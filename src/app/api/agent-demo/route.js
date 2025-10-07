// Demonstration of Agent Collaboration System Usage
// This shows both automatic and manual usage patterns

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// 🤖 AUTOMATIC USAGE - Agents coordinate automatically
export async function automaticCollaboration() {
  console.log("🔄 Automatic Agent Collaboration Demo...\n");

  // 1. Agent discovers available tasks
  const { data: openTasks } = await supabase
    .from("agent_tasks")
    .select("*")
    .eq("status", "open")
    .order("priority", { ascending: false });

  console.log(`📋 Found ${openTasks?.length || 0} open tasks`);

  // 2. Agent automatically claims a high-priority task
  if (openTasks && openTasks.length > 0) {
    const taskToClaim = openTasks[0];

    await supabase
      .from("agent_tasks")
      .update({
        assigned_agent: "supernova",
        status: "claimed",
        started_at: new Date().toISOString(),
        progress_notes: [
          `[${new Date().toISOString()}] supernova: Task automatically claimed due to high priority`,
        ],
      })
      .eq("id", taskToClaim.id);

    console.log(`✅ Auto-claimed task: "${taskToClaim.task_title}"`);

    // 3. Agent automatically notifies about progress
    await supabase.from("agent_communications").insert({
      from_agent: "supernova",
      to_agent: "copilot",
      message_type: "update",
      subject: `Auto-Update: Started work on ${taskToClaim.task_title}`,
      message: `I've automatically claimed and started working on the Smart Matching educational interface. 

🎯 Current Progress:
- Claimed high-priority task
- Analyzing requirements
- Preparing clean UI implementation

📊 Next Steps:
1. Create educational flow mockups
2. Implement clean React components
3. Add beginner-friendly explanations

ETA: ~2 hours. I'll send updates as I progress!`,
      priority: "normal",
      related_task_id: taskToClaim.id,
    });

    console.log("📢 Auto-sent progress update to copilot");
  }
}

// 👤 MANUAL USAGE - You control the collaboration
export async function manualCollaboration() {
  console.log("👤 Manual Agent Collaboration Demo...\n");

  // 1. You create a task for agents to work on
  const { data: newTask } = await supabase
    .from("agent_tasks")
    .insert({
      task_title: "Design New Landing Page for Casino Affiliates",
      task_description:
        "Create a high-converting landing page design that educates visitors about casino affiliate opportunities while capturing leads.",
      task_type: "design",
      created_by_agent: "user",
      priority: "medium",
      estimated_time: "3hours",
      tags: ["design", "landing-page", "conversion", "affiliate"],
      status: "open",
    })
    .select()
    .single();

  console.log(`📝 Created task: "${newTask.task_title}"`);

  // 2. You can assign specific agents
  await supabase
    .from("agent_tasks")
    .update({
      assigned_agent: "supernova",
      status: "claimed",
    })
    .eq("id", newTask.id);

  console.log("👨‍💼 Manually assigned task to Supernova");

  // 3. You can request specific help
  await supabase.from("agent_communications").insert({
    from_agent: "user",
    to_agent: "copilot",
    message_type: "request",
    subject: "Need Technical Implementation After Design",
    message: `Hey Copilot!

Supernova is working on the landing page design. Once that's done, I'll need you to:

1. 🔧 Implement the design in React/Next.js
2. 📊 Add conversion tracking
3. 🔗 Integrate with our affiliate database
4. 📱 Make it mobile-responsive

The design should be ready in ~3 hours. Can you plan for the technical implementation?`,
    priority: "normal",
    related_task_id: newTask.id,
  });

  console.log("💬 Sent manual coordination message");
}

// 📊 MONITORING - See what agents are doing
export async function monitorAgentActivity() {
  console.log("📊 Agent Activity Monitor...\n");

  // Get recent agent activity
  const { data: recentNotes } = await supabase
    .from("agent_notes")
    .select("agent_name, note_type, title, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: activeTasks } = await supabase
    .from("agent_tasks")
    .select("task_title, assigned_agent, status, priority")
    .in("status", ["claimed", "in-progress"]);

  const { data: recentMessages } = await supabase
    .from("agent_communications")
    .select("from_agent, to_agent, subject, message_type, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  console.log("📝 Recent Notes:");
  recentNotes?.forEach((note) => {
    console.log(`  • ${note.agent_name}: ${note.title} (${note.note_type})`);
  });

  console.log("\n⚡ Active Tasks:");
  activeTasks?.forEach((task) => {
    console.log(
      `  • ${task.task_title} → ${task.assigned_agent} (${task.status})`,
    );
  });

  console.log("\n💬 Recent Messages:");
  recentMessages?.forEach((msg) => {
    console.log(`  • ${msg.from_agent} → ${msg.to_agent}: ${msg.subject}`);
  });
}

// API endpoint for demonstration
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const demo = searchParams.get("demo") || "monitor";

  try {
    let result = {};

    switch (demo) {
      case "auto":
        await automaticCollaboration();
        result = { message: "Automatic collaboration demo completed" };
        break;

      case "manual":
        await manualCollaboration();
        result = { message: "Manual collaboration demo completed" };
        break;

      case "monitor":
      default:
        await monitorAgentActivity();
        result = { message: "Activity monitoring completed" };
        break;
    }

    return Response.json({
      success: true,
      demo: demo,
      ...result,
      usage: {
        automatic: "/api/agent-demo?demo=auto",
        manual: "/api/agent-demo?demo=manual",
        monitor: "/api/agent-demo?demo=monitor",
      },
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
