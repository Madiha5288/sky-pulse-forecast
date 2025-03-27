
// Functions for processing and formatting weather data
import { WeatherData } from './weatherTypes';
import { mapWeatherCondition, formatDay, formatTime } from './weatherFormatters';
import { getOutfitSuggestion } from './outfitSuggestion';

export const processWeatherData = (data: any): WeatherData => {
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
};
