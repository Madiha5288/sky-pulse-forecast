
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (location: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch,
  className 
}) => {
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location);
    }
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
        <Input
          type="text"
          placeholder="Search location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-3 pr-10 py-2 bg-white/40 backdrop-blur-sm border-white/30 focus:ring-2 focus:ring-primary/50"
        />
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
