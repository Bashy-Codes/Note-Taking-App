import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Code,
  Undo,
  Redo,
  Palette,
  Highlighter,
  CheckSquare,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onWordCountChange: (count: number) => void;
}

const colors = [
  // Grayscale (Black to White)
  "#000000",
  "#2E2E2E",
  "#595959",
  "#7F7F7F",
  "#A6A6A6",
  "#CCCCCC",
  "#E0E0E0",
  "#F2F2F2",
  "#FAFAFA",
  "#FFFFFF",

  // Reds & Pinks
  "#8B0000",
  "#D32F2F",
  "#FF0000",
  "#FF5252",
  "#FFCDD2",
  "#E91E63",
  "#F06292",
  "#F8BBD0",
  "#FF80AB",
  "#AD1457",

  // Oranges & Browns
  "#FF6D00",
  "#FF9800",
  "#FFB74D",
  "#FFD180",
  "#FFE0B2",
  "#795548",
  "#8D6E63",
  "#A1887F",
  "#D7CCC8",
  "#3E2723",

  // Yellows & Golds
  "#FFEB3B",
  "#FBC02D",
  "#FFEE58",
  "#FFF176",
  "#FFF9C4",

  // Greens
  "#1B5E20",
  "#388E3C",
  "#4CAF50",
  "#81C784",
  "#C8E6C9",
  "#00C853",
  "#AEEA00",
  "#76FF03",
  "#B2FF59",
  "#CCFF90",

  // Blues
  "#0D47A1",
  "#1976D2",
  "#2196F3",
  "#64B5F6",
  "#BBDEFB",
  "#1E88E5",
  "#42A5F5",
  "#90CAF9",
  "#E3F2FD",
  "#2962FF",

  // Purples & Violets
  "#4A148C",
  "#7B1FA2",
  "#9C27B0",
  "#BA68C8",
  "#CE93D8",
  "#D500F9",
  "#8E24AA",
  "#D1C4E9",
  "#EDE7F6",
  "#6A1B9A",
];

export function Editor({ content, onChange, onWordCountChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      const wordCount = editor.getText().trim().split(/\s+/).length;
      onWordCountChange(wordCount);
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert focus:outline-none max-w-none min-h-[200px] p-4",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg p-4 bg-card shadow-sm">
      <div className="flex flex-wrap gap-2 mb-4 border-b pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-primary/20" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-primary/20" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-primary/20" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-primary/20" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={editor.isActive("taskList") ? "bg-primary/20" : ""}
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "bg-primary/20" : ""
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-primary/20" : ""}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "bg-primary/20" : ""}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-10 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive("highlight") ? "bg-primary/20" : ""}
        >
          <Highlighter className="h-4 w-4" />
        </Button>
        <div className="ml-auto flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="min-h-[200px] focus:outline-none"
      />
    </div>
  );
}
