"use client";

import { useState, useRef, useEffect } from "react";

export default function EnhancedAIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "👋 Hello! I'm Alexandra Sterling, your AI affiliate marketing consultant with 10+ years of experience. I can help you with:\n\n• 🎯 Finding high-commission affiliate programs\n• ✍️ Content creation strategies\n• 🔍 SEO optimization for affiliate sites\n• 💰 Commission maximization techniques\n• 📊 Performance analysis and growth strategies\n\nWhat affiliate marketing challenge can I help you solve today?",
      timestamp: new Date(),
      enhanced: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useEnhanced, setUseEnhanced] = useState(true); // Toggle between basic and enhanced AI
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const endpoint = useEnhanced ? "/api/ai-chat-enhanced" : "/api/ai-chat";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          context: {
            page: window.location.pathname,
            enhanced: useEnhanced,
            userPersona: "affiliate_marketer",
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: messages.length + 2,
          type: "ai",
          content: data.response,
          timestamp: new Date(),
          enhanced: useEnhanced,
          provider: data.ai_provider || "basic",
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: messages.length + 2,
        type: "ai",
        content:
          "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment, or switch to basic mode if the issue persists.",
        timestamp: new Date(),
        enhanced: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          🧠
        </button>

        {/* Enhanced indicator */}
        <div
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            background: useEnhanced ? "#48bb78" : "#cbd5e0",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            color: "white",
            fontWeight: "bold",
            animation: useEnhanced ? "pulse-enhanced 2s infinite" : "none",
          }}
        >
          {useEnhanced ? "AI" : "GPT"}
        </div>

        <style jsx>{`
          @keyframes pulse-enhanced {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(72, 187, 120, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "400px",
        height: "650px",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: useEnhanced ? "2px solid #48bb78" : "2px solid #667eea",
      }}
    >
      {/* Enhanced Header */}
      <div
        style={{
          background: useEnhanced
            ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "28px" }}>🧠</div>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                {useEnhanced ? "Alexandra Sterling" : "AI Assistant"}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>
                {useEnhanced
                  ? "Senior Affiliate Marketing Consultant"
                  : "Affiliate Marketing Expert"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setUseEnhanced(!useEnhanced)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                borderRadius: "8px",
                padding: "4px 8px",
                fontSize: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {useEnhanced ? "🤖 Basic" : "🧠 Enhanced"}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* AI Mode Indicator */}
        <div
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            fontSize: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {useEnhanced
            ? "🚀 Enhanced AI Mode - Real AI responses with affiliate expertise"
            : "⚡ Basic Mode - Knowledge base responses"}
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          background: "#f8fafc",
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: "16px",
              textAlign: message.type === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                maxWidth: "85%",
                padding: "12px 16px",
                borderRadius:
                  message.type === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                background:
                  message.type === "user"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : message.enhanced
                      ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                      : "white",
                color: message.type === "user" ? "white" : "#2d3748",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
                lineHeight: "1.4",
                position: "relative",
              }}
            >
              {message.content}

              {/* Enhanced indicator for AI messages */}
              {message.type === "ai" && message.enhanced && (
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "8px",
                    background: "#48bb78",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "8px",
                    fontSize: "8px",
                    fontWeight: "bold",
                  }}
                >
                  AI
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#64748b",
                marginTop: "4px",
                opacity: 0.7,
              }}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {message.provider && (
                <span style={{ marginLeft: "8px", fontSize: "8px" }}>
                  via {message.provider}
                </span>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ textAlign: "left", marginBottom: "16px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "12px 16px",
                borderRadius: "18px 18px 18px 4px",
                background: useEnhanced
                  ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                  : "white",
                color: "#2d3748",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
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
                    width: "20px",
                    height: "20px",
                    border: "2px solid #e2e8f0",
                    borderTop: useEnhanced
                      ? "2px solid white"
                      : "2px solid #667eea",
                    borderRadius: "50%",
                    animation: "spin-enhanced 1s linear infinite",
                  }}
                />
                <span>
                  {useEnhanced
                    ? "Alexandra is analyzing with AI..."
                    : "AI is thinking..."}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #e2e8f0",
          background: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              useEnhanced
                ? "Ask Alexandra anything about affiliate marketing..."
                : "Ask me anything about affiliate marketing..."
            }
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "2px solid #e2e8f0",
              borderRadius: "25px",
              outline: "none",
              fontSize: "14px",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = useEnhanced ? "#48bb78" : "#667eea")
            }
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              background:
                inputMessage.trim() && !isLoading
                  ? useEnhanced
                    ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "#cbd5e0",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              cursor:
                inputMessage.trim() && !isLoading ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            {isLoading ? "⏳" : "🚀"}
          </button>
        </div>

        {/* Enhanced Quick suggestions */}
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {[
            "Find high-commission programs",
            "Content strategy for casino affiliates",
            "SEO tips for affiliate sites",
            "How to maximize affiliate revenue",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputMessage(suggestion)}
              style={{
                padding: "6px 12px",
                background: useEnhanced ? "#f0fff4" : "#f1f5f9",
                border: `1px solid ${useEnhanced ? "#48bb78" : "#e2e8f0"}`,
                borderRadius: "16px",
                fontSize: "11px",
                color: useEnhanced ? "#22543d" : "#475569",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.background = useEnhanced ? "#c6f6d5" : "#e2e8f0";
                e.target.style.borderColor = useEnhanced
                  ? "#38a169"
                  : "#cbd5e0";
              }}
              onMouseOut={(e) => {
                e.target.style.background = useEnhanced ? "#f0fff4" : "#f1f5f9";
                e.target.style.borderColor = useEnhanced
                  ? "#48bb78"
                  : "#e2e8f0";
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Mode info */}
        <div
          style={{
            marginTop: "8px",
            fontSize: "10px",
            color: "#64748b",
            textAlign: "center",
          }}
        >
          {useEnhanced
            ? "🧠 Enhanced Mode: Real AI with affiliate expertise"
            : "🤖 Basic Mode: Knowledge base responses"}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-enhanced {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
