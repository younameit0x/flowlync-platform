import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST /api/smart-matching/webhooks - Handle external integrations
export async function POST(request) {
  try {
    const body = await request.json();
    const { webhook_type, source, data, signature } = body;

    // Verify webhook signature if provided (for security)
    if (signature && !verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (!webhook_type || !data) {
      return NextResponse.json(
        { error: "webhook_type and data are required" },
        { status: 400 },
      );
    }

    let result;

    switch (webhook_type) {
      case "affiliate_performance_update":
        result = await handleAffiliatePerformanceUpdate(data);
        break;
      case "casino_data_update":
        result = await handleCasinoDataUpdate(data);
        break;
      case "user_behavior_tracking":
        result = await handleUserBehaviorTracking(data);
        break;
      case "recommendation_feedback":
        result = await handleRecommendationFeedback(data);
        break;
      case "bulk_data_sync":
        result = await handleBulkDataSync(data);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid webhook type" },
          { status: 400 },
        );
    }

    // Log the webhook for monitoring
    await supabase.from("webhook_logs").insert([
      {
        webhook_type,
        source,
        processed: true,
        result: { success: true, records_affected: result.affected || 0 },
        created_at: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in POST /api/smart-matching/webhooks:", error);

    // Log failed webhook
    await supabase.from("webhook_logs").insert([
      {
        webhook_type: body?.webhook_type || "unknown",
        source: body?.source || "unknown",
        processed: false,
        result: { error: error.message },
        created_at: new Date().toISOString(),
      },
    ]);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

// Handle affiliate performance updates from external sources
async function handleAffiliatePerformanceUpdate(data) {
  const { affiliate_id, date, metrics } = data;

  if (!affiliate_id || !date || !metrics) {
    throw new Error("affiliate_id, date, and metrics are required");
  }

  // Upsert performance data
  const { data: performance, error } = await supabase
    .from("affiliate_performance")
    .upsert(
      {
        affiliate_id: parseInt(affiliate_id),
        date: date,
        clicks: metrics.clicks || 0,
        signups: metrics.signups || 0,
        deposits: metrics.deposits || 0,
        conversions: metrics.conversions || 0,
        revenue: metrics.revenue || 0,
        payout: metrics.payout || 0,
        player_value: metrics.player_value || 0,
        retention_rate: metrics.retention_rate || 0,
      },
      {
        onConflict: "affiliate_id,date",
      },
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update affiliate performance: ${error.message}`);
  }

  // Update affiliate's overall scores based on performance
  await updateAffiliateScores(affiliate_id);

  return {
    operation: "affiliate_performance_update",
    affiliate_id,
    date,
    affected: 1,
    performance,
  };
}

// Handle casino data updates
async function handleCasinoDataUpdate(data) {
  const { casino_id, updates } = data;

  if (!casino_id || !updates) {
    throw new Error("casino_id and updates are required");
  }

  const { data: casino, error } = await supabase
    .from("casinos")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", casino_id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update casino data: ${error.message}`);
  }

  return {
    operation: "casino_data_update",
    casino_id,
    affected: 1,
    casino,
  };
}

// Handle user behavior tracking
async function handleUserBehaviorTracking(data) {
  const { user_id, session_id, action_type, target_type, target_id, metadata } =
    data;

  if (!user_id || !action_type) {
    throw new Error("user_id and action_type are required");
  }

  const { data: behavior, error } = await supabase
    .from("user_behavior")
    .insert([
      {
        user_id,
        session_id,
        action_type,
        target_type,
        target_id,
        metadata,
        timestamp: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to track user behavior: ${error.message}`);
  }

  return {
    operation: "user_behavior_tracking",
    user_id,
    action_type,
    affected: 1,
    behavior,
  };
}

// Handle recommendation feedback from external sources
async function handleRecommendationFeedback(data) {
  const { user_id, recommendation_id, feedback, is_accepted, source } = data;

  if (!user_id || !recommendation_id || feedback === undefined) {
    throw new Error("user_id, recommendation_id, and feedback are required");
  }

  // Update recommendation
  const { data: recommendation, error } = await supabase
    .from("smart_recommendations")
    .update({
      user_feedback: feedback,
      is_accepted: is_accepted !== undefined ? is_accepted : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", recommendation_id)
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to update recommendation feedback: ${error.message}`,
    );
  }

  // Log interaction
  await supabase.from("recommendation_interactions").insert([
    {
      recommendation_id,
      user_id,
      interaction_type: is_accepted
        ? "accept"
        : feedback === -1
          ? "reject"
          : "view",
      metadata: { feedback, is_accepted, source },
    },
  ]);

  return {
    operation: "recommendation_feedback",
    user_id,
    recommendation_id,
    affected: 1,
    recommendation,
  };
}

// Handle bulk data synchronization
async function handleBulkDataSync(data) {
  const { sync_type, records } = data;

  if (!sync_type || !Array.isArray(records)) {
    throw new Error("sync_type and records array are required");
  }

  let tableName;
  switch (sync_type) {
    case "affiliates":
      tableName = "affiliates";
      break;
    case "casinos":
      tableName = "casinos";
      break;
    case "performance":
      tableName = "affiliate_performance";
      break;
    default:
      throw new Error("Invalid sync_type");
  }

  const results = [];
  for (const record of records) {
    try {
      const { data: inserted, error } = await supabase
        .from(tableName)
        .upsert(record, { onConflict: "id" })
        .select()
        .single();

      if (error) {
        results.push({
          record: record.id || "unknown",
          success: false,
          error: error.message,
        });
      } else {
        results.push({
          record: record.id || "unknown",
          success: true,
          data: inserted,
        });
      }
    } catch (error) {
      results.push({
        record: record.id || "unknown",
        success: false,
        error: error.message,
      });
    }
  }

  return {
    operation: "bulk_data_sync",
    sync_type,
    total_records: records.length,
    successful_records: results.filter((r) => r.success).length,
    failed_records: results.filter((r) => !r.success).length,
    results,
  };
}

// Update affiliate scores based on recent performance
async function updateAffiliateScores(affiliateId) {
  // Get recent performance data (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: performance } = await supabase
    .from("affiliate_performance")
    .select("*")
    .eq("affiliate_id", affiliateId)
    .gte("date", thirtyDaysAgo.toISOString().split("T")[0]);

  if (performance && performance.length > 0) {
    // Calculate average metrics
    const avgClicks =
      performance.reduce((sum, p) => sum + p.clicks, 0) / performance.length;
    const avgConversions =
      performance.reduce((sum, p) => sum + p.conversions, 0) /
      performance.length;
    const avgRevenue =
      performance.reduce((sum, p) => sum + p.revenue, 0) / performance.length;
    const avgRetention =
      performance.reduce((sum, p) => sum + p.retention_rate, 0) /
      performance.length;

    // Calculate new reputation score (0-100)
    const conversionRate = avgClicks > 0 ? avgConversions / avgClicks : 0;
    const revenueScore = Math.min((avgRevenue / 1000) * 20, 100); // Normalize revenue
    const retentionScore = avgRetention * 20; // Convert decimal to score

    const newReputationScore = Math.round(
      conversionRate * 30 + revenueScore * 0.4 + retentionScore * 0.3,
    );

    // Update affiliate
    await supabase
      .from("affiliates")
      .update({
        reputation_score: Math.max(0, Math.min(100, newReputationScore)),
        updated_at: new Date().toISOString(),
      })
      .eq("id", affiliateId);
  }
}

// Verify webhook signature for security
function verifyWebhookSignature(payload, signature) {
  // In production, implement proper HMAC verification
  // For now, just check if signature exists
  return signature && signature.length > 0;
}
