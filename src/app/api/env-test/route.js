import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyPrefix:
        process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + "...",
    },
  });
}
