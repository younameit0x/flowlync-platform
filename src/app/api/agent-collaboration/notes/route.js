// API Route: /api/agent-collaboration/notes
// For agents to share research, insights, and communicate

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentName = searchParams.get("agent");
    const noteType = searchParams.get("type");
    const tags = searchParams.get("tags");
    const targetAgent = searchParams.get("target");

    let query = supabase
      .from("agent_notes")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter by agent if specified
    if (agentName) {
      query = query.eq("agent_name", agentName);
    }

    // Filter by note type if specified
    if (noteType) {
      query = query.eq("note_type", noteType);
    }

    // Filter by tags if specified
    if (tags) {
      const tagArray = tags.split(",");
      query = query.overlaps("tags", tagArray);
    }

    // Filter by target agent if specified
    if (targetAgent) {
      query = query.or(
        `target_agents.cs.{${targetAgent}},target_agents.cs.{all}`,
      );
    }

    const { data: notes, error } = await query.limit(50);

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      notes: notes || [],
      count: notes?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching agent notes:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch agent notes",
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
      agent_name,
      note_type,
      title,
      content,
      tags = [],
      related_file_path,
      priority = "medium",
      target_agents = ["all"],
      metadata = {},
    } = body;

    // Validate required fields
    if (!agent_name || !note_type || !title || !content) {
      return Response.json(
        {
          success: false,
          error:
            "Missing required fields: agent_name, note_type, title, content",
        },
        { status: 400 },
      );
    }

    const { data: note, error } = await supabase
      .from("agent_notes")
      .insert({
        agent_name,
        note_type,
        title,
        content,
        tags,
        related_file_path,
        priority,
        target_agents,
        metadata,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      note,
      message: "Note created successfully",
    });
  } catch (error) {
    console.error("Error creating agent note:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to create agent note",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return Response.json(
        { success: false, error: "Note ID is required for updates" },
        { status: 400 },
      );
    }

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();

    const { data: note, error } = await supabase
      .from("agent_notes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Error updating agent note:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to update agent note",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
