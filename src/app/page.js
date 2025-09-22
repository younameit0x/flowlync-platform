'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function Home() {
  const { user, error, isLoading } = useUser();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            FlowLync
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#problem" className="hover:text-blue-400 transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-blue-400 transition-colors">The Solution</a>
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#join" className="hover:text-blue-400 transition-colors">Join Us</a>
            {user ? (
              <Link href="/api/auth/logout" className="hover:text-blue-400 transition-colors">Logout</Link>
            ) : (
              <Link href="/api/auth/login" className="hover:text-blue-400 transition-colors">Login</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Unifying Affiliates, Casinos, and Launchpads in a <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Trust-First Ecosystem</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            FlowLync is the trust protocol for performance marketing—where affiliates get paid instantly, casinos and launchpads access real, high-quality traffic, and everyone benefits from transparent, crypto-powered relationships.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="#join" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105">
              Get Early Access & Join the Inner Circle
            </a>
            <a href="#solution" className="border-2 border-blue-500 hover:bg-blue-500/10 px-8 py-4 rounded-full font-semibold transition-all">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Why I Built FlowLync */}
      <section className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Why I Built FlowLync</h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            As a former affiliate, I saw firsthand how slow payments, fake traffic, and lack of trust held everyone back. FlowLync is my answer—a platform built on transparency, speed, and real relationships. This is more than a product; it&apos;s a movement to restore trust and unlock growth for everyone in the ecosystem.
          </p>
        </div>
      </section>

      {/* How We Ensure Trust */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">How We Ensure Trust</h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Every member of FlowLync is carefully vetted. Affiliates must prove real, engaged audiences. Casinos and launchpads are screened for reputation and compliance. Our process combines manual review, data analysis, and ongoing monitoring to keep the network clean and high-quality.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">The Broken System</h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Current affiliate marketing is plagued with inefficiencies, fraud, and mistrust that hurts everyone involved.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-2xl hover:transform hover:scale-105 transition-all">
              <h3 className="text-2xl font-bold mb-4">Fake Traffic</h3>
              <p className="text-gray-300">
                Advertisers waste budgets on incentivized or bot traffic that never converts, while legitimate affiliates struggle to compete.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl hover:transform hover:scale-105 transition-all">
              <h3 className="text-2xl font-bold mb-4">Slow Payments</h3>
              <p className="text-gray-300">
                Affiliates wait weeks or months for payments, slowing their growth and preventing them from scaling successful campaigns.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl hover:transform hover:scale-105 transition-all">
              <h3 className="text-2xl font-bold mb-4">Lack of Trust</h3>
              <p className="text-gray-300">
                Both sides operate with skepticism—affiliates worry about shaving, advertisers worry about fake referrals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">The FlowLync Solution</h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            We&apos;re creating a trust-based ecosystem powered by blockchain technology and transparent relationships.
          </p>
          
          {/* Ecosystem Diagram */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-center">
              <div>
                <div className="font-bold">Affiliates</div>
              </div>
            </div>
            
            <div className="text-2xl text-blue-400 rotate-90 md:rotate-0">⟷</div>
            
            <div className="w-40 h-40 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-center">
              <div>
                <div className="font-bold text-lg">FlowLync</div>
              </div>
            </div>
            
            <div className="text-2xl text-blue-400 rotate-90 md:rotate-0">⟷</div>
            
            <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-center">
              <div>
                <div className="font-bold">Casinos</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Instant Crypto Payments</h3>
              <p className="text-gray-300">
                Affiliates receive payments in near real-time, enabling them to reinvest and scale immediately.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Vetted Partnerships</h3>
              <p className="text-gray-300">
                Rigorous verification of all participants ensures quality and eliminates fraud on both sides.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Performance Analytics</h3>
              <p className="text-gray-300">
                Transparent tracking and reporting built on blockchain technology for undeniable proof of performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">How FlowLync Works</h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Our process is designed for simplicity, transparency, and mutual benefit.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Apply & Get Vetted</h3>
              <p className="text-gray-300">
                Both affiliates and advertisers apply to join our ecosystem and undergo verification.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Form Partnerships</h3>
              <p className="text-gray-300">
                Connect with high-quality partners through our curated matching system.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Track Performance</h3>
              <p className="text-gray-300">
                Use our transparent dashboard to monitor campaigns in real-time.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                4
              </div>
              <h3 className="text-xl font-bold mb-4">Get Paid Instantly</h3>
              <p className="text-gray-300">
                Receive crypto payments immediately as your traffic converts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div className="bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">Is FlowLync only for gambling?</h3>
              <p className="text-gray-300">
                No. While we start with iGaming and crypto launchpads, our trust protocol can serve any industry that relies on performance marketing and real results.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">How are payments handled?</h3>
              <p className="text-gray-300">
                We use crypto for instant, transparent payouts. Smart contracts and on-chain tracking ensure everyone gets paid fairly and fast.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">What does &quot;vetted&quot; mean?</h3>
              <p className="text-gray-300">
                We manually review and verify every affiliate, casino, and launchpad before they join. Ongoing monitoring keeps the network clean.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4">How do I join First Access?</h3>
              <p className="text-gray-300">
                Just enter your email and name below. We&apos;ll reach out to select early members for feedback and collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-800 p-12 rounded-3xl border border-gray-700">
            <h2 className="text-4xl font-bold mb-6">Join the FlowLync Revolution</h2>
            <p className="text-xl text-gray-300 mb-8">
              Be among the first to experience trust-based performance marketing
            </p>
            
            {user ? (
              <div className="space-y-4">
                <div className="text-green-400 text-lg">
                  ✅ Welcome, {user.name || user.email}! You&apos;re already logged in.
                </div>
                <Link href="/dashboard" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full font-semibold transition-all">
                  Access Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <form className="space-y-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full px-6 py-4 rounded-full bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-6 py-4 rounded-full bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
                    required 
                  />
                  <select className="w-full px-6 py-4 rounded-full bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white" required>
                    <option value="">Select Your Role</option>
                    <option value="affiliate">Affiliate/Marketer</option>
                    <option value="casino">Casino Operator</option>
                    <option value="launchpad">Crypto Launchpad</option>
                    <option value="other">Other</option>
                  </select>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full font-semibold transition-all"
                  >
                    Get Early Access
                  </button>
                </form>
                
                <div className="text-gray-400">
                  Or <Link href="/api/auth/login" className="text-blue-400 hover:text-blue-300 underline">sign in</Link> if you already have an account
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6 border-t border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            FlowLync
          </div>
          <p className="text-gray-400 mb-6">Building the future of performance marketing through trust and transparency</p>
          <p className="text-gray-500">&copy; 2025 FlowLync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}