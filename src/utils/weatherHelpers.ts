
// Helper utilities for weather data

import { WeatherData } from './weatherTypes';
import { getOutfitSuggestion } from './outfitSuggestion';

// Create fallback data if the API fails
export const createFallbackData = (location: string): WeatherData => {
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
