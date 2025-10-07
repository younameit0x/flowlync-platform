import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  try {
    // Basic connectivity test
    const result = {
      timestamp: new Date().toISOString(),
      environment: {
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
        supabaseUrlStart: supabaseUrl
          ? supabaseUrl.substring(0, 20) + "..."
          : "missing",
      },
    };

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        ...result,
        status: "error",
        message: "Missing Supabase environment variables",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test basic connection with a simple query
    const { data, error, count } = await supabase
      .from("casinos")
      .select("id, name", { count: "exact" })
      .limit(1);

    if (error) {
      return NextResponse.json({
        ...result,
        status: "database_error",
        error: error.message,
        code: error.code,
      });
    }

    return NextResponse.json({
      ...result,
      status: "success",
      database: {
        connected: true,
        casinosCount: count,
        sampleData: data,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
