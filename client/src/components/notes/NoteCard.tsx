import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pin, Download, Copy, Trash, Clock, Calendar } from "lucide-react";
import { Note } from "@shared/schema";
import { downloadNote } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
  onPin: () => void;
  onDelete: () => void;
  onClick: () => void;
}

type NoteColor =
  | "NorthernLights"
  | "VioletPink"
  | "Rose"
  | "LimeGreen"
  | "yellow"
  | "magenta"
  | "cyan"
  | "LightRose"
  | null
  | undefined;

export function NoteCard({ note, onPin, onDelete, onClick }: NoteCardProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(note.content);
    toast({
      title: "Copied to clipboard",
      description: "Note content has been copied to your clipboard",
    });
  };

  const gradients: Record<Exclude<NoteColor, null | undefined>, string> = {
    NorthernLights: "bg-gradient-to-r from-teal-200 to-teal-500",
    VioletPink: "bg-gradient-to-r from-violet-200 to-pink-200",
    Rose: "bg-gradient-to-r from-rose-300 to-rose-500",
    LimeGreen: "bg-gradient-to-tl from-lime-400 to-green-600",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-200/50 dark:border-yellow-800/20",
    magenta:
      "bg-pink-100 dark:bg-pink-900/50 border-pink-200/50 dark:border-pink-800/20",
    cyan: "bg-cyan-100 dark:bg-cyan-900/50 border-cyan-200/50 dark:border-cyan-800/20",
    LightRose: "bg-gradient-to-r from-rose-400 to-orange-300",
  } as const;

  const dateStr = format(note.createdAt, "MMM d, yyyy");
  const timeAgo = formatDistanceToNow(note.updatedAt, { addSuffix: true });

  const noteColor = note.color as NoteColor;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`group cursor-pointer hover:shadow-lg transition-all border h-full ${
          noteColor && gradients[noteColor]
            ? gradients[noteColor]
            : "border-muted"
        }`}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1.5 flex-1">
            <h3 className="font-semibold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {note.title}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{dateStr}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onPin();
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <Pin
                className={`h-4 w-4 transition-transform ${
                  note.isPinned ? "fill-primary rotate-45" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                downloadNote(note);
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard();
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 hover:text-red-500 transition-all"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="line-clamp-3 text-sm prose dark:prose-invert max-w-none opacity-80"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
          {note.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary-foreground/80 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
