import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "../notes/SearchBar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onNewNote: () => void;
  search: string;
  onSearch: (value: string) => void;
}

export function Header({ onNewNote, search, onSearch }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            Bashy Notes
          </h1>
          <div className="flex-1 max-w-md">
            <SearchBar value={search} onChange={onSearch} />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              onClick={onNewNote}
              className={cn(
                "bg-gradient-to-r from-primary to-primary/80",
                "hover:from-primary/90 hover:to-primary/70",
                "border-none text-primary-foreground font-medium",
                "shadow-md hover:shadow-lg",
                "transition-all duration-300",
                "group relative overflow-hidden rounded-full"
              )}
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
              <Plus className="h-4 w-4 mr-2 animate-pulse" />
              <span className="relative z-10">Create Note</span>
              <Sparkles className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <div className="pl-2 border-l">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
