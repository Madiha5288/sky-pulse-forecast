
// Helper functions for formatting weather data

// Map OpenWeatherMap condition codes to our app's condition types
export const mapWeatherCondition = (conditionCode: number, isDay: boolean = true): string => {
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
export const formatDay = (timestamp: number, index: number): string => {
  if (index === 0) return 'Today';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Format the time for hourly forecast
export const formatTime = (timestamp: number, index: number): string => {
  if (index === 0) return 'Now';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
};
