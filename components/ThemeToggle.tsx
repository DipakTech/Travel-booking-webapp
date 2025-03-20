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
          <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300 transition-all scale-100 rotate-0 dark:scale-0 dark:rotate-90" />
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
          <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300 transition-all scale-0 -rotate-90 dark:scale-100 dark:rotate-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
