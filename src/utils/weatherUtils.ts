
// For demonstration, we'll create mock data functions
// In a real app, these would fetch from a weather API

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

const mockWeatherData: WeatherData = {
  location: "San Francisco, CA",
  current: {
    temperature: 21,
    feelsLike: 22,
    condition: "clear-day",
    humidity: 65,
    windSpeed: 12,
  },
  forecast: [
    { date: "Today", temperature: 21, condition: "clear-day" },
    { date: "Mon", temperature: 22, condition: "clear-day" },
    { date: "Tue", temperature: 20, condition: "cloudy" },
    { date: "Wed", temperature: 19, condition: "rain" },
    { date: "Thu", temperature: 18, condition: "rain" },
    { date: "Fri", temperature: 20, condition: "cloudy" },
    { date: "Sat", temperature: 22, condition: "clear-day" },
  ],
  hourlyForecast: [
    { time: "Now", temperature: 21, condition: "clear-day" },
    { time: "10 AM", temperature: 22, condition: "clear-day" },
    { time: "11 AM", temperature: 23, condition: "clear-day" },
    { time: "12 PM", temperature: 24, condition: "cloudy" },
    { time: "1 PM", temperature: 24, condition: "cloudy" },
    { time: "2 PM", temperature: 23, condition: "rain" },
    { time: "3 PM", temperature: 22, condition: "rain" },
    { time: "4 PM", temperature: 21, condition: "cloudy" },
    { time: "5 PM", temperature: 20, condition: "clear-day" },
  ]
};

// In a real app, this would fetch from an API
export const fetchWeatherData = (location: string): Promise<WeatherData> => {
  console.log(`Fetching weather data for: ${location}`);
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const customData = {...mockWeatherData};
      customData.location = location || mockWeatherData.location;
      
      // Randomize the condition to show different backgrounds
      const conditions = ["clear-day", "clear-night", "cloudy", "rain", "thunderstorm", "snow", "mist", "windy"];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      customData.current.condition = randomCondition;
      
      resolve(customData);
    }, 500);
  });
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
