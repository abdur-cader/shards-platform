// for getting all shards for a user (in profile page)
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/auth";

export async function GET(req: Request) {

    const token = req.headers.get("sb-access-token");
    const sessionId = req.headers.get("session-id");

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    );

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
        return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    console.log("session ID from called user API:", sessionId);

    let query = supabase.from("shards").select("*").eq("user_id", userId);

    // If not owner, filter to only visible shards
    if (sessionId !== userId) {
        query = query.eq("is_visible", true);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ shards: data });
}
