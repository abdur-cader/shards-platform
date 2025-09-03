import React from "react";
import { auth, signIn } from "@/auth";

import ShardForm from "@/components/ShardForm";

type GithubRepo = {
  name: string;
  full_name: string;
  html_url: string;
};

async function fetchUserRepos(githubUsername: string): Promise<GithubRepo[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }
    const repos: Array<{ name: string; full_name: string; html_url: string }> =
      await response.json();

    return repos.map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
    }));
  } catch (error) {
    console.error("Error fetching repositories: ", error);
    return [];
  }
}

const Page = async () => {
  const session = await auth();
  const GithubUsername = session?.user?.github_login;
  const repos = GithubUsername ? await fetchUserRepos(GithubUsername) : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-50 to-white dark:bg-gradient-to-br dark:from-[#081408] dark:to-black">
      {session && session?.user ? (
        <div className="w-full max-w-md text-center">
          <div className="text-xl font-semibold mb-6">Create a Shard</div>
          <ShardForm repos={repos} />
        </div>
      ) : (
        <div className="w-full max-w-md text-center">
          <div className="text-lg font-medium mb-4">
            Please sign in to create a shard.
          </div>
          <form
            action={async () => {
              "use server";
              await signIn("github", { callbackUrl: "/shards/create" });
            }}
          >
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;
