/**
 * FlowLync Affiliate API Endpoint
 * 
 * Next.js API route for affiliate program integration
 * Supports multiple affiliate networks with unified interface
 */

import { NextResponse } from 'next/server';

// Import our affiliate service (for future API integration)
const DEMO_MODE = true; // Set to false when API keys are available

// Enhanced demo data for immediate use
const enhancedAffiliateData = {
  networks: {
    shareasale: [
      {
        id: 'ss_001',
        name: 'BetMGM Casino',
        website: 'https://casino.betmgm.com',
        commission: '35-50%',
        rating: 4.8,
        vertical: 'Online Casino',
        network: 'ShareASale'
      },
      {
        id: 'ss_002',
        name: 'DraftKings Sportsbook',
        website: 'https://sportsbook.draftkings.com',
        commission: '25-40%',
        rating: 4.8,
        vertical: 'Sportsbook',
        network: 'ShareASale'
      }
    ],
    commissionjunction: [
      {
        id: 'cj_001',
        name: 'Caesars Palace Online',
        website: 'https://www.caesarscasino.com',
        commission: '30-45%',
        rating: 4.7,
        vertical: 'Online Casino',
        network: 'Commission Junction'
      },
      {
        id: 'cj_002',
        name: 'FanDuel Casino',
        website: 'https://casino.fanduel.com',
        commission: '25-40%',
        rating: 4.6,
        vertical: 'Online Casino',
        network: 'Commission Junction'
      }
    ],
    impactradius: [
      {
        id: 'ir_001',
        name: 'BetRivers Sportsbook',
        website: 'https://www.betrivers.com',
        commission: '30-45%',
        rating: 4.5,
        vertical: 'Sportsbook',
        network: 'Impact Radius'
      }
    ],
    direct: [
      {
        id: 'direct_001',
        name: 'Stake.com',
        website: 'https://stake.com',
        commission: '40-60%',
        rating: 4.8,
        vertical: 'Crypto Gambling',
        network: 'Direct Partnership'
      },
      {
        id: 'direct_002',
        name: 'BC.Game',
        website: 'https://bc.game',
        commission: '35-55%',
        rating: 4.7,
        vertical: 'Crypto Gambling',
        network: 'Direct Partnership'
      }
    ]
  }
};

// GET /api/affiliate-networks - Get all affiliate programs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network');
    const vertical = searchParams.get('vertical');
    const limit = parseInt(searchParams.get('limit') || '50');

    console.log('🚀 FlowLync Affiliate API called:', { network, vertical, limit });

    // In demo mode, use enhanced static data
    if (DEMO_MODE) {
      let allPrograms = [];
      
      // Collect all programs from all networks
      Object.values(enhancedAffiliateData.networks).forEach(networkPrograms => {
        allPrograms.push(...networkPrograms);
      });

      // Filter by network if specified
      if (network && enhancedAffiliateData.networks[network]) {
        allPrograms = enhancedAffiliateData.networks[network];
      }

      // Filter by vertical if specified
      if (vertical) {
        allPrograms = allPrograms.filter(program => 
          program.vertical.toLowerCase().includes(vertical.toLowerCase())
        );
      }

      // Apply limit
      allPrograms = allPrograms.slice(0, limit);

      const response = {
        success: true,
        mode: 'demo',
        total: allPrograms.length,
        programs: allPrograms,
        networks_available: Object.keys(enhancedAffiliateData.networks),
        verticals_available: [...new Set(allPrograms.map(p => p.vertical))],
        api_status: {
          shareasale: 'Ready for integration',
          commissionjunction: 'Ready for integration', 
          impactradius: 'Ready for integration',
          direct_partnerships: 'Active'
        }
      };

      return NextResponse.json(response);
    }

    // TODO: Real API integration when credentials are available
    // This would call the actual affiliate network APIs
    /*
    const affiliateService = new AffiliateAPIService();
    affiliateService.addNetwork('shareasale', {
      apiKey: process.env.SHAREASALE_API_KEY,
      affiliateId: process.env.SHAREASALE_AFFILIATE_ID
    });
    
    const programs = await affiliateService.getAllMerchants();
    */

    return NextResponse.json({
      success: false,
      message: 'Real API integration requires credentials',
      demo_available: true
    });

  } catch (error) {
    console.error('Affiliate API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST /api/affiliate-networks - Add new affiliate program or update existing
export async function POST(request) {
  try {
    const data = await request.json();
    console.log('📝 Adding new affiliate program:', data);

    // Validate required fields
    const required = ['name', 'website', 'vertical', 'commission'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}`
      }, { status: 400 });
    }

    // In demo mode, simulate adding to database
    if (DEMO_MODE) {
      const newProgram = {
        id: `custom_${Date.now()}`,
        name: data.name,
        website: data.website,
        commission: data.commission,
        rating: data.rating || 4.0,
        vertical: data.vertical,
        network: data.network || 'Custom Entry',
        added_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        mode: 'demo',
        message: 'Program added to demo database',
        program: newProgram
      });
    }

    // TODO: Real database integration
    return NextResponse.json({
      success: false,
      message: 'Real database integration not yet implemented'
    });

  } catch (error) {
    console.error('Affiliate POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// PUT /api/affiliate-networks - Sync with affiliate networks
export async function PUT(request) {
  try {
    const { action } = await request.json();
    console.log('🔄 Affiliate sync action:', action);

    if (action === 'sync_all') {
      // In demo mode, simulate sync
      if (DEMO_MODE) {
        const syncResults = {
          shareasale: { status: 'success', programs: 45, new: 12 },
          commissionjunction: { status: 'success', programs: 38, new: 8 },
          impactradius: { status: 'success', programs: 29, new: 5 },
          total_new: 25,
          total_updated: 15,
          sync_time: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          mode: 'demo',
          message: 'Demo sync completed',
          results: syncResults
        });
      }

      // TODO: Real sync implementation
      /*
      const affiliateService = new AffiliateAPIService();
      const results = await affiliateService.syncAllNetworks();
      */

      return NextResponse.json({
        success: false,
        message: 'Real sync requires API credentials'
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Unknown action'
    }, { status: 400 });

  } catch (error) {
    console.error('Affiliate sync error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}