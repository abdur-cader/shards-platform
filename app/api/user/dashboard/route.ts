import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const token = req.headers.get("sb-access-token");
  const userId = req.headers.get("session-id");

  if (!token || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );

  // only allow these columns for edit
  const allowedColumns = ["id", "name", "username", "email", "bio", "image"];
  const { searchParams } = new URL(req.url);
  const columnsParam = searchParams.get("columns") || "";
  const requestedColumns = columnsParam.split(",").map(c => c.trim());
  const columnsToSelect =
    requestedColumns.filter(c => allowedColumns.includes(c)).join(",") || "*";

  // query by id since we’re fetching the current user
  const { data, error } = await supabase
    .from("users")
    .select(columnsToSelect)
    .eq("id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
