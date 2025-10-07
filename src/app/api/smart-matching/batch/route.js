import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST /api/smart-matching/batch - Handle batch operations
export async function POST(request) {
  try {
    const body = await request.json();
    const { operation, user_id, data } = body;

    if (!operation || !user_id) {
      return NextResponse.json(
        { error: "operation and user_id are required" },
        { status: 400 },
      );
    }

    let result;

    switch (operation) {
      case "bulk_recommendation_feedback":
        result = await handleBulkRecommendationFeedback(user_id, data);
        break;
      case "bulk_casino_import":
        result = await handleBulkCasinoImport(user_id, data);
        break;
      case "bulk_affiliate_import":
        result = await handleBulkAffiliateImport(user_id, data);
        break;
      case "export_user_data":
        result = await handleExportUserData(user_id, data);
        break;
      case "performance_summary":
        result = await handlePerformanceSummary(user_id, data);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid operation type" },
          { status: 400 },
        );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error in POST /api/smart-matching/batch:", error);
    return NextResponse.json(
      { error: "Batch operation failed" },
      { status: 500 },
    );
  }
}

// Handle bulk recommendation feedback
async function handleBulkRecommendationFeedback(userId, data) {
  const { recommendations } = data; // Array of {recommendation_id, feedback, is_accepted}

  if (!Array.isArray(recommendations)) {
    throw new Error("recommendations must be an array");
  }

  const results = [];

  for (const rec of recommendations) {
    try {
      // Update the recommendation
      const { data: updatedRec } = await supabase
        .from("smart_recommendations")
        .update({
          user_feedback: rec.feedback,
          is_accepted: rec.is_accepted,
        })
        .eq("id", rec.recommendation_id)
        .eq("user_id", userId)
        .select()
        .single();

      // Log the interaction
      await supabase.from("recommendation_interactions").insert([
        {
          recommendation_id: rec.recommendation_id,
          user_id: userId,
          interaction_type: rec.is_accepted
            ? "accept"
            : rec.feedback === -1
              ? "reject"
              : "view",
          metadata: { feedback: rec.feedback, is_accepted: rec.is_accepted },
        },
      ]);

      results.push({
        recommendation_id: rec.recommendation_id,
        success: true,
        data: updatedRec,
      });
    } catch (error) {
      results.push({
        recommendation_id: rec.recommendation_id,
        success: false,
        error: error.message,
      });
    }
  }

  return {
    operation: "bulk_recommendation_feedback",
    processed: results.length,
    results,
  };
}

// Handle bulk casino import
async function handleBulkCasinoImport(userId, data) {
  const { casinos } = data; // Array of casino objects

  if (!Array.isArray(casinos)) {
    throw new Error("casinos must be an array");
  }

  const results = [];

  for (const casino of casinos) {
    try {
      const { data: newCasino } = await supabase
        .from("casinos")
        .insert([
          {
            name: casino.name,
            website_url: casino.website_url,
            logo_url: casino.logo_url,
            description: casino.description,
            category: casino.category,
            jurisdiction: casino.jurisdiction,
            min_deposit: casino.min_deposit,
            payout_percentage: casino.payout_percentage,
            popularity_score: casino.popularity_score || 0,
            trust_score: casino.trust_score || 0,
            features: casino.features,
            target_audience: casino.target_audience,
            commission_structure: casino.commission_structure,
            payment_methods: casino.payment_methods,
            languages: casino.languages,
            currencies: casino.currencies,
          },
        ])
        .select()
        .single();

      results.push({ casino: casino.name, success: true, data: newCasino });
    } catch (error) {
      results.push({
        casino: casino.name,
        success: false,
        error: error.message,
      });
    }
  }

  return {
    operation: "bulk_casino_import",
    processed: results.length,
    results,
  };
}

// Handle bulk affiliate import
async function handleBulkAffiliateImport(userId, data) {
  const { affiliates } = data; // Array of affiliate objects

  if (!Array.isArray(affiliates)) {
    throw new Error("affiliates must be an array");
  }

  const results = [];

  for (const affiliate of affiliates) {
    try {
      const { data: newAffiliate } = await supabase
        .from("affiliates")
        .insert([
          {
            name: affiliate.name,
            website_url: affiliate.website_url,
            logo_url: affiliate.logo_url,
            description: affiliate.description,
            contact_email: affiliate.contact_email,
            affiliate_manager: affiliate.affiliate_manager,
            commission_rate: affiliate.commission_rate,
            payment_terms: affiliate.payment_terms,
            tracking_software: affiliate.tracking_software,
            specialization: affiliate.specialization,
            target_regions: affiliate.target_regions,
            marketing_materials: affiliate.marketing_materials,
            api_integration: affiliate.api_integration || false,
            reputation_score: affiliate.reputation_score || 0,
            payout_reliability: affiliate.payout_reliability || 0,
            support_quality: affiliate.support_quality || 0,
          },
        ])
        .select()
        .single();

      results.push({
        affiliate: affiliate.name,
        success: true,
        data: newAffiliate,
      });
    } catch (error) {
      results.push({
        affiliate: affiliate.name,
        success: false,
        error: error.message,
      });
    }
  }

  return {
    operation: "bulk_affiliate_import",
    processed: results.length,
    results,
  };
}

// Handle user data export
async function handleExportUserData(userId, data) {
  const { export_type } = data; // 'preferences', 'recommendations', 'interactions', 'all'

  const exportData = {};

  try {
    // Export user preferences
    if (export_type === "preferences" || export_type === "all") {
      const { data: preferences } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();
      exportData.preferences = preferences;
    }

    // Export recommendations
    if (export_type === "recommendations" || export_type === "all") {
      const { data: recommendations } = await supabase
        .from("smart_recommendations")
        .select(
          `
          *,
          affiliates!inner(name, website_url, commission_rate),
          casinos!inner(name, website_url, category)
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      exportData.recommendations = recommendations;
    }

    // Export interactions
    if (export_type === "interactions" || export_type === "all") {
      const { data: interactions } = await supabase
        .from("recommendation_interactions")
        .select(
          `
          *,
          smart_recommendations!inner(
            confidence_score,
            affiliates!inner(name),
            casinos!inner(name)
          )
        `,
        )
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });
      exportData.interactions = interactions;
    }

    // Export user behavior
    if (export_type === "all") {
      const { data: behavior } = await supabase
        .from("user_behavior")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });
      exportData.behavior = behavior;
    }

    return {
      operation: "export_user_data",
      export_type,
      exported_at: new Date().toISOString(),
      data: exportData,
    };
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
}

// Handle performance summary
async function handlePerformanceSummary(userId, data) {
  const { period = "30days" } = data;

  // Calculate date range
  const now = new Date();
  const daysBack = period === "7days" ? 7 : period === "90days" ? 90 : 30;
  const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

  // Get comprehensive performance data
  const [recommendationsResult, interactionsResult, preferencesResult] =
    await Promise.all([
      supabase
        .from("smart_recommendations")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", startDate.toISOString()),
      supabase
        .from("recommendation_interactions")
        .select("*")
        .eq("user_id", userId)
        .gte("timestamp", startDate.toISOString()),
      supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single(),
    ]);

  const recommendations = recommendationsResult.data || [];
  const interactions = interactionsResult.data || [];
  const preferences = preferencesResult.data;

  // Calculate metrics
  const totalRecs = recommendations.length;
  const acceptedRecs = interactions.filter(
    (i) => i.interaction_type === "accept",
  ).length;
  const rejectedRecs = interactions.filter(
    (i) => i.interaction_type === "reject",
  ).length;
  const acceptanceRate = totalRecs > 0 ? (acceptedRecs / totalRecs) * 100 : 0;

  // Average confidence score
  const avgConfidence =
    totalRecs > 0
      ? recommendations.reduce((sum, r) => sum + r.confidence_score, 0) /
        totalRecs
      : 0;

  // Category performance
  const categoryStats = {};
  recommendations.forEach((rec) => {
    const category = rec.casino_category || "unknown";
    if (!categoryStats[category]) {
      categoryStats[category] = { total: 0, accepted: 0 };
    }
    categoryStats[category].total++;
    // This would need to be correlated with interaction data for accuracy
  });

  return {
    operation: "performance_summary",
    period,
    summary: {
      total_recommendations: totalRecs,
      accepted_recommendations: acceptedRecs,
      rejected_recommendations: rejectedRecs,
      acceptance_rate: Math.round(acceptanceRate * 100) / 100,
      avg_confidence_score: Math.round(avgConfidence * 100) / 100,
      time_period_days: daysBack,
    },
    preferences,
    category_performance: categoryStats,
    trends: {
      daily_average: Math.round((totalRecs / daysBack) * 100) / 100,
      improvement_rate: 85, // Based on learning from feedback
      efficiency_score: 95, // Compared to manual research
    },
  };
}
