
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SearchBarProps {
  onSearch: (location: string) => void;
  className?: string;
}

// Common locations that users might search for
const popularLocations = [
  "New York, US",
  "London, GB",
  "Tokyo, JP",
  "Paris, FR",
  "Sydney, AU",
  "Berlin, DE",
  "Beijing, CN",
  "Cairo, EG",
  "Mumbai, IN",
  "Rio de Janeiro, BR",
  "Dubai, AE",
  "Toronto, CA",
];

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch,
  className 
}) => {
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location);
      setOpen(false);
    }
  };

  const handleSelectLocation = (selected: string) => {
    setLocation(selected);
    onSearch(selected);
    setOpen(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "flex items-center space-x-2 w-full max-w-md animate-fade-in",
        className
      )}
    >
      <div className="relative flex-grow">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Input
              type="text"
              placeholder="Search location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-3 pr-10 py-2 bg-white/40 backdrop-blur-sm border-white/30 focus:ring-2 focus:ring-primary/50"
              onClick={() => setOpen(true)}
            />
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full" align="start">
            <Command>
              <CommandInput 
                placeholder="Search city, country..." 
                value={location}
                onValueChange={setLocation}
              />
              <CommandList>
                <CommandEmpty>No locations found</CommandEmpty>
                <CommandGroup heading="Popular Locations">
                  {popularLocations.map((place) => (
                    <CommandItem 
                      key={place}
                      value={place}
                      onSelect={() => handleSelectLocation(place)}
                    >
                      {place}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Button 
        type="submit" 
        size="icon"
        className="bg-primary hover:bg-primary/90 text-white transition-transform hover:scale-105"
      >
        <Search size={18} />
      </Button>
    </form>
  );
};
