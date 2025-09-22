'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage('🎉 Success! You\'re on the early access list!');
        setFormData({ email: '', name: '', role: '' });
      } else {
        setSubmitMessage(`❌ ${result.error || 'Failed to submit'}`);
      }
    } catch (error) {
      setSubmitMessage('❌ Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      {/* Header */}
      <header className="fixed w-full z-50 bg-slate-50/95 backdrop-blur-sm border-b border-slate-300 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">
            FlowLync
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#problem" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">The Problem</a>
            <a href="#solution" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">The Solution</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">How It Works</a>
            <a href="#join" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">Join Us</a>
            {user ? (
              <Link href="/api/auth/logout" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">Logout</Link>
            ) : (
              <Link href="/api/auth/login" className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105">Login</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Unifying Affiliates, Casinos, and Launchpads in a <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Trust-First Ecosystem</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            FlowLync is the trust protocol for performance marketing—where affiliates get paid instantly, casinos and launchpads access real, high-quality traffic, and everyone benefits from transparent, crypto-powered relationships.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="#join" className="bg-gradient-to-r from-gray-800 via-gray-900 to-blue-900 bg-size-200 animate-gradient-x hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 hover:shadow-xl duration-300">
              Get Early Access & Join the Inner Circle
            </a>
            <a href="#solution" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Why I Built FlowLync */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Why I Built FlowLync</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            As a former affiliate, I saw firsthand how slow payments, fake traffic, and lack of trust held everyone back. FlowLync is my answer—a platform built on transparency, speed, and real relationships. This is more than a product; it&apos;s a movement to restore trust and unlock growth for everyone in the ecosystem.
          </p>
        </div>
      </section>

      {/* How We Ensure Trust */}
      <section className="py-20 px-6 bg-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">How We Ensure Trust</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Every member of FlowLync is carefully vetted. Affiliates must prove real, engaged audiences. Casinos and launchpads are screened for reputation and compliance. Our process combines manual review, data analysis, and ongoing monitoring to keep the network clean and high-quality.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">The Broken System</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Current affiliate marketing is plagued with inefficiencies, fraud, and mistrust that hurts everyone involved.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Fake Traffic</h3>
              <p className="text-gray-600">
                Advertisers waste budgets on incentivized or bot traffic that never converts, while legitimate affiliates struggle to compete.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Slow Payments</h3>
              <p className="text-gray-600">
                Affiliates wait weeks or months for payments, slowing their growth and preventing them from scaling successful campaigns.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Lack of Trust</h3>
              <p className="text-gray-600">
                Both sides operate with skepticism—affiliates worry about shaving, advertisers worry about fake referrals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-6 bg-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">The FlowLync Solution</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            We&apos;re creating a trust-based ecosystem powered by blockchain technology and transparent relationships.
          </p>
          
          {/* Ecosystem Diagram */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-center shadow-lg">
              <div>
                <div className="font-bold text-white">Affiliates</div>
              </div>
            </div>
            
            <div className="text-2xl text-blue-600 rotate-90 md:rotate-0">⟷</div>
            
            <div className="w-40 h-40 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-center shadow-lg">
              <div>
                <div className="font-bold text-lg text-white">FlowLync</div>
              </div>
            </div>
            
            <div className="text-2xl text-blue-600 rotate-90 md:rotate-0">⟷</div>
            
            <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-center shadow-lg">
              <div>
                <div className="font-bold text-white">Casinos</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant Crypto Payments</h3>
              <p className="text-gray-600">
                Affiliates receive payments in near real-time, enabling them to reinvest and scale immediately.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Vetted Partnerships</h3>
              <p className="text-gray-600">
                Rigorous verification of all participants ensures quality and eliminates fraud on both sides.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Performance Analytics</h3>
              <p className="text-gray-600">
                Transparent tracking and reporting built on blockchain technology for undeniable proof of performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">How FlowLync Works</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Our process is designed for simplicity, transparency, and mutual benefit.
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                1
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Apply & Get Vetted</h3>
              <p className="text-gray-600">
                Both affiliates and advertisers apply to join our ecosystem and undergo verification.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                2
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Form Partnerships</h3>
              <p className="text-gray-600">
                Connect with high-quality partners through our curated matching system.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                3
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Track Performance</h3>
              <p className="text-gray-600">
                Use our transparent dashboard to monitor campaigns in real-time.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                4
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Get Paid Instantly</h3>
              <p className="text-gray-600">
                Receive crypto payments immediately as your traffic converts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Is FlowLync only for gambling?</h3>
              <p className="text-gray-600">
                No. While we start with iGaming and crypto launchpads, our trust protocol can serve any industry that relies on performance marketing and real results.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="text-xl font-bold mb-4 text-gray-900">How are payments handled?</h3>
              <p className="text-gray-600">
                We use crypto for instant, transparent payouts. Smart contracts and on-chain tracking ensure everyone gets paid fairly and fast.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="text-xl font-bold mb-4 text-gray-900">What does &quot;vetted&quot; mean?</h3>
              <p className="text-gray-600">
                We manually review and verify every affiliate, casino, and launchpad before they join. Ongoing monitoring keeps the network clean.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="text-xl font-bold mb-4 text-gray-900">How do I join First Access?</h3>
              <p className="text-gray-600">
                Just enter your email and name below. We&apos;ll reach out to select early members for feedback and collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-20 px-6 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-50 p-12 rounded-3xl shadow-xl border border-gray-300">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Join the FlowLync Revolution</h2>
            <p className="text-xl text-gray-600 mb-8">
              Be among the first to experience trust-based performance marketing
            </p>
            
            {user ? (
              <div className="space-y-4">
                <div className="text-green-600 text-lg font-medium">
                  ✅ Welcome, {user.name || user.email}! You&apos;re already logged in.
                </div>
                <Link href="/dashboard" className="inline-block bg-gray-900 hover:bg-gray-800 px-8 py-4 rounded-full font-semibold transition-all text-white shadow-lg hover:shadow-xl hover:scale-105 duration-300">
                  Access Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email" 
                    className="w-full px-6 py-4 rounded-full bg-gray-50 border border-gray-300 focus:border-gray-500 focus:outline-none text-gray-900"
                    required 
                    disabled={isSubmitting}
                  />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name" 
                    className="w-full px-6 py-4 rounded-full bg-gray-50 border border-gray-300 focus:border-gray-500 focus:outline-none text-gray-900"
                    required 
                    disabled={isSubmitting}
                  />
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-full bg-gray-50 border border-gray-300 focus:border-gray-500 focus:outline-none text-gray-900" 
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Your Role</option>
                    <option value="affiliate">Affiliate/Marketer</option>
                    <option value="casino">Casino Operator</option>
                    <option value="launchpad">Crypto Launchpad</option>
                    <option value="other">Other</option>
                  </select>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-gray-800 via-gray-900 to-blue-900 bg-size-200 animate-gradient-x hover:bg-gray-800 px-8 py-4 rounded-full font-semibold transition-all text-white shadow-lg hover:shadow-xl hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Early Access'}
                  </button>
                  
                  {submitMessage && (
                    <div className="text-center p-3 rounded-lg bg-gray-100 text-gray-900 font-medium">
                      {submitMessage}
                    </div>
                  )}
                </form>
                
                <div className="text-gray-600">
                  Or <Link href="/api/auth/login" className="text-gray-900 hover:text-gray-700 underline">sign in</Link> if you already have an account
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 py-12 px-6 border-t border-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">
            FlowLync
          </div>
          <p className="text-gray-600 mb-6">Building the future of performance marketing through trust and transparency</p>
          <p className="text-gray-500">&copy; 2025 FlowLync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}