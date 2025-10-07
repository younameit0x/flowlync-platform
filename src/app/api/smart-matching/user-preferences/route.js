import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/smart-matching/user-preferences - Get user preferences
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id parameter is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching user preferences:", error);
      return NextResponse.json(
        { error: "Failed to fetch user preferences" },
        { status: 500 },
      );
    }

    return NextResponse.json({ preferences: data });
  } catch (error) {
    console.error("Error in GET /api/smart-matching/user-preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/smart-matching/user-preferences - Create or update user preferences
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      user_id,
      preferred_categories,
      preferred_jurisdictions,
      risk_tolerance,
      budget_range,
      preferred_features,
      preferred_payment_methods,
      target_regions,
      experience_level,
      marketing_preferences,
    } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 },
      );
    }

    // Check if preferences already exist
    const { data: existing } = await supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", user_id)
      .single();

    let result;

    if (existing) {
      // Update existing preferences
      const { data, error } = await supabase
        .from("user_preferences")
        .update({
          preferred_categories,
          preferred_jurisdictions,
          risk_tolerance,
          budget_range,
          preferred_features,
          preferred_payment_methods,
          target_regions,
          experience_level,
          marketing_preferences,
        })
        .eq("user_id", user_id)
        .select()
        .single();

      if (error) {
        console.error("Error updating user preferences:", error);
        return NextResponse.json(
          { error: "Failed to update user preferences" },
          { status: 500 },
        );
      }

      result = data;
    } else {
      // Create new preferences
      const { data, error } = await supabase
        .from("user_preferences")
        .insert([
          {
            user_id,
            preferred_categories,
            preferred_jurisdictions,
            risk_tolerance,
            budget_range,
            preferred_features,
            preferred_payment_methods,
            target_regions,
            experience_level,
            marketing_preferences,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating user preferences:", error);
        return NextResponse.json(
          { error: "Failed to create user preferences" },
          { status: 500 },
        );
      }

      result = data;
    }

    return NextResponse.json(
      { preferences: result },
      { status: existing ? 200 : 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/smart-matching/user-preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
