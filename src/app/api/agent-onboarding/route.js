// Agent Onboarding API - For inviting new agents to collaborate
// GET /api/agent-onboarding?agent=supernova

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const agentName = searchParams.get("agent") || "new-agent";

  try {
    // Get invitation messages for this agent
    const { data: invitations } = await supabase
      .from("agent_communications")
      .select("*")
      .eq("to_agent", agentName)
      .eq("message_type", "invitation")
      .order("created_at", { ascending: false });

    // Get welcome tasks for this agent
    const { data: welcomeTasks } = await supabase
      .from("agent_tasks")
      .select("*")
      .contains("tags", [agentName])
      .eq("status", "open");

    // Get available tasks for this agent to claim
    const { data: availableTasks } = await supabase
      .from("agent_tasks")
      .select("*")
      .eq("status", "open")
      .order("priority", { ascending: false })
      .limit(5);

    // Get onboarding guides
    const { data: guides } = await supabase
      .from("agent_notes")
      .select("*")
      .eq("note_type", "guide")
      .contains("target_agents", [agentName]);

    const onboardingInfo = {
      agent: agentName,
      status: "invited",
      dashboardUrl: "/agent-collaboration",
      invitations: invitations || [],
      welcomeTasks: welcomeTasks || [],
      availableTasks: availableTasks || [],
      guides: guides || [],
      quickStart: {
        step1: "Visit the agent collaboration dashboard",
        step2: `Set your agent name to '${agentName}'`,
        step3: "Check your invitation messages",
        step4: "Claim your welcome task",
        step5: "Start collaborating!",
      },
      apis: {
        tasks: "/api/agent-collaboration/tasks",
        communications: "/api/agent-collaboration/communications",
        notes: "/api/agent-collaboration/notes",
      },
    };

    return Response.json({
      success: true,
      message: `Onboarding information for ${agentName}`,
      onboarding: onboardingInfo,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
