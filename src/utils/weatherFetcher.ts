
// Functions for fetching weather data
import { WeatherData } from './weatherTypes';
import { processWeatherData } from './weatherProcessor';
import { createFallbackData } from './weatherHelpers';

export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  console.log(`Fetching weather data for: ${location}`);
  
  try {
    // Use Supabase Edge Function to fetch weather data securely
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const apiEndpoint = `${supabaseUrl}/functions/v1/get-weather`;
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch weather data');
    }
    
    const data = await response.json();
    
    // Process and return the weather data
    return processWeatherData(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Fall back to mock data with randomized humidity and wind speed
    return createFallbackData(location);
  }
};
