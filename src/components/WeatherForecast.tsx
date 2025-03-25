
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherCard } from "@/components/WeatherCard";
import { cn } from "@/lib/utils";

interface ForecastDay {
  date: string;
  temperature: number;
  condition: string;
}

interface WeatherForecastProps {
  forecast: ForecastDay[];
  className?: string;
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ 
  forecast, 
  className 
}) => {
  return (
    <Card className={cn(
      "overflow-hidden glass-card animate-fade-in delay-100",
      "backdrop-blur-lg bg-white/20 border-white/30",
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((day, index) => (
            <WeatherCard
              key={day.date}
              date={day.date}
              temperature={day.temperature}
              condition={day.condition}
              isCurrentDay={index === 0}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
