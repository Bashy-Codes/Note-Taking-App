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
  | "lavender"
  | "mint"
  | "sky"
  | "lemon"
  | "peach"
  | "rose"
  | "lightGreen"
  | "lightYellow"
  | "lightPink"
  | "lightCyan"
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
    lavender:
      "bg-gradient-to-br from-lavender-50 to-lavender-100/80 dark:from-lavender-900/10 dark:to-lavender-800/10 border-lavender-200/50 dark:border-lavender-800/20",
    mint: "bg-gradient-to-br from-mint-50 to-mint-100/80 dark:from-mint-900/10 dark:to-mint-800/10 border-mint-200/50 dark:border-mint-800/20",
    sky: "bg-gradient-to-br from-sky-50 to-sky-100/80 dark:from-sky-900/10 dark:to-sky-800/10 border-sky-200/50 dark:border-sky-800/20",
    lemon:
      "bg-gradient-to-br from-lemon-50 to-lemon-100/80 dark:from-lemon-900/10 dark:to-lemon-800/10 border-lemon-200/50 dark:border-lemon-800/20",
    peach:
      "bg-gradient-to-br from-peach-50 to-peach-100/80 dark:from-peach-900/10 dark:to-peach-800/10 border-peach-200/50 dark:border-peach-800/20",
    rose: "bg-gradient-to-br from-rose-50 to-rose-100/80 dark:from-rose-900/10 dark:to-rose-800/10 border-rose-200/50 dark:border-rose-800/20",
    lightGreen:
      "bg-gradient-to-br from-lightGreen-50 to-lightGreen-100/80 dark:from-lightGreen-900/10 dark:to-lightGreen-800/10 border-lightGreen-200/50 dark:border-lightGreen-800/20",
    lightYellow:
      "bg-gradient-to-br from-lightYellow-50 to-lightYellow-100/80 dark:from-lightYellow-900/10 dark:to-lightYellow-800/10 border-lightYellow-200/50 dark:border-lightYellow-800/20",
    lightPink:
      "bg-gradient-to-br from-lightPink-50 to-lightPink-100/80 dark:from-lightPink-900/10 dark:to-lightPink-800/10 border-lightPink-200/50 dark:border-lightPink-800/20",
    lightCyan:
      "bg-gradient-to-br from-lightCyan-50 to-lightCyan-100/80 dark:from-lightCyan-900/10 dark:to-lightCyan-800/10 border-lightCyan-200/50 dark:border-lightCyan-800/20",
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
          noteColor && gradients[noteColor] ? gradients[noteColor] : "border-muted" 
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