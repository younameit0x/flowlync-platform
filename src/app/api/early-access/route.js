import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const { email, name, role } = await request.json()
    
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

    if (!role) {
      return Response.json(
        { error: 'Please select your role' }, 
        { status: 400 }
      )
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('early_access_signups')
      .insert([
        { 
          email: email.toLowerCase().trim(),
          name: name.trim(),
          role: role,
          created_at: new Date().toISOString()
        }
      ])

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { error: 'Failed to save signup' }, 
        { status: 500 }
      )
    }

    return Response.json(
      { message: 'Successfully joined early access!', data }, 
      { status: 200 }
    )

  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}