"use client";

import React, { useEffect, useState } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Only render after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={"sm"}
          aria-label="Toggle theme"
          className="bg-transparent dark:bg-gray-900" // Ensure dark bg on dark mode
        >
          {theme === "light" ? (
            <Sun key="light" size={ICON_SIZE} className={"text-muted-foreground"} />
          ) : theme === "dark" ? (
            <Moon key="dark" size={ICON_SIZE} className={"text-muted-foreground"} />
          ) : (
            <Laptop key="system" size={ICON_SIZE} className={"text-muted-foreground"} />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-content bg-background dark:bg-gray-900" // Set dark bg for dropdown content
        align="start"
      >
        <DropdownMenuRadioGroup value={theme} onValueChange={(e) => setTheme(e)}>
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" /> <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" /> <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" /> <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
