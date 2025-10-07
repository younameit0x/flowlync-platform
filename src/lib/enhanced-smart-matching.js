/**
 * Enhanced Smart Matching Service
 * 
 * Integrates with FlowLync's expanded affiliate database
 * Now supports 200+ affiliate programs vs original 18
 */

// Enhanced affiliate matching algorithm
class EnhancedSmartMatchingService {
  constructor() {
    this.enhancedPrograms = [];
    this.userPreferences = {};
    this.matchingWeights = {
      vertical_match: 0.30,      // Primary vertical preference
      commission_rate: 0.25,     // Higher commission preferred
      brand_reputation: 0.20,    // Brand rating/trust score
      geographic_fit: 0.15,      // Regional availability
      payment_terms: 0.10        // Payout speed/terms
    };
  }

  // Load enhanced affiliate data
  async loadEnhancedPrograms() {
    try {
      // First try to load enhanced database
      const fs = require('fs');
      const path = require('path');
      
      const enhancedPath = path.join(process.cwd(), 'gambling-affiliate-data-enhanced.json');
      if (fs.existsSync(enhancedPath)) {
        const data = JSON.parse(fs.readFileSync(enhancedPath, 'utf8'));
        this.enhancedPrograms = data.all_affiliates || [];
        console.log(`✅ Loaded ${this.enhancedPrograms.length} enhanced affiliate programs`);
        return this.enhancedPrograms;
      }

      // Fallback to original data if enhanced not available
      const originalPath = path.join(process.cwd(), 'gambling-affiliate-data.json');
      if (fs.existsSync(originalPath)) {
        const data = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
        this.enhancedPrograms = [
          ...(data.casino_affiliates || []),
          ...(data.sportsbook_affiliates || []),
          ...(data.poker_affiliates || []),
          ...(data.crypto_gambling_affiliates || []),
          ...(data.lottery_affiliates || [])
        ];
        console.log(`📝 Loaded ${this.enhancedPrograms.length} original affiliate programs`);
        return this.enhancedPrograms;
      }

      // Generate demo programs if no data available
      this.enhancedPrograms = this.generateDemoPrograms();
      console.log(`🧪 Generated ${this.enhancedPrograms.length} demo affiliate programs`);
      return this.enhancedPrograms;

    } catch (error) {
      console.error('Error loading affiliate programs:', error);
      this.enhancedPrograms = this.generateDemoPrograms();
      return this.enhancedPrograms;
    }
  }

  // Generate enhanced demo programs for testing
  generateDemoPrograms() {
    return [
      {
        id: 'enhanced_demo_001',
        name: 'BetMGM Casino',
        website: 'https://casino.betmgm.com',
        vertical: 'Online Casino',
        region: 'North America',
        commission_structure: { revenue_share: '35-50%' },
        rating: 4.8,
        minimum_payout: 100,
        payment_terms: 'Net 15',
        status: 'active',
        network_source: 'ShareASale'
      },
      {
        id: 'enhanced_demo_002',
        name: 'DraftKings Sportsbook',
        website: 'https://sportsbook.draftkings.com',
        vertical: 'Sportsbook',
        region: 'North America',
        commission_structure: { revenue_share: '25-40%' },
        rating: 4.8,
        minimum_payout: 100,
        payment_terms: 'Net 30',
        status: 'active',
        network_source: 'Impact Radius'
      },
      {
        id: 'enhanced_demo_003',
        name: 'Stake.com',
        website: 'https://stake.com',
        vertical: 'Crypto Gambling',
        region: 'Global',
        commission_structure: { revenue_share: '40-60%' },
        rating: 4.8,
        minimum_payout: 50,
        payment_terms: 'Real-time',
        status: 'active',
        network_source: 'Direct Partnership'
      },
      {
        id: 'enhanced_demo_004',
        name: 'LeoVegas Casino',
        website: 'https://www.leovegas.com',
        vertical: 'Online Casino',
        region: 'Europe',
        commission_structure: { revenue_share: '35-50%' },
        rating: 4.9,
        minimum_payout: 100,
        payment_terms: 'Net 30',
        status: 'active',
        network_source: 'Commission Junction'
      },
      {
        id: 'enhanced_demo_005',
        name: 'Caesars Casino',
        website: 'https://www.caesarscasino.com',
        vertical: 'Online Casino',
        region: 'North America',
        commission_structure: { revenue_share: '30-45%' },
        rating: 4.7,
        minimum_payout: 100,
        payment_terms: 'Net 30',
        status: 'active',
        network_source: 'Commission Junction'
      }
    ];
  }

  // Enhanced matching algorithm with multiple factors
  async getEnhancedRecommendations(userPreferences, options = {}) {
    await this.loadEnhancedPrograms();

    const {
      limit = 10,
      minRating = 4.0,
      preferredRegions = [],
      excludeNetworks = [],
      minCommission = 0
    } = options;

    console.log(`🎯 Enhanced Smart Matching for ${this.enhancedPrograms.length} programs`);

    // Filter programs based on criteria
    let filteredPrograms = this.enhancedPrograms.filter(program => {
      // Basic filters
      if (program.status !== 'active') return false;
      if (program.rating < minRating) return false;
      if (excludeNetworks.includes(program.network_source)) return false;

      // Commission filter
      const commissionRate = this.extractCommissionRate(program);
      if (commissionRate < minCommission) return false;

      // Region filter
      if (preferredRegions.length > 0 && !preferredRegions.includes(program.region)) {
        return false;
      }

      return true;
    });

    // Score each program based on user preferences
    const scoredPrograms = filteredPrograms.map(program => {
      const score = this.calculateEnhancedScore(program, userPreferences);
      return { ...program, match_score: score };
    });

    // Sort by match score and return top results
    const recommendations = scoredPrograms
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, limit)
      .map(program => ({
        ...program,
        match_percentage: Math.round(program.match_score * 100),
        recommendation_reason: this.generateRecommendationReason(program, userPreferences)
      }));

    console.log(`✅ Generated ${recommendations.length} enhanced recommendations`);

    return {
      recommendations,
      total_programs_analyzed: this.enhancedPrograms.length,
      filters_applied: {
        min_rating: minRating,
        preferred_regions: preferredRegions,
        excluded_networks: excludeNetworks,
        min_commission: minCommission
      },
      matching_algorithm: 'Enhanced Multi-Factor Scoring'
    };
  }

  // Enhanced scoring algorithm
  calculateEnhancedScore(program, userPreferences) {
    let score = 0;

    // Vertical match score
    if (userPreferences.gambling_types && userPreferences.gambling_types.includes(program.vertical)) {
      score += this.matchingWeights.vertical_match;
    }

    // Commission rate score
    const commissionRate = this.extractCommissionRate(program);
    const commissionScore = Math.min(commissionRate / 50, 1); // Normalize to max 50%
    score += this.matchingWeights.commission_rate * commissionScore;

    // Brand reputation score (based on rating)
    const reputationScore = (program.rating || 4.0) / 5.0;
    score += this.matchingWeights.brand_reputation * reputationScore;

    // Geographic fit score
    let geoScore = 0.5; // Default neutral score
    if (userPreferences.region) {
      geoScore = program.region === userPreferences.region ? 1.0 : 0.3;
    }
    score += this.matchingWeights.geographic_fit * geoScore;

    // Payment terms score
    let paymentScore = 0.5; // Default
    if (program.payment_terms) {
      if (program.payment_terms.includes('Real-time')) paymentScore = 1.0;
      else if (program.payment_terms.includes('Net 15')) paymentScore = 0.8;
      else if (program.payment_terms.includes('Net 30')) paymentScore = 0.6;
    }
    score += this.matchingWeights.payment_terms * paymentScore;

    return Math.min(score, 1.0); // Cap at 1.0
  }

  // Extract commission rate from various formats
  extractCommissionRate(program) {
    const commissionStr = program.commission_structure?.revenue_share || '25%';
    
    // Handle ranges like "30-45%"
    if (commissionStr.includes('-')) {
      const range = commissionStr.split('-');
      const min = parseInt(range[0]) || 25;
      const max = parseInt(range[1]) || 35;
      return (min + max) / 2; // Return average
    }
    
    // Handle single values like "35%"
    return parseInt(commissionStr) || 25;
  }

  // Generate recommendation reason
  generateRecommendationReason(program, userPreferences) {
    const reasons = [];

    // Vertical match
    if (userPreferences.gambling_types && userPreferences.gambling_types.includes(program.vertical)) {
      reasons.push(`Matches your ${program.vertical} preference`);
    }

    // High commission
    const commissionRate = this.extractCommissionRate(program);
    if (commissionRate >= 35) {
      reasons.push(`High commission rate (${commissionRate}%)`);
    }

    // High rating
    if (program.rating >= 4.5) {
      reasons.push(`Excellent reputation (${program.rating}★)`);
    }

    // Good payment terms
    if (program.payment_terms && program.payment_terms.includes('Net 15')) {
      reasons.push('Fast payout terms');
    }

    // Network source
    if (program.network_source) {
      reasons.push(`Available via ${program.network_source}`);
    }

    return reasons.length > 0 ? reasons.join(' • ') : 'Good overall match';
  }

  // Get programs by network source
  async getProgramsByNetwork(networkSource) {
    await this.loadEnhancedPrograms();
    return this.enhancedPrograms.filter(program => 
      program.network_source === networkSource
    );
  }

  // Get program statistics
  async getEnhancedStatistics() {
    await this.loadEnhancedPrograms();

    const stats = {
      total_programs: this.enhancedPrograms.length,
      by_vertical: {},
      by_network: {},
      by_region: {},
      average_commission: 0,
      average_rating: 0,
      active_programs: 0
    };

    let totalCommission = 0;
    let totalRating = 0;
    let ratingCount = 0;

    this.enhancedPrograms.forEach(program => {
      // Count by vertical
      stats.by_vertical[program.vertical] = (stats.by_vertical[program.vertical] || 0) + 1;

      // Count by network
      const network = program.network_source || 'Unknown';
      stats.by_network[network] = (stats.by_network[network] || 0) + 1;

      // Count by region
      stats.by_region[program.region] = (stats.by_region[program.region] || 0) + 1;

      // Active programs
      if (program.status === 'active') {
        stats.active_programs++;
      }

      // Average commission
      totalCommission += this.extractCommissionRate(program);

      // Average rating
      if (program.rating) {
        totalRating += program.rating;
        ratingCount++;
      }
    });

    stats.average_commission = Math.round(totalCommission / this.enhancedPrograms.length);
    stats.average_rating = ratingCount > 0 ? Math.round((totalRating / ratingCount) * 10) / 10 : 0;

    return stats;
  }
}

// Export for use in FlowLync
const enhancedSmartMatching = new EnhancedSmartMatchingService();

// CommonJS exports (works with require())
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EnhancedSmartMatchingService,
    enhancedSmartMatching
  };
}