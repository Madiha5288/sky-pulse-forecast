
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Shirt, Umbrella, Sun, Snowflake, Wind } from "lucide-react";

interface OutfitSuggestionsProps {
  outfitSuggestion: {
    clothing: string[];
    accessories: string[];
    advice: string;
  };
  className?: string;
}

export const OutfitSuggestions: React.FC<OutfitSuggestionsProps> = ({
  outfitSuggestion,
  className,
}) => {
  // Get appropriate icon based on item name
  const getItemIcon = (item: string) => {
    const itemLower = item.toLowerCase();
    
    if (itemLower.includes("umbrella")) return <Umbrella className="h-4 w-4 mr-2" />;
    if (itemLower.includes("sunscreen") || itemLower.includes("sunglasses")) 
      return <Sun className="h-4 w-4 mr-2" />;
    if (itemLower.includes("snow") || itemLower.includes("thermal")) 
      return <Snowflake className="h-4 w-4 mr-2" />;
    if (itemLower.includes("wind")) return <Wind className="h-4 w-4 mr-2" />;
    
    // Default icon
    return <Shirt className="h-4 w-4 mr-2" />;
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden glass-card animate-fade-in delay-300",
        "backdrop-blur-lg bg-white/20 border-white/30 hover-lift",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">What to Wear Today</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Clothing</h3>
            <ul className="space-y-1">
              {outfitSuggestion.clothing.map((item, index) => (
                <li key={index} className="flex items-center text-sm bg-white/30 p-2 rounded-md">
                  {getItemIcon(item)}
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {outfitSuggestion.accessories.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Accessories</h3>
              <ul className="space-y-1">
                {outfitSuggestion.accessories.map((item, index) => (
                  <li key={index} className="flex items-center text-sm bg-white/30 p-2 rounded-md">
                    {getItemIcon(item)}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-3 p-3 bg-white/40 rounded-md">
            <p className="text-sm italic">{outfitSuggestion.advice}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
