import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Note } from "@shared/schema";
import { NoteCard } from "./NoteCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Editor } from "./Editor";
import { TagInput } from "./TagInput";
import { Button } from "@/components/ui/button";
import { Save, Clock } from "lucide-react";
import { format } from "date-fns";

interface NoteListProps {
  notes: Note[];
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

const colors = {
  
  lavender: "#F4A460",
  mint: "#00FF00",
  sky: "#ff5733 ",
  lemon: "#66CDAA",
  peach: "#20B2AA",
  rose: "#FA8072",
  lightGreen: "#00FF7F",
  lightYellow: "#FFFF00",
  lightPink: "#FF00FF",
  lightCyan: "#00FFFF",
};

export function NoteList({ notes, onUpdate, onDelete }: NoteListProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [tempNote, setTempNote] = useState<Note | null>(null);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTempNote(note);
  };

  const handleClose = () => {
    if (tempNote && selectedNote) {
      onUpdate(selectedNote.id, tempNote);
    }
    setSelectedNote(null);
    setTempNote(null);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
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

      <Dialog open={!!selectedNote} onOpenChange={() => handleClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {tempNote && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle>
                  <div className="space-y-2">
                    <Input
                      value={tempNote.title}
                      onChange={e =>
                        setTempNote(prev => prev ? { ...prev, title: e.target.value } : prev)
                      }
                      className="text-xl font-bold"
                      placeholder="Note title"
                    />
                    <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>Last updated {format(tempNote.updatedAt, "PPpp")}</span>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Editor
                content={tempNote.content}
                onChange={content =>
                  setTempNote(prev => prev ? { ...prev, content } : prev)
                }
              />

              <TagInput
                tags={tempNote.tags}
                onChange={tags =>
                  setTempNote(prev => prev ? { ...prev, tags } : prev)
                }
              />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Note Color</h4>
                <div className="flex gap-3">
                  {Object.entries(colors).map(([name, hex]) => (
                    <button
                      key={name}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                        tempNote.color === name ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: hex }}
                      onClick={() => {
                        setTempNote(prev => prev ? { ...prev, color: name } : prev);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleClose} className="w-full sm:w-auto">
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