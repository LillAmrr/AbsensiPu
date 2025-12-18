import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- Helper Function: Calculate Distance ---
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { location, faceMatch, userId } = await req.json();
    
    if (!location || typeof faceMatch !== 'boolean' || !userId) {
      return new Response(JSON.stringify({ error: 'Missing location, faceMatch, or userId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Verify Face Match
    if (!faceMatch) {
      return new Response(JSON.stringify({ error: 'Face verification failed.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Fetch active office location from the database
    const { data: officeLocation, error: locationError } = await supabaseClient
      .from('attendance_locations')
      .select('latitude, longitude, radius_meters')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (locationError || !officeLocation) {
      throw new Error("Could not find an active office location. Please configure one in the 'attendance_locations' table.");
    }
    
    // 3. Verify Location
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      officeLocation.latitude,
      officeLocation.longitude
    );

    if (distance > officeLocation.radius_meters) {
      return new Response(JSON.stringify({ error: `You are ${Math.round(distance)} meters away. You must be within ${officeLocation.radius_meters} meters of the office to check in.` }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // 4. Check if user has already checked in today
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const { data: existingCheckIn, error: checkInError } = await supabaseClient
      .from('attendance_records')
      .select('id')
      .eq('user_id', userId)
      .gte('check_in', `${today}T00:00:00.000Z`)
      .lte('check_in', `${today}T23:59:59.999Z`)
      .single();

    if (checkInError && checkInError.code !== 'PGRST116') { // PGRST116 = 'no rows found'
      throw checkInError;
    }

    if (existingCheckIn) {
      return new Response(JSON.stringify({ error: 'You have already checked in today.' }), {
        status: 409, // Conflict
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Insert new attendance record
    const { data, error } = await supabaseClient
      .from('attendance_records')
      .insert({
        user_id: userId,
        check_in: new Date().toISOString(),
        latitude: location.latitude,
        longitude: location.longitude,
        face_verified: true,
        status: 'present',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, attendanceRecord: data }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-attendance function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});