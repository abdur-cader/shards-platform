import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        github_login?: string;
        github_id?: string;
        bio?: string;
    }

    interface Session {
        accessToken?: string;
        supabaseAccessToken?: string; // your JWT token for supabase
        user: {
            id: string;
            github_login?: string;
            github_id?: string;
            username?: string;
            avatar_url?: string;
            address?: string;
            bio?: string;
            access_level?: string;
            project_limit?: number;
            ai_credits?: number;
            is_banned?: boolean;
            settings?: Record<string, any>;
            githubAccessToken?: string;
        } & DefaultSession["user"];
    }

    interface JWT {
        accessToken?: string;
        id?: string;
        github_login?: string;
        github_id?: string;
        githubAccessToken?: string;
    }
}