"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Phone, MessageSquare, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BookingSectionProps {
  price: number;
}

export function BookingSection({ price }: BookingSectionProps) {
  const [date, setDate] = useState<Date>();
  const [groupSize, setGroupSize] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-br from-white/80 via-white/70 to-white/60",
        "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
        "backdrop-blur-xl rounded-2xl shadow-lg",
        "border border-gray-200/20 dark:border-gray-800/20",
        "p-6 sm:p-8 transition-all duration-300",
      )}
    >
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Price Display */}
        <div className="text-center pb-6 border-b border-gray-200/20 dark:border-gray-800/20">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-3xl sm:text-4xl font-bold"
            >
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                ${price}
              </span>
              <span className="text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400">
                /day
              </span>
            </motion.div>
            {/* Enhanced Price Glow Effect */}
            <div className="absolute -inset-2 bg-primary/10 dark:bg-primary/20 blur-2xl rounded-full opacity-50" />
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
            Select Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  "bg-white/50 dark:bg-gray-800/50",
                  "border-gray-200 dark:border-gray-700",
                  "hover:bg-white/80 dark:hover:bg-gray-800/80",
                  "text-gray-700 dark:text-gray-300",
                  "hover:border-primary/50 dark:hover:border-primary/50",
                  "transition-all duration-300",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary dark:text-primary/90" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className={cn(
                  "rounded-lg border",
                  "border-gray-200 dark:border-gray-800",
                  "bg-white dark:bg-gray-900",
                  "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
                )}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Group Size */}
        <div className="space-y-2">
          <label className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
            Group Size
          </label>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={cn(
              "flex items-center justify-between p-2",
              "rounded-xl bg-gradient-to-br",
              "from-white/60 to-white/40",
              "dark:from-gray-800/60 dark:to-gray-800/40",
              "border border-gray-200 dark:border-gray-700",
              "shadow-sm",
            )}
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
              className={cn(
                "p-2 rounded-lg transition-all",
                "bg-white/50 dark:bg-gray-900/50",
                "hover:bg-primary/5 dark:hover:bg-primary/10",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "active:scale-95",
              )}
              disabled={groupSize <= 1}
            >
              <Minus className="h-4 w-4 text-primary dark:text-primary/90" />
            </motion.button>
            <span className="font-medium text-gray-900 dark:text-gray-100 min-w-[2rem] text-center">
              {groupSize}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setGroupSize(Math.min(10, groupSize + 1))}
              className={cn(
                "p-2 rounded-lg transition-all",
                "bg-white/50 dark:bg-gray-900/50",
                "hover:bg-primary/5 dark:hover:bg-primary/10",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "active:scale-95",
              )}
              disabled={groupSize >= 10}
            >
              <Plus className="h-4 w-4 text-primary dark:text-primary/90" />
            </motion.button>
          </motion.div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Maximum group size: 10
          </p>
        </div>

        {/* Total Price */}
        <div className="py-4 border-t border-b border-gray-200/20 dark:border-gray-800/20">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
              Total
            </span>
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                ${price * groupSize}
              </span>
              {/* Enhanced Total Price Glow */}
              <div className="absolute -inset-2 bg-primary/10 dark:bg-primary/20 blur-xl rounded-full opacity-50" />
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className={cn(
                "w-full h-12 text-base font-medium",
                "bg-gradient-to-r from-primary via-primary to-primary/90",
                "hover:from-primary/90 hover:via-primary/85 hover:to-primary/80",
                "text-white shadow-lg shadow-primary/20 dark:shadow-primary/10",
                "border border-primary/10 dark:border-primary/20",
                "transition-all duration-300",
              )}
            >
              Book Now
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {["Message", "Call"].map((action, index) => (
              <motion.div
                key={action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full bg-gradient-to-br",
                    "from-white/60 to-white/40",
                    "dark:from-gray-800/60 dark:to-gray-800/40",
                    "border-gray-200 dark:border-gray-700",
                    "hover:border-primary/50 dark:hover:border-primary/50",
                    "text-gray-700 dark:text-gray-300",
                    "transition-all duration-300",
                  )}
                >
                  {index === 0 ? (
                    <MessageSquare className="h-4 w-4 mr-2 text-primary dark:text-primary/90" />
                  ) : (
                    <Phone className="h-4 w-4 mr-2 text-primary dark:text-primary/90" />
                  )}
                  <span className="hidden sm:inline">{action}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          By booking, you agree to our{" "}
          <a
            href="#"
            className={cn(
              "text-primary hover:text-primary/90",
              "dark:text-primary/90 dark:hover:text-primary/80",
              "hover:underline transition-colors",
              "relative inline-block",
              "after:absolute after:bottom-0 after:left-0 after:right-0",
              "after:h-px after:bg-primary/50 after:scale-x-0",
              "hover:after:scale-x-100 after:transition-transform",
            )}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className={cn(
              "text-primary hover:text-primary/90",
              "dark:text-primary/90 dark:hover:text-primary/80",
              "hover:underline transition-colors",
              "relative inline-block",
              "after:absolute after:bottom-0 after:left-0 after:right-0",
              "after:h-px after:bg-primary/50 after:scale-x-0",
              "hover:after:scale-x-100 after:transition-transform",
            )}
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </motion.div>
  );
}
