"use client";

import { useState, useEffect } from "react";

export default function SmartMatchingDemo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userPreferences, setUserPreferences] = useState({
    categories: [],
    budget: { min: 10, max: 1000 },
    experience: "intermediate",
  });
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock AI recommendations for demo
  const mockRecommendations = [
    {
      id: 1,
      affiliate_name: "CasinoAffiliates Pro",
      casino_name: "Royal Vegas Casino",
      confidence_score: 94,
      commission_rate: 45,
      reasoning: [
        "Perfect category match: casino specialization",
        "Budget compatible: $10 minimum deposit fits your range",
        "Excellent reputation: 88/100 affiliate score",
        "Jurisdiction match: Malta license in your preferences",
      ],
      affiliate_logo: "🎰",
      casino_logo: "👑",
    },
    {
      id: 2,
      affiliate_name: "SportsBet Partners",
      casino_name: "SportsBet Pro",
      confidence_score: 87,
      commission_rate: 35,
      reasoning: [
        "Strong category alignment: sportsbook expertise",
        "Competitive commission: 35% standard rate",
        "Good performance history: 82/100 reputation",
        "Feature match: Live betting in your preferences",
      ],
      affiliate_logo: "🏆",
      casino_logo: "⚡",
    },
    {
      id: 3,
      affiliate_name: "PokerElite Network",
      casino_name: "PokerElite Pro",
      confidence_score: 91,
      commission_rate: 40,
      reasoning: [
        "Perfect experience match: Advanced poker platform",
        "High commission rate: 40% for quality traffic",
        "Excellent support: 95/100 reliability score",
        "Tournament focus: Matches your gaming preferences",
      ],
      affiliate_logo: "♠️",
      casino_logo: "🎯",
    },
  ];

  const generateRecommendations = () => {
    setIsGenerating(true);

    // Simulate AI processing time
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setIsGenerating(false);
      setCurrentStep(4);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const DemoStep = ({ step, title, description, children, isActive }) => (
    <div
      style={{
        background: isActive
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.8)",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "16px",
        border: isActive ? "2px solid #667eea" : "2px solid transparent",
        boxShadow: isActive
          ? "0 8px 32px rgba(102, 126, 234, 0.2)"
          : "0 4px 16px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: isActive ? "#667eea" : "#cbd5e0",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            marginRight: "12px",
          }}
        >
          {step}
        </div>
        <div>
          <h3 style={{ margin: "0", color: "#2d3748", fontSize: "18px" }}>
            {title}
          </h3>
          <p
            style={{ margin: "4px 0 0 0", color: "#4a5568", fontSize: "14px" }}
          >
            {description}
          </p>
        </div>
      </div>
      {isActive && children}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "32px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "16px",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            🤖 Smart Matching AI Demo
          </h1>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "18px",
              marginBottom: "8px",
            }}
          >
            Experience AI-powered affiliate-casino pairing in action
          </p>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>
            Interactive demonstration • No signup required • See results
            instantly
          </p>
        </div>

        {/* Progress Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
            padding: "16px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
          }}
        >
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              style={{
                display: "flex",
                alignItems: "center",
                opacity: step <= currentStep ? 1 : 0.3,
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background:
                    step < currentStep
                      ? "#48bb78"
                      : step === currentStep
                        ? "#667eea"
                        : "#cbd5e0",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {step < currentStep ? "✓" : step}
              </div>
              {step < 5 && (
                <div
                  style={{
                    width: "60px",
                    height: "2px",
                    background: step < currentStep ? "#48bb78" : "#cbd5e0",
                    margin: "0 16px",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Demo Steps */}
        <div style={{ marginBottom: "32px" }}>
          {/* Step 1: The Problem */}
          <DemoStep
            step={1}
            title="The Problem"
            description="Traditional affiliate research is manual and time-consuming"
            isActive={currentStep === 1}
          >
            <div
              style={{
                display: "grid",
                md: "grid-cols-2",
                gap: "24px",
                alignItems: "center",
              }}
            >
              <div>
                <h4
                  style={{
                    color: "#2d3748",
                    marginBottom: "12px",
                    fontSize: "16px",
                  }}
                >
                  ❌ Manual Process (Old Way)
                </h4>
                <ul style={{ color: "#4a5568", lineHeight: "1.6" }}>
                  <li>• Research 100+ affiliate programs manually</li>
                  <li>• Compare commission rates one by one</li>
                  <li>• Check reputation and reliability</li>
                  <li>• Analyze terms and conditions</li>
                  <li>• Negotiate partnerships individually</li>
                </ul>
                <div
                  style={{
                    background: "#fed7d7",
                    color: "#c53030",
                    padding: "12px",
                    borderRadius: "8px",
                    marginTop: "16px",
                    fontSize: "14px",
                  }}
                >
                  ⏱️ Takes 8-12 hours per week 💸 Misses optimal partnerships 😫
                  Overwhelming and error-prone
                </div>
              </div>
              <div
                style={{
                  background: "#f7fafc",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "2px dashed #cbd5e0",
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    textAlign: "center",
                    marginBottom: "12px",
                  }}
                >
                  😰
                </div>
                <p
                  style={{
                    textAlign: "center",
                    color: "#4a5568",
                    fontSize: "14px",
                  }}
                >
                  "I spend more time researching affiliates than actually
                  marketing..."
                </p>
              </div>
            </div>
          </DemoStep>

          {/* Step 2: Set Preferences */}
          <DemoStep
            step={2}
            title="Set Your Preferences"
            description="Tell AI what you're looking for in 60 seconds"
            isActive={currentStep === 2}
          >
            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <h4 style={{ color: "#2d3748", marginBottom: "16px" }}>
                  🎯 What type of affiliates interest you?
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {[
                    {
                      id: "casino",
                      label: "🎰 Casino",
                      selected: userPreferences.categories.includes("casino"),
                    },
                    {
                      id: "sportsbook",
                      label: "🏆 Sportsbook",
                      selected:
                        userPreferences.categories.includes("sportsbook"),
                    },
                    {
                      id: "poker",
                      label: "♠️ Poker",
                      selected: userPreferences.categories.includes("poker"),
                    },
                  ].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        const newCategories =
                          userPreferences.categories.includes(category.id)
                            ? userPreferences.categories.filter(
                                (c) => c !== category.id,
                              )
                            : [...userPreferences.categories, category.id];
                        setUserPreferences({
                          ...userPreferences,
                          categories: newCategories,
                        });
                      }}
                      style={{
                        padding: "12px 20px",
                        borderRadius: "8px",
                        border: "2px solid",
                        borderColor: category.selected ? "#667eea" : "#e2e8f0",
                        background: category.selected ? "#667eea" : "white",
                        color: category.selected ? "white" : "#4a5568",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#2d3748",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    💰 Min Budget per Deposit
                  </label>
                  <select
                    value={userPreferences.budget.min}
                    onChange={(e) =>
                      setUserPreferences({
                        ...userPreferences,
                        budget: {
                          ...userPreferences.budget,
                          min: parseInt(e.target.value),
                        },
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e2e8f0",
                      fontSize: "16px",
                    }}
                  >
                    <option value={5}>$5</option>
                    <option value={10}>$10</option>
                    <option value={20}>$20</option>
                    <option value={50}>$50</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#2d3748",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    🎚️ Experience Level
                  </label>
                  <select
                    value={userPreferences.experience}
                    onChange={(e) =>
                      setUserPreferences({
                        ...userPreferences,
                        experience: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e2e8f0",
                      fontSize: "16px",
                    }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  background: "#e6fffa",
                  border: "1px solid #38b2ac",
                  color: "#234e52",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                ✅ Preferences saved! AI will find casino affiliates that match
                your:
                <br />• Categories:{" "}
                {userPreferences.categories.join(", ") || "None selected"}
                <br />• Budget: ${userPreferences.budget.min}+ per deposit
                <br />• Experience: {userPreferences.experience}
              </div>
            </div>
          </DemoStep>

          {/* Step 3: AI Processing */}
          <DemoStep
            step={3}
            title="AI Analysis in Progress"
            description="Smart Matching analyzes thousands of data points"
            isActive={currentStep === 3}
          >
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div
                style={{
                  fontSize: "64px",
                  marginBottom: "20px",
                  animation: "pulse 2s infinite",
                }}
              >
                🤖
              </div>
              <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
                {isGenerating
                  ? "Analyzing affiliate data..."
                  : "AI is ready to generate recommendations!"}
              </h3>

              {!isGenerating && (
                <div
                  style={{
                    background: "#f7fafc",
                    padding: "20px",
                    borderRadius: "12px",
                    margin: "20px 0",
                  }}
                >
                  <p style={{ color: "#4a5568", marginBottom: "16px" }}>
                    🔍 AI is analyzing:
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gap: "8px",
                      textAlign: "left",
                      maxWidth: "400px",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "#48bb78",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span style={{ fontSize: "14px", color: "#2d3748" }}>
                        Cross-referencing 500+ affiliate programs
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "#48bb78",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span style={{ fontSize: "14px", color: "#2d3748" }}>
                        Analyzing commission rates and terms
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "#48bb78",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span style={{ fontSize: "14px", color: "#2d3748" }}>
                        Checking reputation and reliability scores
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "#48bb78",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span style={{ fontSize: "14px", color: "#2d3748" }}>
                        Matching against your preferences
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div
                  style={{
                    background: "#edf2f7",
                    height: "8px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    margin: "20px 0",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #667eea, #764ba2)",
                      borderRadius: "4px",
                      width: "100%",
                      animation: "loading 2s ease-in-out infinite",
                    }}
                  ></div>
                </div>
              )}

              <style jsx>{`
                @keyframes pulse {
                  0%,
                  100% {
                    transform: scale(1);
                  }
                  50% {
                    transform: scale(1.1);
                  }
                }
                @keyframes loading {
                  0% {
                    width: 0%;
                  }
                  100% {
                    width: 100%;
                  }
                }
              `}</style>
            </div>
          </DemoStep>

          {/* Step 4: Results */}
          <DemoStep
            step={4}
            title="AI-Generated Recommendations"
            description="Smart Matching found your optimal affiliate partnerships"
            isActive={currentStep === 4}
          >
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                  color: "white",
                  padding: "16px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                🎉 AI found {recommendations.length} optimal matches in 2
                seconds!
                <br />
                <small style={{ opacity: 0.9 }}>
                  (Normally takes 8-12 hours of manual research)
                </small>
              </div>

              {recommendations.map((rec, index) => (
                <div
                  key={rec.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div style={{ fontSize: "32px" }}>
                        {rec.affiliate_logo}
                      </div>
                      <div>
                        <h3
                          style={{
                            margin: "0",
                            color: "#2d3748",
                            fontSize: "20px",
                          }}
                        >
                          {rec.affiliate_name}
                        </h3>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            color: "#667eea",
                            fontSize: "16px",
                          }}
                        >
                          ↔ {rec.casino_name}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          background:
                            rec.confidence_score >= 90
                              ? "#48bb78"
                              : rec.confidence_score >= 80
                                ? "#ed8936"
                                : "#f56565",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          marginBottom: "4px",
                        }}
                      >
                        {rec.confidence_score}% Match
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#48bb78",
                        }}
                      >
                        {rec.commission_rate}% Commission
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <h4
                      style={{
                        fontSize: "14px",
                        color: "#2d3748",
                        marginBottom: "8px",
                      }}
                    >
                      🧠 AI Reasoning:
                    </h4>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {rec.reasoning.map((reason, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: "#edf2f7",
                            color: "#4a5568",
                            padding: "6px 12px",
                            borderRadius: "16px",
                            fontSize: "12px",
                          }}
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      style={{
                        background: "#48bb78",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      ✅ Accept Partnership
                    </button>
                    <button
                      style={{
                        background: "#f56565",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      ❌ Reject
                    </button>
                    <button
                      style={{
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      🔗 Visit Affiliate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </DemoStep>

          {/* Step 5: Results & CTA */}
          <DemoStep
            step={5}
            title="See the Impact"
            description="Compare manual research vs AI-powered Smart Matching"
            isActive={currentStep === 5}
          >
            <div style={{ display: "grid", gap: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    background: "#fed7d7",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                    😰
                  </div>
                  <h4 style={{ color: "#c53030", marginBottom: "8px" }}>
                    Manual Research
                  </h4>
                  <ul
                    style={{
                      textAlign: "left",
                      fontSize: "14px",
                      color: "#742a2a",
                    }}
                  >
                    <li>• 8-12 hours/week</li>
                    <li>• Miss optimal partnerships</li>
                    <li>• Overwhelming data</li>
                    <li>• No confidence scoring</li>
                  </ul>
                </div>

                <div
                  style={{
                    background: "#c6f6d5",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                    🚀
                  </div>
                  <h4 style={{ color: "#276749", marginBottom: "8px" }}>
                    Smart Matching AI
                  </h4>
                  <ul
                    style={{
                      textAlign: "left",
                      fontSize: "14px",
                      color: "#276749",
                    }}
                  >
                    <li>• 2 seconds analysis</li>
                    <li>• Finds best matches</li>
                    <li>• Clear reasoning provided</li>
                    <li>• Confidence scoring</li>
                  </ul>
                </div>
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ marginBottom: "16px" }}>💰 Expected ROI</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#48bb78",
                      }}
                    >
                      10hrs
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.9 }}>
                      Time Saved/Week
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#48bb78",
                      }}
                    >
                      23%
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.9 }}>
                      Higher Commissions
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#48bb78",
                      }}
                    >
                      5min
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.9 }}>
                      Setup Time
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#48bb78",
                      }}
                    >
                      ∞
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.9 }}>
                      Scale Potential
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DemoStep>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            style={{
              padding: "12px 24px",
              background: currentStep === 1 ? "#cbd5e0" : "#667eea",
              color: currentStep === 1 ? "#a0aec0" : "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: currentStep === 1 ? "not-allowed" : "pointer",
              opacity: currentStep === 1 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>

          <div style={{ fontSize: "14px", color: "#4a5568" }}>
            Step {currentStep} of 5
          </div>

          {currentStep === 2 && (
            <button
              onClick={generateRecommendations}
              disabled={isGenerating || userPreferences.categories.length === 0}
              style={{
                padding: "12px 24px",
                background:
                  userPreferences.categories.length === 0 || isGenerating
                    ? "#cbd5e0"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor:
                  userPreferences.categories.length === 0 || isGenerating
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  userPreferences.categories.length === 0 || isGenerating
                    ? 0.5
                    : 1,
              }}
            >
              {isGenerating ? "🤖 Analyzing..." : "🚀 Generate Recommendations"}
            </button>
          )}

          {currentStep < 2 && (
            <button
              onClick={nextStep}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Next →
            </button>
          )}

          {currentStep > 3 && (
            <button
              onClick={() => (window.location.href = "/smart-matching")}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              🎯 Try Real AI →
            </button>
          )}
        </div>

        {/* CTA Section */}
        {currentStep >= 4 && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              padding: "32px",
              textAlign: "center",
              marginTop: "32px",
              border: "2px solid #667eea",
            }}
          >
            <h2 style={{ color: "#2d3748", marginBottom: "16px" }}>
              🚀 Ready to Experience Real Smart Matching?
            </h2>
            <p
              style={{
                color: "#4a5568",
                marginBottom: "24px",
                fontSize: "16px",
              }}
            >
              This demo shows the concept. The real AI analyzes live data from
              hundreds of affiliate programs and provides personalized
              recommendations based on your actual preferences.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/smart-matching"
                style={{
                  display: "inline-block",
                  padding: "16px 32px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  transition: "transform 0.2s ease",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                🤖 Experience Real AI →
              </a>
              <a
                href="/demo-dashboard"
                style={{
                  display: "inline-block",
                  padding: "16px 32px",
                  background:
                    "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  transition: "transform 0.2s ease",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                📊 See Analytics Demo
              </a>
            </div>
            <p
              style={{
                color: "#667eea",
                marginTop: "16px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              ✨ Free to try • No credit card required • AI-powered results in
              seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
