import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simple recommendations test
export async function GET(request) {
  try {
    console.log('🔍 Starting recommendation debug test...');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || 'test-user';
    
    // Step 1: Get user preferences
    console.log('Step 1: Getting user preferences for:', userId);
    const { data: userPrefs, error: prefError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (prefError) {
      console.log('❌ Preferences error:', prefError.message);
      return NextResponse.json({ 
        error: 'Preferences error: ' + prefError.message,
        step: 'user_preferences'
      }, { status: 500 });
    }

    if (!userPrefs) {
      return NextResponse.json({ 
        error: 'User preferences not found',
        step: 'user_preferences'
      }, { status: 404 });
    }

    console.log('✅ User preferences found:', userPrefs.preferred_categories);

    // Step 2: Get affiliates
    console.log('Step 2: Getting affiliates...');
    const { data: affiliates, error: affError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('is_active', true);

    if (affError) {
      console.log('❌ Affiliates error:', affError.message);
      return NextResponse.json({ 
        error: 'Affiliates error: ' + affError.message,
        step: 'affiliates'
      }, { status: 500 });
    }

    console.log('✅ Affiliates found:', affiliates?.length || 0);

    // Step 3: Get casinos
    console.log('Step 3: Getting casinos...');
    const { data: casinos, error: casinoError } = await supabase
      .from('casinos')
      .select('*')
      .eq('is_active', true);

    if (casinoError) {
      console.log('❌ Casinos error:', casinoError.message);
      return NextResponse.json({ 
        error: 'Casinos error: ' + casinoError.message,
        step: 'casinos'
      }, { status: 500 });
    }

    console.log('✅ Casinos found:', casinos?.length || 0);

    // Step 4: Simple matching logic
    const recommendations = [];
    
    for (const affiliate of affiliates || []) {
      for (const casino of casinos || []) {
        // Simple category match
        if (userPrefs.preferred_categories && 
            userPrefs.preferred_categories.includes(casino.category) &&
            affiliate.specialization === casino.category) {
          
          recommendations.push({
            affiliate_name: affiliate.name,
            casino_name: casino.name,
            category: casino.category,
            confidence_score: 85,
            commission_rate: affiliate.commission_rate
          });
        }
      }
    }

    console.log('✅ Generated recommendations:', recommendations.length);

    return NextResponse.json({
      success: true,
      user_preferences: userPrefs,
      affiliates_count: affiliates?.length || 0,
      casinos_count: casinos?.length || 0,
      recommendations_count: recommendations.length,
      recommendations: recommendations.slice(0, 5)
    });

  } catch (error) {
    console.error('❌ Test API error:', error);
    return NextResponse.json({ 
      error: 'Test API error: ' + error.message,
      stack: error.stack
    }, { status: 500 });
  }
}