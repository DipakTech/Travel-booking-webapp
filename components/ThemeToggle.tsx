"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative w-10 h-10 rounded-full"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="relative w-6 h-6">
        {/* Sun icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: theme === "dark" ? 0 : 1,
            opacity: theme === "dark" ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Sun className="w-6 h-6 text-yellow-500" />
        </motion.div>

        {/* Moon icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            opacity: theme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Moon className="w-6 h-6 text-slate-900 dark:text-slate-100" />
        </motion.div>
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
