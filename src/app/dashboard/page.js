'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-red-400 text-xl">{error.message}</div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            FlowLync Dashboard
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user.name || user.email}</span>
            <Link href="/api/auth/logout" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to FlowLync!</h1>
          <p className="text-xl text-gray-300">
            You&apos;re part of the first access group. We&apos;re building something amazing together.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <p className="text-2xl font-bold text-green-400">First Access Member</p>
            <p className="text-gray-400 text-sm mt-2">Exclusive early access to FlowLync</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Platform Progress</h3>
            <p className="text-2xl font-bold text-blue-400">Alpha Phase</p>
            <p className="text-gray-400 text-sm mt-2">Building core features</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Community</h3>
            <p className="text-2xl font-bold text-purple-400">Founding Members</p>
            <p className="text-gray-400 text-sm mt-2">Shaping the future together</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-300 mb-2">Email</h3>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300 mb-2">Name</h3>
              <p className="text-lg">{user.name || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300 mb-2">Member Since</h3>
              <p className="text-lg">{new Date(user.updated_at).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300 mb-2">User ID</h3>
              <p className="text-sm font-mono text-gray-400">{user.sub}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-8 border border-blue-500/20 mb-8">
          <h2 className="text-2xl font-bold mb-4">What&apos;s Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
              <div>
                <h3 className="font-semibold">Join Our Community</h3>
                <p className="text-gray-300">Connect with other first access members in our exclusive Discord.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
              <div>
                <h3 className="font-semibold">Share Your Feedback</h3>
                <p className="text-gray-300">Help us build the features you need most. Your input shapes FlowLync.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
              <div>
                <h3 className="font-semibold">Early Access Features</h3>
                <p className="text-gray-300">Be the first to test new features as we build the platform.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Demo Section */}
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl p-8 border border-green-500/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <span className="mr-3">🚀</span>
                FlowLync Affiliate Tracking Demo
              </h2>
              <p className="text-gray-300">
                Experience our professional affiliate tracking system with real-time analytics
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-400 font-semibold">✅ LIVE SYSTEM</div>
              <div className="text-xs text-gray-400">Production Ready</div>
            </div>
          </div>

          {/* Demo Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">👆</div>
              <h3 className="font-semibold text-blue-400">Click Tracking</h3>
              <p className="text-sm text-gray-300">Real-time link click monitoring</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-green-400">Conversions</h3>
              <p className="text-sm text-gray-300">Track conversion events & revenue</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-purple-400">Analytics</h3>
              <p className="text-sm text-gray-300">Professional dashboard with gradients</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-orange-400">Real-time</h3>
              <p className="text-sm text-gray-300">Live updates every 5 seconds</p>
            </div>
          </div>

          {/* Demo Actions */}
          <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-center">🎯 Try the Complete Demo Flow</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Link 
                href="/demo-dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="font-semibold">📊 Professional Dashboard</div>
                <div className="text-xs opacity-90">Commercial-grade analytics</div>
              </Link>
              <Link 
                href="/demo-link"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-4 py-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="font-semibold">🔗 Generate Link</div>
                <div className="text-xs opacity-90">Create trackable affiliate links</div>
              </Link>
              <Link 
                href="/demo-convert"
                className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 px-4 py-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="font-semibold">💰 Test Conversion</div>
                <div className="text-xs opacity-90">Simulate conversion events</div>
              </Link>
              <Link 
                href="/setup-db"
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-4 py-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="font-semibold">⚙️ Setup Database</div>
                <div className="text-xs opacity-90">Initialize demo tables</div>
              </Link>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                🎨 <strong>Professional Design:</strong> Gradients, animations, and commercial-grade aesthetics matching premium SaaS platforms
              </p>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
            <div className="text-center">
              <h4 className="font-semibold text-blue-400 mb-2">💡 Why This Matters</h4>
              <p className="text-sm text-gray-300">
                This demo showcases FlowLync's affiliate tracking capabilities with a professional interface 
                that matches commercial platforms like ClickFunnels and ConvertKit. Perfect for partner presentations!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <Link 
            href="/" 
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            ← Back to Homepage
          </Link>
          <Link
            href="/demo-dashboard"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-6 py-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            🚀 Try Professional Demo
          </Link>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Join Discord Community
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Submit Feedback
          </button>
        </div>
      </main>
    </div>
  );
}