"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BloggerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userProgress, setUserProgress] = useState({
    affiliate_revenue: 0,
    content_created: 0,
    time_saved: 0,
    achievements: [],
  });
  const [contentIdeas, setContentIdeas] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    setIsMobile(window.innerWidth < 768);

    // Mock data for demo
    setUserProgress({
      affiliate_revenue: 1250,
      content_created: 12,
      time_saved: 48,
      achievements: [
        { id: 1, name: "First Affiliate Sale", icon: "💰", unlocked: true },
        { id: 2, name: "Content Creator", icon: "✍️", unlocked: true },
        { id: 3, name: "Revenue Goal", icon: "🎯", unlocked: false },
        { id: 4, name: "Community Contributor", icon: "👥", unlocked: false },
      ],
    });

    setContentIdeas([
      {
        id: 1,
        title: "Top 5 Casino Affiliate Programs for Beginners",
        confidence: 94,
        estimated_revenue: 450,
        reason: "High demand topic with strong affiliate commissions",
      },
      {
        id: 2,
        title: "How to Choose the Right Casino Affiliate Program",
        confidence: 89,
        estimated_revenue: 380,
        reason: "Educational content that builds trust and conversions",
      },
      {
        id: 3,
        title: "Best Casino Bonuses for Affiliate Marketers",
        confidence: 91,
        estimated_revenue: 520,
        reason: "Trending topic with high-converting affiliate offers",
      },
    ]);

    setCommunityPosts([
      {
        id: 1,
        author: "Sarah M.",
        avatar: "👩‍💻",
        content:
          "Just hit $2,000/month in affiliate revenue! Smart Matching AI made it possible 🙌",
        likes: 24,
        comments: 8,
        time: "2 hours ago",
      },
      {
        id: 2,
        author: "Mike R.",
        avatar: "👨‍🎓",
        content:
          "The content ideas feature is a game-changer. Created 5 posts this week!",
        likes: 18,
        comments: 5,
        time: "4 hours ago",
      },
      {
        id: 3,
        author: "Emma L.",
        avatar: "👩‍🎨",
        content:
          "Anyone else saving 10+ hours/week with this AI? Time for more content creation! 🚀",
        likes: 31,
        comments: 12,
        time: "6 hours ago",
      },
    ]);
  }, []);

  const TabButton = ({ tab, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(tab)}
      style={{
        padding: "12px 20px",
        background: isActive
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "rgba(255, 255, 255, 0.1)",
        color: isActive ? "white" : "rgba(255, 255, 255, 0.8)",
        border: "none",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      onMouseOver={(e) =>
        !isActive && (e.target.style.background = "rgba(255, 255, 255, 0.2)")
      }
      onMouseOut={(e) =>
        !isActive && (e.target.style.background = "rgba(255, 255, 255, 0.1)")
      }
    >
      <span>{icon}</span>
      {!isMobile && label}
    </button>
  );

  const AchievementCard = ({ achievement }) => (
    <div
      style={{
        background: achievement.unlocked
          ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
          : "rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        padding: "16px",
        textAlign: "center",
        border: achievement.unlocked
          ? "none"
          : "2px dashed rgba(255, 255, 255, 0.3)",
        opacity: achievement.unlocked ? 1 : 0.6,
      }}
    >
      <div style={{ fontSize: "32px", marginBottom: "8px" }}>
        {achievement.icon}
      </div>
      <div style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>
        {achievement.name}
      </div>
      {achievement.unlocked && (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "10px",
            marginTop: "8px",
          }}
        >
          ✓ Unlocked
        </div>
      )}
    </div>
  );

  const ContentIdeaCard = ({ idea }) => (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "16px",
        border: "1px solid rgba(102, 126, 234, 0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ color: "#2d3748", fontSize: "18px", margin: 0 }}>
          {idea.title}
        </h3>
        <div
          style={{
            background:
              idea.confidence >= 90
                ? "#48bb78"
                : idea.confidence >= 80
                  ? "#ed8936"
                  : "#f56565",
            color: "white",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {idea.confidence}% Match
        </div>
      </div>

      <p style={{ color: "#4a5568", marginBottom: "16px", fontSize: "14px" }}>
        {idea.reason}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#48bb78", fontWeight: "bold", fontSize: "16px" }}>
          Est. Revenue: ${idea.estimated_revenue}/month
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              background: "#667eea",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            ✍️ Write Post
          </button>
          <button
            style={{
              background: "#e2e8f0",
              color: "#4a5568",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            📊 View Details
          </button>
        </div>
      </div>
    </div>
  );

  const CommunityPostCard = ({ post }) => (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "16px",
        border: "1px solid rgba(102, 126, 234, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div style={{ fontSize: "24px" }}>{post.avatar}</div>
        <div>
          <div style={{ fontWeight: "bold", color: "#2d3748" }}>
            {post.author}
          </div>
          <div style={{ color: "#667eea", fontSize: "12px" }}>{post.time}</div>
        </div>
      </div>

      <p style={{ color: "#4a5568", marginBottom: "16px" }}>{post.content}</p>

      <div
        style={{
          display: "flex",
          gap: "16px",
          fontSize: "12px",
          color: "#667eea",
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            color: "#667eea",
            cursor: "pointer",
          }}
        >
          👍 {post.likes}
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            color: "#667eea",
            cursor: "pointer",
          }}
        >
          💬 {post.comments}
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            color: "#667eea",
            cursor: "pointer",
          }}
        >
          🔗 Share
        </button>
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
      {/* Header */}
      <div
        style={{
          padding: "20px 32px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/dashboard"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "20px",
              }}
            >
              ←
            </Link>
            <div>
              <h1
                style={{
                  color: "white",
                  fontSize: "24px",
                  margin: 0,
                  fontWeight: "bold",
                }}
              >
                🤝 Blogger Hub
              </h1>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                AI-powered content monetization platform
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              href="/smart-matching"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontSize: "14px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.background = "rgba(255, 255, 255, 0.2)")
              }
              onMouseOut={(e) => (e.target.style.background = "transparent")}
            >
              🤖 Smart Matching
            </Link>
            <Link
              href="/demo-smart-matching"
              style={{
                background: "white",
                color: "#667eea",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              🎬 Demo
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px" }}>
        {/* Progress Overview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            margin: "32px 0",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>💰</div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#48bb78" }}
            >
              ${userProgress.affiliate_revenue}
            </div>
            <div style={{ color: "#4a5568", fontSize: "14px" }}>
              Monthly Revenue
            </div>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 0.95)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>✍️</div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#667eea" }}
            >
              {userProgress.content_created}
            </div>
            <div style={{ color: "#4a5568", fontSize: "14px" }}>
              Posts Created
            </div>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>⏱️</div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#ed8936" }}
            >
              {userProgress.time_saved}h
            </div>
            <div style={{ color: "#4a5568", fontSize: "14px" }}>Time Saved</div>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏆</div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#9f7aea" }}
            >
              {userProgress.achievements.filter((a) => a.unlocked).length}/
              {userProgress.achievements.length}
            </div>
            <div style={{ color: "#4a5568", fontSize: "14px" }}>
              Achievements
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "32px",
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          <TabButton
            tab="overview"
            label="Overview"
            icon="📊"
            isActive={activeTab === "overview"}
            onClick={setActiveTab}
          />
          <TabButton
            tab="content"
            label="Content Tools"
            icon="✍️"
            isActive={activeTab === "content"}
            onClick={setActiveTab}
          />
          <TabButton
            tab="community"
            label="Community"
            icon="👥"
            isActive={activeTab === "community"}
            onClick={setActiveTab}
          />
          <TabButton
            tab="analytics"
            label="Analytics"
            icon="📈"
            isActive={activeTab === "analytics"}
            onClick={setActiveTab}
          />
          <TabButton
            tab="achievements"
            label="Achievements"
            icon="🏆"
            isActive={activeTab === "achievements"}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        <div style={{ marginBottom: "32px" }}>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "32px",
              }}
            >
              <div>
                <h2
                  style={{
                    color: "white",
                    fontSize: "24px",
                    marginBottom: "20px",
                  }}
                >
                  🚀 Welcome to Blogger Hub!
                </h2>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
                    🎯 Your Next Steps
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
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
                      <span style={{ color: "#4a5568" }}>
                        Set up your blog preferences for personalized
                        recommendations
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "#667eea",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span style={{ color: "#4a5568" }}>
                        Create your first affiliate content using AI suggestions
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "#ed8936",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span style={{ color: "#4a5568" }}>
                        Share your success in the community
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
                    🔥 Trending in Blogger Community
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div
                      style={{
                        padding: "12px",
                        background: "#f7fafc",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#2d3748",
                          fontSize: "14px",
                        }}
                      >
                        🔥 Hot Topic: "AI Affiliate Marketing Strategies"
                      </div>
                      <div style={{ color: "#667eea", fontSize: "12px" }}>
                        24 bloggers discussing
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        background: "#f7fafc",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#2d3748",
                          fontSize: "14px",
                        }}
                      >
                        💡 Tip: "Best affiliate programs for gaming blogs"
                      </div>
                      <div style={{ color: "#667eea", fontSize: "12px" }}>
                        18 bloggers sharing
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  style={{
                    color: "white",
                    fontSize: "20px",
                    marginBottom: "16px",
                  }}
                >
                  🏆 Your Achievements
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {userProgress.achievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    padding: "20px",
                    marginTop: "20px",
                  }}
                >
                  <h4 style={{ color: "#2d3748", marginBottom: "12px" }}>
                    🎯 Revenue Goal
                  </h4>
                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <span style={{ color: "#4a5568", fontSize: "12px" }}>
                        Progress to $2,000/month
                      </span>
                      <span
                        style={{
                          color: "#667eea",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        ${userProgress.affiliate_revenue}/$2,000
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: "#e2e8f0",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(userProgress.affiliate_revenue / 2000) * 100}%`,
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "4px",
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#667eea",
                      textAlign: "center",
                    }}
                  >
                    {Math.round((userProgress.affiliate_revenue / 2000) * 100)}%
                    Complete
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Tools Tab */}
          {activeTab === "content" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <h2 style={{ color: "white", fontSize: "24px", margin: 0 }}>
                  ✍️ AI Content Creator
                </h2>
                <button
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  🤖 Generate New Ideas
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "32px",
                }}
              >
                <div>
                  <h3
                    style={{
                      color: "white",
                      fontSize: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    🎯 AI-Generated Content Ideas
                  </h3>
                  {contentIdeas.map((idea) => (
                    <ContentIdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>

                <div>
                  <h3
                    style={{
                      color: "white",
                      fontSize: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    🛠️ Content Tools
                  </h3>

                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      padding: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    <h4 style={{ color: "#2d3748", marginBottom: "12px" }}>
                      📝 Blog Post Generator
                    </h4>
                    <p
                      style={{
                        color: "#4a5568",
                        fontSize: "14px",
                        marginBottom: "16px",
                      }}
                    >
                      Create affiliate content automatically based on AI
                      recommendations
                    </p>
                    <button
                      style={{
                        width: "100%",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        padding: "12px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      🚀 Generate Post
                    </button>
                  </div>

                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      padding: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    <h4 style={{ color: "#2d3748", marginBottom: "12px" }}>
                      🔍 SEO Optimizer
                    </h4>
                    <p
                      style={{
                        color: "#4a5568",
                        fontSize: "14px",
                        marginBottom: "16px",
                      }}
                    >
                      Optimize your affiliate content for search engines
                    </p>
                    <button
                      style={{
                        width: "100%",
                        background: "#48bb78",
                        color: "white",
                        border: "none",
                        padding: "12px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      ⚡ Optimize Content
                    </button>
                  </div>

                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      padding: "20px",
                    }}
                  >
                    <h4 style={{ color: "#2d3748", marginBottom: "12px" }}>
                      📱 Social Media Posts
                    </h4>
                    <p
                      style={{
                        color: "#4a5568",
                        fontSize: "14px",
                        marginBottom: "16px",
                      }}
                    >
                      Generate engaging social media content for your affiliate
                      posts
                    </p>
                    <button
                      style={{
                        width: "100%",
                        background: "#9f7aea",
                        color: "white",
                        border: "none",
                        padding: "12px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      📱 Create Posts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Community Tab */}
          {activeTab === "community" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <h2 style={{ color: "white", fontSize: "24px", margin: 0 }}>
                  👥 Blogger Community
                </h2>
                <button
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  📝 Share Your Story
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "32px",
                }}
              >
                <div>
                  <h3
                    style={{
                      color: "white",
                      fontSize: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    📢 Community Feed
                  </h3>
                  {communityPosts.map((post) => (
                    <CommunityPostCard key={post.id} post={post} />
                  ))}
                </div>

                <div>
                  <h3
                    style={{
                      color: "white",
                      fontSize: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    🏆 Top Contributors
                  </h3>

                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      padding: "20px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ fontSize: "24px" }}>👑</div>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#2d3748" }}>
                          Sarah M.
                        </div>
                        <div style={{ color: "#667eea", fontSize: "12px" }}>
                          $3,200/month
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ fontSize: "24px" }}>⭐</div>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#2d3748" }}>
                          Mike R.
                        </div>
                        <div style={{ color: "#667eea", fontSize: "12px" }}>
                          $2,800/month
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div style={{ fontSize: "24px" }}>🌟</div>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#2d3748" }}>
                          Emma L.
                        </div>
                        <div style={{ color: "#667eea", fontSize: "12px" }}>
                          $2,100/month
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      padding: "20px",
                    }}
                  >
                    <h4 style={{ color: "#2d3748", marginBottom: "12px" }}>
                      💡 Weekly Challenge
                    </h4>
                    <p
                      style={{
                        color: "#4a5568",
                        fontSize: "14px",
                        marginBottom: "16px",
                      }}
                    >
                      Create 3 affiliate posts this week and share your results!
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{
                          background: "#48bb78",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        ✅ Join Challenge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div>
              <h2
                style={{
                  color: "white",
                  fontSize: "24px",
                  marginBottom: "24px",
                }}
              >
                📈 Blogger Analytics
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
                    📊 Content Performance
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#4a5568" }}>
                        Top Performing Post
                      </span>
                      <span style={{ color: "#48bb78", fontWeight: "bold" }}>
                        $340 revenue
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#4a5568" }}>Average per Post</span>
                      <span style={{ color: "#667eea", fontWeight: "bold" }}>
                        $104 revenue
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "#4a5568" }}>
                        Total Content Views
                      </span>
                      <span style={{ color: "#ed8936", fontWeight: "bold" }}>
                        12.5K views
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
                    ⏱️ Time Savings
                  </h3>
                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#4a5568" }}>This Week</span>
                      <span style={{ color: "#48bb78", fontWeight: "bold" }}>
                        12 hours saved
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: "#e2e8f0",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "75%",
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                  </div>
                  <p style={{ color: "#4a5568", fontSize: "12px" }}>
                    Equivalent to $600 in consulting time saved
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
                    🎯 Revenue Goals
                  </h3>
                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#4a5568" }}>Monthly Target</span>
                      <span style={{ color: "#667eea", fontWeight: "bold" }}>
                        $2,000
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: "#e2e8f0",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "62.5%",
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                  </div>
                  <p style={{ color: "#4a5568", fontSize: "12px" }}>
                    On track to exceed goal this month! 🚀
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div>
              <h2
                style={{
                  color: "white",
                  fontSize: "24px",
                  marginBottom: "24px",
                }}
              >
                🏆 Achievement Center
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
                    ✅ Completed Achievements
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {userProgress.achievements
                      .filter((a) => a.unlocked)
                      .map((achievement) => (
                        <div
                          key={achievement.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px",
                            background: "#f7fafc",
                            borderRadius: "8px",
                          }}
                        >
                          <div style={{ fontSize: "24px" }}>
                            {achievement.icon}
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: "bold",
                                color: "#2d3748",
                                fontSize: "14px",
                              }}
                            >
                              {achievement.name}
                            </div>
                            <div style={{ color: "#48bb78", fontSize: "12px" }}>
                              ✓ Completed
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
                    🎯 In Progress
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {userProgress.achievements
                      .filter((a) => !a.unlocked)
                      .map((achievement) => (
                        <div
                          key={achievement.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px",
                            background: "#f7fafc",
                            borderRadius: "8px",
                            opacity: 0.6,
                          }}
                        >
                          <div style={{ fontSize: "24px" }}>
                            {achievement.icon}
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: "bold",
                                color: "#2d3748",
                                fontSize: "14px",
                              }}
                            >
                              {achievement.name}
                            </div>
                            <div style={{ color: "#cbd5e0", fontSize: "12px" }}>
                              🔒 Locked
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    padding: "24px",
                  }}
                >
                  <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
                    📈 Progress Tracking
                  </h3>
                  <div style={{ display: "grid", gap: "16px" }}>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ color: "#4a5568", fontSize: "14px" }}>
                          Revenue Goal: $2,000/month
                        </span>
                        <span style={{ color: "#667eea", fontSize: "12px" }}>
                          ${userProgress.affiliate_revenue}/$2,000
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          background: "#e2e8f0",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${(userProgress.affiliate_revenue / 2000) * 100}%`,
                            height: "100%",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ color: "#4a5568", fontSize: "14px" }}>
                          Content Creation: 20 posts
                        </span>
                        <span style={{ color: "#667eea", fontSize: "12px" }}>
                          {userProgress.content_created}/20
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          background: "#e2e8f0",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${(userProgress.content_created / 20) * 100}%`,
                            height: "100%",
                            background:
                              "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h3 style={{ color: "#2d3748", marginBottom: "16px" }}>
            🚀 Quick Actions
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            <Link
              href="/smart-matching"
              style={{
                display: "block",
                padding: "16px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                textAlign: "center",
                fontWeight: "bold",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              🤖 Find Affiliate Programs
            </Link>

            <Link
              href="/demo-smart-matching"
              style={{
                display: "block",
                padding: "16px",
                background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                textAlign: "center",
                fontWeight: "bold",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              🎬 Try Interactive Demo
            </Link>

            <button
              style={{
                padding: "16px",
                background: "linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              ✍️ Generate Content Ideas
            </button>

            <button
              style={{
                padding: "16px",
                background: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              👥 Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
