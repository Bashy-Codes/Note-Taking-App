import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pin, Download, Copy, Trash2, Clock, Calendar } from "lucide-react";
import type { Note } from "@shared/schema";
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
  | "LightRose";

export function NoteCard({ note, onPin, onDelete, onClick }: NoteCardProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    const formattedContent = `${note.title}

${note.content.replace(/<[^>]+>/g, "")}`;
    await navigator.clipboard.writeText(formattedContent);
    toast({
      title: "Copied to clipboard",
      description: "Note title and content have been copied to your clipboard",
      variant: "default",
    });
  };

  const gradients: Record<NoteColor, string> = {
    NorthernLights: "bg-gradient-to-br from-teal-200 to-teal-500",
    VioletPink: "bg-gradient-to-br from-violet-200 to-pink-200",
    Rose: "bg-gradient-to-br from-rose-300 to-rose-500",
    LimeGreen: "bg-gradient-to-br from-lime-400 to-green-600",
    yellow:
      "bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-yellow-900/50 dark:to-yellow-700/50",
    magenta:
      "bg-gradient-to-br from-pink-100 to-pink-300 dark:from-pink-900/50 dark:to-pink-700/50",
    cyan: "bg-gradient-to-br from-cyan-100 to-cyan-300 dark:from-cyan-900/50 dark:to-cyan-700/50",
    LightRose: "bg-gradient-to-br from-rose-400 to-orange-300",
  };

  const dateStr = format(note.createdAt, "MMM d, yyyy");
  const timeAgo = formatDistanceToNow(note.updatedAt, { addSuffix: true });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${
          gradients[note.color as NoteColor] || "bg-card"
        } overflow-hidden`}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative">
          <div className="space-y-1.5 flex-1">
            <h3 className="font-semibold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            className="opacity-70 hover:opacity-100 transition-opacity absolute top-2 right-2"
          >
            <Pin
              className={`h-4 w-4 transition-transform ${
                note.isPinned ? "fill-primary rotate-45" : ""
              }`}
            />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="line-clamp-3 text-sm prose dark:prose-invert max-w-none opacity-80"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
          <span className="inline-block text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {note.category}
          </span>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                downloadNote(note);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
              className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity duration-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
