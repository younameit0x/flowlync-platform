import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fallback to JSON file if Supabase is not available
const useSupabase = supabaseUrl && supabaseServiceKey;
let supabase;

if (useSupabase) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

// GET /api/smart-matching/affiliates - Get all affiliates with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vertical = searchParams.get("vertical") || searchParams.get("specialization");
    const region = searchParams.get("region");
    const active = searchParams.get("active");
    const min_commission = searchParams.get("min_commission");
    const beginner_friendly = searchParams.get("beginner_friendly");

    // Try JSON file first (our new comprehensive data)
    try {
      const dataPath = path.join(process.cwd(), 'gambling-affiliate-data.json');
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      const affiliateData = JSON.parse(fileContent);

      // Combine all affiliate types with proper formatting
      const allAffiliates = [
        ...affiliateData.casino_affiliates.map(a => ({ 
          ...a, 
          specialization: 'Casino',
          commission_rate: parseFloat(a.commission_structure?.revenue_share?.split('-')[1]?.replace('%', '') || '0'),
          is_active: a.status === 'active',
          reputation_score: a.trust_score || 50
        })),
        ...affiliateData.sportsbook_affiliates.map(a => ({ 
          ...a, 
          specialization: 'Sportsbook',
          commission_rate: parseFloat(a.commission_structure?.revenue_share?.split('-')[1]?.replace('%', '') || '0'),
          is_active: a.status === 'active',
          reputation_score: a.trust_score || 50
        })),
        ...(affiliateData.crypto_gambling_affiliates || []).map(a => ({ 
          ...a, 
          specialization: 'Crypto Gambling',
          commission_rate: parseFloat(a.commission_structure?.revenue_share?.split('-')[1]?.replace('%', '') || '0'),
          is_active: a.status === 'active',
          reputation_score: a.trust_score || 50
        })),
        ...(affiliateData.website_tools_affiliates || []).map(a => ({ 
          ...a, 
          specialization: 'Website Tools',
          commission_rate: 25, // Default for tools
          is_active: a.status === 'active',
          reputation_score: a.trust_score || 50
        }))
      ];

      // Apply filters
      let filteredAffiliates = allAffiliates;

      if (vertical && vertical !== 'All Verticals') {
        filteredAffiliates = filteredAffiliates.filter(affiliate => 
          affiliate.specialization === vertical || affiliate.vertical === vertical
        );
      }

      if (region && region !== 'Worldwide') {
        filteredAffiliates = filteredAffiliates.filter(affiliate => 
          affiliate.region === region || affiliate.region === 'Global'
        );
      }

      if (active !== null) {
        filteredAffiliates = filteredAffiliates.filter(affiliate => 
          affiliate.is_active === (active === "true")
        );
      }

      if (min_commission) {
        filteredAffiliates = filteredAffiliates.filter(affiliate => 
          affiliate.commission_rate >= parseFloat(min_commission)
        );
      }

      if (beginner_friendly === 'true') {
        filteredAffiliates = filteredAffiliates.filter(affiliate => 
          affiliate.beginner_friendly === true
        );
      }

      // Sort by reputation score
      filteredAffiliates.sort((a, b) => b.reputation_score - a.reputation_score);

      return NextResponse.json({ 
        affiliates: filteredAffiliates,
        total: filteredAffiliates.length,
        source: 'json_file',
        metadata: affiliateData.metadata
      });

    } catch (jsonError) {
      console.log('JSON file not available, falling back to Supabase:', jsonError.message);
    }

    // Fallback to Supabase if available
    if (useSupabase) {
      let query = supabase
        .from("affiliates")
        .select("*")
        .order("reputation_score", { ascending: false });

      if (vertical) {
        query = query.eq("specialization", vertical);
      }

      if (active !== null) {
        query = query.eq("is_active", active === "true");
      }

      if (min_commission) {
        query = query.gte("commission_rate", parseFloat(min_commission));
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching affiliates from Supabase:", error);
        return NextResponse.json(
          { error: "Failed to fetch affiliates" },
          { status: 500 },
        );
      }

      return NextResponse.json({ 
        affiliates: data, 
        source: 'supabase' 
      });
    }

    // No data source available
    return NextResponse.json(
      { error: "No data source available" },
      { status: 503 },
    );

  } catch (error) {
    console.error("Error in GET /api/smart-matching/affiliates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/smart-matching/affiliates - Create a new affiliate
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      website_url,
      logo_url,
      description,
      contact_email,
      affiliate_manager,
      commission_rate,
      payment_terms,
      tracking_software,
      specialization,
      target_regions,
      marketing_materials,
      api_integration,
      reputation_score,
      payout_reliability,
      support_quality,
    } = body;

    // Validate required fields
    if (
      !name ||
      !website_url ||
      !contact_email ||
      !commission_rate ||
      !specialization
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, website_url, contact_email, commission_rate, specialization",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("affiliates")
      .insert([
        {
          name,
          website_url,
          logo_url,
          description,
          contact_email,
          affiliate_manager,
          commission_rate,
          payment_terms,
          tracking_software,
          specialization,
          target_regions,
          marketing_materials,
          api_integration,
          reputation_score,
          payout_reliability,
          support_quality,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating affiliate:", error);
      return NextResponse.json(
        { error: "Failed to create affiliate" },
        { status: 500 },
      );
    }

    return NextResponse.json({ affiliate: data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/smart-matching/affiliates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
