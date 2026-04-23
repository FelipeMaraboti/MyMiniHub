import { useEffect } from "react";

interface UseKeyboardNavOptions {
  count: number;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onSelect: (i: number) => void;
  onEscape?: () => void;
}

/**
 * Hook para navegação por teclado em listas.
 * ↑↓ para mover, Enter para selecionar, Esc para fechar.
 */
export function useKeyboardNav({
  count,
  activeIndex,
  setActiveIndex,
  onSelect,
  onEscape,
}: UseKeyboardNavOptions) {
  useEffect(() => {
    if (count === 0) return;

    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex(Math.min(activeIndex + 1, count - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex(Math.max(activeIndex - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < count) {
            onSelect(activeIndex);
          }
          break;
        case "Escape":
          e.preventDefault();
          onEscape?.();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [count, activeIndex, setActiveIndex, onSelect, onEscape]);
}
