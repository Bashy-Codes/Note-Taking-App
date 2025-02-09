import { useState, useEffect } from "react";
import { Note, NewNoteSchema } from "@shared/schema";
import { loadNotes, saveNotes, createNote } from "@/lib/storage";
import { useKeyboardShortcuts } from "@/lib/shortcuts";
import { Header } from "@/components/layout/Header";
import { NoteList } from "@/components/notes/NoteList";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence } from "framer-motion";

const DEFAULT_COLORS = ["amber", "blue", "purple", "green", "red", "pink"];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedNotes = loadNotes();
      setNotes(savedNotes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive"
      });
    }
  }, []);

  useEffect(() => {
    try {
      saveNotes(notes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive"
      });
    }
  }, [notes]);

  const handleNewNote = () => {
    try {
      const randomColor = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
      const newNote = createNote({
        title: "Untitled Note",
        content: "Start writing your note here...",
        tags: [],
        color: randomColor,
        isPinned: false
      });

      setNotes(prevNotes => [newNote, ...prevNotes]);

      toast({
        title: "Note created",
        description: "A new note has been created. Click to start editing!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create a new note",
        variant: "destructive"
      });
    }
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    try {
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === id 
            ? { ...note, ...updates, updatedAt: Date.now() } 
            : note
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive"
      });
    }
  };

  const handleDeleteNote = (id: string) => {
    try {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
    }
  };

  useKeyboardShortcuts({
    newNote: (e) => {
      e.preventDefault();
      handleNewNote();
    },
    search: (e) => {
      e.preventDefault();
      document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
    }
  });

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background/95">
      <Header
        onNewNote={handleNewNote}
        search={search}
        onSearch={setSearch}
      />
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="popLayout">
          <NoteList
            notes={filteredNotes}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
          />
        </AnimatePresence>
      </main>
    </div>
  );
}