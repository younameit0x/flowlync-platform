'use client';

import { useState, useEffect } from 'react';

export default function AgentCollaborationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [agentName, setAgentName] = useState('copilot');
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Available agents in the system
  const availableAgents = ['copilot', 'supernova', 'claude', 'other'];

  useEffect(() => {
    loadDashboardData();
  }, [agentName]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load notes
      const notesResponse = await fetch(`/api/agent-collaboration/notes?target=${agentName}`);
      const notesData = await notesResponse.json();
      if (notesData.success) setNotes(notesData.notes);

      // Load tasks
      const tasksResponse = await fetch('/api/agent-collaboration/tasks?status=open');
      const tasksData = await tasksResponse.json();
      if (tasksData.success) setTasks(tasksData.tasks);

      // Load communications
      const commsResponse = await fetch(`/api/agent-collaboration/communications?agent=${agentName}&unread=true`);
      const commsData = await commsResponse.json();
      if (commsData.success) setCommunications(commsData.messages);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (toAgent, messageType, subject, message, relatedTaskId = null) => {
    try {
      const response = await fetch('/api/agent-collaboration/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_agent: agentName,
          to_agent: toAgent,
          message_type: messageType,
          subject,
          message,
          related_task_id: relatedTaskId,
          priority: 'normal'
        })
      });

      if (response.ok) {
        loadDashboardData(); // Refresh data
        return true;
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    return false;
  };

  const claimTask = async (taskId) => {
    try {
      const response = await fetch('/api/agent-collaboration/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: taskId,
          assigned_agent: agentName,
          status: 'claimed',
          agent_name: agentName,
          progress_note: 'Task claimed and starting work'
        })
      });

      if (response.ok) {
        loadDashboardData(); // Refresh data
        return true;
      }
    } catch (error) {
      console.error('Error claiming task:', error);
    }
    return false;
  };

  const createNote = async (noteType, title, content, tags = [], targetAgents = ['all']) => {
    try {
      const response = await fetch('/api/agent-collaboration/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name: agentName,
          note_type: noteType,
          title,
          content,
          tags,
          target_agents: targetAgents,
          priority: 'medium'
        })
      });

      if (response.ok) {
        loadDashboardData(); // Refresh data
        return true;
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">🤖 Loading Agent Collaboration Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🤖 Agent Collaboration Hub
              </h1>
              <p className="text-gray-600 text-lg">Multi-agent coordination and communication center</p>
            </div>
            
            {/* Agent Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium">Active Agent:</label>
              <select 
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-xl font-medium bg-white hover:border-blue-400 focus:border-blue-500 focus:outline-none"
              >
                {availableAgents.map(agent => (
                  <option key={agent} value={agent}>
                    {agent.charAt(0).toUpperCase() + agent.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
              <div className="text-blue-800 font-medium">Shared Notes</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'open').length}</div>
              <div className="text-green-800 font-medium">Open Tasks</div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{communications.length}</div>
              <div className="text-orange-800 font-medium">Unread Messages</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{tasks.filter(t => t.assigned_agent === agentName).length}</div>
              <div className="text-purple-800 font-medium">My Tasks</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex space-x-2 mb-8 bg-gray-100 rounded-2xl p-2">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'tasks', label: '⚡ Tasks', icon: '⚡' },
              { id: 'notes', label: '📝 Notes', icon: '📝' },
              { id: 'communications', label: '💬 Messages', icon: '💬' },
              { id: 'create', label: '➕ Create', icon: '➕' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white shadow-lg text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">🎯 Agent Collaboration Overview</h2>
                <p className="text-gray-600 text-lg">Coordinate work, share insights, and collaborate efficiently</p>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="border-2 border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Recent Notes</h3>
                  <div className="space-y-4">
                    {notes.slice(0, 3).map(note => (
                      <div key={note.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-800">{note.title}</span>
                          <span className="text-sm text-gray-500">{note.agent_name}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{note.content.substring(0, 100)}...</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {note.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Active Tasks</h3>
                  <div className="space-y-4">
                    {tasks.filter(t => t.status === 'open').slice(0, 3).map(task => (
                      <div key={task.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-800">{task.task_title}</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{task.task_description.substring(0, 100)}...</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500">{task.created_by_agent}</span>
                          <button
                            onClick={() => claimTask(task.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            Claim Task
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">⚡ Task Coordination</h2>
                <div className="flex space-x-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                    ➕ Create Task
                  </button>
                </div>
              </div>

              <div className="grid gap-6">
                {tasks.map(task => (
                  <div key={task.id} className="border-2 border-gray-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{task.task_title}</h3>
                        <p className="text-gray-600 mb-4">{task.task_description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                            {task.task_type}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority} priority
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            task.status === 'open' ? 'bg-gray-100 text-gray-800' :
                            task.status === 'claimed' ? 'bg-orange-100 text-orange-800' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.status}
                          </span>
                          {task.estimated_time && (
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm font-medium">
                              ~{task.estimated_time}
                            </span>
                          )}
                        </div>

                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {task.tags.map(tag => (
                              <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="ml-4 text-right">
                        <div className="text-sm text-gray-500 mb-2">Created by: {task.created_by_agent}</div>
                        {task.assigned_agent && (
                          <div className="text-sm text-gray-500 mb-2">Assigned to: {task.assigned_agent}</div>
                        )}
                        <div className="space-y-2">
                          {task.status === 'open' && (
                            <button
                              onClick={() => claimTask(task.id)}
                              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors"
                            >
                              Claim Task
                            </button>
                          )}
                          <button
                            onClick={() => sendMessage(task.created_by_agent, 'question', `Question about: ${task.task_title}`, 'I have a question about this task...', task.id)}
                            className="block w-full bg-gray-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-700 transition-colors"
                          >
                            Ask Question
                          </button>
                        </div>
                      </div>
                    </div>

                    {task.progress_notes && task.progress_notes.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-800 mb-2">Progress Notes:</h4>
                        <div className="space-y-2">
                          {task.progress_notes.slice(-3).map((note, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {note}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">📝 Shared Knowledge Base</h2>
              </div>

              <div className="grid gap-6">
                {notes.map(note => (
                  <div key={note.id} className="border-2 border-gray-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                            {note.note_type}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            note.priority === 'high' ? 'bg-red-100 text-red-800' :
                            note.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {note.priority}
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <pre className="whitespace-pre-wrap text-gray-700">{note.content}</pre>
                        </div>

                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {note.tags.map(tag => (
                              <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {note.related_file_path && (
                          <div className="text-sm text-gray-600 mb-2">
                            📄 Related file: <code className="bg-gray-100 px-2 py-1 rounded">{note.related_file_path}</code>
                          </div>
                        )}
                      </div>

                      <div className="ml-4 text-right">
                        <div className="text-sm text-gray-500 mb-2">By: {note.agent_name}</div>
                        <div className="text-sm text-gray-500 mb-2">
                          Target: {note.target_agents.join(', ')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(note.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'communications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">💬 Agent Communications</h2>
              </div>

              <div className="grid gap-6">
                {communications.map(comm => (
                  <div key={comm.id} className="border-2 border-gray-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{comm.subject || 'No Subject'}</h3>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                            {comm.message_type}
                          </span>
                          {comm.priority !== 'normal' && (
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              comm.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              comm.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {comm.priority}
                            </span>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <pre className="whitespace-pre-wrap text-gray-700">{comm.message}</pre>
                        </div>
                      </div>

                      <div className="ml-4 text-right">
                        <div className="text-sm text-gray-500 mb-2">From: {comm.from_agent}</div>
                        <div className="text-sm text-gray-500 mb-2">To: {comm.to_agent || 'All Agents'}</div>
                        <div className="text-xs text-gray-400 mb-4">
                          {new Date(comm.created_at).toLocaleString()}
                        </div>
                        
                        <button
                          onClick={() => {
                            // Mark as read and reply functionality can be added here
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center">➕ Create & Collaborate</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">🚀 Quick Actions</h3>
                  
                  <div className="grid gap-4">
                    <button
                      onClick={() => createNote('insight', 'New Insight', 'Share your findings here...', ['insight'], ['all'])}
                      className="bg-blue-600 text-white p-4 rounded-2xl text-left hover:bg-blue-700 transition-colors"
                    >
                      <div className="font-bold">💡 Share Insight</div>
                      <div className="text-sm opacity-90">Document findings or discoveries</div>
                    </button>
                    
                    <button
                      onClick={() => sendMessage('all', 'update', 'Progress Update', 'Current status and next steps...')}
                      className="bg-green-600 text-white p-4 rounded-2xl text-left hover:bg-green-700 transition-colors"
                    >
                      <div className="font-bold">📢 Broadcast Update</div>
                      <div className="text-sm opacity-90">Share progress with all agents</div>
                    </button>
                    
                    <button className="bg-purple-600 text-white p-4 rounded-2xl text-left hover:bg-purple-700 transition-colors">
                      <div className="font-bold">🎨 Upload Asset</div>
                      <div className="text-sm opacity-90">Share designs or code snippets</div>
                    </button>
                    
                    <button className="bg-orange-600 text-white p-4 rounded-2xl text-left hover:bg-orange-700 transition-colors">
                      <div className="font-bold">⚡ Create Task</div>
                      <div className="text-sm opacity-90">Delegate work to other agents</div>
                    </button>
                  </div>
                </div>

                {/* Collaboration Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🤝 Collaboration Best Practices</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">📝</span>
                      <div>
                        <div className="font-bold text-gray-800">Document Everything</div>
                        <div className="text-sm text-gray-600">Share insights, decisions, and findings to help other agents</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🏷️</span>
                      <div>
                        <div className="font-bold text-gray-800">Use Tags Effectively</div>
                        <div className="text-sm text-gray-600">Tag notes and tasks for easy discovery and organization</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <div className="font-bold text-gray-800">Clear Task Descriptions</div>
                        <div className="text-sm text-gray-600">Provide context, requirements, and expected outcomes</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <div className="font-bold text-gray-800">Communicate Proactively</div>
                        <div className="text-sm text-gray-600">Share updates, ask questions, and coordinate work</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}