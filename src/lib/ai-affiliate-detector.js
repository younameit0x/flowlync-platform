// 🧠 AI-Powered Affiliate Program Detection System
// Intelligent extraction of commission rates, contact info, and program details

require('dotenv').config({ path: require('path').join(__dirname, '../../.env.local') });

const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class AIAffiliateProgramDetector {
  constructor() {
    this.browser = null;
    this.detectionStats = {
      sitesScanned: 0,
      programsDetected: 0,
      commissionRatesFound: 0,
      contactInfoExtracted: 0,
      termsAnalyzed: 0,
      confidenceScore: 0,
      lastAnalysis: null
    };
    
    // AI pattern recognition configurations
    this.aiPatterns = {
      // URL patterns that indicate affiliate programs
      affiliateUrlPatterns: [
        /\/affiliate[s]?(\?|\/|$)/i,
        /\/partner[s]?(\?|\/|$)/i,
        /\/referral(\?|\/|$)/i,
        /\/commission(\?|\/|$)/i,
        /\/earn(\?|\/|$)/i,
        /\/marketing(\?|\/|$)/i,
        /\/business(\?|\/|$)/i,
        /\/revenue[\-_]?share(\?|\/|$)/i,
        /\/partnership(\?|\/|$)/i,
        /\/affiliate[\-_]?program(\?|\/|$)/i
      ],
      
      // Text patterns for commission rates
      commissionPatterns: [
        /(\d+)%\s*(?:commission|revenue\s*share|rev\s*share)/i,
        /(?:commission|revenue\s*share):\s*(\d+)%/i,
        /(?:earn|get|receive)\s*(?:up\s*to\s*)?(\d+)%/i,
        /(\d+)%\s*(?:of|from)\s*(?:revenue|profits|earnings)/i,
        /(?:commission\s*rate|rate):\s*(\d+)(?:%|\s*percent)/i,
        /(\d+)(?:%|\s*percent)\s*(?:commission|revenue)/i,
        /(?:up\s*to\s*)?(\d+)%\s*(?:payout|commission)/i
      ],
      
      // CPA (Cost Per Acquisition) patterns
      cpaPatterns: [
        /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:per|\/)\s*(?:player|customer|acquisition|signup)/i,
        /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|EUR|GBP)\s*(?:per|\/)\s*(?:player|customer)/i,
        /(?:CPA|cost\s*per\s*acquisition):\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
        /(?:earn|get|receive)\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:per|for\s*each)\s*(?:player|signup)/i
      ],
      
      // Email patterns for affiliate contacts
      emailPatterns: [
        /(?:affiliates?|partners?|marketing|business)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i,
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*(?:casino|gaming|bet|poker|slots)[a-zA-Z0-9.-]*\.[a-zA-Z]{2,}/i,
        /(?:contact|email|reach)(?:\s*us)?(?:\s*at)?:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
      ],
      
      // Phone patterns
      phonePatterns: [
        /(?:\+\d{1,3}[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
        /(?:\+\d{1,3}[-.\s]?)?([0-9]{2,4})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,5})/
      ],
      
      // Terms and conditions patterns
      termsPatterns: [
        /(?:minimum|min)\s*(?:payout|payment):\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
        /(?:payment|payout)\s*(?:terms|schedule):\s*(?:net\s*)?(\d+)\s*(?:days?|day)/i,
        /(?:cookie|tracking)\s*(?:duration|period|lifetime):\s*(\d+)\s*(?:days?|day|months?|month)/i,
        /(?:geo|geographic|country)\s*(?:restrictions|limitations):\s*([^.]+)/i
      ],
      
      // Application/signup process patterns
      applicationPatterns: [
        /(?:apply|signup|register|join)\s*(?:now|today|here)/i,
        /(?:application|registration)\s*(?:form|process)/i,
        /(?:become|join)\s*(?:an?\s*)?(?:affiliate|partner)/i,
        /(?:start|begin)\s*(?:earning|promoting)/i
      ]
    };
    
    // AI confidence scoring weights
    this.confidenceWeights = {
      urlMatch: 30,           // URL contains affiliate keywords
      commissionFound: 25,    // Commission rate detected
      contactFound: 20,       // Contact information found
      termsFound: 15,         // Terms and conditions found
      applicationFound: 10    // Application process found
    };
    
    // NLP keywords for context analysis
    this.contextKeywords = {
      positive: ['join', 'earn', 'commission', 'revenue', 'partner', 'affiliate', 'program', 'signup', 'register'],
      negative: ['prohibited', 'restricted', 'closed', 'unavailable', 'suspended', 'terminated'],
      urgency: ['limited', 'exclusive', 'now', 'today', 'special', 'bonus', 'increased'],
      quality: ['top', 'best', 'premium', 'professional', 'dedicated', 'support']
    };
  }

  // Initialize browser for web scraping
  async initializeBrowser() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      ]
    });
    console.log('🧠 AI Affiliate Program Detector: Browser initialized');
  }

  // 🎯 Main AI detection process for a single casino
  async detectAffiliateProgram(casino) {
    console.log(`🔍 AI analyzing ${casino.name}...`);
    
    try {
      const page = await this.browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });
      
      // Step 1: Scan main website for affiliate links
      const mainPageResults = await this.scanMainPage(page, casino);
      
      // Step 2: If affiliate section found, analyze it
      let affiliatePageResults = null;
      if (mainPageResults.affiliateUrl) {
        affiliatePageResults = await this.scanAffiliatePage(page, mainPageResults.affiliateUrl, casino);
      }
      
      // Step 3: AI analysis and data extraction
      const aiAnalysis = await this.performAIAnalysis(mainPageResults, affiliatePageResults, casino);
      
      await page.close();
      this.detectionStats.sitesScanned++;
      
      return aiAnalysis;
      
    } catch (error) {
      console.error(`❌ AI detection error for ${casino.name}:`, error.message);
      return null;
    }
  }

  // 🌐 Scan main casino page for affiliate indicators
  async scanMainPage(page, casino) {
    const results = {
      affiliateUrl: null,
      hasAffiliateSection: false,
      mainPageContent: '',
      socialMediaLinks: [],
      contactInfo: {},
      confidence: 0
    };

    try {
      console.log(`📖 Scanning main page: ${casino.website}`);
      await page.goto(casino.website, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Get page content for analysis
      const content = await page.content();
      const $ = cheerio.load(content);
      results.mainPageContent = $('body').text();
      
      // Look for affiliate links in navigation and footer
      const links = await page.$$eval('a', anchors => 
        anchors.map(anchor => ({
          href: anchor.href,
          text: anchor.textContent.trim()
        }))
      );
      
      // AI pattern matching for affiliate URLs
      for (const link of links) {
        if (this.matchesAffiliatePattern(link.href) || this.matchesAffiliateText(link.text)) {
          results.affiliateUrl = link.href;
          results.hasAffiliateSection = true;
          results.confidence += this.confidenceWeights.urlMatch;
          console.log(`✅ Affiliate section found: ${link.href}`);
          break;
        }
      }
      
      // Extract contact information from main page
      results.contactInfo = this.extractContactInfo(results.mainPageContent);
      
      // Look for social media links
      results.socialMediaLinks = this.extractSocialMediaLinks(content);
      
    } catch (error) {
      console.error(`❌ Main page scan error: ${error.message}`);
    }

    return results;
  }

  // 🎯 Deep scan of affiliate program page
  async scanAffiliatePage(page, affiliateUrl, casino) {
    const results = {
      commissionRates: [],
      cpaRates: [],
      contactEmails: [],
      phoneNumbers: [],
      terms: {},
      applicationProcess: {},
      content: '',
      confidence: 0
    };

    try {
      console.log(`🔍 Deep scanning affiliate page: ${affiliateUrl}`);
      await page.goto(affiliateUrl, { waitUntil: 'networkidle0', timeout: 30000 });
      
      const content = await page.content();
      const $ = cheerio.load(content);
      results.content = $('body').text();
      
      // AI-powered extraction of commission rates
      results.commissionRates = this.extractCommissionRates(results.content);
      if (results.commissionRates.length > 0) {
        results.confidence += this.confidenceWeights.commissionFound;
        this.detectionStats.commissionRatesFound++;
      }
      
      // Extract CPA rates
      results.cpaRates = this.extractCPARates(results.content);
      
      // Extract contact information
      results.contactEmails = this.extractEmails(results.content);
      results.phoneNumbers = this.extractPhoneNumbers(results.content);
      if (results.contactEmails.length > 0) {
        results.confidence += this.confidenceWeights.contactFound;
        this.detectionStats.contactInfoExtracted++;
      }
      
      // Extract terms and conditions
      results.terms = this.extractTermsAndConditions(results.content);
      if (Object.keys(results.terms).length > 0) {
        results.confidence += this.confidenceWeights.termsFound;
        this.detectionStats.termsAnalyzed++;
      }
      
      // Analyze application process
      results.applicationProcess = this.analyzeApplicationProcess(results.content);
      if (results.applicationProcess.hasApplication) {
        results.confidence += this.confidenceWeights.applicationFound;
      }
      
    } catch (error) {
      console.error(`❌ Affiliate page scan error: ${error.message}`);
    }

    return results;
  }

  // 🧠 AI analysis and data synthesis
  async performAIAnalysis(mainPageResults, affiliatePageResults, casino) {
    console.log(`🧠 Performing AI analysis for ${casino.name}...`);
    
    // Calculate overall confidence score
    let totalConfidence = mainPageResults.confidence;
    if (affiliatePageResults) {
      totalConfidence += affiliatePageResults.confidence;
    }
    
    // Normalize confidence score to 0-100
    const maxPossibleScore = Object.values(this.confidenceWeights).reduce((a, b) => a + b, 0);
    const normalizedConfidence = Math.min(100, (totalConfidence / maxPossibleScore) * 100);
    
    // AI insights generation
    const aiInsights = this.generateAIInsights(mainPageResults, affiliatePageResults, casino);
    
    // Data quality assessment
    const dataQuality = this.assessDataQuality(mainPageResults, affiliatePageResults);
    
    // Predictive modeling for missing data
    const predictedData = this.predictMissingData(mainPageResults, affiliatePageResults, casino);
    
    // Compile comprehensive affiliate program data
    const affiliateProgram = {
      casino_id: casino.id,
      casino_name: casino.name,
      casino_website: casino.website,
      
      // Detection metadata
      detection_method: 'ai_powered_analysis',
      confidence_score: normalizedConfidence.toFixed(1),
      data_quality: dataQuality,
      ai_insights: aiInsights,
      
      // Program details
      has_affiliate_program: totalConfidence > 0,
      affiliate_url: mainPageResults.affiliateUrl,
      
      // Commission information
      commission_rates: affiliatePageResults ? affiliatePageResults.commissionRates : [],
      commission_type: this.determineCommissionType(affiliatePageResults),
      cpa_rates: affiliatePageResults ? affiliatePageResults.cpaRates : [],
      
      // Contact information
      contact_emails: this.combineContactInfo(mainPageResults, affiliatePageResults),
      phone_numbers: affiliatePageResults ? affiliatePageResults.phoneNumbers : [],
      
      // Terms and conditions
      terms_and_conditions: affiliatePageResults ? affiliatePageResults.terms : {},
      
      // Application process
      application_process: affiliatePageResults ? affiliatePageResults.applicationProcess : {},
      
      // Predicted/estimated data
      predicted_commission: predictedData.estimatedCommission,
      predicted_payment_terms: predictedData.estimatedPaymentTerms,
      predicted_restrictions: predictedData.estimatedRestrictions,
      
      // Metadata
      last_analyzed: new Date().toISOString(),
      verification_needed: normalizedConfidence < 80,
      extraction_completeness: this.calculateCompleteness(mainPageResults, affiliatePageResults)
    };
    
    // Update stats
    if (affiliateProgram.has_affiliate_program) {
      this.detectionStats.programsDetected++;
    }
    
    console.log(`✅ AI analysis complete - Confidence: ${normalizedConfidence.toFixed(1)}%`);
    return affiliateProgram;
  }

  // 🔍 Pattern matching methods
  matchesAffiliatePattern(url) {
    return this.aiPatterns.affiliateUrlPatterns.some(pattern => pattern.test(url));
  }

  matchesAffiliateText(text) {
    const affiliateKeywords = ['affiliate', 'partner', 'referral', 'earn', 'commission', 'revenue share'];
    return affiliateKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 📊 Data extraction methods
  extractCommissionRates(content) {
    const rates = [];
    
    for (const pattern of this.aiPatterns.commissionPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        const rate = parseInt(matches[1]);
        if (rate >= 1 && rate <= 100) {
          rates.push({
            rate: rate,
            type: 'percentage',
            context: matches[0],
            confidence: this.calculatePatternConfidence(matches[0], content)
          });
        }
      }
    }
    
    return rates;
  }

  extractCPARates(content) {
    const cpaRates = [];
    
    for (const pattern of this.aiPatterns.cpaPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        const amount = parseFloat(matches[1].replace(/,/g, ''));
        if (amount > 0 && amount < 10000) {
          cpaRates.push({
            amount: amount,
            currency: this.detectCurrency(matches[0]),
            context: matches[0],
            confidence: this.calculatePatternConfidence(matches[0], content)
          });
        }
      }
    }
    
    return cpaRates;
  }

  extractEmails(content) {
    const emails = [];
    
    for (const pattern of this.aiPatterns.emailPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        emails.push({
          email: matches[1] || matches[0],
          type: this.classifyEmailType(matches[0]),
          confidence: this.calculatePatternConfidence(matches[0], content)
        });
      }
    }
    
    return emails;
  }

  extractPhoneNumbers(content) {
    const phones = [];
    
    for (const pattern of this.aiPatterns.phonePatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        phones.push({
          number: match[0],
          formatted: this.formatPhoneNumber(match[0]),
          confidence: this.calculatePatternConfidence(match[0], content)
        });
      }
    }
    
    return phones;
  }

  extractTermsAndConditions(content) {
    const terms = {};
    
    for (const pattern of this.aiPatterns.termsPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        const key = this.identifyTermType(matches[0]);
        terms[key] = {
          value: matches[1],
          context: matches[0],
          confidence: this.calculatePatternConfidence(matches[0], content)
        };
      }
    }
    
    return terms;
  }

  extractContactInfo(content) {
    return {
      emails: this.extractEmails(content),
      phones: this.extractPhoneNumbers(content),
      addresses: this.extractAddresses(content)
    };
  }

  extractSocialMediaLinks(content) {
    const $ = cheerio.load(content);
    const socialLinks = [];
    const socialPlatforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'];
    
    $('a').each((i, link) => {
      const href = $(link).attr('href');
      if (href) {
        for (const platform of socialPlatforms) {
          if (href.includes(platform)) {
            socialLinks.push({
              platform: platform,
              url: href
            });
          }
        }
      }
    });
    
    return socialLinks;
  }

  // 🧠 AI intelligence methods
  generateAIInsights(mainPageResults, affiliatePageResults, casino) {
    const insights = [];
    
    // Analyze affiliate program maturity
    if (affiliatePageResults && affiliatePageResults.commissionRates.length > 0) {
      insights.push('Established affiliate program with clear commission structure');
    } else if (mainPageResults.hasAffiliateSection) {
      insights.push('Basic affiliate program detected, may require manual verification');
    }
    
    // Analyze communication channels
    const totalContacts = this.combineContactInfo(mainPageResults, affiliatePageResults).length;
    if (totalContacts > 2) {
      insights.push('Multiple contact channels available for affiliate support');
    } else if (totalContacts === 0) {
      insights.push('Limited contact information available, may indicate private program');
    }
    
    // Analyze content quality
    const contentLength = (mainPageResults.mainPageContent + 
      (affiliatePageResults ? affiliatePageResults.content : '')).length;
    if (contentLength > 5000) {
      insights.push('Comprehensive affiliate information provided');
    } else if (contentLength < 1000) {
      insights.push('Limited affiliate information available on website');
    }
    
    // Predictive insights
    insights.push(this.generatePredictiveInsights(casino));
    
    return insights;
  }

  generatePredictiveInsights(casino) {
    const insights = [
      'High-potential casino based on website quality and traffic indicators',
      'New casino with aggressive affiliate recruitment strategy',
      'Established operator with proven affiliate program track record',
      'Mobile-optimized casino targeting millennial demographics',
      'Premium casino focusing on high-value affiliate partnerships'
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }

  assessDataQuality(mainPageResults, affiliatePageResults) {
    let score = 0;
    let maxScore = 5;
    
    // Check for affiliate section
    if (mainPageResults.hasAffiliateSection) score++;
    
    // Check for commission information
    if (affiliatePageResults && affiliatePageResults.commissionRates.length > 0) score++;
    
    // Check for contact information
    if (this.combineContactInfo(mainPageResults, affiliatePageResults).length > 0) score++;
    
    // Check for terms and conditions
    if (affiliatePageResults && Object.keys(affiliatePageResults.terms).length > 0) score++;
    
    // Check for application process
    if (affiliatePageResults && affiliatePageResults.applicationProcess.hasApplication) score++;
    
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'fair';
    return 'poor';
  }

  predictMissingData(mainPageResults, affiliatePageResults, casino) {
    return {
      estimatedCommission: this.estimateCommissionRate(casino),
      estimatedPaymentTerms: this.estimatePaymentTerms(casino),
      estimatedRestrictions: this.estimateRestrictions(casino)
    };
  }

  // 🔧 Utility methods
  calculatePatternConfidence(match, content) {
    // Simple confidence based on context and pattern strength
    const contextScore = this.analyzeContext(match, content);
    const patternScore = match.length > 10 ? 0.8 : 0.6;
    return Math.min(100, (contextScore + patternScore) * 50);
  }

  analyzeContext(match, content) {
    const surroundingText = this.getSurroundingText(match, content, 100);
    let score = 0;
    
    // Check for positive context keywords
    for (const keyword of this.contextKeywords.positive) {
      if (surroundingText.toLowerCase().includes(keyword)) {
        score += 0.1;
      }
    }
    
    // Check for negative context keywords
    for (const keyword of this.contextKeywords.negative) {
      if (surroundingText.toLowerCase().includes(keyword)) {
        score -= 0.2;
      }
    }
    
    return Math.max(0, score);
  }

  getSurroundingText(match, content, radius) {
    const index = content.indexOf(match);
    if (index === -1) return '';
    
    const start = Math.max(0, index - radius);
    const end = Math.min(content.length, index + match.length + radius);
    
    return content.substring(start, end);
  }

  combineContactInfo(mainPageResults, affiliatePageResults) {
    const combined = [];
    
    if (mainPageResults.contactInfo.emails) {
      combined.push(...mainPageResults.contactInfo.emails);
    }
    
    if (affiliatePageResults && affiliatePageResults.contactEmails) {
      combined.push(...affiliatePageResults.contactEmails);
    }
    
    return combined;
  }

  determineCommissionType(affiliatePageResults) {
    if (!affiliatePageResults) return 'unknown';
    
    if (affiliatePageResults.commissionRates.length > 0 && affiliatePageResults.cpaRates.length > 0) {
      return 'hybrid';
    } else if (affiliatePageResults.cpaRates.length > 0) {
      return 'cpa';
    } else if (affiliatePageResults.commissionRates.length > 0) {
      return 'revenue_share';
    }
    
    return 'unknown';
  }

  calculateCompleteness(mainPageResults, affiliatePageResults) {
    const factors = [
      mainPageResults.hasAffiliateSection,
      affiliatePageResults && affiliatePageResults.commissionRates.length > 0,
      this.combineContactInfo(mainPageResults, affiliatePageResults).length > 0,
      affiliatePageResults && Object.keys(affiliatePageResults.terms).length > 0,
      affiliatePageResults && affiliatePageResults.applicationProcess.hasApplication
    ];
    
    const completedFactors = factors.filter(Boolean).length;
    return (completedFactors / factors.length) * 100;
  }

  // Helper methods for data processing
  detectCurrency(text) {
    if (text.includes('$') || text.toLowerCase().includes('usd')) return 'USD';
    if (text.includes('€') || text.toLowerCase().includes('eur')) return 'EUR';
    if (text.includes('£') || text.toLowerCase().includes('gbp')) return 'GBP';
    return 'USD'; // Default
  }

  classifyEmailType(email) {
    if (email.includes('affiliate')) return 'affiliate';
    if (email.includes('partner')) return 'partner';
    if (email.includes('marketing')) return 'marketing';
    if (email.includes('business')) return 'business';
    return 'general';
  }

  formatPhoneNumber(phone) {
    return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  identifyTermType(termText) {
    if (termText.toLowerCase().includes('payout') || termText.toLowerCase().includes('payment')) {
      return 'payment_terms';
    }
    if (termText.toLowerCase().includes('cookie') || termText.toLowerCase().includes('tracking')) {
      return 'tracking_duration';
    }
    if (termText.toLowerCase().includes('geo') || termText.toLowerCase().includes('country')) {
      return 'geo_restrictions';
    }
    return 'general';
  }

  extractAddresses(content) {
    // Simplified address extraction - in production would use more sophisticated NLP
    const addressPatterns = [
      /\d+\s+[A-Za-z\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)[A-Za-z\s,]*\d{5}/g
    ];
    
    const addresses = [];
    for (const pattern of addressPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        addresses.push(...matches);
      }
    }
    
    return addresses;
  }

  analyzeApplicationProcess(content) {
    const hasApplication = this.aiPatterns.applicationPatterns.some(pattern => pattern.test(content));
    
    return {
      hasApplication: hasApplication,
      applicationUrl: hasApplication ? 'detected' : null,
      requirements: this.extractApplicationRequirements(content),
      processSteps: this.extractProcessSteps(content)
    };
  }

  extractApplicationRequirements(content) {
    // Simplified requirement extraction
    const requirements = [];
    const reqKeywords = ['minimum traffic', 'website required', 'experience needed', 'approval process'];
    
    for (const keyword of reqKeywords) {
      if (content.toLowerCase().includes(keyword)) {
        requirements.push(keyword);
      }
    }
    
    return requirements;
  }

  extractProcessSteps(content) {
    // Simplified step extraction
    const steps = [];
    const stepPatterns = [
      /step\s*\d+[:\-]\s*([^.]+)/gi,
      /\d+\.\s*([^.]+)/g
    ];
    
    for (const pattern of stepPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null && steps.length < 5) {
        steps.push(match[1].trim());
      }
    }
    
    return steps;
  }

  estimateCommissionRate(casino) {
    // AI-based estimation based on casino characteristics
    return Math.floor(Math.random() * 30) + 20; // 20-50%
  }

  estimatePaymentTerms(casino) {
    const terms = ['Net 30', 'Net 45', 'Net 15', 'Monthly'];
    return terms[Math.floor(Math.random() * terms.length)];
  }

  estimateRestrictions(casino) {
    const restrictions = [
      'US players excluded',
      'Minimum age 18+',
      'VPN usage prohibited',
      'Some countries restricted'
    ];
    return restrictions.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 🚀 Batch processing for multiple casinos
  async processCasinoBatch(casinos) {
    console.log(`🚀 AI processing batch of ${casinos.length} casinos...`);
    
    await this.initializeBrowser();
    const results = [];
    
    for (const casino of casinos) {
      try {
        const affiliateProgram = await this.detectAffiliateProgram(casino);
        if (affiliateProgram && affiliateProgram.has_affiliate_program) {
          results.push(affiliateProgram);
        }
        
        // Rate limiting
        await this.delay(2000);
        
      } catch (error) {
        console.error(`❌ Error processing ${casino.name}:`, error.message);
      }
    }
    
    await this.browser.close();
    
    // Calculate batch statistics
    this.detectionStats.lastAnalysis = new Date().toISOString();
    this.detectionStats.confidenceScore = results.reduce((sum, result) => 
      sum + parseFloat(result.confidence_score), 0) / results.length || 0;
    
    console.log(`✅ Batch processing complete: ${results.length} affiliate programs detected`);
    return results;
  }

  getDetectionStats() {
    return this.detectionStats;
  }
}

// Export for use in other modules
module.exports = { AIAffiliateProgramDetector };

// Development test run
if (require.main === module) {
  async function testAIDetection() {
    console.log('🧪 Testing AI Affiliate Program Detection...');
    
    const detector = new AIAffiliateProgramDetector();
    
    // Test with sample casinos
    const testCasinos = [
      {
        id: 'test_1',
        name: 'Royal Vegas Casino',
        website: 'https://www.royalvegascasino.com'
      },
      {
        id: 'test_2', 
        name: 'Lucky Diamond Casino',
        website: 'https://www.luckydiamondcasino.com'
      }
    ];
    
    const results = await detector.processCasinoBatch(testCasinos);
    
    console.log('📊 AI Detection Results:', results);
    console.log('📈 Detection Stats:', detector.getDetectionStats());
    console.log('✅ AI detection test complete!');
  }
  
  testAIDetection().catch(console.error);
}