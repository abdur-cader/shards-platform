import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import jwt from "jsonwebtoken"
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // this key bypasses RLS for trusted backend usage
);



export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: true,
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    github_id: profile.id.toString(),
                    name: profile.name,
                    email: profile.email,
                    image: profile.avatar_url,
                    github_login: profile.login,
                };
            },
        }),
    ],
    adapter: SupabaseAdapter({
        url: process.env.SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    callbacks: {
        async session({ session, user }) {
            const { data, error } = await supabase
                .from('users')
                .select('bio, access_level, ai_credits, is_banned, settings, username')
                .eq('id', user.id)
                .single();

            if (data) {
                session.user.bio = data.bio;
                session.user.access_level = data.access_level;
                session.user.ai_credits = data.ai_credits;
                session.user.is_banned = data.is_banned;
                session.user.settings = data.settings;
                session.user.username = data.username;
            } else {
                console.log("NO DATA AVAILABLE:", error)
            }

            session.user.id = user.id;
            session.user.name = user.name;
            session.user.email = user.email;
            session.user.image = user.image;
            session.user.github_id = user.github_id;
            session.user.github_login = user.github_login;

            console.log("AUTH CHECK=========================================================")

            console.log("  1 user.id for JWT payload:", user.id);
            console.log("  2 github login:", user.github_login);
            console.log("  3 github id:", user.github_id);
            console.log("  4 name:", user.name);

            console.log("END 1==================== SUPABASE ================================")

            if (data) {
                console.log("  5 username:", data.username);
                console.log("  6 bio:", data.bio);
                console.log("  7 access_level:", data.access_level);
                console.log("  8 ai_credits:", data.ai_credits);
                console.log("  9 is_banned:", data.is_banned);
                console.log("  10 settings:", data.settings);
                console.log("END ALL============================================================")
            }

            const signingSecret = process.env.SUPABASE_JWT_SECRET
            if (signingSecret) {
                const payload = {
                    aud: "authenticated",
                    exp: Math.floor(new Date(session.expires).getTime() / 1000),
                    sub: user.id,
                    email: user.email,
                    role: "authenticated",
                }
                session.supabaseAccessToken = jwt.sign(payload, signingSecret)
            }

            return session;
        },
    },
})
