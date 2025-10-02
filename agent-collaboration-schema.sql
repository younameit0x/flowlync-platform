-- Agent Collaboration System Database Schema
-- This creates tables for multi-agent communication and coordination

-- 1. Agent Notes - For sharing research, insights, and communication
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

-- 2. Agent Assets - For sharing visual designs, code snippets, files
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

-- 3. Agent Tasks - For coordinating work and avoiding duplicates
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

-- 4. Agent Sessions - For tracking collaborative work sessions
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

-- 5. Agent Communications - Real-time messaging between agents
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

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_agent_notes_agent_type ON agent_notes(agent_name, note_type);
CREATE INDEX IF NOT EXISTS idx_agent_notes_tags ON agent_notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_agent_notes_target ON agent_notes USING GIN(target_agents);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_assigned ON agent_tasks(assigned_agent);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_tags ON agent_tasks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_agent_comms_from_to ON agent_communications(from_agent, to_agent);
CREATE INDEX IF NOT EXISTS idx_agent_comms_read ON agent_communications(read_status);

-- Enable Row Level Security
ALTER TABLE agent_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_communications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all for service role, restrict for others)
CREATE POLICY "agent_notes_policy" ON agent_notes FOR ALL USING (true);
CREATE POLICY "agent_assets_policy" ON agent_assets FOR ALL USING (true);
CREATE POLICY "agent_tasks_policy" ON agent_tasks FOR ALL USING (true);
CREATE POLICY "agent_sessions_policy" ON agent_sessions FOR ALL USING (true);
CREATE POLICY "agent_communications_policy" ON agent_communications FOR ALL USING (true);