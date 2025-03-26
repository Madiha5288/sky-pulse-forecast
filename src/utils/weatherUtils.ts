
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
}

// Map OpenWeatherMap condition codes to our app's condition types
const mapWeatherCondition = (weatherId: number, isDay: boolean = true): string => {
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return 'thunderstorm';
  }
  // Drizzle or Rain
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return 'rain';
  }
  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return 'snow';
  }
  // Atmosphere (fog, mist, etc)
  if (weatherId >= 700 && weatherId < 800) {
    return 'mist';
  }
  // Clear
  if (weatherId === 800) {
    return isDay ? 'clear-day' : 'clear-night';
  }
  // Clouds
  if (weatherId > 800) {
    return 'cloudy';
  }
  
  return 'clear-day'; // Default
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

export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  console.log(`Fetching weather data for: ${location}`);
  
  try {
    // The API key is public and free-tier for demo purposes
    const API_KEY = "1c62688f67477865ecb9505d1c8c707d";
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`;
    
    // First get coordinates for the location
    const geoResponse = await fetch(geocodeUrl);
    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {
      throw new Error('Location not found');
    }
    
    const { lat, lon } = geoData[0];
    
    // Get current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const currentResponse = await fetch(currentUrl);
    const currentData = await currentResponse.json();
    
    // Get forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();
    
    // Check if data is valid
    if (!currentData || !forecastData) {
      throw new Error('Failed to fetch weather data');
    }
    
    // Process current weather
    const current = {
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      condition: mapWeatherCondition(currentData.weather[0].id, 
        currentData.dt > currentData.sys.sunrise && currentData.dt < currentData.sys.sunset),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
    };
    
    // Process daily forecast (get one entry per day)
    const dailyForecasts = [];
    const processedDays = new Set();
    
    for (let i = 0; i < forecastData.list.length; i++) {
      const item = forecastData.list[i];
      const day = new Date(item.dt * 1000).toDateString();
      
      if (!processedDays.has(day)) {
        processedDays.add(day);
        dailyForecasts.push({
          date: formatDay(item.dt, dailyForecasts.length),
          temperature: Math.round(item.main.temp),
          condition: mapWeatherCondition(item.weather[0].id)
        });
        
        if (dailyForecasts.length >= 7) break;
      }
    }
    
    // Process hourly forecast (first 9 entries)
    const hourlyForecasts = forecastData.list.slice(0, 9).map((item, index) => ({
      time: formatTime(item.dt, index),
      temperature: Math.round(item.main.temp),
      condition: mapWeatherCondition(item.weather[0].id)
    }));
    
    return {
      location: location,
      current,
      forecast: dailyForecasts,
      hourlyForecast: hourlyForecasts
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
  
  return {
    location,
    current: {
      temperature: randomTemp,
      feelsLike: randomTemp + (Math.random() > 0.5 ? 1 : -1),
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
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
