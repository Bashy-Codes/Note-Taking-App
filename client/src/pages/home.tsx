"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Note } from "@shared/schema";
import { loadNotes, saveNotes, createNote } from "@/lib/storage";
import { useKeyboardShortcuts } from "@/lib/shortcuts";
import { Header } from "@/components/layout/Header";
import { NoteList } from "@/components/notes/NoteList";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const DEFAULT_COLORS = [
  "White",
  "Cream",
  "LightBlue",
  "LightGreen",
  "LightPink",
  "LightYellow",
  "LightPurple",
  "LightGray",
];

const DEFAULT_CATEGORIES = ["All", "Personal", "Work", "Study"];

const CATEGORY_COLORS = {
  All: "bg-red-500 text-white hover:bg-red-600",
  Personal: "bg-green-500 text-white hover:bg-green-600",
  Work: "bg-blue-500 text-white hover:bg-blue-600",
  Study: "bg-purple-500 text-white hover:bg-purple-600",
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadNotesData = async () => {
      try {
        const savedNotes = await loadNotes();
        setNotes(savedNotes);
      } catch (error) {
        console.error("Failed to load notes:", error);
        toast({
          title: "Error",
          description: "Failed to load notes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadNotesData();
  }, [toast]);

  useEffect(() => {
    const saveNotesData = async () => {
      if (!isLoading) {
        try {
          await saveNotes(notes);
        } catch (error) {
          console.error("Failed to save notes:", error);
          toast({
            title: "Error",
            description: "Failed to save notes. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    saveNotesData();
  }, [notes, toast, isLoading]);

  const handleNewNote = useCallback(() => {
    try {
      const randomColor =
        DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
      const newNote = createNote({
        title: "Untitled Note",
        content: "Start writing your note here...",
        color: randomColor,
        isPinned: false,
        category: "Personal",
        reminderDate: null,
      });
      setNotes((prevNotes) => [newNote, ...prevNotes]);
      toast({
        title: "Note created",
        description: "A new note has been created. Click to start editing!",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to create a new note:", error);
      toast({
        title: "Error",
        description: "Failed to create a new note. Please try again.",
        variant: "default",
      });
    }
  }, [toast]);

  const handleUpdateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      try {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: Date.now() }
              : note
          )
        );
        toast({
          title: "Note updated",
          description: "Your note has been updated successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to update note:", error);
        toast({
          title: "Error",
          description: "Failed to update note. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleDeleteNote = useCallback(
    (id: string) => {
      try {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        toast({
          title: "Note deleted",
          description: "Your note has been deleted successfully",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to delete note:", error);
        toast({
          title: "Error",
          description: "Failed to delete note. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  useKeyboardShortcuts({
    newNote: (e) => {
      e.preventDefault();
      handleNewNote();
    },
    search: (e) => {
      e.preventDefault();
      document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
    },
  });

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        (activeCategory === "All" || note.category === activeCategory) &&
        (note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()))
    );
  }, [notes, activeCategory, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header onNewNote={handleNewNote} search={search} onSearch={setSearch} />
      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-6"
        >
          <TabsList className="bg-card/80 dark:bg-card/50 backdrop-blur-sm p-1 rounded-full shadow-md">
            {" "}
            {DEFAULT_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className={`capitalize rounded-full px-4 py-2 transition-colors font-medium ${
                  CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]
                }
                  ${
                    activeCategory === category
                      ? "bg-primary/20 dark:bg-primary/50 text-primary dark:text-primary-foreground ring-2 ring-primary/50 dark:ring-primary/20"
                      : ""
                  }`}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredNotes.length > 0 ? (
              <NoteList
                notes={filteredNotes}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
                categories={DEFAULT_CATEGORIES.filter((cat) => cat !== "All")}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-muted-foreground"
              >
                <p>No notes found. Create a new note to get started!</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
