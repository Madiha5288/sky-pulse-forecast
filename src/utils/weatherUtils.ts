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

// Map Visual Crossing condition codes to our app's condition types
const mapWeatherCondition = (condition: string, isDay: boolean = true): string => {
  const lcCondition = condition.toLowerCase();
  
  if (lcCondition.includes('thunder') || lcCondition.includes('tstorm')) {
    return 'thunderstorm';
  }
  if (lcCondition.includes('rain') || lcCondition.includes('shower') || lcCondition.includes('drizzle')) {
    return 'rain';
  }
  if (lcCondition.includes('snow') || lcCondition.includes('flurr') || lcCondition.includes('ice')) {
    return 'snow';
  }
  if (lcCondition.includes('fog') || lcCondition.includes('mist') || lcCondition.includes('haz')) {
    return 'mist';
  }
  if (lcCondition.includes('clear')) {
    return isDay ? 'clear-day' : 'clear-night';
  }
  if (lcCondition.includes('cloud') || lcCondition.includes('overcast')) {
    return 'cloudy';
  }
  if (lcCondition.includes('wind')) {
    return 'windy';
  }
  
  return isDay ? 'clear-day' : 'clear-night'; // Default
};

// Format the date for the forecast
const formatDay = (dateStr: string, index: number): string => {
  if (index === 0) return 'Today';
  
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Format the time for hourly forecast
const formatTime = (timeStr: string, index: number): string => {
  if (index === 0) return 'Now';
  
  const date = new Date(timeStr);
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
    const encodedLocation = encodeURIComponent(location);
    const url = `https://visual-crossing-weather.p.rapidapi.com/forecast?aggregateHours=1&location=${encodedLocation}&contentType=json&unitGroup=metric&shortColumnNames=false`;
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '7a3fcdb816msh8578eb120aa3ea1p14a3eejsn4ce5db8259e8',
        'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!data || !data.locations || Object.keys(data.locations).length === 0) {
      throw new Error('Location not found');
    }
    
    const locationKey = Object.keys(data.locations)[0];
    const locationData = data.locations[locationKey];
    const valuesArray = locationData.values;
    
    if (!valuesArray || valuesArray.length === 0) {
      throw new Error('No weather data available');
    }
    
    // Process current weather (first entry in values)
    const currentData = valuesArray[0];
    const isDay = new Date().getHours() > 6 && new Date().getHours() < 18;
    
    const current = {
      temperature: Math.round(currentData.temp),
      feelsLike: Math.round(currentData.feelslike),
      condition: mapWeatherCondition(currentData.conditions, isDay),
      humidity: Math.round(currentData.humidity),
      windSpeed: Math.round(currentData.wspd),
    };
    
    // Process daily forecast (get one entry per day)
    const dailyForecasts = [];
    const processedDays = new Set();
    
    for (let i = 0; i < valuesArray.length; i++) {
      const item = valuesArray[i];
      const day = new Date(item.datetime).toDateString();
      
      if (!processedDays.has(day)) {
        processedDays.add(day);
        dailyForecasts.push({
          date: formatDay(item.datetime, dailyForecasts.length),
          temperature: Math.round(item.temp),
          condition: mapWeatherCondition(item.conditions)
        });
        
        if (dailyForecasts.length >= 7) break;
      }
    }
    
    // Process hourly forecast (first 9 entries)
    const hourlyForecasts = valuesArray.slice(0, 9).map((item, index) => ({
      time: formatTime(item.datetime, index),
      temperature: Math.round(item.temp),
      condition: mapWeatherCondition(item.conditions)
    }));
    
    // Generate outfit suggestion based on current weather
    const outfitSuggestion = getOutfitSuggestion(
      current.temperature,
      current.condition,
      current.windSpeed
    );
    
    return {
      location: locationData.address,
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
  };
  
  // Add outfit suggestion to mock data
  weatherData.outfitSuggestion = getOutfitSuggestion(
    weatherData.current.temperature,
    weatherData.current.condition,
    weatherData.current.windSpeed
  );
  
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
