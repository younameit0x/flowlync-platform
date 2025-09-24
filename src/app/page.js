'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Force fresh deployment timestamp
const DEPLOYMENT_TIMESTAMP = Date.now();

// Interactive Yield Calculator Component
function YieldCalculator() {
  const [investment, setInvestment] = useState(50000);
  const [duration, setDuration] = useState(12);
  const [riskLevel, setRiskLevel] = useState('moderate');

  const calculateYield = () => {
    const baseRates = {
      conservative: { min: 0.08, max: 0.12 },
      moderate: { min: 0.10, max: 0.15 },
      aggressive: { min: 0.12, max: 0.18 }
    };
    
    const rates = baseRates[riskLevel];
    const minYield = investment * rates.min * (duration / 12);
    const maxYield = investment * rates.max * (duration / 12);
    const avgYield = (minYield + maxYield) / 2;
    
    return {
      minYield: Math.round(minYield),
      maxYield: Math.round(maxYield),
      avgYield: Math.round(avgYield),
      monthlyMin: Math.round(minYield / duration),
      monthlyMax: Math.round(maxYield / duration),
      monthlyAvg: Math.round(avgYield / duration)
    };
  };

  const yields = calculateYield();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8 md:p-12 rounded-3xl shadow-2xl text-white">
      <h3 className="text-3xl font-bold mb-6 text-center">Calculate Your Potential Yield</h3>
      <p className="text-gray-300 mb-8 text-lg text-center">
        Adjust the parameters below to see your projected returns from providing liquidity.
      </p>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Controls */}
        <div className="space-y-8">
          {/* Investment Amount */}
          <div>
            <label className="block text-lg font-semibold mb-4">
              Investment Amount: <span className="text-green-400">${investment.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={investment}
              onChange={(e) => setInvestment(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>$10K</span>
              <span>$1M</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-lg font-semibold mb-4">
              Duration: <span className="text-blue-400">{duration} months</span>
            </label>
            <input
              type="range"
              min="3"
              max="60"
              step="3"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>3 months</span>
              <span>5 years</span>
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-lg font-semibold mb-4">Risk Level</label>
            <div className="grid grid-cols-3 gap-2">
              {['conservative', 'moderate', 'aggressive'].map((level) => (
                <button
                  key={level}
                  onClick={() => setRiskLevel(level)}
                  className={`p-3 rounded-lg font-medium transition-all duration-300 ${
                    riskLevel === level
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {riskLevel === 'conservative' && '8-12% APY - Lower risk, steady returns'}
              {riskLevel === 'moderate' && '10-15% APY - Balanced risk/reward'}
              {riskLevel === 'aggressive' && '12-18% APY - Higher risk, maximum yield'}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h4 className="text-xl font-bold mb-4 text-center">Projected Returns</h4>
            
            {/* Total Returns */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Return Range:</span>
                <span className="font-bold text-green-400">
                  ${yields.minYield.toLocaleString()} - ${yields.maxYield.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Expected Average:</span>
                <span className="font-bold text-blue-400 text-xl">
                  ${yields.avgYield.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="border-t border-white/20 pt-4">
              <h5 className="font-semibold mb-3 text-center">Monthly Income</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Monthly Range:</span>
                  <span className="text-green-400">
                    ${yields.monthlyMin.toLocaleString()} - ${yields.monthlyMax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Monthly Average:</span>
                  <span className="text-blue-400 font-bold">
                    ${yields.monthlyAvg.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-6">
              <div className="text-sm text-gray-300 mb-2">Yield Potential</div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((yields.avgYield / investment) * 100 * 5, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {((yields.avgYield / investment) * 100).toFixed(1)}% total return over {duration} months
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Start Earning Yield
            </button>
            <p className="text-xs text-gray-400 mt-2">
              * Projections based on historical casino revenue data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header className="fixed w-full z-50 bg-transparent backdrop-blur-sm">
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

      {/* Parallax Hero Header */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Layer - Slowest movement */}
        <div
          className="absolute inset-0 parallax-bg"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            background: `
              radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
              linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)
            `
          }}
        >
          {/* Geometric Patterns */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="geometric" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="2" fill="#3b82f6" opacity="0.3"/>
                  <rect x="20" y="20" width="4" height="4" fill="#3b82f6" opacity="0.2"/>
                  <rect x="80" y="80" width="6" height="6" fill="#3b82f6" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#geometric)"/>
            </svg>
          </div>
        </div>

        {/* Middle Layer - Medium movement */}
        <div
          className="absolute inset-0 parallax-middle"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-400/5 rounded-full blur-2xl"></div>
        </div>

        {/* Content Layer - Fastest movement */}
        <div
          className="relative z-10 text-center px-6 max-w-6xl mx-auto parallax-content"
          style={{
            transform: `translateY(${scrollY * -0.2}px)`,
          }}
        >
          {/* FlowLync Branding */}
          <div className="mb-6 md:mb-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent drop-shadow-lg">
              FlowLync
            </h1>
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Hero Text */}
          <div className="animate-fade-in-up animation-delay-200">
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight text-gray-900 drop-shadow-sm px-4 md:px-0">
              Instant Affiliate Payments Powered by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Crypto Liquidity</span>
            </h2>
            <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-sm px-4 md:px-0">
              FlowLync solves the affiliate payment delay problem through DeFi innovation. <strong>Crypto liquidity providers bridge cashflow gaps</strong>, enabling instant affiliate payments while earning yield from casino revenue streams. No more 30-60 day payment delays.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <a href="#join" className="bg-gradient-to-r from-gray-800 via-gray-900 to-blue-900 bg-size-200 animate-gradient-x hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 hover:shadow-2xl duration-300 shadow-lg">
              Join the Liquidity Revolution
            </a>
            <a href="#solution" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg">
              See How DeFi Works
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Why I Built FlowLync */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Why I Built FlowLync</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            As a former affiliate, I experienced the cashflow nightmare: <strong>waiting 30-60 days for payments</strong> while casinos sat on my earnings. I realized the solution wasn&apos;t just faster payments—it was <strong>eliminating the wait entirely through DeFi liquidity</strong>. FlowLync connects crypto liquidity providers who front affiliate payments and earn yield from casino revenue streams. It&apos;s not just affiliate marketing—it&apos;s financial innovation.
          </p>
        </div>
      </section>

      {/* How DeFi Liquidity Works */}
      <section className="py-20 px-6 bg-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">How DeFi Liquidity Works</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            <strong>Crypto liquidity providers</strong> stake capital to provide instant affiliate payments. When affiliates generate conversions, casinos pay FlowLync, which automatically distributes yield back to liquidity providers. It&apos;s a win-win: affiliates get paid instantly, liquidity providers earn consistent returns from casino revenue streams.
          </p>
          <div className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Affiliates ⟷ Liquidity Providers ⟷ Casinos
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">The Cashflow Crisis</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            The affiliate industry is stuck in a <strong>30-60 day payment cycle</strong> that crushes growth and creates massive inefficiencies. The real problem isn&apos;t trust—it&apos;s cashflow.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Payment Delays</h3>
              <p className="text-gray-600">
                <strong>30-60 day payment cycles</strong> kill momentum. Affiliates can&apos;t reinvest winnings immediately, stunting campaign growth and preventing rapid scaling of successful funnels.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Cashflow Gaps</h3>
              <p className="text-gray-600">
                Casinos hold affiliate earnings for months while affiliates struggle with cash flow. There&apos;s a massive <strong>liquidity opportunity</strong> being ignored.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Missed Yield</h3>
              <p className="text-gray-600">
                Millions in casino revenue sits idle instead of generating yield for liquidity providers. It&apos;s a <strong>DeFi opportunity</strong> waiting to be unlocked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-6 bg-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">The DeFi Liquidity Solution</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            FlowLync creates a <strong>three-way DeFi ecosystem</strong> where crypto liquidity providers bridge cashflow gaps, affiliates get instant payments, and everyone earns from casino revenue streams.
          </p>
          
          {/* Three-Way Ecosystem Diagram */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
            <div className="w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-center shadow-xl">
              <div>
                <div className="font-bold text-white text-sm">AFFILIATES</div>
                <div className="text-xs text-blue-100">Get Instant Payments</div>
              </div>
            </div>
            
            <div className="text-3xl text-blue-600 rotate-90 md:rotate-0 animate-pulse">💰</div>
            
            <div className="w-48 h-48 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center text-center shadow-xl border-4 border-white">
              <div>
                <div className="font-bold text-lg text-white">LIQUIDITY</div>
                <div className="font-bold text-lg text-white">PROVIDERS</div>
                <div className="text-xs text-green-100">Earn Yield from Casino Revenue</div>
              </div>
            </div>
            
            <div className="text-3xl text-green-600 rotate-90 md:rotate-0 animate-pulse">📈</div>
            
            <div className="w-40 h-40 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-center shadow-xl">
              <div>
                <div className="font-bold text-white text-sm">CASINOS</div>
                <div className="text-xs text-green-100">Access Quality Traffic</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">⚡ Instant Liquidity</h3>
              <p className="text-gray-600">
                Crypto liquidity providers front affiliate payments immediately. No more 30-60 day waits—affiliates get paid within minutes of conversions.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">💎 Yield Generation</h3>
              <p className="text-gray-600">
                Liquidity providers earn consistent yield from casino revenue streams. It&apos;s like lending with casino earnings as collateral—steady, predictable returns.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">🚀 Accelerated Growth</h3>
              <p className="text-gray-600">
                Instant payments mean affiliates can reinvest winnings immediately, scaling successful campaigns 10x faster than traditional networks.
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

      {/* Liquidity Provider Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              💎 Earn Yield as a <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Liquidity Provider</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bridge the affiliate cashflow gap and earn consistent returns from casino revenue streams. Your capital enables instant payments while generating steady yield.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200">
              <div className="text-3xl font-bold text-green-600 mb-2">8-15%</div>
              <div className="text-gray-600">Annual Yield</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Revenue Flow</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">$10K+</div>
              <div className="text-gray-600">Min. Position</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-gray-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">Auto</div>
              <div className="text-gray-600">Compounding</div>
            </div>
          </div>

          {/* How It Works for Liquidity Providers */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Stake Liquidity</h3>
              <p className="text-gray-600">
                Provide USDC/ETH to the liquidity pool. Your capital becomes available for instant affiliate payments while earning base yield from the pool.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Enable Payments</h3>
              <p className="text-gray-600">
                Your liquidity enables instant affiliate payments. When conversions happen, affiliates get paid immediately using pool funds.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Earn Yield</h3>
              <p className="text-gray-600">
                When casinos pay FlowLync, yield flows back to liquidity providers. You earn from casino revenue streams - consistent, predictable returns.
              </p>
            </div>
          </div>

          {/* Interactive Yield Calculator */}
          <YieldCalculator />
        </div>
      </section>

      {/* Casino Partner Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Partner with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400">Premium Casinos</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Join elite casino operators who prioritize quality traffic and instant settlements. 
              Experience the future of affiliate partnerships with faster payouts and better conversion rates.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Traffic Quality */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Premium Traffic</h3>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                2.3x
              </div>
              <p className="text-white/80">
                Higher conversion rates compared to traditional affiliate networks. Quality over quantity approach.
              </p>
            </div>

            {/* Settlement Speed */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instant Settlements</h3>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                &lt;5min
              </div>
              <p className="text-white/80">
                Affiliate payments processed instantly through DeFi liquidity, eliminating 30-60 day delays.
              </p>
            </div>

            {/* Revenue Growth */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Revenue Growth</h3>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
                +47%
              </div>
              <p className="text-white/80">
                Average revenue increase for casinos using FlowLync's instant payment model.
              </p>
            </div>
          </div>

          {/* Casino Benefits */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-12 mb-12">
            <h3 className="text-3xl font-bold text-white text-center mb-12">Why Elite Casinos Choose FlowLync</h3>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Attract Top Affiliates</h4>
                    <p className="text-white/80">Premium affiliates choose casinos offering instant payments over traditional 30-day models.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Higher LTV Players</h4>
                    <p className="text-white/80">Motivated affiliates drive higher-quality traffic with better long-term player value.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Reduced Churn</h4>
                    <p className="text-white/80">Instant payment satisfaction leads to stronger, more loyal affiliate relationships.</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Risk-Free Model</h4>
                    <p className="text-white/80">FlowLync handles all liquidity risks. You pay only for delivered results.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-green-400 to-teal-500 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h4>
                    <p className="text-white/80">Real-time tracking and attribution with blockchain-level transparency.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Competitive Edge</h4>
                    <p className="text-white/80">First-mover advantage in DeFi-powered affiliate marketing innovation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Casino CTA */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Affiliate Program?</h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join forward-thinking casino operators who are revolutionizing affiliate partnerships with instant payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-300">
                Become a Casino Partner
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold px-8 py-4 rounded-full transition-all backdrop-blur-sm">
                Download Partnership Deck
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Leaders</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how FlowLync is transforming affiliate marketing across the ecosystem
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Affiliate Testimonial */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Sarah Mitchell</h4>
                  <p className="text-blue-600 font-medium">Super Affiliate</p>
                  <p className="text-gray-500 text-sm">$2.3M annual revenue</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "FlowLync changed everything for my business. Getting paid instantly instead of waiting 60 days means I can reinvest and scale campaigns immediately. My cashflow went from feast-or-famine to predictable growth."
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Monthly Volume</span>
                  <span className="font-semibold text-gray-900">$420K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Time with FlowLync</span>
                  <span className="font-semibold text-gray-900">8 months</span>
                </div>
              </div>
            </div>

            {/* Casino Testimonial */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Marcus Rodriguez</h4>
                  <p className="text-purple-600 font-medium">VP Marketing</p>
                  <p className="text-gray-500 text-sm">EliteCasino Group</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "Since partnering with FlowLync, our affiliate program attracts premium partners who know they'll get paid instantly. Player quality improved 40% and affiliate satisfaction is through the roof. This is the future of casino marketing."
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Player LTV Increase</span>
                  <span className="font-semibold text-gray-900">+43%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Affiliate Retention</span>
                  <span className="font-semibold text-gray-900">94%</span>
                </div>
              </div>
            </div>

            {/* Liquidity Provider Testimonial */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Jennifer Chen</h4>
                  <p className="text-blue-600 font-medium">DeFi Investor</p>
                  <p className="text-gray-500 text-sm">$1.2M+ in liquidity</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "FlowLync offers institutional-grade yield in an underserved market. The 12.5% APY is backed by real casino revenue, not speculative tokens. It's like being the bank for affiliate marketing - steady, profitable, and scalable."
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Current Yield</span>
                  <span className="font-semibold text-gray-900">12.5% APY</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capital Deployed</span>
                  <span className="font-semibold text-gray-900">14 months</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold text-center mb-12">FlowLync by the Numbers</h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">$47M+</div>
                <p className="text-blue-100">Total Volume Processed</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">2,340</div>
                <p className="text-blue-100">Active Affiliates</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">180+</div>
                <p className="text-blue-100">Casino Partners</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">98.7%</div>
                <p className="text-blue-100">Payment Success Rate</p>
              </div>
            </div>
          </div>

          {/* Case Study Preview */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="lg:flex">
              <div className="lg:w-1/3 bg-gradient-to-br from-gray-900 to-blue-900 p-8 lg:p-12 text-white">
                <h3 className="text-2xl font-bold mb-4">Success Story</h3>
                <h4 className="text-xl mb-6 text-blue-200">From $50K to $2M in 18 months</h4>
                <p className="text-blue-100 mb-6">
                  How GamingPro Network scaled their affiliate business using FlowLync's instant payment model.
                </p>
                <button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all backdrop-blur-sm">
                  Read Full Case Study
                </button>
              </div>
              
              <div className="lg:w-2/3 p-8 lg:p-12">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-lg font-bold text-gray-900 mb-4">Key Challenges</h5>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>60-day payment delays killing cashflow</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Top affiliates leaving for competitors</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Unable to scale marketing spend</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-lg font-bold text-gray-900 mb-4">FlowLync Results</h5>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Instant payments = 40x revenue growth</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>95% affiliate retention rate</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Scaled from 12 to 400+ affiliates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
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
              <h3 className="text-xl font-bold mb-4 text-gray-900">How do instant payments work?</h3>
              <p className="text-gray-600">
                FlowLync uses DeFi liquidity protocols to bridge the cashflow gap. When affiliates generate conversions, our liquidity providers front the payments immediately while casino settlements happen in the background. Affiliates get paid in minutes, not months.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="text-xl font-bold mb-4 text-gray-900">What do liquidity providers earn?</h3>
              <p className="text-gray-600">
                Liquidity providers earn yield from casino revenue streams. When casinos pay FlowLync for affiliate conversions, a portion flows back as returns to those who provided the upfront liquidity. It's like earning interest on casino cashflow.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Do I need to understand crypto?</h3>
              <p className="text-gray-600">
                No. While FlowLync uses blockchain technology behind the scenes, affiliates and casino partners interact through familiar USD-based interfaces. The crypto complexity is handled automatically.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="text-xl font-bold mb-4 text-gray-900">How is this different from traditional affiliate networks?</h3>
              <p className="text-gray-600">
                Traditional networks make affiliates wait 30-60 days for payments because they don't solve the cashflow problem—they just pass it along. FlowLync eliminates the wait by creating a liquidity marketplace where everyone benefits from faster capital flows.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="text-xl font-bold mb-4 text-gray-900">How do I get started?</h3>
              <p className="text-gray-600">
                Join our early access program below. We're onboarding affiliates, casino partners, and liquidity providers in phases to ensure a smooth launch of this new cashflow model.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with Role-Based Signup */}
      <section id="join" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Join the FlowLync <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Revolution</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your path in the future of DeFi-powered affiliate marketing. Each role has unique benefits and earning opportunities.
            </p>
          </div>

          {user ? (
            <div className="text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-200">
              <div className="text-green-600 text-lg font-medium mb-6">
                ✅ Welcome back, {user.name || user.email}! You're already logged in.
              </div>
              <Link href="/dashboard" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Access Your Dashboard
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Affiliate Signup */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Affiliates & Marketers</h3>
                  <p className="text-gray-600">Get paid instantly, scale faster</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Instant payments (not 30-60 days)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Premium casino partnerships</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Real-time analytics & tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Higher conversion rates</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="role" value="affiliate" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    required 
                    disabled={isSubmitting}
                  />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    required 
                    disabled={isSubmitting}
                  />
                  <select 
                    name="experience"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Experience Level</option>
                    <option value="beginner">New to affiliate marketing</option>
                    <option value="intermediate">1-3 years experience</option>
                    <option value="expert">3+ years, $100K+ annual</option>
                  </select>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Joining...' : 'Join as Affiliate'}
                  </button>
                </form>

                {submitMessage && formData.role === 'affiliate' && (
                  <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                    {submitMessage}
                  </div>
                )}
              </div>

              {/* Casino Signup */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Casino Partners</h3>
                  <p className="text-gray-600">Attract premium affiliates</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Attract top-tier affiliates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Higher LTV players (+40%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Risk-free liquidity model</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Advanced attribution tracking</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="role" value="casino" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Business Email" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-900"
                    required 
                    disabled={isSubmitting}
                  />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-900"
                    required 
                    disabled={isSubmitting}
                  />
                  <input 
                    type="text" 
                    name="company"
                    onChange={handleInputChange}
                    placeholder="Casino/Brand Name" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-900"
                    required 
                    disabled={isSubmitting}
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Become a Partner'}
                  </button>
                </form>

                {submitMessage && formData.role === 'casino' && (
                  <div className="mt-4 p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-sm">
                    {submitMessage}
                  </div>
                )}
              </div>

              {/* Liquidity Provider Signup */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Liquidity Providers</h3>
                  <p className="text-gray-600">Earn 8-15% annual yield</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">8-15% annual yield (APY)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Revenue-backed returns</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Institutional-grade security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">$10K+ minimum investment</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="role" value="liquidity-provider" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    required 
                    disabled={isSubmitting}
                  />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    required 
                    disabled={isSubmitting}
                  />
                  <select 
                    name="investment_range"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Investment Range</option>
                    <option value="10k-50k">$10K - $50K</option>
                    <option value="50k-250k">$50K - $250K</option>
                    <option value="250k-1m">$250K - $1M</option>
                    <option value="1m+">$1M+</option>
                  </select>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Provide Liquidity'}
                  </button>
                </form>

                {submitMessage && formData.role === 'liquidity-provider' && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
                    {submitMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Universal Login Link */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Link href="/api/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors">
              Sign In to Your Dashboard
            </Link>
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
