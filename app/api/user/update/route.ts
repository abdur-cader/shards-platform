import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function PUT(request: Request) {
  // Get the authorization token
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, username, bio, userId } = body;
  console.log("USERID------------------------------------------------------------", userId);

  // Validate inputs
  if (!name || !username || !userId) {
    return NextResponse.json(
      { error: "Name, username, and user ID are required" },
      { status: 400 }
    );
  }

  // Check username format
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return NextResponse.json(
      { error: "Username can only contain letters, numbers, underscores, and hyphens" },
      { status: 400 }
    );
  }

  const supabase =  createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      )

  console.log("Received token:", token);

  try {
    // First get current user data
    const { data: currentUser } = await supabase
      .from("users")
      .select("username")
      .eq("id", userId)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only check username availability if it's being changed
    if (username !== currentUser.username) {
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    // Update user
    const { data, error } = await supabase
      .from("users")
      .update({ 
        name, 
        username, 
        bio: bio || null 
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}