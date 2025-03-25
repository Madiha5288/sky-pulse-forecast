
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherIcon } from "@/components/WeatherIcon";
import { cn } from "@/lib/utils";

interface WeatherCardProps {
  date: string;
  temperature: number;
  condition: string;
  className?: string;
  isCurrentDay?: boolean;
  style?: React.CSSProperties;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ 
  date, 
  temperature, 
  condition, 
  className,
  isCurrentDay = false,
  style
}) => {
  const getCardBackground = () => {
    switch (condition) {
      case "clear-day":
      case "clear-night":
        return "weather-gradient-clear";
      case "cloudy":
        return "weather-gradient-cloudy";
      case "rain":
        return "weather-gradient-rain";
      case "thunderstorm":
        return "weather-gradient-thunderstorm";
      case "snow":
        return "weather-gradient-snow";
      case "mist":
        return "weather-gradient-mist";
      default:
        return "weather-gradient-clear";
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg",
        isCurrentDay ? "border-2 border-primary shadow-md" : "border border-white/30",
        getCardBackground(),
        "glass-card",
        className
      )}
      style={style}
    >
      <CardContent className="p-4 flex flex-col items-center">
        <p className="text-sm font-medium text-foreground/80">{date}</p>
        <div className="my-2">
          <WeatherIcon 
            condition={condition as any} 
            size={isCurrentDay ? 48 : 32} 
            className="my-2"
          />
        </div>
        <p className={cn(
          "font-semibold",
          isCurrentDay ? "text-3xl" : "text-xl"
        )}>
          {temperature}°
        </p>
      </CardContent>
    </Card>
  );
};
