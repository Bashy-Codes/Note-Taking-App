import { z } from "zod";

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  color: z.string(),
  isPinned: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number()
});

export type Note = z.infer<typeof NoteSchema>;

export const NewNoteSchema = NoteSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
}).extend({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required")
});

export type NewNote = z.infer<typeof NewNoteSchema>;
