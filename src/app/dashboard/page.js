"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  
  // Dashboard state
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalUsers: 0,
      activeAffiliate: 0,
      monthlyRevenue: 0,
      conversionRate: 0,
    },
    recentActivity: [],
    topPerformers: [],
    loading: true
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login");
    }
    if (user) {
      loadDashboardData();
    }
  }, [user, isLoading, router]);

  const loadDashboardData = async () => {
    // Simulate loading real business data
    setTimeout(() => {
      setDashboardData({
        metrics: {
          totalUsers: 1247,
          activeAffiliates: 89,
          monthlyRevenue: 45230,
          conversionRate: 12.4,
        },
        recentActivity: [
          { id: 1, type: 'signup', user: 'new.user@email.com', time: '2 minutes ago', value: '+€150 potential' },
          { id: 2, type: 'affiliate', user: 'affiliate.pro@gmail.com', time: '15 minutes ago', value: '+€890 commission' },
          { id: 3, type: 'match', user: 'beginner@yahoo.com', time: '32 minutes ago', value: 'Smart Match completed' },
          { id: 4, type: 'signup', user: 'startup.founder@startup.lv', time: '1 hour ago', value: '+€300 potential' },
        ],
        topPerformers: [
          { rank: 1, name: 'Latvia Casino Network', revenue: 12450, growth: '+23%' },
          { rank: 2, name: 'German Gaming Partners', revenue: 9870, growth: '+18%' },
          { rank: 3, name: 'Nordic Affiliate Hub', revenue: 7890, growth: '+15%' },
        ],
        loading: false
      });
    }, 1000);
  };

  if (isLoading || dashboardData.loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <div className="text-white text-xl">Loading FlowLync Dashboard...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error.message}</div>
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-black bg-opacity-20 backdrop-blur-lg border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              📊 FlowLync Business Dashboard
            </div>
            <div className="text-green-400 text-sm font-semibold bg-green-400 bg-opacity-20 px-3 py-1 rounded-full">
              LIVE
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-white font-semibold">{user.name || user.email}</div>
              <div className="text-blue-300 text-sm">Platform Admin</div>
            </div>
            <img 
              src={user.picture || '/default-avatar.png'} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-blue-400"
            />
            <Link
              href="/api/auth/logout"
              className="bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-300 px-4 py-2 rounded-lg transition-all border border-red-500 border-opacity-30"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">👥</div>
              <div className="text-green-400 text-sm font-semibold">+12% this month</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{dashboardData.metrics.totalUsers.toLocaleString()}</div>
            <div className="text-blue-200">Total Users</div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🤝</div>
              <div className="text-green-400 text-sm font-semibold">+8% this month</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{dashboardData.metrics.activeAffiliates}</div>
            <div className="text-blue-200">Active Affiliates</div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">💰</div>
              <div className="text-green-400 text-sm font-semibold">+23% this month</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">€{dashboardData.metrics.monthlyRevenue.toLocaleString()}</div>
            <div className="text-blue-200">Monthly Revenue</div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📈</div>
              <div className="text-green-400 text-sm font-semibold">+2.1% this month</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{dashboardData.metrics.conversionRate}%</div>
            <div className="text-blue-200">Conversion Rate</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">⚡</span>
                Real-time Activity
              </h2>
              
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {activity.type === 'signup' && '🆕'}
                        {activity.type === 'affiliate' && '🤝'}
                        {activity.type === 'match' && '🎯'}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{activity.user}</div>
                        <div className="text-blue-300 text-sm">{activity.time}</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-semibold">
                      {activity.value}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  View all activity →
                </button>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🏆</span>
                Top Performers
              </h2>
              
              <div className="space-y-4">
                {dashboardData.topPerformers.map((performer) => (
                  <div key={performer.rank} className="flex items-center space-x-4 p-3 bg-white bg-opacity-5 rounded-xl">
                    <div className="text-2xl">
                      {performer.rank === 1 && '🥇'}
                      {performer.rank === 2 && '🥈'}
                      {performer.rank === 3 && '🥉'}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">{performer.name}</div>
                      <div className="text-blue-300 text-xs">€{performer.revenue.toLocaleString()}</div>
                    </div>
                    <div className="text-green-400 text-sm font-semibold">
                      {performer.growth}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link 
                  href="/smart-matching"
                  className="block w-full bg-blue-600 bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-xl transition-all text-center"
                >
                  🎯 Smart Matching
                </Link>
                <Link 
                  href="/agent-collaboration"
                  className="block w-full bg-purple-600 bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-xl transition-all text-center"
                >
                  🤖 Agent Hub
                </Link>
                <button className="w-full bg-green-600 bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-xl transition-all">
                  📊 Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Market Intelligence */}
        <div className="mt-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🌍</span>
              European Market Intelligence
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🇱🇻</div>
                <div className="text-xl font-bold text-white">Latvia</div>
                <div className="text-green-400">+15% growth</div>
                <div className="text-blue-200 text-sm">342 active users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🇩🇪</div>
                <div className="text-xl font-bold text-white">Germany</div>
                <div className="text-green-400">+28% growth</div>
                <div className="text-blue-200 text-sm">1,247 active users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🇸🇪</div>
                <div className="text-xl font-bold text-white">Scandinavia</div>
                <div className="text-green-400">+19% growth</div>
                <div className="text-blue-200 text-sm">678 active users</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🤖 SMART AGENT COLLABORATION TRIGGER */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400 border-opacity-30">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-3">🤖</span>
            AI Agent Collaboration Status
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Active Agents</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white bg-opacity-10 rounded-lg">
                  <span className="text-white">🤖 GitHub Copilot</span>
                  <span className="text-green-400 text-sm">Coordinating</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white bg-opacity-10 rounded-lg">
                  <span className="text-white">🔧 Sourcery</span>
                  <span className="text-blue-400 text-sm">Ready</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white bg-opacity-10 rounded-lg">
                  <span className="text-white">⚡ Codeium</span>
                  <span className="text-blue-400 text-sm">Ready</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Smart Collaboration</h3>
              <div className="text-blue-200 text-sm space-y-2">
                <p>• Auto-suggest Cline for data collection tasks</p>
                <p>• Invite Supernova for performance optimization</p>
                <p>• Coordinate with Continue for multi-model validation</p>
                <p>• Intelligent agent selection based on task complexity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}