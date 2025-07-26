import React from 'react';
import Herotemp from '@/components/Herotemp';
import { auth, signIn } from '@/auth';

import ShardForm from '@/components/ShardForm';

async function fetchUserRepos(githubUsername: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`, {
      headers: {
        'Accept': 'application/vnd.github+json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const repos = await response.json();
    return repos.map((repo: any) => ({
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url
    }));
  } catch (error) {
    console.error('Error fetching repositories: ', error);
    return [];
  }
}



const Page = async () => {
  const session = await auth();
  const GithubUsername = session?.user?.github_login
  const repos = GithubUsername ? await fetchUserRepos(GithubUsername): [];

  return (
    <div>
      <Herotemp />
      {session && session?.user ? (
        <>
          <div className="text-center text-xl font-semibold mt-4">Create a Shard</div>
          <ShardForm repos={repos} />
        </>
      ) : (
        <div className="text-center mt-6">
          <div className="text-lg font-medium">Please sign in to create a shard.</div>
          <form action={async () => {
            "use server"
            await signIn('github', { callbackUrl: '/shards/create' });
          }}>
            <button type="submit" className="cursor-pointer">Sign In</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;
