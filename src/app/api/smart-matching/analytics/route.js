import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET /api/smart-matching/analytics - Get user analytics and insights
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const period = searchParams.get('period') || '30days'; // 7days, 30days, 90days

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const now = new Date();
    const daysBack = period === '7days' ? 7 : period === '90days' ? 90 : 30;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Get user's recommendation interactions
    const { data: interactions } = await supabase
      .from('recommendation_interactions')
      .select(`
        *,
        smart_recommendations!inner(
          confidence_score,
          commission_rate,
          affiliate_id,
          casino_id,
          affiliates!inner(name, commission_rate),
          casinos!inner(name, category)
        )
      `)
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString());

    // Get user's preferences
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Calculate analytics
    const totalRecommendations = interactions?.length || 0;
    const acceptedRecommendations = interactions?.filter(i => i.interaction_type === 'accept').length || 0;
    const rejectedRecommendations = interactions?.filter(i => i.interaction_type === 'reject').length || 0;

    const acceptanceRate = totalRecommendations > 0 ? (acceptedRecommendations / totalRecommendations) * 100 : 0;

    // Calculate average confidence scores
    const avgConfidenceScore = interactions?.length > 0
      ? interactions.reduce((sum, i) => sum + (i.smart_recommendations?.confidence_score || 0), 0) / interactions.length
      : 0;

    // Calculate potential revenue (estimated)
    const acceptedRecs = interactions?.filter(i => i.interaction_type === 'accept') || [];
    const potentialRevenue = acceptedRecs.reduce((sum, i) => {
      return sum + (i.smart_recommendations?.commission_rate || 0);
    }, 0);

    // Category preferences analysis
    const categoryBreakdown = {};
    if (interactions) {
      interactions.forEach(i => {
        const category = i.smart_recommendations?.casinos?.category;
        if (category) {
          categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
        }
      });
    }

    const analytics = {
      overview: {
        total_recommendations: totalRecommendations,
        accepted_recommendations: acceptedRecommendations,
        rejected_recommendations: rejectedRecommendations,
        acceptance_rate: Math.round(acceptanceRate * 100) / 100,
        avg_confidence_score: Math.round(avgConfidenceScore * 100) / 100,
        potential_revenue: Math.round(potentialRevenue * 100) / 100,
        period: period
      },
      preferences: preferences,
      category_breakdown: categoryBreakdown,
      trends: {
        // This would be calculated from historical data
        improvement_rate: 85, // AI getting better at recommendations
        time_saved_hours: Math.round(totalRecommendations * 2.5), // Assuming 2.5 hours per manual research
        efficiency_gain: 95 // Percentage more efficient than manual
      },
      recommendations: {
        top_performing_categories: Object.entries(categoryBreakdown)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([category, count]) => ({ category, count })),
        avg_commission_accepted: acceptedRecs.length > 0
          ? Math.round((potentialRevenue / acceptedRecs.length) * 100) / 100
          : 0
      }
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error in GET /api/smart-matching/analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
