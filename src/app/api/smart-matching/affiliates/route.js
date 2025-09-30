import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/smart-matching/affiliates - Get all affiliates with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const active = searchParams.get('active');
    const min_commission = searchParams.get('min_commission');

    let query = supabase
      .from('affiliates')
      .select('*')
      .order('reputation_score', { ascending: false });

    if (specialization) {
      query = query.eq('specialization', specialization);
    }

    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    if (min_commission) {
      query = query.gte('commission_rate', parseFloat(min_commission));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching affiliates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch affiliates' },
        { status: 500 }
      );
    }

    return NextResponse.json({ affiliates: data });
  } catch (error) {
    console.error('Error in GET /api/smart-matching/affiliates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
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
      support_quality
    } = body;

    // Validate required fields
    if (!name || !website_url || !contact_email || !commission_rate || !specialization) {
      return NextResponse.json(
        { error: 'Missing required fields: name, website_url, contact_email, commission_rate, specialization' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('affiliates')
      .insert([{
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
        support_quality
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating affiliate:', error);
      return NextResponse.json(
        { error: 'Failed to create affiliate' },
        { status: 500 }
      );
    }

    return NextResponse.json({ affiliate: data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/smart-matching/affiliates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
