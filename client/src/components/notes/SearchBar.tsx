import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search notes..."
        className="pl-9 pr-4 py-2 rounded-full border-2 border-primary/20 bg-background/80 backdrop-blur-sm focus:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
      />
    </div>
  );
}
