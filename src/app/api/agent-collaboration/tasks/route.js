// API Route: /api/agent-collaboration/tasks
// For coordinating tasks between agents

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const assignedAgent = searchParams.get("assigned");
    const taskType = searchParams.get("type");
    const priority = searchParams.get("priority");

    let query = supabase
      .from("agent_tasks")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    // Filter by status
    if (status) {
      query = query.eq("status", status);
    }

    // Filter by assigned agent
    if (assignedAgent) {
      query = query.eq("assigned_agent", assignedAgent);
    }

    // Filter by task type
    if (taskType) {
      query = query.eq("task_type", taskType);
    }

    // Filter by priority
    if (priority) {
      query = query.eq("priority", priority);
    }

    const { data: tasks, error } = await query.limit(100);

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      tasks: tasks || [],
      count: tasks?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching agent tasks:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch agent tasks",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      task_title,
      task_description,
      task_type,
      created_by_agent,
      assigned_agent,
      priority = "medium",
      estimated_time,
      dependencies = [],
      related_files = [],
      tags = [],
      metadata = {},
    } = body;

    // Validate required fields
    if (!task_title || !task_description || !task_type || !created_by_agent) {
      return Response.json(
        {
          success: false,
          error:
            "Missing required fields: task_title, task_description, task_type, created_by_agent",
        },
        { status: 400 },
      );
    }

    const { data: task, error } = await supabase
      .from("agent_tasks")
      .insert({
        task_title,
        task_description,
        task_type,
        created_by_agent,
        assigned_agent,
        priority,
        estimated_time,
        dependencies,
        related_files,
        tags,
        metadata,
        status: assigned_agent ? "claimed" : "open",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      task,
      message: "Task created successfully",
    });
  } catch (error) {
    console.error("Error creating agent task:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to create agent task",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, agent_name, ...updates } = body;

    if (!id) {
      return Response.json(
        { success: false, error: "Task ID is required for updates" },
        { status: 400 },
      );
    }

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();

    // Handle status changes
    if (updates.status === "claimed" && updates.assigned_agent) {
      updates.started_at = new Date().toISOString();
    } else if (updates.status === "completed") {
      updates.completed_at = new Date().toISOString();
    }

    // Add progress note if provided
    if (updates.progress_note && agent_name) {
      const timestamp = new Date().toISOString();
      const progressNote = `[${timestamp}] ${agent_name}: ${updates.progress_note}`;

      // Get current progress notes
      const { data: currentTask } = await supabase
        .from("agent_tasks")
        .select("progress_notes")
        .eq("id", id)
        .single();

      const currentNotes = currentTask?.progress_notes || [];
      updates.progress_notes = [...currentNotes, progressNote];
      delete updates.progress_note; // Remove the temporary field
    }

    const { data: task, error } = await supabase
      .from("agent_tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      task,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error updating agent task:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to update agent task",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
