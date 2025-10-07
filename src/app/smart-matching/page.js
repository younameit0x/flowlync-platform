"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function SmartMatching() {
  const { user, error: userError, isLoading: userLoading } = useUser();
  const [activeStep, setActiveStep] = useState("welcome");
  const [userAnswers, setUserAnswers] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // For development purposes - remove in production
  const isDev = process.env.NODE_ENV === "development";
  const effectiveUser =
    user || (isDev ? { sub: "dev-user-123", name: "Development User" } : null);

  // Real affiliate data state
  const [realAffiliates, setRealAffiliates] = useState([]);
  const [loadingAffiliates, setLoadingAffiliates] = useState(false);

  const fetchUserPreferences = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/smart-matching/user-preferences?user_id=${effectiveUser.sub}`,
      );
      const data = await response.json();

      if (response.ok && data.preferences) {
        setUserAnswers(data.preferences);
        setActiveStep("results");
        fetchRealAffiliates();
      } else {
        setActiveStep("questionnaire");
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      setActiveStep("questionnaire");
    }
  }, [effectiveUser]);

  // Fetch user preferences when user is available
  useEffect(() => {
    if (effectiveUser) {
      fetchUserPreferences();
    } else if (!userLoading && !isDev) {
      setActiveStep("welcome");
    }
  }, [effectiveUser, userLoading, isDev, fetchUserPreferences]);

  // Fetch real affiliate data from our API
  const fetchRealAffiliates = async () => {
    setLoadingAffiliates(true);
    try {
      const params = new URLSearchParams();
      
      // Add filters based on user answers
      if (userAnswers.verticals?.length && !userAnswers.verticals.includes('All Verticals')) {
        params.append('vertical', userAnswers.verticals[0]); // Use first selected vertical
      }
      
      if (userAnswers.regions?.length && !userAnswers.regions.includes('Worldwide')) {
        params.append('region', userAnswers.regions[0]); // Use first selected region
      }

      if (userAnswers.experience === 'beginner') {
        params.append('beginner_friendly', 'true');
      }

      const response = await fetch(`/api/smart-matching/affiliates?${params}`);
      const data = await response.json();

      if (data.affiliates) {
        // Transform API data to match our UI format
        const transformedAffiliates = data.affiliates.map(affiliate => ({
          id: affiliate.id,
          category: affiliate.specialization || affiliate.vertical || 'Casino',
          name: affiliate.name,
          commission: affiliate.commission_structure?.revenue_share || `Up to ${affiliate.commission_rate}%`,
          minPayout: `$${affiliate.minimum_payout || 100}`,
          regions: [affiliate.region || 'Global'],
          verticals: [affiliate.specialization || affiliate.vertical || 'Casino'],
          difficulty: affiliate.beginner_friendly ? 'Beginner' : 'Intermediate',
          rating: affiliate.rating || 4.5,
          features: affiliate.promotional_materials ? [
            "Marketing materials provided",
            "24/7 support",
            "Advanced tracking",
            "No setup fees"
          ] : ["Basic tracking", "Email support"],
          websiteTools: affiliate.website_tools || [],
          description: affiliate.description || `Professional ${affiliate.specialization || 'gambling'} affiliate program.`,
          paymentMethods: affiliate.currencies ? 
            affiliate.currencies.map(curr => curr === 'USD' ? 'Bank Transfer' : curr) : 
            ["Bank Transfer", "PayPal"],
          languages: affiliate.languages || ["English"],
          established: affiliate.established?.toString() || "2020",
          trustScore: affiliate.trust_score || affiliate.reputation_score || 85,
          website: affiliate.website,
          affiliateUrl: affiliate.affiliate_url,
          contactEmail: affiliate.contact_email
        }));

        setRealAffiliates(transformedAffiliates);
      }
    } catch (error) {
      console.error('Error fetching real affiliates:', error);
      // Fallback to mock data on error
    } finally {
      setLoadingAffiliates(false);
    }
  };

  // Fetch real affiliate data when showing results
  useEffect(() => {
    if (activeStep === 'results') {
      fetchRealAffiliates();
    }
  }, [activeStep, userAnswers]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/smart-matching/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userAnswers),
      });
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to load recommendations");
    }
  };

  const saveUserPreferences = async (answers) => {
    if (!effectiveUser) return;

    try {
      await fetch("/api/smart-matching/user-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: effectiveUser.sub,
          preferences: answers,
        }),
      });
    } catch (err) {
      console.error("Error saving preferences:", err);
    }
  };

  const handleQuestionnaireComplete = async (answers) => {
    setUserAnswers(answers);
    setLoading(true);
    
    try {
      await saveUserPreferences(answers);
      await fetchRecommendations();
      setActiveStep("results");
    } catch (err) {
      setError("Failed to process your answers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setActiveStep("questionnaire");
    setUserAnswers({});
    setRecommendations([]);
    setRealAffiliates([]);
    setError(null);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Authentication error. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        {activeStep === "welcome" && <WelcomeStep onStart={() => setActiveStep("questionnaire")} />}
        {activeStep === "questionnaire" && (
          <QuestionnaireStep onComplete={handleQuestionnaireComplete} loading={loading} />
        )}
        {activeStep === "results" && (
          <ResultsStep
            answers={userAnswers}
            recommendations={recommendations}
            realAffiliates={realAffiliates}
            loadingAffiliates={loadingAffiliates}
            error={error}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

// Welcome Step Component
function WelcomeStep({ onStart }) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="text-6xl mb-6">🌍</div>
      <h1 className="text-5xl font-bold text-white mb-6">
        FlowLync Global Affiliate Matching
      </h1>
      <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
        Complete affiliate platform for bloggers worldwide - Find the perfect gambling affiliate programs for your audience
      </p>
      
      {/* Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">🎰</div>
          <h3 className="text-lg font-semibold text-white mb-2">Casinos</h3>
          <p className="text-blue-100 text-sm">Global casino affiliate programs</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">⚽</div>
          <h3 className="text-lg font-semibold text-white mb-2">Sportsbooks</h3>
          <p className="text-blue-100 text-sm">Sports betting partnerships</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">🃏</div>
          <h3 className="text-lg font-semibold text-white mb-2">Poker & More</h3>
          <p className="text-blue-100 text-sm">Poker, lottery, fantasy sports</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">🛠️</div>
          <h3 className="text-lg font-semibold text-white mb-2">Website Tools</h3>
          <p className="text-blue-100 text-sm">Complete blogger toolkit</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-4 rounded-2xl text-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
      >
        🚀 Start Smart Matching
      </button>
    </div>
  );
}

// Questionnaire Step Component
function QuestionnaireStep({ onComplete, loading }) {
  const [answers, setAnswers] = useState({
    experience: '',
    regions: [],
    verticals: [],
    websiteNeeds: []
  });

  const handleSubmit = () => {
    if (!answers.experience) {
      alert('Please select your experience level');
      return;
    }
    onComplete(answers);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-4xl font-bold text-white mb-4">
          Global Affiliate Questionnaire
        </h2>
        <p className="text-xl text-blue-100">
          Help us find the perfect affiliate programs for your global audience
        </p>
      </div>

      <div className="space-y-8">
        {/* Experience Level */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            What's your affiliate marketing experience?
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {['beginner', 'intermediate', 'expert'].map((level) => (
              <button
                key={level}
                onClick={() => setAnswers({ ...answers, experience: level })}
                className={`p-4 rounded-xl border transition-all ${
                  answers.experience === level
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-white/5 border-white/20 text-blue-100 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold capitalize">{level}</div>
                <div className="text-sm mt-1">
                  {level === 'beginner' && 'Just getting started'}
                  {level === 'intermediate' && 'Some experience'}
                  {level === 'expert' && 'Advanced marketer'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Regions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            Which regions are you targeting? (Select all that apply)
          </h3>
          <div className="grid md:grid-cols-4 gap-3">
            {['Europe', 'USA', 'Canada', 'UK', 'Australia', 'Asia', 'Latin America', 'Worldwide'].map((region) => (
              <button
                key={region}
                onClick={() => {
                  const newRegions = answers.regions.includes(region)
                    ? answers.regions.filter(r => r !== region)
                    : [...answers.regions, region];
                  setAnswers({ ...answers, regions: newRegions });
                }}
                className={`p-3 rounded-xl border transition-all text-sm ${
                  answers.regions.includes(region)
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-white/5 border-white/20 text-blue-100 hover:bg-white/10'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Gambling Verticals */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            Which gambling verticals interest you? (Select all that apply)
          </h3>
          <div className="grid md:grid-cols-4 gap-3">
            {['Casino', 'Sportsbook', 'Poker', 'Lottery', 'Fantasy Sports', 'Esports', 'Crypto', 'All Verticals'].map((vertical) => (
              <button
                key={vertical}
                onClick={() => {
                  const newVerticals = answers.verticals.includes(vertical)
                    ? answers.verticals.filter(v => v !== vertical)
                    : [...answers.verticals, vertical];
                  setAnswers({ ...answers, verticals: newVerticals });
                }}
                className={`p-3 rounded-xl border transition-all text-sm ${
                  answers.verticals.includes(vertical)
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-blue-100 hover:bg-white/10'
                }`}
              >
                {vertical}
              </button>
            ))}
          </div>
        </div>

        {/* Website Needs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            What website/blogging tools do you need? (Select all that apply)
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {['Content Creation', 'Design', 'SEO Tools', 'Analytics', 'Social Media', 'Complete Package'].map((need) => (
              <button
                key={need}
                onClick={() => {
                  const newNeeds = answers.websiteNeeds.includes(need)
                    ? answers.websiteNeeds.filter(n => n !== need)
                    : [...answers.websiteNeeds, need];
                  setAnswers({ ...answers, websiteNeeds: newNeeds });
                }}
                className={`p-3 rounded-xl border transition-all text-sm ${
                  answers.websiteNeeds.includes(need)
                    ? 'bg-green-600 border-green-400 text-white'
                    : 'bg-white/5 border-white/20 text-blue-100 hover:bg-white/10'
                }`}
              >
                {need}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={loading || !answers.experience}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-4 rounded-2xl text-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Finding Matches...
              </>
            ) : (
              '🔍 Find My Perfect Matches'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Results Step Component
function ResultsStep({ answers, recommendations, realAffiliates, loadingAffiliates, error, onRestart }) {
  if (error) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-4">😅</div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-blue-100 mb-6">{error}</p>
        <button
          onClick={onRestart}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Use real affiliate data if available, fallback to mock data
  const getDisplayResults = () => {
    if (realAffiliates.length > 0) {
      return realAffiliates;
    }
    
    // Fallback mock data
    return [
      {
        id: 1,
        category: 'Casino',
        name: "Global Casino Partners",
        commission: "Up to 50%",
        minPayout: "$100",
        regions: answers.regions || ["Worldwide"],
        verticals: ["Casino", "Live Casino"],
        difficulty: "Beginner",
        rating: 4.8,
        features: [
          "No setup fees",
          "24/7 multilingual support",
          "Complete marketing toolkit",
          "Real-time analytics"
        ],
        websiteTools: answers.websiteNeeds?.includes('Complete Package') ? [
          "Website templates",
          "Content creation tools",
          "SEO optimization"
        ] : [],
        description: "Perfect for new bloggers! Complete affiliate solution with all tools included.",
        paymentMethods: ["Bank Transfer", "PayPal", "Crypto"],
        languages: ["English", "German", "Swedish", "Spanish"],
        established: "2018",
        trustScore: 95
      },
      {
        id: 2,
        category: 'Sportsbook',
        name: "Sports Affiliate Network",
        commission: "Up to 35%",
        minPayout: "$50",
        regions: answers.regions || ["Europe", "USA"],
        verticals: ["Sportsbook", "Live Betting"],
        difficulty: "Beginner",
        rating: 4.6,
        features: [
          "Low minimum payout",
          "Weekly payments",
          "Live betting promotions",
          "Mobile-optimized"
        ],
        websiteTools: answers.websiteNeeds?.includes('Content Creation') ? [
          "Sports content library",
          "Betting guides",
          "Live odds widgets"
        ] : [],
        description: "Leading sportsbook affiliate program with excellent conversion rates.",
        paymentMethods: ["Bank Transfer", "Skrill", "Neteller"],
        languages: ["English", "German", "French"],
        established: "2015",
        trustScore: 92
      }
    ];
  };

  const displayResults = getDisplayResults();

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Your Perfect Global Affiliate Matches!
        </h2>
        <p className="text-xl text-blue-100 mb-4">
          Based on your preferences for <strong>{answers.regions?.join(', ') || 'global markets'}</strong>
          {answers.verticals?.length ? ` in ${answers.verticals.join(', ')}` : ''}
        </p>
        <div className="bg-blue-800/30 rounded-xl p-4 max-w-2xl mx-auto">
          <p className="text-blue-100">
            {realAffiliates.length > 0 ? (
              <>🎉 <strong>Real Data:</strong> Showing {displayResults.length} live affiliate programs from @Cline's collection!</>
            ) : (
              <>🚀 <strong>Sample Data:</strong> Real affiliate database coming from @Cline soon!</>
            )}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loadingAffiliates && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-blue-100">Loading affiliate programs...</p>
        </div>
      )}

      {/* Results Display */}
      {!loadingAffiliates && (
        <div className="space-y-6 mb-8">
          {displayResults.map((result) => (
            <div key={result.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {result.category === 'Casino' ? '🎰' : 
                       result.category === 'Sportsbook' ? '⚽' : 
                       result.category === 'Poker' ? '🃏' : '🎮'}
                    </span>
                    <h3 className="text-xl font-bold text-white">{result.name}</h3>
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {result.difficulty}
                    </span>
                  </div>
                  <p className="text-blue-100 mb-3">{result.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full">
                      ⭐ {result.rating}/5.0
                    </span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full">
                      🛡️ Trust: {result.trustScore}%
                    </span>
                    <span className="text-blue-200">📅 Since {result.established}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400 mb-1">{result.commission}</div>
                  <div className="text-sm text-blue-200">Commission Rate</div>
                  <div className="text-sm text-blue-200 mt-2">Min: {result.minPayout}</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  ✨ Key Features
                </h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {result.features.map((feature, idx) => (
                    <div key={idx} className="text-blue-100 text-sm flex items-center gap-2">
                      <span className="text-green-400">•</span> {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Website Tools (if user selected website needs) */}
              {result.websiteTools && result.websiteTools.length > 0 && (
                <div className="bg-purple-600/20 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    🛠️ Included Website Tools
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {result.websiteTools.map((tool, idx) => (
                      <div key={idx} className="text-purple-100 text-sm flex items-center gap-2">
                        <span className="text-purple-400">🔧</span> {tool}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition-colors font-semibold">
                  🚀 Apply Now
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors">
                  📊 View Details
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-colors">
                  💬 Get Support
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          🚀 Ready to Start Your Affiliate Journey?
        </h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          {realAffiliates.length > 0 ? 
            "These are real affiliate programs from our comprehensive database!" :
            "Sample matches shown - @Cline is building the comprehensive global database!"
          }
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
            🎯 Get Full Access
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
            📚 Learning Center
          </button>
          <button
            onClick={onRestart}
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            🔄 Start Over
          </button>
        </div>
      </div>
    </div>
  );
}