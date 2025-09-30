import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/smart-matching/casinos - Get all casinos with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const jurisdiction = searchParams.get('jurisdiction');
    const active = searchParams.get('active');

    let query = supabase
      .from('casinos')
      .select('*')
      .order('popularity_score', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (jurisdiction) {
      query = query.eq('jurisdiction', jurisdiction);
    }

    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching casinos:', error);
      return NextResponse.json(
        { error: 'Failed to fetch casinos' },
        { status: 500 }
      );
    }

    return NextResponse.json({ casinos: data });
  } catch (error) {
    console.error('Error in GET /api/smart-matching/casinos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/smart-matching/casinos - Create a new casino
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      website_url,
      logo_url,
      description,
      category,
      jurisdiction,
      min_deposit,
      payout_percentage,
      popularity_score,
      trust_score,
      features,
      target_audience,
      commission_structure,
      payment_methods,
      languages,
      currencies
    } = body;

    // Validate required fields
    if (!name || !website_url || !category || !jurisdiction) {
      return NextResponse.json(
        { error: 'Missing required fields: name, website_url, category, jurisdiction' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('casinos')
      .insert([{
        name,
        website_url,
        logo_url,
        description,
        category,
        jurisdiction,
        min_deposit,
        payout_percentage,
        popularity_score,
        trust_score,
        features,
        target_audience,
        commission_structure,
        payment_methods,
        languages,
        currencies
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating casino:', error);
      return NextResponse.json(
        { error: 'Failed to create casino' },
        { status: 500 }
      );
    }

    return NextResponse.json({ casino: data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/smart-matching/casinos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
