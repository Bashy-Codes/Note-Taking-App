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
  "#000000",
  "#434343",
  "#666666",
  "#999999",
  "#b7b7b7",
  "#cccccc",
  "#d9d9d9",
  "#efefef",
  "#f3f3f3",
  "#ffffff",
  "#980000",
  "#ff0000",
  "#ff9900",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#4a86e8",
  "#0000ff",
  "#9900ff",
  "#ff00ff",
  "#e6b8af",
  "#f4cccc",
  "#fce5cd",
  "#fff2cc",
  "#d9ead3",
  "#d0e0e3",
  "#c9daf8",
  "#cfe2f3",
  "#d9d2e9",
  "#ead1dc",
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
