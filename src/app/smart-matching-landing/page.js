"use client";

import { useState } from "react";
import Link from "next/link";

export default function SmartMatchingLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would integrate with your email service
  };

  const FeatureCard = ({ icon, title, description, benefit }) => (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "24px",
        textAlign: "center",
        border: "1px solid rgba(102, 126, 234, 0.2)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 12px 40px rgba(102, 126, 234, 0.2)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>{icon}</div>
      <h3 style={{ color: "#2d3748", fontSize: "20px", marginBottom: "12px" }}>
        {title}
      </h3>
      <p style={{ color: "#4a5568", marginBottom: "12px" }}>{description}</p>
      <div
        style={{
          background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {benefit}
      </div>
    </div>
  );

  const TestimonialCard = ({ name, role, company, quote }) => (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid rgba(102, 126, 234, 0.1)",
      }}
    >
      <div style={{ color: "#667eea", fontSize: "24px", marginBottom: "12px" }}>
        ⭐⭐⭐⭐⭐
      </div>
      <p
        style={{ color: "#4a5568", fontStyle: "italic", marginBottom: "16px" }}
      >
        "{quote}"
      </p>
      <div>
        <div style={{ fontWeight: "bold", color: "#2d3748" }}>{name}</div>
        <div style={{ color: "#667eea", fontSize: "14px" }}>
          {role}, {company}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          padding: "16px 32px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
            🤖 FlowLync Smart Matching
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link
              href="/demo-smart-matching"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.2)")
              }
              onMouseOut={(e) => (e.target.style.background = "transparent")}
            >
              🎬 Try Demo
            </Link>
            <Link
              href="/smart-matching"
              style={{
                background: "white",
                color: "#667eea",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "bold",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              🚀 Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px" }}>
        {/* Hero Section */}
        <div style={{ textAlign: "center", padding: "80px 0 60px 0" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "24px",
              lineHeight: "1.2",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            AI-Powered Affiliate Matching
            <span style={{ color: "#48bb78" }}> Revolution</span>
          </h1>
          <p
            style={{
              fontSize: "20px",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "40px",
              maxWidth: "600px",
              margin: "0 auto 40px auto",
            }}
          >
            Stop wasting 8-12 hours/week on manual affiliate research. Our AI
            finds optimal casino-affiliate partnerships in seconds.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "40px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/demo-smart-matching"
              style={{
                display: "inline-block",
                padding: "16px 32px",
                background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "bold",
                transition: "transform 0.2s ease",
                boxShadow: "0 8px 25px rgba(72, 187, 120, 0.3)",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              🎬 See AI in Action (Free Demo)
            </Link>
            <Link
              href="/smart-matching"
              style={{
                display: "inline-block",
                padding: "16px 32px",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "bold",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.3)")
              }
              onMouseOut={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.2)")
              }
            >
              🚀 Try Smart Matching Now
            </Link>
          </div>

          {/* Trust Indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              flexWrap: "wrap",
              marginTop: "40px",
            }}
          >
            <div style={{ textAlign: "center", color: "white" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#48bb78",
                }}
              >
                2s
              </div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                AI Analysis Time
              </div>
            </div>
            <div style={{ textAlign: "center", color: "white" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#48bb78",
                }}
              >
                94%
              </div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                Avg Confidence Score
              </div>
            </div>
            <div style={{ textAlign: "center", color: "white" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#48bb78",
                }}
              >
                10hrs
              </div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                Time Saved/Week
              </div>
            </div>
            <div style={{ textAlign: "center", color: "white" }}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#48bb78",
                }}
              >
                45%
              </div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                Avg Commission Rate
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ padding: "60px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{ fontSize: "36px", color: "white", marginBottom: "16px" }}
            >
              Why Smart Matching AI?
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "rgba(255, 255, 255, 0.8)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Traditional affiliate research is broken. Our AI fixes it with
              intelligent, data-driven matching.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              marginBottom: "60px",
            }}
          >
            <FeatureCard
              icon="🎯"
              title="Intelligent Matching"
              description="AI analyzes your preferences, budget, and experience level to find perfect affiliate partnerships"
              benefit="94% Match Accuracy"
            />
            <FeatureCard
              icon="⚡"
              title="Instant Results"
              description="Get personalized recommendations in 2 seconds instead of 8-12 hours of manual research"
              benefit="99.9% Time Reduction"
            />
            <FeatureCard
              icon="💰"
              title="Optimal Commissions"
              description="AI identifies the highest-paying affiliate programs that match your traffic and audience"
              benefit="23% Higher Revenue"
            />
            <FeatureCard
              icon="📊"
              title="Performance Tracking"
              description="Monitor recommendation success and get insights to improve your affiliate strategy"
              benefit="Data-Driven Decisions"
            />
            <FeatureCard
              icon="🔄"
              title="Continuous Learning"
              description="AI improves recommendations based on your feedback and market performance data"
              benefit="Smarter Over Time"
            />
            <FeatureCard
              icon="🛡️"
              title="Trusted Partners"
              description="Only recommends verified, reputable affiliates with proven track records"
              benefit="Risk-Free Partnerships"
            />
          </div>
        </div>

        {/* How It Works */}
        <div
          style={{
            padding: "60px 0",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "24px",
            margin: "60px 0",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{ fontSize: "36px", color: "white", marginBottom: "16px" }}
            >
              How Smart Matching Works
            </h2>
            <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.8)" }}>
              Three simple steps to AI-powered affiliate success
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  margin: "0 auto 20px auto",
                }}
              >
                1️⃣
              </div>
              <h3
                style={{
                  color: "white",
                  fontSize: "24px",
                  marginBottom: "12px",
                }}
              >
                Set Preferences
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Tell AI your preferred casino categories, budget range, and
                experience level
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  margin: "0 auto 20px auto",
                }}
              >
                🤖
              </div>
              <h3
                style={{
                  color: "white",
                  fontSize: "24px",
                  marginBottom: "12px",
                }}
              >
                AI Analysis
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                AI analyzes 500+ affiliate programs against your criteria in
                seconds
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  margin: "0 auto 20px auto",
                }}
              >
                ✅
              </div>
              <h3
                style={{
                  color: "white",
                  fontSize: "24px",
                  marginBottom: "12px",
                }}
              >
                Get Matches
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Receive personalized recommendations with confidence scores and
                reasoning
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ padding: "60px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{ fontSize: "36px", color: "white", marginBottom: "16px" }}
            >
              What Our Users Say
            </h2>
            <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.8)" }}>
              Real results from affiliate marketers using Smart Matching AI
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            <TestimonialCard
              name="Sarah Johnson"
              role="Affiliate Manager"
              company="CasinoMax Partners"
              quote="Smart Matching found us a 45% commission affiliate program we never would have discovered manually. Increased our monthly revenue by $2,500."
            />
            <TestimonialCard
              name="Mike Chen"
              role="Performance Marketer"
              company="BettingPro Agency"
              quote="This AI saved me 12 hours per week on affiliate research. The recommendations are spot-on and the confidence scoring helps me prioritize the best opportunities."
            />
            <TestimonialCard
              name="Emma Rodriguez"
              role="iGaming Consultant"
              company="Self-Employed"
              quote="The AI reasoning is incredible - it explains exactly why each match is recommended. It's like having a senior affiliate manager working 24/7."
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div
          style={{
            padding: "60px 0",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "24px",
            margin: "60px 0",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{ fontSize: "36px", color: "white", marginBottom: "16px" }}
            >
              Simple, Transparent Pricing
            </h2>
            <p style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.8)" }}>
              Start free, upgrade when you're ready
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "16px",
                padding: "32px",
                textAlign: "center",
                border: "2px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  color: "#2d3748",
                  fontSize: "24px",
                  marginBottom: "16px",
                }}
              >
                Starter
              </h3>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#667eea",
                  marginBottom: "16px",
                }}
              >
                Free
              </div>
              <ul
                style={{
                  textAlign: "left",
                  color: "#4a5568",
                  marginBottom: "24px",
                }}
              >
                <li>• 5 AI recommendations/month</li>
                <li>• Basic preference settings</li>
                <li>• Email support</li>
                <li>• Standard confidence scoring</li>
              </ul>
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Get Started Free
              </button>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "16px",
                padding: "32px",
                textAlign: "center",
                border: "2px solid #667eea",
                transform: "scale(1.05)",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                  display: "inline-block",
                }}
              >
                MOST POPULAR
              </div>
              <h3
                style={{
                  color: "#2d3748",
                  fontSize: "24px",
                  marginBottom: "16px",
                }}
              >
                Professional
              </h3>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#667eea",
                  marginBottom: "16px",
                }}
              >
                $49
                <span style={{ fontSize: "18px", color: "#4a5568" }}>
                  /month
                </span>
              </div>
              <ul
                style={{
                  textAlign: "left",
                  color: "#4a5568",
                  marginBottom: "24px",
                }}
              >
                <li>• Unlimited AI recommendations</li>
                <li>• Advanced preference filters</li>
                <li>• Performance analytics</li>
                <li>• Priority support</li>
                <li>• API access</li>
              </ul>
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Start Free Trial
              </button>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "16px",
                padding: "32px",
                textAlign: "center",
                border: "2px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  color: "#2d3748",
                  fontSize: "24px",
                  marginBottom: "16px",
                }}
              >
                Enterprise
              </h3>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#667eea",
                  marginBottom: "16px",
                }}
              >
                $199
                <span style={{ fontSize: "18px", color: "#4a5568" }}>
                  /month
                </span>
              </div>
              <ul
                style={{
                  textAlign: "left",
                  color: "#4a5568",
                  marginBottom: "24px",
                }}
              >
                <li>• Everything in Professional</li>
                <li>• White-label solution</li>
                <li>• Custom AI training</li>
                <li>• Dedicated account manager</li>
                <li>• Advanced integrations</li>
              </ul>
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "24px",
            margin: "60px 0",
          }}
        >
          <h2
            style={{ fontSize: "36px", color: "white", marginBottom: "24px" }}
          >
            Ready to Revolutionize Your Affiliate Strategy?
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: "40px",
            }}
          >
            Join the future of affiliate marketing. Start with our interactive
            demo or dive right into the full AI experience.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/demo-smart-matching"
              style={{
                display: "inline-block",
                padding: "16px 32px",
                background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "bold",
                transition: "transform 0.2s ease",
                boxShadow: "0 8px 25px rgba(72, 187, 120, 0.3)",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              🎬 Try Interactive Demo (Free)
            </Link>
            <Link
              href="/smart-matching"
              style={{
                display: "inline-block",
                padding: "16px 32px",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "bold",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.3)")
              }
              onMouseOut={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.2)")
              }
            >
              🚀 Start Smart Matching Now
            </Link>
          </div>

          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              marginTop: "24px",
              fontSize: "14px",
            }}
          >
            ✅ No credit card required • 🚀 Setup in 2 minutes • 📈 See results
            immediately
          </p>
        </div>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "40px 0",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <p style={{ marginBottom: "16px" }}>
            © 2025 FlowLync Platform. Built for affiliate marketers who want to
            work smarter, not harder.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/privacy"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="/support"
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
              }}
            >
              Support
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
