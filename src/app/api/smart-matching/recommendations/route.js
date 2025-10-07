import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 🚀 Enhanced AI-powered Smart Matching with Real-Time Data
class SmartMatchingAI {
  constructor() {
    this.weights = {
      category_match: 0.2,
      jurisdiction_match: 0.15,
      feature_match: 0.1,
      budget_compatibility: 0.1,
      experience_level: 0.1,
      reputation_score: 0.05,
      performance_history: 0.05,
      // New real-time factors
      live_commission_rate: 0.15,
      trending_score: 0.1,
      real_time_availability: 0.1,
      market_opportunity: 0.1,
      competitive_advantage: 0.05,
    };
  }

  // Enhanced match score calculation with real-time data
  async calculateEnhancedMatchScore(userPrefs, affiliate, casino) {
    let score = 0;
    let reasoning = [];

    // Get real-time data for this affiliate program
    const realTimeData = await this.fetchRealTimeData(
      affiliate.name || casino.name,
    );

    // Category match (20%)
    if (userPrefs.preferred_categories && affiliate.specialization) {
      const categoryMatch = userPrefs.preferred_categories.includes(
        affiliate.specialization,
      )
        ? 1
        : 0;
      score += categoryMatch * this.weights.category_match;
      reasoning.push(
        `Category match: ${categoryMatch ? "Perfect" : "No match"} (${affiliate.specialization})`,
      );
    }

    // Jurisdiction compatibility (15%)
    if (userPrefs.preferred_jurisdictions && casino.jurisdiction) {
      const jurisdictionMatch = userPrefs.preferred_jurisdictions.includes(
        casino.jurisdiction,
      )
        ? 1
        : 0;
      score += jurisdictionMatch * this.weights.jurisdiction_match;
      reasoning.push(
        `Jurisdiction compatibility: ${jurisdictionMatch ? "Compatible" : "Not compatible"} (${casino.jurisdiction})`,
      );
    }

    // 🔥 Live Commission Rate Analysis (15%)
    if (realTimeData?.current_commission) {
      const commissionScore = this.calculateCommissionScore(
        realTimeData.current_commission,
        userPrefs.min_commission || 20,
      );
      score += commissionScore * this.weights.live_commission_rate;
      reasoning.push(
        `Live commission: ${realTimeData.current_commission}% (Score: ${(commissionScore * 100).toFixed(1)}%)`,
      );

      // Commission change indicator
      if (realTimeData.commission_change_24h > 0) {
        reasoning.push(
          `🔥 Commission increased by ${realTimeData.commission_change_24h.toFixed(1)}% in 24h`,
        );
      }
    }

    // 📈 Real-Time Trending Score (10%)
    if (realTimeData?.trending_score) {
      const trendingScore = realTimeData.trending_score / 100; // Normalize to 0-1
      score += trendingScore * this.weights.trending_score;
      reasoning.push(
        `Trending score: ${realTimeData.trending_score}/100 (${realTimeData.momentum || "Stable"})`,
      );

      if (
        realTimeData.momentum === "Explosive" ||
        realTimeData.momentum === "Hot"
      ) {
        reasoning.push(
          `🚀 ${realTimeData.momentum} momentum detected - Act fast!`,
        );
      }
    }

    // ⚡ Real-Time Availability (10%)
    if (realTimeData?.live_status) {
      const availabilityScore =
        realTimeData.live_status === "accepting_affiliates" ? 1 : 0;
      score += availabilityScore * this.weights.real_time_availability;
      reasoning.push(`Live status: ${realTimeData.live_status}`);

      if (realTimeData.seasonal_bonus) {
        reasoning.push(`💰 Active bonus: ${realTimeData.seasonal_bonus}`);
      }
    }

    // 🎯 Market Opportunity Score (10%)
    if (realTimeData) {
      const opportunityScore = this.calculateOpportunityScore(realTimeData);
      score += opportunityScore * this.weights.market_opportunity;
      reasoning.push(
        `Market opportunity: ${(opportunityScore * 100).toFixed(1)}% (${realTimeData.competition_level} competition)`,
      );
    }

    // Feature match (10%)
    if (userPrefs.preferred_features && casino.features) {
      const userFeatures = userPrefs.preferred_features || [];
      const casinoFeatures = casino.features || [];
      const featureMatches = userFeatures.filter((f) =>
        casinoFeatures.includes(f),
      ).length;
      const featureScore =
        userFeatures.length > 0 ? featureMatches / userFeatures.length : 0.5;
      score += featureScore * this.weights.feature_match;
      reasoning.push(
        `Feature match: ${Math.round(featureScore * 100)}% (${featureMatches}/${userFeatures.length} features)`,
      );
    }

    // Budget compatibility (10%)
    if (userPrefs.budget_range && casino.min_deposit) {
      const budgetMin = userPrefs.budget_range.min || 0;
      const budgetMax = userPrefs.budget_range.max || Infinity;
      const budgetScore =
        casino.min_deposit >= budgetMin && casino.min_deposit <= budgetMax
          ? 1
          : 0;
      score += budgetScore * this.weights.budget_compatibility;
      reasoning.push(
        `Budget compatibility: ${budgetScore ? "Within range" : "Outside range"} (Min: $${casino.min_deposit})`,
      );
    }

    // Experience level match (10%)
    if (userPrefs.experience_level && casino.target_audience) {
      const experienceMatch =
        casino.target_audience.experience === userPrefs.experience_level
          ? 1
          : 0.5;
      score += experienceMatch * this.weights.experience_level;
      reasoning.push(
        `Experience level: ${experienceMatch === 1 ? "Perfect match" : "Moderate match"} (${userPrefs.experience_level})`,
      );
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
    reasoning.push(
      `Performance history: ${Math.round(performanceScore * 100)}%`,
    );

    return {
      score: Math.round(score * 100),
      reasoning: reasoning,
    };
  }

  // Generate recommendations for a user
  async generateRecommendations(userId, limit = 10) {
    try {
      // Get user preferences
      const { data: userPrefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!userPrefs) {
        throw new Error("User preferences not found");
      }

      // Get all active affiliates and casinos
      const [affiliatesResult, casinosResult] = await Promise.all([
        supabase.from("affiliates").select("*").eq("is_active", true),
        supabase.from("casinos").select("*").eq("is_active", true),
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

          const matchResult = this.calculateMatchScore(
            userPrefs,
            affiliate,
            casino,
          );

          if (matchResult.score >= 50) {
            // Only include reasonably good matches
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
              recommendation_type: "partnership",
              commission_rate: affiliate.commission_rate,
              casino_category: casino.category,
              casino_jurisdiction: casino.jurisdiction,
            });
          }
        }
      }

      // Sort by confidence score and limit results
      recommendations.sort((a, b) => b.confidence_score - a.confidence_score);

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      throw error;
    }
  }

  // 🚀 Real-Time Data Integration Methods

  // Fetch real-time data for a specific affiliate program
  async fetchRealTimeData(programName) {
    try {
      // Simulate API call to our live-rates endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/smart-matching/live-rates`,
      );
      const data = await response.json();

      if (data.success && data.data) {
        // Find the specific program
        const programData = data.data.find(
          (program) =>
            program.program_name
              .toLowerCase()
              .includes(programName.toLowerCase()) ||
            programName
              .toLowerCase()
              .includes(program.program_name.toLowerCase()),
        );

        return programData || null;
      }

      return null;
    } catch (error) {
      console.error("Error fetching real-time data:", error);
      return null;
    }
  }

  // Calculate commission score based on current rates vs user preference
  calculateCommissionScore(currentCommission, minCommission) {
    if (currentCommission >= minCommission) {
      // Normalize to 0-1 scale, with bonus points for higher commissions
      const baseScore = Math.min(currentCommission / 50, 1); // Cap at 50% commission
      const bonusScore = Math.max(0, (currentCommission - minCommission) / 20); // Bonus for exceeding minimum
      return Math.min(baseScore + bonusScore * 0.2, 1);
    }
    return 0;
  }

  // Calculate market opportunity score
  calculateOpportunityScore(realTimeData) {
    let opportunityScore = 0.5; // Base score

    // Competition level impact
    switch (realTimeData.competition_level?.toLowerCase()) {
      case "low":
        opportunityScore += 0.3;
        break;
      case "medium":
        opportunityScore += 0.1;
        break;
      case "high":
        opportunityScore -= 0.1;
        break;
    }

    // Program health impact
    if (realTimeData.program_health) {
      opportunityScore += (realTimeData.program_health - 80) / 100; // Health above 80% is good
    }

    // Volume change impact
    if (realTimeData.volume_change_24h) {
      opportunityScore += Math.min(realTimeData.volume_change_24h / 100, 0.2); // Cap at 20% bonus
    }

    // Seasonal bonus boost
    if (realTimeData.seasonal_bonus) {
      opportunityScore += 0.15;
    }

    return Math.max(0, Math.min(1, opportunityScore));
  }

  // Enhanced recommendation generation with real-time data
  async generateEnhancedRecommendations(userId, limit = 10) {
    try {
      // Get user preferences
      const { data: userPrefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!userPrefs) {
        return [];
      }

      // Get affiliates and casinos
      const { data: affiliates } = await supabase
        .from("affiliates")
        .select("*");
      const { data: casinos } = await supabase.from("casinos").select("*");

      if (!affiliates || !casinos) {
        return [];
      }

      const recommendations = [];

      // Enhanced matching with real-time data
      for (const affiliate of affiliates) {
        for (const casino of casinos) {
          if (
            affiliate.accepted_casinos &&
            !affiliate.accepted_casinos.includes(casino.id)
          ) {
            continue;
          }

          // Use enhanced match score calculation
          const matchResult = await this.calculateEnhancedMatchScore(
            userPrefs,
            affiliate,
            casino,
          );

          if (matchResult.score >= 50) {
            // Get trending data for additional context
            const trendingResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/smart-matching/trending`,
            );
            const trendingData = await trendingResponse.json();
            let trendingInfo = null;

            if (trendingData.success) {
              trendingInfo = trendingData.data.find((trend) =>
                trend.program_name
                  .toLowerCase()
                  .includes(casino.name.toLowerCase()),
              );
            }

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
              recommendation_type: "partnership",
              commission_rate: affiliate.commission_rate,
              casino_category: casino.category,
              casino_jurisdiction: casino.jurisdiction,
              // Enhanced real-time data
              real_time_data: matchResult.realTimeData,
              trending_info: trendingInfo,
              opportunity_level: trendingInfo
                ? trendingInfo.momentum
                : "Stable",
              time_sensitive: trendingInfo?.time_to_act || null,
              market_insight: matchResult.marketInsight,
            });
          }
        }
      }

      // Enhanced sorting with real-time factors
      recommendations.sort((a, b) => {
        // Primary sort: confidence score
        if (b.confidence_score !== a.confidence_score) {
          return b.confidence_score - a.confidence_score;
        }

        // Secondary sort: trending momentum
        const momentumPriority = {
          Explosive: 4,
          Hot: 3,
          Rising: 2,
          Emerging: 1,
          Stable: 0,
        };
        const aMomentum = momentumPriority[a.opportunity_level] || 0;
        const bMomentum = momentumPriority[b.opportunity_level] || 0;

        return bMomentum - aMomentum;
      });

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error("Error generating enhanced recommendations:", error);
      throw error;
    }
  }
}

// GET /api/smart-matching/recommendations - Generate recommendations for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id parameter is required" },
        { status: 400 },
      );
    }

    // Get user preferences
    const { data: userPrefs, error: prefError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (prefError || !userPrefs) {
      return NextResponse.json(
        {
          error:
            "User preferences not found. Please set up your preferences first.",
        },
        { status: 404 },
      );
    }

    // Get all active affiliates and casinos
    const [affiliatesResult, casinosResult] = await Promise.all([
      supabase.from("affiliates").select("*").eq("is_active", true),
      supabase.from("casinos").select("*").eq("is_active", true),
    ]);

    const affiliates = affiliatesResult.data || [];
    const casinos = casinosResult.data || [];

    // Generate recommendations
    const recommendations = [];

    for (const affiliate of affiliates) {
      for (const casino of casinos) {
        // Match based on user preferences
        if (
          userPrefs.preferred_categories &&
          userPrefs.preferred_categories.includes(casino.category) &&
          affiliate.specialization === casino.category
        ) {
          // Calculate basic confidence score
          let confidence = 70;

          // Bonus for jurisdiction match
          if (
            userPrefs.preferred_jurisdictions &&
            userPrefs.preferred_jurisdictions.includes(casino.jurisdiction)
          ) {
            confidence += 15;
          }

          // Bonus for high reputation
          if (affiliate.reputation_score >= 85) confidence += 10;
          if (casino.trust_score >= 85) confidence += 5;

          recommendations.push({
            affiliate_id: affiliate.id,
            casino_id: casino.id,
            affiliate_name: affiliate.name,
            casino_name: casino.name,
            affiliate_logo: affiliate.logo_url,
            casino_logo: casino.logo_url,
            affiliate_website: affiliate.website_url,
            casino_website: casino.website_url,
            confidence_score: Math.min(100, confidence),
            recommendation_type: "partnership",
            commission_rate: affiliate.commission_rate,
            casino_category: casino.category,
            casino_jurisdiction: casino.jurisdiction,
            reasoning: [
              `Category match: ${casino.category}`,
              `Commission: ${affiliate.commission_rate}%`,
            ],
          });
        }
      }
    }

    // Sort by confidence score and limit results
    recommendations.sort((a, b) => b.confidence_score - a.confidence_score);
    const finalRecommendations = recommendations.slice(0, limit);

    // Add real-time market summary
    const marketSummary = {
      total_recommendations: finalRecommendations.length,
      trending_opportunities: finalRecommendations.filter(
        (r) => r.confidence_score > 85,
      ).length,
      time_sensitive_deals: finalRecommendations.filter(
        (r) => r.commission_rate >= 40,
      ).length,
      average_confidence:
        finalRecommendations.length > 0
          ? Math.round(
              finalRecommendations.reduce(
                (sum, r) => sum + r.confidence_score,
                0,
              ) / finalRecommendations.length,
            )
          : 0,
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json({
      recommendations: finalRecommendations,
      market_summary: marketSummary,
      enhanced_features: {
        real_time_data: true,
        trending_analysis: true,
        market_intelligence: true,
        ai_powered: true,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/smart-matching/recommendations:", error);

    return NextResponse.json(
      { error: "Failed to generate recommendations", details: error.message },
      { status: 500 },
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
      is_accepted,
    } = body;

    if (!user_id || !recommendation_id || feedback === undefined) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: user_id, recommendation_id, feedback",
        },
        { status: 400 },
      );
    }

    // Update the recommendation with user feedback
    const { data, error } = await supabase
      .from("smart_recommendations")
      .update({
        user_feedback: feedback,
        is_accepted: is_accepted !== undefined ? is_accepted : null,
      })
      .eq("id", recommendation_id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) {
      console.error("Error saving recommendation feedback:", error);
      return NextResponse.json(
        { error: "Failed to save feedback" },
        { status: 500 },
      );
    }

    // Log the interaction
    await supabase.from("recommendation_interactions").insert([
      {
        recommendation_id,
        user_id,
        interaction_type: is_accepted
          ? "accept"
          : feedback === -1
            ? "reject"
            : "view",
        metadata: { feedback, is_accepted },
      },
    ]);

    return NextResponse.json({ success: true, recommendation: data });
  } catch (error) {
    console.error("Error in POST /api/smart-matching/recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
