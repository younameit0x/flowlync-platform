import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced AI Chat Assistant with Real AI API Integration
class EnhancedAIChatAssistant {
  constructor() {
    this.affiliatePersona = {
      name: "Alexandra Sterling",
      role: "Senior Affiliate Marketing Consultant with 10+ years experience",
      expertise: ["Casino Affiliates", "Content Strategy", "SEO Optimization", "Commission Maximization"],
      personality: "Professional, data-driven, encouraging, and results-focused",
      specializations: ["iGaming", "Digital Products", "Performance Marketing"]
    };

    this.aiProviders = [
      { name: 'huggingface', url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', free: true },
      { name: 'groq', url: 'https://api.groq.com/openai/v1/chat/completions', free: true }
    ];
  }

  // Enhanced response generation with real AI
  async generateEnhancedResponse(query, context = {}) {
    try {
      // First, try to get real AI response
      const aiResponse = await this.getAIResponse(query);

      // Then enhance it with affiliate marketing context
      const enhancedResponse = await this.enhanceWithAffiliateContext(aiResponse, query, context);

      return enhancedResponse;
    } catch (error) {
      console.log('AI API failed, using fallback:', error.message);
      // Fallback to the original knowledge base system
      return await this.generateFallbackResponse(query, context);
    }
  }

  // Get response from free AI APIs
  async getAIResponse(query) {
    const affiliateContext = `You are Alexandra Sterling, a senior affiliate marketing consultant specializing in casino and iGaming affiliates. You have 10+ years of experience helping bloggers and marketers maximize their affiliate revenue. Be professional, data-driven, and provide actionable advice. Current query: ${query}`;

    // Try Hugging Face first (completely free)
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || 'hf_xxxxxxxxxxxxxxxxxxxxxxxxx'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: affiliateContext,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data[0]?.generated_text || "I understand your affiliate marketing question and I'm here to help!";
      }
    } catch (error) {
      console.log('Hugging Face API error:', error.message);
    }

    // Fallback to a simple template response
    return this.generateTemplateResponse(query);
  }

  // Generate template response when APIs are unavailable
  generateTemplateResponse(query) {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('commission') || lowerQuery.includes('earn')) {
      return "Great question about commissions! Casino affiliate programs typically offer 25-45% commission rates. For example, with 1000 clicks at a 35% commission rate and $50 average deposit, you could earn $1,750 monthly. I can help you find programs with the highest rates for your niche.";
    }

    if (lowerQuery.includes('content') || lowerQuery.includes('blog')) {
      return "Content is crucial for affiliate success! Focus on creating genuine value for your readers. I recommend detailed casino reviews, comparison posts, and beginner's guides. The key is balancing helpful content with natural affiliate link placement.";
    }

    if (lowerQuery.includes('seo') || lowerQuery.includes('rank')) {
      return "SEO for affiliate sites requires targeting long-tail keywords like 'best casino bonuses for beginners.' Create comprehensive content that genuinely helps users, and include affiliate links naturally within the content. Focus on user experience and valuable information.";
    }

    return "I'm Alexandra Sterling, your affiliate marketing consultant. I specialize in helping content creators like you maximize affiliate revenue through proven strategies. What specific aspect of affiliate marketing would you like help with?";
  }

  // Enhance AI response with affiliate marketing context
  async enhanceWithAffiliateContext(aiResponse, originalQuery, context) {
    // Get relevant data from your platform
    const platformData = await this.getPlatformContext(originalQuery);

    // Combine AI response with platform-specific information
    let enhancedResponse = aiResponse;

    // Add specific recommendations if query is about programs
    if (originalQuery.toLowerCase().includes('recommend') && originalQuery.toLowerCase().includes('program')) {
      enhancedResponse += "\n\n💡 Pro Tip: Based on your Smart Matching data, I recommend focusing on casino affiliate programs offering 35%+ commissions. These typically perform best for content creators.";
    }

    // Add SEO advice if query is about content
    if (originalQuery.toLowerCase().includes('content') || originalQuery.toLowerCase().includes('blog')) {
      enhancedResponse += "\n\n🎯 Content Strategy: Create detailed, helpful content that ranks for long-tail keywords. Include affiliate links naturally within valuable information.";
    }

    // Add platform integration
    enhancedResponse += `\n\n🤝 Platform Integration: You can use the Smart Matching AI at /smart-matching to find personalized affiliate program recommendations, or try the interactive demo at /demo-smart-matching to see it in action.`;

    return enhancedResponse;
  }

  // Get contextual data from your platform
  async getPlatformContext(query) {
    try {
      // Get top recommendations for context
      const { data: recommendations } = await supabase
        .from('smart_recommendations')
        .select(`
          *,
          affiliates!inner(name, commission_rate),
          casinos!inner(name, category)
        `)
        .limit(3);

      return {
        recommendations: recommendations || [],
        hasActiveRecommendations: (recommendations && recommendations.length > 0)
      };
    } catch (error) {
      return { recommendations: [], hasActiveRecommendations: false };
    }
  }

  // Fallback to original system when AI APIs fail
  async generateFallbackResponse(query, context) {
    // Use the original knowledge base system
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('recommend') && lowerQuery.includes('program')) {
      return await this.handleProgramRecommendation(query, context);
    }

    if (lowerQuery.includes('content') && lowerQuery.includes('idea')) {
      return this.handleContentIdea(query, context);
    }

    if (lowerQuery.includes('seo') || lowerQuery.includes('rank')) {
      return this.handleSEOAdvice(query, context);
    }

    if (lowerQuery.includes('commission') || lowerQuery.includes('earn')) {
      return "Casino affiliate programs offer excellent commission rates! Most programs provide 25-45% commissions. For example, if you drive 1000 clicks to a program with 35% commission and $50 average deposits, you could earn $1,750 monthly.";
    }

    return "I'm Alexandra Sterling, your affiliate marketing consultant. I can help you with program recommendations, content strategies, SEO optimization, and maximizing your affiliate revenue. What specific area would you like to focus on?";
  }

  // Original methods for fallback
  async handleProgramRecommendation(query, context) {
    try {
      const { data: programs } = await supabase
        .from('smart_recommendations')
        .select(`
          *,
          affiliates!inner(name, commission_rate, specialization),
          casinos!inner(name, category, jurisdiction)
        `)
        .limit(3);

      if (programs && programs.length > 0) {
        const program = programs[0];
        return `I recommend the ${program.affiliates.name} program partnered with ${program.casinos.name}. It offers a ${program.commission_rate}% commission rate and specializes in ${program.affiliates.specialization}. This match has a ${program.confidence_score}% confidence score from our AI analysis.`;
      }

      return "I can help you find excellent affiliate programs! The Smart Matching AI typically finds programs with 35-45% commission rates that match your audience perfectly.";
    } catch (error) {
      return "I can suggest excellent affiliate programs for you. Focus on programs offering 35%+ commissions in the casino/gaming niche for optimal results.";
    }
  }

  handleContentIdea(query, context) {
    const ideas = [
      "Create a comprehensive 'Best Casino Bonuses 2025' guide - this content type converts extremely well!",
      "Write a detailed review of popular casino games with natural affiliate link integration",
      "Develop a 'Beginner's Guide to Casino Affiliate Marketing' - establishes you as an authority",
      "Create comparison posts between different casino affiliate programs - very valuable for readers"
    ];

    return ideas[Math.floor(Math.random() * ideas.length)];
  }

  handleSEOAdvice(query, context) {
    const seoTips = [
      "Target long-tail keywords like 'best casino affiliate programs for beginners' - high conversion intent!",
      "Create comprehensive, helpful content that genuinely serves your readers - Google rewards this",
      "Include affiliate links naturally within valuable content - avoid spammy placement",
      "Focus on user experience and mobile optimization - crucial ranking factors"
    ];

    return seoTips[Math.floor(Math.random() * seoTips.length)];
  }
}

// POST /api/ai-chat-enhanced - Enhanced AI chat with real AI integration
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const chatAI = new EnhancedAIChatAssistant();
    const response = await chatAI.generateEnhancedResponse(message, context);

    // Save enhanced chat interaction
    try {
      await supabase
        .from('chat_interactions')
        .insert([{
          user_query: message,
          ai_response: response,
          context: { ...context, enhanced: true },
          created_at: new Date().toISOString()
        }]);
    } catch (dbError) {
      console.log('Could not save enhanced chat interaction:', dbError.message);
    }

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      context: 'enhanced_ai_assistant',
      ai_provider: 'hybrid_system'
    });

  } catch (error) {
    console.error('Error in enhanced AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to process enhanced chat message' },
      { status: 500 }
    );
  }
}
