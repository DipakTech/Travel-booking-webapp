"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Search,
  MapPin,
  Users,
  Shield,
  Award,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const trustIndicators = [
  {
    icon: Shield,
    label: "Licensed & Insured",
  },
  {
    icon: Award,
    label: "Expert Local Guides",
  },
  {
    icon: Clock,
    label: "24/7 Support",
  },
];

export function HeroSection() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/50 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:32px_32px] z-20 opacity-30" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative container mx-auto px-4 z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-xl md:text-2xl font-bold text-white mb-6 leading-tight">
            Your Nepal Adventure{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Begins Here
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Connect with expert local guides for authentic Himalayan
            experiences. From trekking to cultural tours, we've got you covered.
          </p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative group">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-primary transition-colors" />
                <Input
                  placeholder="Where to?"
                  className="pl-10 h-12 border-gray-200 hover:border-primary focus:border-primary transition-colors"
                />
              </div>

              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 border-gray-200 hover:border-primary transition-colors",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {date ? format(date, "PPP") : <span>When</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-primary" />
                <Input
                  type="number"
                  placeholder="Group Size"
                  className="pl-10 h-12 border-gray-200 hover:border-primary focus:border-primary transition-colors"
                  min={1}
                />
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-white h-12 text-lg font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]">
                <Search className="mr-2 h-5 w-5" /> Find Guides
              </Button>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {trustIndicators.map((indicator) => {
              const Icon = indicator.icon;
              return (
                <div
                  key={indicator.label}
                  className="flex items-center gap-3 text-white/90"
                >
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{indicator.label}</span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
