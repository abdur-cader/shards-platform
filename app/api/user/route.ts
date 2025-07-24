import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
    const token = req.headers.get("sb-access-token");
    const userId = req.headers.get("session-id");
    const purpose = req.headers.get("purpose") // either "edit" or "view"
    const single = req.headers.get("single") === "true";




    console.log("session id:", userId)
    if (purpose === "edit" && !token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let supabase;

    if (purpose === "edit" && token) {
        supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            }
        );
    } else {
        supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
    }

    const allowedColumns = ["id", "name", "username", "email", "bio", "image"];
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");


    const columnsParam = searchParams.get("columns") || "";
    const requestedColumns = columnsParam.split(",").map(c => c.trim());

    const filteredColumns = requestedColumns.filter(c => allowedColumns.includes(c));
    const columnsToSelect = filteredColumns.length > 0 ? filteredColumns.join(",") : "*";


    let query = supabase.from("users").select(columnsToSelect);

    if (username) {
        query = query.eq("username", username);
    }

    if (single) {
        query.single();
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
