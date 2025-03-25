
import React from "react";
import { CloudRain, CloudSun, Moon, Sun, Thermometer, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

type WeatherCondition = 
  | "clear-day" 
  | "clear-night" 
  | "cloudy" 
  | "rain" 
  | "thunderstorm" 
  | "snow" 
  | "mist" 
  | "windy";

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  className,
  size = 24
}) => {
  const getIcon = () => {
    switch (condition) {
      case "clear-day":
        return <Sun size={size} className="text-yellow-400 animate-float" />;
      case "clear-night":
        return <Moon size={size} className="text-gray-300 animate-float" />;
      case "cloudy":
        return <CloudSun size={size} className="text-gray-400 animate-float" />;
      case "rain":
        return <CloudRain size={size} className="text-blue-400 animate-float" />;
      case "thunderstorm":
        return <CloudRain size={size} className="text-purple-500 animate-float" />;
      case "snow":
        return <CloudRain size={size} className="text-blue-100 animate-float" />;
      case "mist":
        return <CloudSun size={size} className="text-gray-300 animate-float" />;
      case "windy":
        return <Wind size={size} className="text-gray-500 animate-float" />;
      default:
        return <Thermometer size={size} className="text-gray-400 animate-float" />;
    }
  };

  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      {getIcon()}
    </div>
  );
};
