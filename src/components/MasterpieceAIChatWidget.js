'use client';

import { useState, useRef, useEffect } from 'react';

export default function MasterpieceAIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "🎓 Hello! I'm Dr. Alexandra Sterling, your AI affiliate marketing consultant with a PhD in Digital Marketing and 15+ years of experience. I've helped generate over $500M in affiliate revenue.\n\nI can assist you with:\n\n🎯 **Advanced Affiliate Strategies**\n• Commission maximization algorithms\n• AI-powered content optimization\n• Market trend analysis\n• Competitive intelligence\n\n🔍 **Research & Analysis**\n• Web research and trend analysis\n• SEO optimization strategies\n• Performance prediction\n• Content gap analysis\n\n💡 **Implementation Support**\n• Content creation strategies\n• SEO optimization plans\n• Revenue optimization\n• Growth strategies\n\nWhat affiliate marketing challenge would you like to tackle today?",
      timestamp: new Date(),
      enhanced: true,
      aiPersona: 'Dr_Alexandra_Sterling'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState('masterpiece'); // masterpiece, enhanced, basic
  const [showCapabilities, setShowCapabilities] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const endpoint = getEndpointForMode(aiMode);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: {
            page: window.location.pathname,
            aiMode: aiMode,
            userPersona: 'affiliate_marketer',
            timestamp: new Date().toISOString()
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: messages.length + 2,
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          enhanced: aiMode !== 'basic',
          aiPersona: getPersonaForMode(aiMode),
          provider: data.aiPersona || aiMode,
          capabilities: data.capabilities || 'basic'
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: "I apologize for the technical difficulty. As an AI consultant, I recommend trying again in a moment or switching to a different AI mode. If the issue persists, the platform's fallback systems will ensure you still get helpful responses.",
        timestamp: new Date(),
        enhanced: false,
        aiPersona: 'Dr_Alexandra_Sterling'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getEndpointForMode = (mode) => {
    switch (mode) {
      case 'masterpiece': return '/api/ai-chat-masterpiece';
      case 'enhanced': return '/api/ai-chat-enhanced';
      case 'basic': return '/api/ai-chat';
      default: return '/api/ai-chat-masterpiece';
    }
  };

  const getPersonaForMode = (mode) => {
    switch (mode) {
      case 'masterpiece': return 'Dr_Alexandra_Sterling';
      case 'enhanced': return 'Alexandra_Sterling';
      case 'basic': return 'AI_Assistant';
      default: return 'Dr_Alexandra_Sterling';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const aiModes = [
    {
      id: 'masterpiece',
      name: '🧠 Masterpiece AI',
      description: 'Dr. Alexandra Sterling - PhD Level Expertise',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      indicator: '👑'
    },
    {
      id: 'enhanced',
      name: '⚡ Enhanced AI',
      description: 'Advanced AI with Affiliate Expertise',
      color: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      indicator: '🚀'
    },
    {
      id: 'basic',
      name: '💬 Basic AI',
      description: 'Knowledge Base Responses',
      color: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
      indicator: '⚡'
    }
  ];

  if (!isOpen) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '70px',
            height: '70px',
            fontSize: '28px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            animation: 'masterpiece-pulse 3s infinite'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          🧠
        </button>

        {/* Masterpiece indicator */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: '-12px',
          background: '#ffd700',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#2d3748',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
          animation: 'gold-glow 2s infinite'
        }}>
          👑
        </div>

        <style jsx>{`
          @keyframes masterpiece-pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(102, 126, 234, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
          }
          @keyframes gold-glow {
            0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '450px',
      height: '700px',
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: `3px solid ${aiModes.find(mode => mode.id === aiMode)?.color.split(' ')[1] || '#667eea'}`
    }}>

      {/* Masterpiece Header */}
      <div style={{
        background: aiModes.find(mode => mode.id === aiMode)?.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '32px' }}>
              {aiModes.find(mode => mode.id === aiMode)?.indicator || '🧠'}
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                {getPersonaForMode(aiMode)}
              </div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>
                {aiMode === 'masterpiece' && 'PhD Digital Marketing & AI'}
                {aiMode === 'enhanced' && 'Senior Affiliate Marketing Consultant'}
                {aiMode === 'basic' && 'Affiliate Marketing Expert'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowCapabilities(!showCapabilities)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {showCapabilities ? '✖️' : '⚙️'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* AI Capabilities Panel */}
        {showCapabilities && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            fontSize: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'left'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              🚀 {aiModes.find(mode => mode.id === aiMode)?.name} Capabilities:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {aiMode === 'masterpiece' && (
                <>
                  <div>• Web Research</div>
                  <div>• SEO Analysis</div>
                  <div>• Trend Prediction</div>
                  <div>• Content Strategy</div>
                  <div>• Competitive Intel</div>
                  <div>• Revenue Optimization</div>
                </>
              )}
              {aiMode === 'enhanced' && (
                <>
                  <div>• Smart Responses</div>
                  <div>• Platform Integration</div>
                  <div>• Content Ideas</div>
                  <div>• SEO Tips</div>
                  <div>• Program Matching</div>
                  <div>• Performance Analysis</div>
                </>
              )}
              {aiMode === 'basic' && (
                <>
                  <div>• Knowledge Base</div>
                  <div>• Basic Q&A</div>
                  <div>• Platform Help</div>
                  <div>• Simple Advice</div>
                  <div>• Always Available</div>
                  <div>• Fast Responses</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* AI Mode Selector */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          gap: '8px',
          justifyContent: 'center'
        }}>
          {aiModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setAiMode(mode.id)}
              style={{
                padding: '6px 12px',
                background: aiMode === mode.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${aiMode === mode.id ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                color: 'white',
                borderRadius: '12px',
                fontSize: '10px',
                cursor: 'pointer',
                fontWeight: aiMode === mode.id ? 'bold' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        background: '#f8fafc'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: '20px',
              textAlign: message.type === 'user' ? 'right' : 'left'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                maxWidth: '85%',
                padding: '16px 20px',
                borderRadius: message.type === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                background: message.type === 'user'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : message.enhanced
                    ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                    : 'white',
                color: message.type === 'user' ? 'white' : '#2d3748',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                lineHeight: '1.5',
                position: 'relative'
              }}
            >
              {message.content}

              {/* AI Persona indicator */}
              {message.type === 'ai' && message.aiPersona && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '8px',
                  background: message.enhanced ? '#48bb78' : '#667eea',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '8px',
                  fontWeight: 'bold'
                }}>
                  {message.aiPersona}
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: '10px',
                color: '#64748b',
                marginTop: '6px',
                opacity: 0.7
              }}
            >
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {message.provider && (
                <span style={{ marginLeft: '8px', fontSize: '8px' }}>
                  via {message.provider}
                </span>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <div style={{
              display: 'inline-block',
              padding: '16px 20px',
              borderRadius: '20px 20px 20px 6px',
              background: aiMode === 'masterpiece'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : aiMode === 'enhanced'
                ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                : 'white',
              color: '#2d3748',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              fontSize: '14px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid #e2e8f0',
                  borderTop: `3px solid ${aiMode === 'masterpiece' ? '#ffd700' : aiMode === 'enhanced' ? 'white' : '#667eea'}`,
                  borderRadius: '50%',
                  animation: 'masterpiece-spin 1s linear infinite'
                }} />
                <span>
                  {aiMode === 'masterpiece' && 'Dr. Sterling is analyzing with advanced AI...'}
                  {aiMode === 'enhanced' && 'Alexandra is processing your query...'}
                  {aiMode === 'basic' && 'AI is thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div style={{
        padding: '24px',
        borderTop: '1px solid #e2e8f0',
        background: 'white'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              aiMode === 'masterpiece'
                ? "Ask Dr. Sterling anything about affiliate marketing..."
                : aiMode === 'enhanced'
                ? "Ask Alexandra anything about affiliate marketing..."
                : "Ask me anything about affiliate marketing..."
            }
            style={{
              flex: 1,
              padding: '14px 20px',
              border: `2px solid ${aiMode === 'masterpiece' ? '#667eea' : aiMode === 'enhanced' ? '#48bb78' : '#ed8936'}`,
              borderRadius: '30px',
              outline: 'none',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = aiMode === 'masterpiece' ? '#5a67d8' : aiMode === 'enhanced' ? '#38a169' : '#dd6b20'}
            onBlur={(e) => e.target.style.borderColor = aiMode === 'masterpiece' ? '#667eea' : aiMode === 'enhanced' ? '#48bb78' : '#ed8936'}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              background: inputMessage.trim() && !isLoading
                ? (aiMode === 'masterpiece'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : aiMode === 'enhanced'
                    ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                    : 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)')
                : '#cbd5e0',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            {isLoading ? '⏳' : '🚀'}
          </button>
        </div>

        {/* Masterpiece Quick suggestions */}
        <div style={{
          marginTop: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {[
            'Search latest affiliate trends',
            'Generate content strategy',
            'SEO optimization analysis',
            'Commission rate research',
            'Competitive analysis',
            'Revenue optimization plan'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputMessage(suggestion)}
              style={{
                padding: '8px 14px',
                background: aiMode === 'masterpiece'
                  ? '#edf2f7'
                  : aiMode === 'enhanced'
                  ? '#f0fff4'
                  : '#fef5e7',
                border: `1px solid ${aiMode === 'masterpiece' ? '#667eea' : aiMode === 'enhanced' ? '#48bb78' : '#ed8936'}`,
                borderRadius: '20px',
                fontSize: '11px',
                color: aiMode === 'masterpiece' ? '#2d3748' : aiMode === 'enhanced' ? '#22543d' : '#9a3412',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.background = aiMode === 'masterpiece'
                  ? '#e2e8f0'
                  : aiMode === 'enhanced'
                  ? '#c6f6d5'
                  : '#fed7aa';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = aiMode === 'masterpiece'
                  ? '#edf2f7'
                  : aiMode === 'enhanced'
                  ? '#f0fff4'
                  : '#fef5e7';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Mode info */}
        <div style={{
          marginTop: '12px',
          fontSize: '10px',
          color: '#64748b',
          textAlign: 'center',
          padding: '8px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}>
          {aiMode === 'masterpiece' && '🧠 Masterpiece Mode: PhD-level expertise with web research, SEO analysis, and advanced strategies'}
          {aiMode === 'enhanced' && '⚡ Enhanced Mode: Advanced AI with platform integration and specialized knowledge'}
          {aiMode === 'basic' && '💬 Basic Mode: Reliable responses with platform knowledge base'}
        </div>
      </div>

      <style jsx>{`
        @keyframes masterpiece-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
