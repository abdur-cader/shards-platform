import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const headers = req.headers;

        const userId = headers.get("userid")
        const accessToken = headers.get("sb-access-token")

        if (!userId || !accessToken) {
            return NextResponse.json({ error : "Missing auth headers"}, { status: 401 })
        }
        console.log("accessToken:", accessToken)
        console.log("supabaseUrl:", process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log("supabaseRoleKey:", process.env.SUPABASE_SERVICE_ROLE_KEY)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            }
        );

        const { data, error } = await supabase
            .from("saved_ideas")
            .insert([
                {
                    user_id: userId,
                    object: body,
                },
            ])
            .select()

        if (error) {
            console.error("Supabase insert Error:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 })
        }

        return NextResponse.json({ success: true, data });
    } catch (err) {
        console.error("API error:", err);
        return NextResponse.json({ err: "something went wrong" }, { status: 500});
    }
}