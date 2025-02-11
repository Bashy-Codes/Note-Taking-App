"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Note } from "@shared/schema";
import { NoteCard } from "./NoteCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Editor } from "./Editor";
import { Button } from "@/components/ui/button";
import { Save, Clock, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NoteListProps {
  notes: Note[];
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  categories: string[];
}

const colors = {
  NorthernLights: "#28b5ae",
  VioletPink: "#ed91e4",
  Rose: "#e03f6f",
  LimeGreen: "#1ff065",
  yellow: "#FFFF00",
  magenta: "#FF00FF",
  cyan: "#00FFFF",
  LightRose: "#fa6b9d",
};

export function NoteList({
  notes,
  onUpdate,
  onDelete,
  categories,
}: NoteListProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [tempNote, setTempNote] = useState<Note | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const { toast } = useToast();

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTempNote(note);
    setWordCount(note.content.trim().split(/\s+/).length);
  };

  const handleClose = () => {
    setSelectedNote(null);
    setTempNote(null);
  };

  const handleSave = () => {
    if (
      tempNote &&
      selectedNote &&
      JSON.stringify(tempNote) !== JSON.stringify(selectedNote)
    ) {
      onUpdate(selectedNote.id, tempNote);
      toast({
        title: "Note updated",
        description: "Your changes have been saved.",
        variant: "default",
      });
    }
    handleClose();
  };

  const handleContentChange = (content: string) => {
    setTempNote((prev) => (prev ? { ...prev, content } : prev));
  };

  const handleWordCountChange = (count: number) => {
    setWordCount(count);
  };

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [notes]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {sortedNotes.map((note, index) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <NoteCard
                note={note}
                onPin={() => onUpdate(note.id, { isPinned: !note.isPinned })}
                onDelete={() => onDelete(note.id)}
                onClick={() => handleNoteClick(note)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={!!selectedNote} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {tempNote && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Input
                      value={tempNote.title}
                      onChange={(e) =>
                        setTempNote((prev) =>
                          prev ? { ...prev, title: e.target.value } : prev
                        )
                      }
                      className="text-xl font-bold"
                      placeholder="Note title"
                    />
                    <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>
                        Last updated{" "}
                        {formatDistanceToNow(tempNote.updatedAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Editor
                content={tempNote.content}
                onChange={handleContentChange}
                onWordCountChange={handleWordCountChange}
              />

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-medium bg-primary/10 px-2 py-1 rounded-full">
                  Word count: {wordCount}
                </span>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Note Color</h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(colors).map(([name, hex]) => (
                    <button
                      key={name}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                        tempNote.color === name
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
                      }`}
                      style={{ backgroundColor: hex }}
                      onClick={() => {
                        setTempNote((prev) =>
                          prev
                            ? { ...prev, color: name as keyof typeof colors }
                            : prev
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Category</h4>
                <Select
                  value={tempNote.category}
                  onValueChange={(value) =>
                    setTempNote((prev) =>
                      prev ? { ...prev, category: value } : prev
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
