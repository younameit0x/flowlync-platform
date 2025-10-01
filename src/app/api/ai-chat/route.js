import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// AI Chat Assistant - Cost-free implementation using existing data
class AIChatAssistant {
  constructor() {
    this.knowledgeBase = {
      affiliate_marketing: {
        keywords: ['affiliate', 'commission', 'program', 'marketing', 'revenue'],
        responses: [
          "Affiliate marketing is a performance-based marketing strategy where you earn commissions for promoting other companies' products.",
          "To get started with affiliate marketing, choose a niche you're passionate about and find relevant affiliate programs.",
          "Smart Matching AI can help you find the best affiliate programs with the highest commissions for your audience."
        ]
      },
      casino_affiliates: {
        keywords: ['casino', 'gambling', 'slots', 'poker', 'betting'],
        responses: [
          "Casino affiliate programs typically offer 25-45% commission rates, much higher than traditional affiliate programs.",
          "Popular casino categories include slots, poker, sports betting, and live dealer games.",
          "When choosing casino affiliate programs, consider the commission structure, payment reliability, and marketing materials provided."
        ]
      },
      content_creation: {
        keywords: ['blog', 'content', 'post', 'article', 'seo'],
        responses: [
          "For affiliate content, focus on providing genuine value to your readers while naturally incorporating affiliate links.",
          "Top-performing affiliate content includes detailed reviews, comparisons, and beginner's guides.",
          "SEO tip: Target long-tail keywords like 'best casino affiliate programs for beginners' for better rankings."
        ]
      },
      smart_matching: {
        keywords: ['smart matching', 'ai', 'recommendations', 'platform'],
        responses: [
          "Smart Matching uses AI to analyze your preferences and find perfect affiliate-casino partnerships in seconds.",
          "The platform considers 7 factors: category match, jurisdiction, features, budget, experience level, reputation, and performance history.",
          "You can access Smart Matching at /smart-matching or try the interactive demo at /demo-smart-matching."
        ]
      }
    };
  }

  // Find relevant response based on user query
  findRelevantResponse(query) {
    const lowerQuery = query.toLowerCase();

    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      const hasKeyword = data.keywords.some(keyword => lowerQuery.includes(keyword));
      if (hasKeyword) {
        return data.responses[Math.floor(Math.random() * data.responses.length)];
      }
    }

    return null;
  }

  // Generate contextual response based on query type
  async generateResponse(query, context = {}) {
    const lowerQuery = query.toLowerCase();

    // Handle specific query types
    if (lowerQuery.includes('recommend') && lowerQuery.includes('program')) {
      return await this.handleProgramRecommendation(query, context);
    }

    if (lowerQuery.includes('content') && lowerQuery.includes('idea')) {
      return this.handleContentIdea(query, context);
    }

    if (lowerQuery.includes('seo') || lowerQuery.includes('rank')) {
      return this.handleSEOAdvice(query, context);
    }

    if (lowerQuery.includes('image') || lowerQuery.includes('picture')) {
      return this.handleImageGeneration(query, context);
    }

    if (lowerQuery.includes('search') || lowerQuery.includes('find')) {
      return this.handleSearchQuery(query, context);
    }

    // Default response using knowledge base
    const relevantResponse = this.findRelevantResponse(query);
    if (relevantResponse) {
      return relevantResponse;
    }

    // Fallback helpful response
    return "I'm here to help with affiliate marketing, Smart Matching, and content creation! Try asking me about:\n• Finding affiliate programs\n• Content creation ideas\n• SEO optimization\n• Platform features\n• Getting started guides";
  }

  // Handle program recommendation queries
  async handleProgramRecommendation(query, context) {
    try {
      // Get sample recommendations from database
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
        return `Based on your query, I recommend the ${program.affiliates.name} program partnered with ${program.casinos.name}. It offers a ${program.commission_rate}% commission rate and specializes in ${program.affiliates.specialization}. This match has a ${program.confidence_score}% confidence score from our AI analysis.`;
      }

      return "I can help you find great affiliate programs! Try setting up your preferences in Smart Matching to get personalized recommendations.";
    } catch (error) {
      return "I can suggest some excellent affiliate programs for you. The Smart Matching AI typically finds programs with 35-45% commission rates that match your audience perfectly.";
    }
  }

  // Handle content idea queries
  handleContentIdea(query, context) {
    const ideas = [
      "Create a 'Best Casino Bonuses 2025' comparison post - this type of content performs very well!",
      "Write a beginner's guide to casino affiliate marketing - educational content builds trust and conversions.",
      "Publish a 'Top 10 Casino Games for Beginners' review with affiliate links - engaging and monetizable.",
      "Create a case study about your affiliate marketing journey - authentic content resonates with readers."
    ];

    return ideas[Math.floor(Math.random() * ideas.length)];
  }

  // Handle SEO advice queries
  handleSEOAdvice(query, context) {
    const seoTips = [
      "Focus on long-tail keywords like 'best casino affiliate programs for beginners' - they're easier to rank for and have higher conversion intent.",
      "Include affiliate links naturally within valuable content - Google favors helpful, informative pages.",
      "Optimize your content for featured snippets by providing clear, concise answers to common questions.",
      "Use internal linking to connect related affiliate content - this improves SEO and user experience."
    ];

    return seoTips[Math.floor(Math.random() * seoTips.length)];
  }

  // Handle image generation queries (simulated for cost-free)
  handleImageGeneration(query, context) {
    // In a real implementation, this would integrate with free AI image services
    // For now, we'll simulate the response
    const imageDescriptions = [
      "I'll generate a professional infographic showing casino affiliate commission rates",
      "Creating an eye-catching header image for your casino review post",
      "Designing a comparison chart for different affiliate programs",
      "Generating a custom thumbnail for your affiliate marketing video"
    ];

    return `${imageDescriptions[Math.floor(Math.random() * imageDescriptions.length)]}. (Note: In a full implementation, this would generate actual images using AI services like DALL-E or Stable Diffusion.)`;
  }

  // Handle search queries
  async handleSearchQuery(query, context) {
    try {
      // Search in existing data
      const searchTerm = query.replace(/search|find/gi, '').trim();

      if (searchTerm.length < 3) {
        return "Please provide more specific search terms. I can help you find affiliate programs, content ideas, or platform information.";
      }

      // Search in casinos
      const { data: casinos } = await supabase
        .from('casinos')
        .select('name, category, jurisdiction')
        .ilike('name', `%${searchTerm}%`)
        .limit(3);

      // Search in affiliates
      const { data: affiliates } = await supabase
        .from('affiliates')
        .select('name, specialization, commission_rate')
        .ilike('name', `%${searchTerm}%`)
        .limit(3);

      let response = `Search results for "${searchTerm}":\n\n`;

      if (casinos && casinos.length > 0) {
        response += "🎰 Casinos:\n";
        casinos.forEach(casino => {
          response += `• ${casino.name} (${casino.category}) - ${casino.jurisdiction}\n`;
        });
        response += "\n";
      }

      if (affiliates && affiliates.length > 0) {
        response += "🤝 Affiliates:\n";
        affiliates.forEach(affiliate => {
          response += `• ${affiliate.name} - ${affiliate.commission_rate}% commission\n`;
        });
      }

      if ((!casinos || casinos.length === 0) && (!affiliates || affiliates.length === 0)) {
        response = `No specific results found for "${searchTerm}". Try asking about affiliate programs, content ideas, or Smart Matching features!`;
      }

      return response;
    } catch (error) {
      return "I can help you search for affiliate programs and platform information. Try asking about specific casinos, affiliates, or features!";
    }
  }
}

// POST /api/ai-chat - Handle chat messages
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

    const chatAI = new AIChatAssistant();
    const response = await chatAI.generateResponse(message, context);

    // Save chat interaction for analytics (optional)
    try {
      await supabase
        .from('chat_interactions')
        .insert([{
          user_query: message,
          ai_response: response,
          context: context,
          created_at: new Date().toISOString()
        }]);
    } catch (dbError) {
      // Non-critical error, continue without saving
      console.log('Could not save chat interaction:', dbError.message);
    }

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      context: 'ai_assistant'
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
