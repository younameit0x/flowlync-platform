'use client';

import { useState, useRef, useEffect } from 'react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "👋 Hi! I'm your AI affiliate marketing assistant. I can help you with:\n\n• Finding affiliate programs\n• Content creation ideas\n• SEO optimization tips\n• Platform navigation\n• General affiliate marketing advice\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: { page: window.location.pathname }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: messages.length + 2,
          type: 'ai',
          content: data.response,
          timestamp: new Date()
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
        content: "Sorry, I'm having trouble responding right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
            width: '60px',
            height: '60px',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          🤖
        </button>

        {/* Pulsing indicator */}
        <div style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          width: '20px',
          height: '20px',
          background: '#48bb78',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />

        <style jsx>{`
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
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
      width: '380px',
      height: '600px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '24px' }}>🤖</div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>AI Assistant</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Affiliate Marketing Expert</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        background: '#f8fafc'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: '16px',
              textAlign: message.type === 'user' ? 'right' : 'left'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: message.type === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                color: message.type === 'user' ? 'white' : '#2d3748',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                lineHeight: '1.4'
              }}
            >
              {message.content}
            </div>
            <div
              style={{
                fontSize: '10px',
                color: '#64748b',
                marginTop: '4px',
                opacity: 0.7
              }}
            >
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ textAlign: 'left', marginBottom: '16px' }}>
            <div style={{
              display: 'inline-block',
              padding: '12px 16px',
              borderRadius: '18px 18px 18px 4px',
              background: 'white',
              color: '#2d3748',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              fontSize: '14px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #e2e8f0',
                  borderTop: '2px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #e2e8f0',
        background: 'white'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about affiliate marketing..."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '25px',
              outline: 'none',
              fontSize: '14px',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              background: inputMessage.trim() && !isLoading ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#cbd5e0',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}
          >
            {isLoading ? '⏳' : '🚀'}
          </button>
        </div>

        {/* Quick suggestions */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {[
            'Find affiliate programs',
            'Content ideas',
            'SEO tips',
            'How to get started'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputMessage(suggestion)}
              style={{
                padding: '6px 12px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '11px',
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#e2e8f0';
                e.target.style.borderColor = '#cbd5e0';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.borderColor = '#e2e8f0';
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
