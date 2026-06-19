import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { Button } from "./Button";
import type { JSX } from "react";

export function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full p-2"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-foreground" />
      ) : (
        <Sun className="h-4 w-4 text-foreground" />
      )}
    </Button>
  );
}
