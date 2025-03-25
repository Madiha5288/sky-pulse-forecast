
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherIcon } from "@/components/WeatherIcon";
import { cn } from "@/lib/utils";

interface CurrentWeatherProps {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  className?: string;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  location,
  temperature,
  feelsLike,
  condition,
  humidity,
  windSpeed,
  className,
}) => {
  const getConditionName = (condition: string) => {
    switch (condition) {
      case "clear-day":
        return "Clear";
      case "clear-night":
        return "Clear Night";
      case "cloudy":
        return "Cloudy";
      case "rain":
        return "Rainy";
      case "thunderstorm":
        return "Thunderstorm";
      case "snow":
        return "Snowy";
      case "mist":
        return "Misty";
      case "windy":
        return "Windy";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden glass-card animate-fade-in",
      "backdrop-blur-lg bg-white/20 border-white/30",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-balance">{location}</h2>
            <p className="text-sm text-foreground/70">{getConditionName(condition)}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <WeatherIcon condition={condition as any} size={64} />
            <div className="text-right">
              <p className="text-5xl font-bold text-shadow-sm">{temperature}°</p>
              <p className="text-sm text-foreground/70">Feels like {feelsLike}°</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex flex-col items-center p-3 bg-white/30 rounded-lg">
            <span className="text-sm text-foreground/70">Humidity</span>
            <span className="text-xl font-medium">{humidity}%</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white/30 rounded-lg">
            <span className="text-sm text-foreground/70">Wind Speed</span>
            <span className="text-xl font-medium">{windSpeed} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
