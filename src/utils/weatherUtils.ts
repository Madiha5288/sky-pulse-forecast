// Weather utility functions for fetching and processing weather data

export interface WeatherData {
  location: string;
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: Array<{
    date: string;
    temperature: number;
    condition: string;
  }>;
  hourlyForecast: Array<{
    time: string;
    temperature: number;
    condition: string;
  }>;
  outfitSuggestion: {
    clothing: string[];
    accessories: string[];
    advice: string;
  };
}

// Map OpenWeatherMap condition codes to our app's condition types
const mapWeatherCondition = (conditionCode: number, isDay: boolean = true): string => {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (conditionCode >= 200 && conditionCode < 300) {
    return 'thunderstorm';
  }
  if (conditionCode >= 300 && conditionCode < 400) {
    return 'rain'; // drizzle maps to rain
  }
  if (conditionCode >= 500 && conditionCode < 600) {
    return 'rain';
  }
  if (conditionCode >= 600 && conditionCode < 700) {
    return 'snow';
  }
  if (conditionCode >= 700 && conditionCode < 800) {
    return 'mist';
  }
  if (conditionCode === 800) {
    return isDay ? 'clear-day' : 'clear-night';
  }
  if (conditionCode > 800 && conditionCode < 900) {
    return 'cloudy';
  }
  
  return isDay ? 'clear-day' : 'clear-night'; // Default
};

// Format the date for the forecast
const formatDay = (timestamp: number, index: number): string => {
  if (index === 0) return 'Today';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Format the time for hourly forecast
const formatTime = (timestamp: number, index: number): string => {
  if (index === 0) return 'Now';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
};

// Generate outfit suggestions based on weather conditions
export const getOutfitSuggestion = (
  temperature: number,
  condition: string,
  windSpeed: number
): { clothing: string[]; accessories: string[]; advice: string } => {
  const clothing: string[] = [];
  const accessories: string[] = [];
  let advice = "";

  // Temperature-based clothing
  if (temperature <= 0) {
    clothing.push("Heavy winter coat", "Thermal underwear", "Sweater", "Winter pants");
    accessories.push("Warm hat", "Insulated gloves", "Thick scarf", "Warm boots");
    advice = "Layer up! It's freezing outside.";
  } else if (temperature <= 10) {
    clothing.push("Winter coat", "Sweater", "Long-sleeve shirt", "Jeans or warm pants");
    accessories.push("Light gloves", "Beanie or hat");
    advice = "It's quite cold, dress warmly.";
  } else if (temperature <= 20) {
    clothing.push("Light jacket or hoodie", "Long-sleeve shirt", "Jeans or pants");
    if (temperature < 15) {
      accessories.push("Light scarf");
    }
    advice = "Cool weather, a light jacket should be sufficient.";
  } else if (temperature <= 25) {
    clothing.push("T-shirt", "Light pants or jeans");
    advice = "Pleasant temperature, dress comfortably.";
  } else {
    clothing.push("T-shirt", "Shorts or light pants");
    accessories.push("Sunglasses", "Hat");
    advice = "Hot weather, dress light and stay hydrated!";
  }

  // Condition-based adjustments
  if (condition.includes("rain")) {
    clothing.push("Waterproof jacket");
    accessories.push("Umbrella");
    advice += " Don't forget rain protection!";
  } else if (condition.includes("thunderstorm")) {
    clothing.push("Waterproof jacket");
    accessories.push("Umbrella");
    advice += " Severe weather expected. Consider staying indoors if possible.";
  } else if (condition.includes("snow")) {
    clothing.push("Waterproof boots");
    accessories.push("Warm socks");
    advice += " Watch out for slippery surfaces.";
  } else if (condition.includes("clear") && temperature > 20) {
    accessories.push("Sunscreen");
    advice += " Apply sunscreen to protect your skin.";
  }

  // Wind-based adjustments
  if (windSpeed > 20) {
    accessories.push("Windbreaker");
    advice += " It's windy outside, secure loose clothing.";
  }

  return { clothing, accessories, advice };
};

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
    
    // Process current weather
    const currentData = data.current;
    const isDay = currentData.dt > data.current.sunrise && currentData.dt < data.current.sunset;
    
    const current = {
      temperature: Math.round(currentData.temp),
      feelsLike: Math.round(currentData.feels_like),
      condition: mapWeatherCondition(currentData.weather[0].id, isDay),
      humidity: currentData.humidity,
      windSpeed: Math.round(currentData.wind_speed * 3.6), // Convert m/s to km/h
    };
    
    // Process daily forecast (get one entry per day)
    const dailyForecasts = data.daily.slice(0, 7).map((day: any, index: number) => ({
      date: formatDay(day.dt, index),
      temperature: Math.round(day.temp.day),
      condition: mapWeatherCondition(day.weather[0].id)
    }));
    
    // Process hourly forecast (first 9 entries)
    const hourlyForecasts = data.hourly.slice(0, 9).map((hour: any, index: number) => ({
      time: formatTime(hour.dt, index),
      temperature: Math.round(hour.temp),
      condition: mapWeatherCondition(hour.weather[0].id)
    }));
    
    // Generate outfit suggestion based on current weather
    const outfitSuggestion = getOutfitSuggestion(
      current.temperature,
      current.condition,
      current.windSpeed
    );
    
    return {
      location: data.location,
      current,
      forecast: dailyForecasts,
      hourlyForecast: hourlyForecasts,
      outfitSuggestion
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Fall back to mock data with randomized humidity and wind speed
    return createFallbackData(location);
  }
};

// Create fallback data if the API fails
const createFallbackData = (location: string): WeatherData => {
  const conditions = ["clear-day", "clear-night", "cloudy", "rain", "thunderstorm", "snow", "mist", "windy"];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomTemp = Math.floor(Math.random() * 15) + 15; // 15-30 degrees
  const randomWindSpeed = Math.floor(Math.random() * 20) + 5; // 5-25 km/h
  
  const weatherData = {
    location,
    current: {
      temperature: randomTemp,
      feelsLike: randomTemp + (Math.random() > 0.5 ? 1 : -1),
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
      windSpeed: randomWindSpeed,
    },
    forecast: Array(7).fill(null).map((_, i) => ({
      date: i === 0 ? "Today" : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i-1],
      temperature: randomTemp + Math.floor(Math.random() * 7) - 3,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
    })),
    hourlyForecast: Array(9).fill(null).map((_, i) => ({
      time: i === 0 ? "Now" : `${(9 + i) % 12 || 12} ${9 + i >= 12 ? 'PM' : 'AM'}`,
      temperature: randomTemp + Math.floor(Math.random() * 5) - 2,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
    })),
    outfitSuggestion: getOutfitSuggestion(
      randomTemp,
      randomCondition,
      randomWindSpeed
    )
  };
  
  return weatherData;
};

export const getRandomCondition = (): string => {
  const conditions = [
    "clear-day", 
    "clear-night", 
    "cloudy", 
    "rain", 
    "thunderstorm", 
    "snow", 
    "mist",
    "windy"
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

export const getRandomTemperature = (min: number = 15, max: number = 30): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
