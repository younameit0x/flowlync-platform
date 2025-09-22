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
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-8 border border-blue-500/20">
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

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <Link href="/" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg text-center transition-colors">
            ← Back to Homepage
          </Link>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
            Join Discord Community
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors">
            Submit Feedback
          </button>
        </div>
      </main>
    </div>
  );
}