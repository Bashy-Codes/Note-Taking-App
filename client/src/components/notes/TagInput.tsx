import { useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input) {
      e.preventDefault();
      if (!tags.includes(input)) {
        onChange([...tags, input]);
      }
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tags..."
      />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-sm px-2 py-1 rounded-full bg-primary/10"
          >
            {tag}
            <button onClick={() => removeTag(tag)}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
