import { useEffect } from "react";

type ShortcutHandler = (e: KeyboardEvent) => void;

export const useKeyboardShortcuts = (shortcuts: Record<string, ShortcutHandler>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      
      // New note shortcut
      if (ctrl && key === "n") {
        e.preventDefault();
        shortcuts.newNote?.(e);
      }
      
      // Save shortcut
      if (ctrl && key === "s") {
        e.preventDefault();
        shortcuts.save?.(e);
      }
      
      // Search shortcut
      if (ctrl && key === "f") {
        e.preventDefault();
        shortcuts.search?.(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
};
