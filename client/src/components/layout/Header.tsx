import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "../notes/SearchBar";

interface HeaderProps {
  onNewNote: () => void;
  search: string;
  onSearch: (value: string) => void;
}

export function Header({ onNewNote, search, onSearch }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
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
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
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