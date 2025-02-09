import { Note, NewNote } from "@shared/schema";
import { nanoid } from "nanoid";

const STORAGE_KEY = "notes-app-data";

export const saveNotes = (notes: Note[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const loadNotes = (): Note[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const createNote = (note: NewNote): Note => {
  const timestamp = Date.now();
  return {
    ...note,
    id: nanoid(),
    createdAt: timestamp,
    updatedAt: timestamp
  };
};

export const updateNote = (id: string, updates: Partial<Note>, notes: Note[]): Note[] => {
  return notes.map(note => 
    note.id === id 
      ? { ...note, ...updates, updatedAt: Date.now() }
      : note
  );
};

export const downloadNote = (note: Note) => {
  const content = `${note.title}\n\n${note.content}`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${note.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
