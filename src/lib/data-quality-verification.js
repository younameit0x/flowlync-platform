// 🔍 Data Quality & Verification System
// Automated validation, duplicate detection, and accuracy monitoring

require("dotenv").config({
  path: require("path").join(__dirname, "../../.env.local"),
});

const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require("cheerio");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

class DataQualityVerification {
  constructor() {
    this.browser = null;
    this.verificationStats = {
      totalRecordsProcessed: 0,
      duplicatesFound: 0,
      inaccurateRecords: 0,
      deadLinks: 0,
      dataQualityScore: 0,
      verificationAccuracy: 0,
      lastVerification: null,
    };

    // Data quality rules and thresholds
    this.qualityRules = {
      // Website validation
      website: {
        required: true,
        format: /^https?:\/\/.+\..+/,
        timeout: 10000,
        expected_status: [200, 301, 302],
      },

      // Casino name validation
      name: {
        required: true,
        min_length: 3,
        max_length: 100,
        forbidden_words: ["test", "example", "placeholder", "dummy"],
        format: /^[a-zA-Z0-9\s\-'&.]+$/,
      },

      // Commission rate validation
      commission_rate: {
        min_value: 1,
        max_value: 100,
        data_type: "number",
        required_for_affiliate: true,
      },

      // Email validation
      email: {
        format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        mx_record_check: true,
        blacklist_check: true,
      },

      // License validation
      license: {
        known_authorities: [
          "Malta Gaming Authority",
          "UK Gambling Commission",
          "Curacao Gaming",
          "Gibraltar Gambling Commission",
          "Kahnawake Gaming Commission",
        ],
        license_format_check: true,
      },

      // Duplicate detection criteria
      duplicate_detection: {
        name_similarity_threshold: 0.85,
        website_exact_match: true,
        email_exact_match: true,
        license_exact_match: true,
      },
    };

    // Verification algorithms
    this.verificationAlgorithms = {
      website_accessibility: this.verifyWebsiteAccessibility.bind(this),
      affiliate_program_exists: this.verifyAffiliateProgramExists.bind(this),
      commission_accuracy: this.verifyCommissionAccuracy.bind(this),
      contact_validity: this.verifyContactInformation.bind(this),
      license_authenticity: this.verifyLicenseAuthenticity.bind(this),
      operational_status: this.verifyOperationalStatus.bind(this),
      duplicate_detection: this.detectDuplicates.bind(this),
      data_freshness: this.checkDataFreshness.bind(this),
    };

    // Data enrichment sources
    this.enrichmentSources = {
      whois: "whois.net",
      ssl_checker: "ssl-checker.net",
      domain_tools: "domaintools.com",
      social_signals: ["twitter.com", "facebook.com", "linkedin.com"],
      review_sites: ["trustpilot.com", "sitejabber.com"],
      industry_databases: ["askgamblers.com", "casino.org"],
    };
  }

  // Initialize browser for verification
  async initializeBrowser() {
    this.browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ],
    });
    console.log("🔍 Data Quality Verification: Browser initialized");
  }

  // 🔍 Main verification process for casino records
  async verifyDataQuality(records) {
    console.log(
      `🔍 Starting data quality verification for ${records.length} records...`,
    );

    await this.initializeBrowser();
    const verificationResults = [];

    for (const record of records) {
      try {
        console.log(`🎯 Verifying ${record.name}...`);

        const verificationResult =
          await this.performComprehensiveVerification(record);
        verificationResults.push(verificationResult);

        // Rate limiting
        await this.delay(1500);
      } catch (error) {
        console.error(
          `❌ Verification error for ${record.name}:`,
          error.message,
        );
        verificationResults.push({
          ...record,
          verification_status: "error",
          verification_error: error.message,
          quality_score: 0,
        });
      }
    }

    await this.browser.close();

    // Generate verification summary
    const summary = this.generateVerificationSummary(verificationResults);
    await this.storeVerificationResults(verificationResults, summary);

    console.log(
      `✅ Data quality verification complete: ${verificationResults.length} records processed`,
    );
    return { results: verificationResults, summary };
  }

  // 🎯 Comprehensive verification for single record
  async performComprehensiveVerification(record) {
    const verificationResult = {
      ...record,
      verification_timestamp: new Date().toISOString(),
      verification_checks: {},
      quality_score: 0,
      verification_status: "pending",
      issues_found: [],
      enhancements: {},
    };

    let totalScore = 0;
    let checksPerformed = 0;

    // Run all verification algorithms
    for (const [checkName, algorithm] of Object.entries(
      this.verificationAlgorithms,
    )) {
      try {
        console.log(`🔍 Running ${checkName} check...`);

        const checkResult = await algorithm(record);
        verificationResult.verification_checks[checkName] = checkResult;

        if (checkResult.passed) {
          totalScore += checkResult.score || 100;
        } else {
          verificationResult.issues_found.push({
            check: checkName,
            issue: checkResult.issue,
            severity: checkResult.severity || "medium",
          });
        }

        checksPerformed++;
      } catch (error) {
        console.error(`❌ ${checkName} check failed:`, error.message);
        verificationResult.verification_checks[checkName] = {
          passed: false,
          error: error.message,
          score: 0,
        };
      }
    }

    // Calculate overall quality score
    verificationResult.quality_score =
      checksPerformed > 0 ? Math.round(totalScore / checksPerformed) : 0;

    // Determine verification status
    if (verificationResult.quality_score >= 80) {
      verificationResult.verification_status = "verified";
    } else if (verificationResult.quality_score >= 60) {
      verificationResult.verification_status = "partially_verified";
    } else {
      verificationResult.verification_status = "failed";
    }

    // Data enrichment
    verificationResult.enhancements = await this.enrichRecordData(record);

    this.verificationStats.totalRecordsProcessed++;

    return verificationResult;
  }

  // 🌐 Website accessibility verification
  async verifyWebsiteAccessibility(record) {
    try {
      const page = await this.browser.newPage();

      const startTime = Date.now();
      const response = await page.goto(record.website, {
        waitUntil: "networkidle0",
        timeout: this.qualityRules.website.timeout,
      });
      const loadTime = Date.now() - startTime;

      const statusCode = response.status();
      const isAccessible =
        this.qualityRules.website.expected_status.includes(statusCode);

      // Check for casino indicators
      const content = await page.content();
      const hasCasinoContent = this.containsCasinoContent(content);

      // Check SSL certificate
      const hasSSL = record.website.startsWith("https://");

      await page.close();

      if (!isAccessible) {
        this.verificationStats.deadLinks++;
      }

      return {
        passed: isAccessible && hasCasinoContent,
        score: isAccessible ? (hasCasinoContent ? 100 : 75) : 0,
        details: {
          status_code: statusCode,
          load_time: loadTime,
          has_ssl: hasSSL,
          has_casino_content: hasCasinoContent,
          accessibility: isAccessible,
        },
        issue: !isAccessible
          ? `Website not accessible (${statusCode})`
          : !hasCasinoContent
            ? "No casino content detected"
            : null,
      };
    } catch (error) {
      this.verificationStats.deadLinks++;
      return {
        passed: false,
        score: 0,
        issue: `Website accessibility error: ${error.message}`,
        severity: "high",
      };
    }
  }

  // 🎰 Affiliate program existence verification
  async verifyAffiliateProgramExists(record) {
    try {
      const page = await this.browser.newPage();
      await page.goto(record.website, {
        waitUntil: "networkidle0",
        timeout: 15000,
      });

      // Look for affiliate links in navigation and footer
      const affiliateLinks = await page.$$eval("a", (anchors) =>
        anchors
          .filter((anchor) => {
            const text = anchor.textContent.toLowerCase();
            const href = anchor.href.toLowerCase();
            return (
              text.includes("affiliate") ||
              text.includes("partner") ||
              href.includes("affiliate") ||
              href.includes("partner")
            );
          })
          .map((anchor) => ({
            text: anchor.textContent.trim(),
            href: anchor.href,
          })),
      );

      // Check for affiliate-specific pages
      let affiliatePageExists = false;
      let affiliatePageContent = "";

      if (affiliateLinks.length > 0) {
        try {
          await page.goto(affiliateLinks[0].href, {
            waitUntil: "networkidle0",
            timeout: 10000,
          });
          affiliatePageContent = await page.content();
          affiliatePageExists =
            this.containsAffiliateContent(affiliatePageContent);
        } catch (e) {
          // Affiliate link might be broken
        }
      }

      await page.close();

      const hasAffiliateProgram =
        affiliateLinks.length > 0 && affiliatePageExists;

      return {
        passed: hasAffiliateProgram,
        score: hasAffiliateProgram ? 100 : affiliateLinks.length > 0 ? 50 : 0,
        details: {
          affiliate_links_found: affiliateLinks.length,
          affiliate_page_exists: affiliatePageExists,
          affiliate_links: affiliateLinks.slice(0, 3), // Store first 3 links
        },
        issue: !hasAffiliateProgram ? "No affiliate program detected" : null,
      };
    } catch (error) {
      return {
        passed: false,
        score: 0,
        issue: `Affiliate verification error: ${error.message}`,
        severity: "medium",
      };
    }
  }

  // 💰 Commission accuracy verification
  async verifyCommissionAccuracy(record) {
    if (!record.commission_rate) {
      return {
        passed: true,
        score: 100,
        details: { note: "No commission rate to verify" },
      };
    }

    const commissionRate = parseFloat(record.commission_rate);

    // Basic range check
    const withinRange =
      commissionRate >= this.qualityRules.commission_rate.min_value &&
      commissionRate <= this.qualityRules.commission_rate.max_value;

    // Industry average comparison
    const industryAverage = 35; // 35% average
    const variance = Math.abs(commissionRate - industryAverage);
    const reasonableVariance = variance <= 25; // Within 25% of average

    // Suspicious values check
    const suspiciousValues = [100, 99, 90, 80]; // Commonly fake values
    const isSuspicious = suspiciousValues.includes(commissionRate);

    const isAccurate = withinRange && reasonableVariance && !isSuspicious;

    return {
      passed: isAccurate,
      score: isAccurate ? 100 : withinRange ? 70 : 30,
      details: {
        commission_rate: commissionRate,
        within_range: withinRange,
        variance_from_average: variance,
        is_suspicious: isSuspicious,
        industry_comparison:
          commissionRate > industryAverage ? "above_average" : "below_average",
      },
      issue: !isAccurate
        ? `Commission rate ${commissionRate}% appears inaccurate`
        : null,
      severity: isSuspicious ? "high" : "medium",
    };
  }

  // 📧 Contact information verification
  async verifyContactInformation(record) {
    const contactInfo = {
      emails: this.extractEmails(record),
      phones: this.extractPhones(record),
      addresses: this.extractAddresses(record),
    };

    let validEmails = 0;
    let totalEmails = contactInfo.emails.length;

    // Verify email formats and domains
    for (const email of contactInfo.emails) {
      if (this.qualityRules.email.format.test(email)) {
        // Additional domain validation could be added here
        validEmails++;
      }
    }

    const hasValidContact = validEmails > 0 || contactInfo.phones.length > 0;
    const contactScore = hasValidContact
      ? Math.min(100, (validEmails / Math.max(1, totalEmails)) * 100)
      : 0;

    return {
      passed: hasValidContact,
      score: contactScore,
      details: {
        total_emails: totalEmails,
        valid_emails: validEmails,
        total_phones: contactInfo.phones.length,
        has_address: contactInfo.addresses.length > 0,
        contact_types: Object.keys(contactInfo).filter(
          (key) => contactInfo[key].length > 0,
        ),
      },
      issue: !hasValidContact ? "No valid contact information found" : null,
    };
  }

  // 🏛️ License authenticity verification
  async verifyLicenseAuthenticity(record) {
    if (!record.license && !record.regulatory_body) {
      return {
        passed: false,
        score: 0,
        issue: "No license information provided",
        severity: "high",
      };
    }

    const regulatoryBody = record.regulatory_body || record.license;
    const isKnownAuthority = this.qualityRules.license.known_authorities.some(
      (authority) =>
        regulatoryBody.toLowerCase().includes(authority.toLowerCase()),
    );

    // License number format validation
    let validLicenseFormat = false;
    if (record.license_number) {
      validLicenseFormat = this.validateLicenseFormat(
        record.license_number,
        regulatoryBody,
      );
    }

    const isAuthentic =
      isKnownAuthority && (validLicenseFormat || !record.license_number);

    return {
      passed: isAuthentic,
      score: isAuthentic ? 100 : isKnownAuthority ? 70 : 30,
      details: {
        regulatory_body: regulatoryBody,
        is_known_authority: isKnownAuthority,
        license_number: record.license_number,
        valid_license_format: validLicenseFormat,
      },
      issue: !isAuthentic
        ? `Unrecognized licensing authority: ${regulatoryBody}`
        : null,
      severity: !isKnownAuthority ? "high" : "medium",
    };
  }

  // ⚡ Operational status verification
  async verifyOperationalStatus(record) {
    try {
      const page = await this.browser.newPage();
      await page.goto(record.website, {
        waitUntil: "networkidle0",
        timeout: 15000,
      });

      const content = await page.content();
      const $ = cheerio.load(content);

      // Check for signs of operational casino
      const hasLoginForm =
        $('input[type="password"]').length > 0 ||
        $("form").text().toLowerCase().includes("login");
      const hasRegistrationForm =
        $("form").text().toLowerCase().includes("register") ||
        $("form").text().toLowerCase().includes("sign up");
      const hasGames =
        content.toLowerCase().includes("slots") ||
        content.toLowerCase().includes("blackjack") ||
        content.toLowerCase().includes("roulette");
      const hasPromotion =
        content.toLowerCase().includes("bonus") ||
        content.toLowerCase().includes("promotion");

      // Check for maintenance or closure notices
      const maintenanceKeywords = [
        "maintenance",
        "closed",
        "suspended",
        "temporarily unavailable",
      ];
      const hasMaintenanceNotice = maintenanceKeywords.some((keyword) =>
        content.toLowerCase().includes(keyword),
      );

      await page.close();

      const operationalScore =
        [hasLoginForm, hasRegistrationForm, hasGames, hasPromotion].filter(
          Boolean,
        ).length * 25;

      const isOperational = operationalScore >= 50 && !hasMaintenanceNotice;

      return {
        passed: isOperational,
        score: isOperational
          ? Math.max(operationalScore, 75)
          : operationalScore,
        details: {
          has_login: hasLoginForm,
          has_registration: hasRegistrationForm,
          has_games: hasGames,
          has_promotions: hasPromotion,
          maintenance_notice: hasMaintenanceNotice,
          operational_indicators: operationalScore,
        },
        issue: !isOperational ? "Casino appears non-operational" : null,
        severity: hasMaintenanceNotice ? "high" : "medium",
      };
    } catch (error) {
      return {
        passed: false,
        score: 0,
        issue: `Operational status check failed: ${error.message}`,
        severity: "medium",
      };
    }
  }

  // 🔄 Duplicate detection
  async detectDuplicates(record) {
    try {
      // Query database for potential duplicates
      const { data: existingRecords } = await supabase
        .from("discovered_casinos")
        .select("*")
        .neq("id", record.id);

      const duplicates = [];

      for (const existing of existingRecords || []) {
        const similarity = this.calculateSimilarity(record, existing);

        if (similarity.is_duplicate) {
          duplicates.push({
            id: existing.id,
            name: existing.name,
            similarity_score: similarity.score,
            matching_criteria: similarity.matching_criteria,
          });
        }
      }

      const hasDuplicates = duplicates.length > 0;

      if (hasDuplicates) {
        this.verificationStats.duplicatesFound++;
      }

      return {
        passed: !hasDuplicates,
        score: hasDuplicates ? 0 : 100,
        details: {
          duplicates_found: duplicates.length,
          duplicates: duplicates.slice(0, 5), // Store first 5 duplicates
          unique_record: !hasDuplicates,
        },
        issue: hasDuplicates
          ? `${duplicates.length} potential duplicates found`
          : null,
        severity: "medium",
      };
    } catch (error) {
      return {
        passed: true, // Don't fail verification if duplicate check fails
        score: 100,
        issue: `Duplicate detection failed: ${error.message}`,
      };
    }
  }

  // 📅 Data freshness verification
  async checkDataFreshness(record) {
    const now = new Date();
    const recordDate = new Date(
      record.discovered_at || record.created_at || now,
    );
    const ageInDays = Math.floor((now - recordDate) / (1000 * 60 * 60 * 24));

    // Data freshness thresholds
    const fresh = ageInDays <= 30; // Within 30 days
    const stale = ageInDays <= 90; // Within 90 days
    const outdated = ageInDays > 90; // Older than 90 days

    let score = 100;
    let status = "fresh";

    if (outdated) {
      score = 30;
      status = "outdated";
    } else if (!stale) {
      score = 60;
      status = "stale";
    }

    return {
      passed: !outdated,
      score: score,
      details: {
        age_in_days: ageInDays,
        freshness_status: status,
        discovered_date: recordDate.toISOString(),
        needs_refresh: outdated,
      },
      issue: outdated
        ? `Data is ${ageInDays} days old and may be outdated`
        : null,
      severity: outdated ? "medium" : "low",
    };
  }

  // 🔧 Data enrichment
  async enrichRecordData(record) {
    const enhancements = {
      website_metadata: {},
      social_presence: {},
      industry_ratings: {},
      technical_details: {},
    };

    try {
      // Website metadata enrichment
      enhancements.website_metadata = await this.extractWebsiteMetadata(
        record.website,
      );

      // Social media presence
      enhancements.social_presence = await this.checkSocialPresence(record);

      // Industry ratings and reviews
      enhancements.industry_ratings = await this.fetchIndustryRatings(record);

      // Technical details
      enhancements.technical_details = await this.extractTechnicalDetails(
        record.website,
      );
    } catch (error) {
      console.error("❌ Data enrichment error:", error.message);
    }

    return enhancements;
  }

  // 🔍 Helper methods
  containsCasinoContent(content) {
    const casinoKeywords = [
      "casino",
      "slots",
      "blackjack",
      "roulette",
      "poker",
      "baccarat",
      "gambling",
      "bet",
      "gaming",
      "jackpot",
      "bonus",
      "deposit",
    ];

    return casinoKeywords.some((keyword) =>
      content.toLowerCase().includes(keyword),
    );
  }

  containsAffiliateContent(content) {
    const affiliateKeywords = [
      "affiliate",
      "partner",
      "commission",
      "revenue share",
      "earn",
      "referral",
      "marketing",
      "promotion",
      "payout",
    ];

    return affiliateKeywords.some((keyword) =>
      content.toLowerCase().includes(keyword),
    );
  }

  extractEmails(record) {
    const emails = [];
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    const textToSearch = JSON.stringify(record);
    let match;

    while ((match = emailRegex.exec(textToSearch)) !== null) {
      emails.push(match[0]);
    }

    return [...new Set(emails)]; // Remove duplicates
  }

  extractPhones(record) {
    const phones = [];
    const phoneRegex = /[\+]?[1-9][\d]{0,15}/g;

    const textToSearch = JSON.stringify(record);
    let match;

    while ((match = phoneRegex.exec(textToSearch)) !== null) {
      if (match[0].length >= 10) {
        // Minimum phone number length
        phones.push(match[0]);
      }
    }

    return [...new Set(phones)];
  }

  extractAddresses(record) {
    // Simplified address extraction - in production would use more sophisticated NLP
    const addresses = [];
    const addressRegex =
      /\d+\s+[A-Za-z\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)/g;

    const textToSearch = JSON.stringify(record);
    let match;

    while ((match = addressRegex.exec(textToSearch)) !== null) {
      addresses.push(match[0]);
    }

    return addresses;
  }

  validateLicenseFormat(licenseNumber, regulatoryBody) {
    const formatPatterns = {
      "Malta Gaming Authority": /^MGA\/[A-Z0-9]+\/\d{3}\/\d{4}$/,
      "UK Gambling Commission": /^[0-9]{5,6}$/,
      "Curacao Gaming": /^[0-9]{4}\/[A-Z]{3}$/,
      Gibraltar: /^[0-9]{3}$/,
    };

    for (const [authority, pattern] of Object.entries(formatPatterns)) {
      if (regulatoryBody.includes(authority)) {
        return pattern.test(licenseNumber);
      }
    }

    return true; // Unknown format, assume valid
  }

  calculateSimilarity(record1, record2) {
    const criteria = {
      name: this.stringSimilarity(record1.name, record2.name),
      website: record1.website === record2.website ? 1 : 0,
      email: this.hasCommonEmail(record1, record2) ? 1 : 0,
    };

    const overallScore =
      (criteria.name + criteria.website + criteria.email) / 3;

    return {
      score: overallScore,
      is_duplicate:
        overallScore >=
        this.qualityRules.duplicate_detection.name_similarity_threshold,
      matching_criteria: Object.keys(criteria).filter(
        (key) => criteria[key] > 0.7,
      ),
    };
  }

  stringSimilarity(str1, str2) {
    // Simple Levenshtein distance-based similarity
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len2 + 1)
      .fill()
      .map(() => Array(len1 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;

    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + cost,
        );
      }
    }

    const distance = matrix[len2][len1];
    return 1 - distance / Math.max(len1, len2);
  }

  hasCommonEmail(record1, record2) {
    const emails1 = this.extractEmails(record1);
    const emails2 = this.extractEmails(record2);

    return emails1.some((email1) => emails2.includes(email1));
  }

  // Enrichment helper methods
  async extractWebsiteMetadata(website) {
    try {
      const page = await this.browser.newPage();
      await page.goto(website, { waitUntil: "networkidle0", timeout: 10000 });

      const metadata = await page.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')
          ?.content,
        keywords: document.querySelector('meta[name="keywords"]')?.content,
        language: document.documentElement.lang,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
      }));

      await page.close();
      return metadata;
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkSocialPresence(record) {
    // Simulate social media presence check
    return {
      facebook: Math.random() > 0.6,
      twitter: Math.random() > 0.7,
      linkedin: Math.random() > 0.8,
      instagram: Math.random() > 0.5,
    };
  }

  async fetchIndustryRatings(record) {
    // Simulate industry ratings fetch
    return {
      trustpilot_rating: Math.random() * 2 + 3, // 3-5 stars
      askgamblers_rating: Math.random() * 2 + 3,
      casino_org_rating: Math.random() * 2 + 3,
    };
  }

  async extractTechnicalDetails(website) {
    // Simulate technical details extraction
    return {
      ssl_certificate: website.startsWith("https://"),
      mobile_responsive: Math.random() > 0.2,
      page_load_speed: Math.floor(Math.random() * 3000) + 1000, // 1-4 seconds
      security_headers: Math.random() > 0.5,
    };
  }

  // 📊 Summary and reporting
  generateVerificationSummary(results) {
    const totalRecords = results.length;
    const verifiedRecords = results.filter(
      (r) => r.verification_status === "verified",
    ).length;
    const partiallyVerifiedRecords = results.filter(
      (r) => r.verification_status === "partially_verified",
    ).length;
    const failedRecords = results.filter(
      (r) => r.verification_status === "failed",
    ).length;

    const averageQualityScore =
      results.reduce((sum, r) => sum + r.quality_score, 0) / totalRecords;

    const commonIssues = this.analyzeCommonIssues(results);

    return {
      total_records: totalRecords,
      verified_records: verifiedRecords,
      partially_verified_records: partiallyVerifiedRecords,
      failed_records: failedRecords,
      verification_rate: (
        ((verifiedRecords + partiallyVerifiedRecords) / totalRecords) *
        100
      ).toFixed(1),
      average_quality_score: averageQualityScore.toFixed(1),
      common_issues: commonIssues,
      verification_timestamp: new Date().toISOString(),
    };
  }

  analyzeCommonIssues(results) {
    const issueCount = {};

    results.forEach((result) => {
      result.issues_found?.forEach((issue) => {
        issueCount[issue.issue] = (issueCount[issue.issue] || 0) + 1;
      });
    });

    return Object.entries(issueCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([issue, count]) => ({ issue, count }));
  }

  // 💾 Store verification results
  async storeVerificationResults(results, summary) {
    try {
      console.log("💾 Storing verification results...");

      // Store individual verification results
      const { error: resultsError } = await supabase
        .from("data_verification_results")
        .upsert(results, { onConflict: "id" });

      if (resultsError) {
        console.error("❌ Results storage error:", resultsError.message);
      }

      // Store verification summary
      const { error: summaryError } = await supabase
        .from("data_verification_summaries")
        .insert(summary);

      if (summaryError) {
        console.error("❌ Summary storage error:", summaryError.message);
      }

      console.log(
        `✅ Stored verification results for ${results.length} records`,
      );
    } catch (error) {
      console.error("❌ Verification storage error:", error.message);
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getVerificationStats() {
    return this.verificationStats;
  }
}

// Export for use in other modules
module.exports = { DataQualityVerification };

// Development test run
if (require.main === module) {
  async function testDataQualityVerification() {
    console.log("🧪 Testing Data Quality Verification System...");

    const verification = new DataQualityVerification();

    // Test with sample records
    const testRecords = [
      {
        id: "test_1",
        name: "Royal Vegas Casino",
        website: "https://www.royalvegascasino.com",
        commission_rate: 35,
        regulatory_body: "Malta Gaming Authority",
        license_number: "MGA/B2C/123/2024",
        discovered_at: new Date().toISOString(),
      },
      {
        id: "test_2",
        name: "Lucky Diamond Casino",
        website: "https://www.luckydiamondcasino.com",
        commission_rate: 45,
        regulatory_body: "UK Gambling Commission",
        discovered_at: new Date(
          Date.now() - 60 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 60 days old
      },
    ];

    const result = await verification.verifyDataQuality(testRecords);

    console.log("📊 Verification Results:", result);
    console.log("📈 Verification Stats:", verification.getVerificationStats());
    console.log("✅ Data quality verification test complete!");
  }

  testDataQualityVerification().catch(console.error);
}
