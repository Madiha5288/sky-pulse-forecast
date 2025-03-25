
import React, { useEffect, useState } from "react";
import { CurrentWeather } from "@/components/CurrentWeather";
import { WeatherForecast } from "@/components/WeatherForecast";
import { SearchBar } from "@/components/SearchBar";
import { fetchWeatherData, WeatherData } from "@/utils/weatherUtils";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchWeather = async (location?: string) => {
    try {
      setIsLoading(true);
      const data = await fetchWeatherData(location || "San Francisco, CA");
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleSearch = (location: string) => {
    fetchWeather(location);
    toast({
      title: "Location updated",
      description: `Weather data for ${location}`,
    });
  };

  const getWeatherBackground = () => {
    if (!weatherData) return "bg-blue-50";
    
    switch (weatherData.current.condition) {
      case "clear-day":
        return "bg-gradient-to-b from-blue-300 to-blue-100";
      case "clear-night":
        return "bg-gradient-to-b from-indigo-900 to-indigo-700";
      case "cloudy":
        return "bg-gradient-to-b from-gray-300 to-gray-100";
      case "rain":
        return "bg-gradient-to-b from-blue-600 to-blue-400";
      case "thunderstorm":
        return "bg-gradient-to-b from-purple-900 to-purple-700";
      case "snow":
        return "bg-gradient-to-b from-blue-50 to-gray-100";
      case "mist":
        return "bg-gradient-to-b from-indigo-100 to-gray-200";
      default:
        return "bg-gradient-to-b from-blue-300 to-blue-100";
    }
  };

  return (
    <div className={`min-h-screen ${getWeatherBackground()} transition-colors duration-1000`}>
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Weather Forecast</h1>
            <p className="text-lg text-foreground/80">Get accurate weather information instantly</p>
          </div>
          
          <SearchBar onSearch={handleSearch} className="mx-auto mb-8" />
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-pulse-slow text-center">
                <p className="text-lg">Loading weather data...</p>
              </div>
            </div>
          ) : weatherData ? (
            <div className="space-y-8">
              <CurrentWeather 
                location={weatherData.location}
                temperature={weatherData.current.temperature}
                feelsLike={weatherData.current.feelsLike}
                condition={weatherData.current.condition}
                humidity={weatherData.current.humidity}
                windSpeed={weatherData.current.windSpeed}
              />
              
              <WeatherForecast forecast={weatherData.forecast} />
            </div>
          ) : (
            <div className="text-center">
              <p>No weather data available. Please try searching for a location.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
