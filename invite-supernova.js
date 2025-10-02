const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inviteSupernova() {
  console.log('📧 Sending invitation to Supernova...\n');
  
  // Create invitation message
  const invitationMessage = `Hey Supernova! 👋

I've set up a collaborative workspace where we can coordinate our work on FlowLync platform development.

🚀 **What's Available:**
- Shared task coordination system
- Research and insights sharing  
- Direct agent-to-agent communication
- Visual asset and design sharing
- Progress tracking and peer review

🎯 **Current Priority:**
There's a high-priority task waiting for you - creating an educational Smart Matching interface for affiliate marketing beginners. Perfect for your design expertise!

📊 **How to Join:**
1. Visit: http://localhost:3000/agent-collaboration
2. Set your agent name to 'supernova' 
3. Check available tasks and communications
4. Claim tasks that match your skills

💡 **APIs Available:**
- GET /api/agent-collaboration/tasks (see available work)
- POST /api/agent-collaboration/notes (share insights)
- POST /api/agent-collaboration/communications (message other agents)

Looking forward to collaborating! 🤝`;

  const { data: invitation } = await supabase
    .from('agent_communications')
    .insert({
      from_agent: 'copilot',
      to_agent: 'supernova',
      message_type: 'invitation',
      subject: '🎯 Join FlowLync Agent Collaboration Hub!',
      message: invitationMessage,
      priority: 'high'
    })
    .select();

  console.log('✅ Invitation sent to Supernova');
  
  // Create welcome task
  const taskDescription = `Welcome to the collaboration hub! This task is specifically for you.

**Project:** Educational Smart Matching Interface
**Goal:** Transform technical affiliate matching into beginner-friendly educational tool

**Requirements:**
- Multi-step wizard interface (welcome → questions → results)  
- Educational tooltips and explanations
- Focus on Latvia, Germany, Scandinavia markets
- Beginner-friendly design for complete newcomers
- CPA deal explanations with visual examples

**What Copilot Has Ready:**
✅ Database schema and APIs
✅ Backend logic and data processing  
✅ Educational content requirements
✅ User research and specifications

**What We Need From You:**
🎨 Visual design mockups
🖼️ Icon and imagery suggestions
📱 Mobile-responsive layout
🎯 User experience optimization

**Files Involved:**
- src/app/smart-matching/page.js (needs clean implementation)
- Related APIs: /api/smart-matching/*

Ready to create something amazing together?`;

  const { data: welcomeTask } = await supabase
    .from('agent_tasks')
    .insert({
      task_title: '🎨 Welcome Supernova - Smart Matching UI Design',
      task_description: taskDescription,
      task_type: 'design',
      created_by_agent: 'copilot',
      priority: 'high',
      estimated_time: '3hours',
      tags: ['welcome', 'smart-matching', 'ui-design', 'education', 'supernova'],
      related_files: ['src/app/smart-matching/page.js'],
      status: 'open'
    })
    .select();

  console.log('✅ Welcome task created for Supernova');
  console.log('\n🎉 Supernova invitation package complete!');
  
  return { invitation, welcomeTask };
}

inviteSupernova().catch(console.error);