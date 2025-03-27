
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Get the API key from environment variables
const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location } = await req.json()
    
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location parameter is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // First, get coordinates for the location
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${OPENWEATHER_API_KEY}`
    const geoResponse = await fetch(geoUrl)
    const geoData = await geoResponse.json()
    
    if (!geoData || geoData.length === 0 || geoData.cod === 401) {
      return new Response(
        JSON.stringify({ error: 'Location not found or API key invalid', details: geoData }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    const { lat, lon, name, country } = geoData[0]
    
    // Then, get current weather and forecast
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=${OPENWEATHER_API_KEY}`
    const weatherResponse = await fetch(weatherUrl)
    const weatherData = await weatherResponse.json()
    
    if (!weatherData || weatherData.cod === 401) {
      return new Response(
        JSON.stringify({ error: 'Weather data not available or API key invalid', details: weatherData }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Process and return the weather data
    // We'll do minimal processing here and let the frontend handle the rest
    return new Response(
      JSON.stringify({
        location: `${name}, ${country || ''}`,
        current: weatherData.current,
        daily: weatherData.daily,
        hourly: weatherData.hourly
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
