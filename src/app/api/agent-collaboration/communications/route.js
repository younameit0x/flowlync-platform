// API Route: /api/agent-collaboration/communications
// For agent-to-agent messaging and coordination

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentName = searchParams.get('agent');
    const messageType = searchParams.get('type');
    const unreadOnly = searchParams.get('unread') === 'true';
    const conversationId = searchParams.get('conversation');

    let query = supabase
      .from('agent_communications')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by agent (messages to/from this agent)
    if (agentName) {
      query = query.or(`from_agent.eq.${agentName},to_agent.eq.${agentName},to_agent.is.null`);
    }

    // Filter by message type
    if (messageType) {
      query = query.eq('message_type', messageType);
    }

    // Filter unread messages
    if (unreadOnly) {
      query = query.eq('read_status', false);
    }

    // Filter by conversation thread
    if (conversationId) {
      query = query.or(`id.eq.${conversationId},replied_to.eq.${conversationId}`);
    }

    const { data: messages, error } = await query.limit(100);

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      messages: messages || [],
      count: messages?.length || 0
    });

  } catch (error) {
    console.error('Error fetching agent communications:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch agent communications',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      from_agent,
      to_agent,
      message_type,
      subject,
      message,
      related_task_id,
      related_note_id,
      priority = 'normal',
      replied_to,
      metadata = {}
    } = body;

    // Validate required fields
    if (!from_agent || !message_type || !message) {
      return Response.json(
        { 
          success: false, 
          error: 'Missing required fields: from_agent, message_type, message' 
        },
        { status: 400 }
      );
    }

    const { data: communication, error } = await supabase
      .from('agent_communications')
      .insert({
        from_agent,
        to_agent,
        message_type,
        subject,
        message,
        related_task_id,
        related_note_id,
        priority,
        replied_to,
        metadata
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      communication,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error creating agent communication:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to send message',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return Response.json(
        { success: false, error: 'Message ID is required for updates' },
        { status: 400 }
      );
    }

    const { data: communication, error } = await supabase
      .from('agent_communications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      communication,
      message: 'Message updated successfully'
    });

  } catch (error) {
    console.error('Error updating agent communication:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to update message',
        details: error.message 
      },
      { status: 500 }
    );
  }
}