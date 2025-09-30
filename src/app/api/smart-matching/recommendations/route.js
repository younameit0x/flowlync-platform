import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// AI-powered recommendation algorithm
class SmartMatchingAI {
  constructor() {
    this.weights = {
      category_match: 0.25,
      jurisdiction_match: 0.20,
      feature_match: 0.15,
      budget_compatibility: 0.10,
      experience_level: 0.10,
      reputation_score: 0.10,
      performance_history: 0.10
    };
  }

  // Calculate match score between user preferences and affiliate/casino
  calculateMatchScore(userPrefs, affiliate, casino) {
    let score = 0;
    let reasoning = [];

    // Category match (25%)
    if (userPrefs.preferred_categories && affiliate.specialization) {
      const categoryMatch = userPrefs.preferred_categories.includes(affiliate.specialization) ? 1 : 0;
      score += categoryMatch * this.weights.category_match;
      reasoning.push(`Category match: ${categoryMatch ? 'Perfect' : 'No match'} (${affiliate.specialization})`);
    }

    // Jurisdiction compatibility (20%)
    if (userPrefs.preferred_jurisdictions && casino.jurisdiction) {
      const jurisdictionMatch = userPrefs.preferred_jurisdictions.includes(casino.jurisdiction) ? 1 : 0;
      score += jurisdictionMatch * this.weights.jurisdiction_match;
      reasoning.push(`Jurisdiction compatibility: ${jurisdictionMatch ? 'Compatible' : 'Not compatible'} (${casino.jurisdiction})`);
    }

    // Feature match (15%)
    if (userPrefs.preferred_features && casino.features) {
      const userFeatures = userPrefs.preferred_features || [];
      const casinoFeatures = casino.features || [];
      const featureMatches = userFeatures.filter(f => casinoFeatures.includes(f)).length;
      const featureScore = userFeatures.length > 0 ? featureMatches / userFeatures.length : 0.5;
      score += featureScore * this.weights.feature_match;
      reasoning.push(`Feature match: ${Math.round(featureScore * 100)}% (${featureMatches}/${userFeatures.length} features)`);
    }

    // Budget compatibility (10%)
    if (userPrefs.budget_range && casino.min_deposit) {
      const budgetMin = userPrefs.budget_range.min || 0;
      const budgetMax = userPrefs.budget_range.max || Infinity;
      const budgetScore = (casino.min_deposit >= budgetMin && casino.min_deposit <= budgetMax) ? 1 : 0;
      score += budgetScore * this.weights.budget_compatibility;
      reasoning.push(`Budget compatibility: ${budgetScore ? 'Within range' : 'Outside range'} (Min: $${casino.min_deposit})`);
    }

    // Experience level match (10%)
    if (userPrefs.experience_level && casino.target_audience) {
      const experienceMatch = casino.target_audience.experience === userPrefs.experience_level ? 1 : 0.5;
      score += experienceMatch * this.weights.experience_level;
      reasoning.push(`Experience level: ${experienceMatch === 1 ? 'Perfect match' : 'Moderate match'} (${userPrefs.experience_level})`);
    }

    // Affiliate reputation (10%)
    if (affiliate.reputation_score) {
      const reputationScore = affiliate.reputation_score / 100;
      score += reputationScore * this.weights.reputation_score;
      reasoning.push(`Affiliate reputation: ${affiliate.reputation_score}/100`);
    }

    // Performance history (10%) - This would be calculated from actual performance data
    const performanceScore = 0.8; // Placeholder - would be calculated from real data
    score += performanceScore * this.weights.performance_history;
    reasoning.push(`Performance history: ${Math.round(performanceScore * 100)}%`);

    return {
      score: Math.round(score * 100),
      reasoning: reasoning
    };
  }

  // Generate recommendations for a user
  async generateRecommendations(userId, limit = 10) {
    try {
      // Get user preferences
      const { data: userPrefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!userPrefs) {
        throw new Error('User preferences not found');
      }

      // Get all active affiliates and casinos
      const [affiliatesResult, casinosResult] = await Promise.all([
        supabase.from('affiliates').select('*').eq('is_active', true),
        supabase.from('casinos').select('*').eq('is_active', true)
      ]);

      const affiliates = affiliatesResult.data || [];
      const casinos = casinosResult.data || [];

      // Generate all possible combinations and score them
      const recommendations = [];

      for (const affiliate of affiliates) {
        for (const casino of casinos) {
          // Skip if affiliate specialization doesn't match casino category
          if (affiliate.specialization !== casino.category) {
            continue;
          }

          const matchResult = this.calculateMatchScore(userPrefs, affiliate, casino);

          if (matchResult.score >= 50) { // Only include reasonably good matches
            recommendations.push({
              affiliate_id: affiliate.id,
              casino_id: casino.id,
              affiliate_name: affiliate.name,
              casino_name: casino.name,
              affiliate_logo: affiliate.logo_url,
              casino_logo: casino.logo_url,
              affiliate_website: affiliate.website_url,
              casino_website: casino.website_url,
              confidence_score: matchResult.score,
              reasoning: matchResult.reasoning,
              recommendation_type: 'partnership',
              commission_rate: affiliate.commission_rate,
              casino_category: casino.category,
              casino_jurisdiction: casino.jurisdiction
            });
          }
        }
      }

      // Sort by confidence score and limit results
      recommendations.sort((a, b) => b.confidence_score - a.confidence_score);

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }
}

// GET /api/smart-matching/recommendations - Generate recommendations for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    const ai = new SmartMatchingAI();
    const recommendations = await ai.generateRecommendations(userId, limit);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error in GET /api/smart-matching/recommendations:', error);

    if (error.message === 'User preferences not found') {
      return NextResponse.json(
        { error: 'User preferences not found. Please set up your preferences first.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

// POST /api/smart-matching/recommendations - Save recommendation feedback
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      user_id,
      recommendation_id,
      feedback, // -1 (negative), 0 (neutral), 1 (positive)
      is_accepted
    } = body;

    if (!user_id || !recommendation_id || feedback === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, recommendation_id, feedback' },
        { status: 400 }
      );
    }

    // Update the recommendation with user feedback
    const { data, error } = await supabase
      .from('smart_recommendations')
      .update({
        user_feedback: feedback,
        is_accepted: is_accepted !== undefined ? is_accepted : null
      })
      .eq('id', recommendation_id)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) {
      console.error('Error saving recommendation feedback:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    // Log the interaction
    await supabase
      .from('recommendation_interactions')
      .insert([{
        recommendation_id,
        user_id,
        interaction_type: is_accepted ? 'accept' : (feedback === -1 ? 'reject' : 'view'),
        metadata: { feedback, is_accepted }
      }]);

    return NextResponse.json({ success: true, recommendation: data });
  } catch (error) {
    console.error('Error in POST /api/smart-matching/recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
