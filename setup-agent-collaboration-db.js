const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupAgentCollaborationTables() {
  console.log('🤖 Setting up Agent Collaboration System...\n');

  try {
    // 1. Agent Notes - For sharing research, insights, and communication
    console.log('📝 Creating agent_notes table...');
    const { error: notesError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS agent_notes (
          id SERIAL PRIMARY KEY,
          agent_name VARCHAR(50) NOT NULL,
          note_type VARCHAR(30) NOT NULL, -- 'research', 'insight', 'visual', 'task', 'code', 'strategy'
          title VARCHAR(200) NOT NULL,
          content TEXT NOT NULL,
          tags TEXT[], -- ['smart-matching', 'ui-design', 'affiliate-marketing']
          related_file_path VARCHAR(500),
          priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
          status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'archived'
          target_agents TEXT[], -- ['copilot', 'supernova', 'all'] - who this note is for
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `
    });

    if (notesError) throw notesError;
    console.log('✅ agent_notes table created');

    // 2. Agent Assets - For sharing visual designs, code snippets, files
    console.log('🎨 Creating agent_assets table...');
    const { error: assetsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS agent_assets (
          id SERIAL PRIMARY KEY,
          agent_name VARCHAR(50) NOT NULL,
          asset_type VARCHAR(30) NOT NULL, -- 'image', 'code', 'design', 'document', 'data'
          asset_name VARCHAR(200) NOT NULL,
          asset_url TEXT,
          asset_content TEXT, -- For code snippets or text assets
          description TEXT,
          tags TEXT[],
          related_project VARCHAR(100),
          usage_instructions TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `
    });

    if (assetsError) throw assetsError;
    console.log('✅ agent_assets table created');

    // 3. Agent Tasks - For coordinating work and avoiding duplicates
    console.log('⚡ Creating agent_tasks table...');
    const { error: tasksError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS agent_tasks (
          id SERIAL PRIMARY KEY,
          task_title VARCHAR(200) NOT NULL,
          task_description TEXT NOT NULL,
          task_type VARCHAR(30) NOT NULL, -- 'development', 'research', 'design', 'testing', 'documentation'
          assigned_agent VARCHAR(50),
          created_by_agent VARCHAR(50) NOT NULL,
          priority VARCHAR(20) DEFAULT 'medium',
          status VARCHAR(30) DEFAULT 'open', -- 'open', 'claimed', 'in-progress', 'review', 'completed', 'blocked'
          estimated_time VARCHAR(20), -- '30min', '2hours', '1day'
          dependencies TEXT[], -- Task IDs this depends on
          related_files TEXT[],
          tags TEXT[],
          progress_notes TEXT[],
          started_at TIMESTAMP WITH TIME ZONE,
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `
    });

    if (tasksError) throw tasksError;
    console.log('✅ agent_tasks table created');

    // 4. Agent Sessions - For tracking collaborative work sessions
    console.log('🔄 Creating agent_sessions table...');
    const { error: sessionsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS agent_sessions (
          id SERIAL PRIMARY KEY,
          session_name VARCHAR(200) NOT NULL,
          description TEXT,
          participating_agents TEXT[] NOT NULL,
          session_type VARCHAR(30) DEFAULT 'collaboration', -- 'collaboration', 'handoff', 'review', 'research'
          status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused'
          goals TEXT[],
          achievements TEXT[],
          current_focus VARCHAR(200),
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          ended_at TIMESTAMP WITH TIME ZONE,
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `
    });

    if (sessionsError) throw sessionsError;
    console.log('✅ agent_sessions table created');

    // 5. Agent Communications - Real-time messaging between agents
    console.log('💬 Creating agent_communications table...');
    const { error: commsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS agent_communications (
          id SERIAL PRIMARY KEY,
          from_agent VARCHAR(50) NOT NULL,
          to_agent VARCHAR(50), -- NULL for broadcast messages
          message_type VARCHAR(30) NOT NULL, -- 'info', 'question', 'request', 'handoff', 'alert', 'update'
          subject VARCHAR(200),
          message TEXT NOT NULL,
          related_task_id INTEGER REFERENCES agent_tasks(id),
          related_note_id INTEGER REFERENCES agent_notes(id),
          priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
          read_status BOOLEAN DEFAULT FALSE,
          replied_to INTEGER REFERENCES agent_communications(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB DEFAULT '{}'::jsonb
        );
      `
    });

    if (commsError) throw commsError;
    console.log('✅ agent_communications table created');

    // 6. Create indexes for better performance
    console.log('🚀 Creating performance indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_agent_notes_agent_type ON agent_notes(agent_name, note_type);',
      'CREATE INDEX IF NOT EXISTS idx_agent_notes_tags ON agent_notes USING GIN(tags);',
      'CREATE INDEX IF NOT EXISTS idx_agent_notes_target ON agent_notes USING GIN(target_agents);',
      'CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);',
      'CREATE INDEX IF NOT EXISTS idx_agent_tasks_assigned ON agent_tasks(assigned_agent);',
      'CREATE INDEX IF NOT EXISTS idx_agent_tasks_tags ON agent_tasks USING GIN(tags);',
      'CREATE INDEX IF NOT EXISTS idx_agent_comms_from_to ON agent_communications(from_agent, to_agent);',
      'CREATE INDEX IF NOT EXISTS idx_agent_comms_read ON agent_communications(read_status);'
    ];

    for (const indexSql of indexes) {
      await supabase.rpc('execute_sql', { sql: indexSql });
    }
    console.log('✅ Performance indexes created');

    // 7. Insert some initial sample data
    console.log('🎯 Adding initial collaboration data...');
    
    // Sample note from Copilot to Supernova
    await supabase.from('agent_notes').insert({
      agent_name: 'copilot',
      note_type: 'insight',
      title: 'Smart Matching Educational Design Requirements',
      content: `Key insights for educational Smart Matching interface:

1. Target Audience: Complete beginners to affiliate marketing
2. Geographic Focus: Latvia, Germany, Scandinavia (high-value markets)
3. Educational Elements Needed:
   - CPA explanations with real examples
   - Step-by-step wizard interface
   - Tooltip explanations for all terms
   - Visual progress indicators
   - Success stories and earning potential

4. Technical Requirements:
   - Multi-step form (welcome → questions → results)
   - Educational content integration
   - Geographic targeting logic
   - Beginner-friendly recommendations

5. UX Priorities:
   - Remove all jargon
   - Add visual explanations
   - Show earning potential clearly
   - Provide actionable next steps`,
      tags: ['smart-matching', 'ui-design', 'education', 'affiliate-marketing'],
      related_file_path: 'src/app/smart-matching/page.js',
      priority: 'high',
      target_agents: ['supernova', 'all']
    });

    // Sample task for collaboration
    await supabase.from('agent_tasks').insert({
      task_title: 'Design Educational Smart Matching UI Components',
      task_description: 'Create visual designs and UI components for the educational Smart Matching interface that teaches affiliate marketing while collecting user preferences.',
      task_type: 'design',
      created_by_agent: 'copilot',
      priority: 'high',
      estimated_time: '2hours',
      tags: ['smart-matching', 'ui-design', 'education'],
      related_files: ['src/app/smart-matching/page.js'],
      status: 'open'
    });

    // Sample communication
    await supabase.from('agent_communications').insert({
      from_agent: 'copilot',
      to_agent: 'supernova',
      message_type: 'handoff',
      subject: 'Smart Matching Educational Interface Collaboration',
      message: `Hey Supernova! 👋

I've been working on transforming the Smart Matching tool into an educational platform for affiliate marketing beginners. 

The user specifically wants:
- Very beginner-friendly interface
- Focus on CPA deals for Latvia/Germany/Scandinavia
- Educational tooltips and explanations
- Step-by-step guidance

I've created the technical foundation and database structure. Could you help with:
1. Visual design mockups for the educational flow?
2. Icon suggestions and visual hierarchy?
3. Research on best practices for educational onboarding?

I'll handle the React implementation once we have the design direction. Let's coordinate to deliver this efficiently!`,
      priority: 'high'
    });

    console.log('✅ Sample collaboration data added');

    console.log('\n🎉 Agent Collaboration System Setup Complete!');
    console.log('\nFeatures available:');
    console.log('📝 Shared Notes & Research');
    console.log('🎨 Asset & Design Sharing');
    console.log('⚡ Task Coordination');
    console.log('🔄 Session Tracking');
    console.log('💬 Inter-Agent Communication');
    console.log('\nNext: Build the agent dashboard UI to access this system!');

  } catch (error) {
    console.error('❌ Error setting up agent collaboration:', error);
    throw error;
  }
}

if (require.main === module) {
  setupAgentCollaborationTables()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { setupAgentCollaborationTables };