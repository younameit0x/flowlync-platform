// Mock API for early access signups (working version)
// TODO: Replace with real Supabase once environment variables are configured
// Force deploy: 2025-01-27 14:30 UTC

export async function POST(request) {
  try {
    const { email, name, role, experience, company, investment_range } = await request.json()
    
    // Validate required fields
    if (!email || !email.includes('@')) {
      return Response.json(
        { error: 'Valid email is required' }, 
        { status: 400 }
      )
    }

    if (!name || name.trim().length < 2) {
      return Response.json(
        { error: 'Name is required (at least 2 characters)' }, 
        { status: 400 }
      )
    }

    // Role is now embedded in the form, so it should always be present
    const userRole = role || 'affiliate' // fallback to affiliate if not specified

    // Simulate successful database save
    // In production, this would save to Supabase database
    const mockUserData = {
      id: Date.now(), // Mock ID
      email: email.toLowerCase().trim(),
      name: name.trim(),
      role: userRole,
      experience,
      company,
      investment_range,
      created_at: new Date().toISOString()
    }

    // Log successful signup for monitoring (in production, this would go to database)
    console.log('✅ New FlowLync signup:', mockUserData)

    // Return success response
    return Response.json(
      { 
        message: 'Successfully joined FlowLync early access! 🎉',
        success: true,
        data: mockUserData 
      }, 
      { status: 200 }
    )
    
  } catch (error) {
    console.error('❌ Signup API error:', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' }, 
      { status: 500 }
    )
  }
}