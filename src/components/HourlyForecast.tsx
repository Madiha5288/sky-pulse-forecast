
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherCard } from "@/components/WeatherCard";
import { cn } from "@/lib/utils";

interface HourlyForecastItem {
  time: string;
  temperature: number;
  condition: string;
}

interface HourlyForecastProps {
  hourlyForecast: HourlyForecastItem[];
  className?: string;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ 
  hourlyForecast, 
  className 
}) => {
  return (
    <Card className={cn(
      "overflow-hidden glass-card animate-fade-in delay-200",
      "backdrop-blur-lg bg-white/20 border-white/30",
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
          {hourlyForecast.map((hour, index) => (
            <WeatherCard
              key={hour.time}
              date={hour.time}
              temperature={hour.temperature}
              condition={hour.condition}
              isCurrentDay={index === 0}
              className="min-w-[90px] animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
