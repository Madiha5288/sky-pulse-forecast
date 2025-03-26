
import React, { useEffect, useState } from "react";
import { CurrentWeather } from "@/components/CurrentWeather";
import { WeatherForecast } from "@/components/WeatherForecast";
import { HourlyForecast } from "@/components/HourlyForecast";
import { SearchBar } from "@/components/SearchBar";
import { fetchWeatherData, WeatherData } from "@/utils/weatherUtils";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    if (!weatherData) return "weather-bg-clear-day";
    return `weather-bg-${weatherData.current.condition}`;
  };

  return (
    <div className={getWeatherBackground()}>
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="text-center mb-6 md:mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white text-shadow">Weather Forecast</h1>
            <p className="text-base md:text-lg text-white/90 text-shadow-sm">Get accurate weather information instantly</p>
          </div>
          
          <SearchBar onSearch={handleSearch} className="mx-auto mb-6 md:mb-8" />
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px] md:min-h-[300px]">
              <div className="animate-pulse-slow text-center text-white">
                <p className="text-lg">Loading weather data...</p>
              </div>
            </div>
          ) : weatherData ? (
            <div className={`space-y-5 md:space-y-8 ${isMobile ? 'pb-10' : ''}`}>
              <CurrentWeather 
                location={weatherData.location}
                temperature={weatherData.current.temperature}
                feelsLike={weatherData.current.feelsLike}
                condition={weatherData.current.condition}
                humidity={weatherData.current.humidity}
                windSpeed={weatherData.current.windSpeed}
              />
              
              <HourlyForecast hourlyForecast={weatherData.hourlyForecast} />
              
              <WeatherForecast forecast={weatherData.forecast} />
            </div>
          ) : (
            <div className="text-center text-white">
              <p>No weather data available. Please try searching for a location.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
