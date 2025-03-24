"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Mountain,
  Map,
  Calendar,
  ThermometerSun,
  Ruler,
  ArrowRight,
  Users,
  Timer,
  Star,
  Search,
  Filter,
  XCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDestinations } from "@/lib/hooks/use-destinations";

const features = [
  {
    icon: Mountain,
    title: "Diverse Terrains",
    description: "From subtropical valleys to alpine peaks",
  },
  {
    icon: Map,
    title: "Expert Navigation",
    description: "Well-marked trails and experienced guides",
  },
  {
    icon: Users,
    title: "Cultural Immersion",
    description: "Authentic local experiences and interactions",
  },
  {
    icon: Timer,
    title: "Flexible Durations",
    description: "Trips ranging from 7 to 16 days",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Options for filters
const difficultyOptions = ["Easy", "Moderate", "Challenging", "Difficult"];
const durationOptions = ["1-7 days", "7-14 days", "14+ days"];

export default function DestinationsPage() {
  const router = useRouter();

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    [],
  );
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filter parameters for API
  const filterParams = useMemo(() => {
    const params: Record<string, any> = {
      limit: 10,
    };

    if (debouncedSearchQuery) {
      params.search = debouncedSearchQuery;
    }

    if (selectedDifficulties.length > 0) {
      params.difficulty = selectedDifficulties
        .map((d) => d.toLowerCase())
        .join(",");
    }

    // Handle duration filtering
    // Using array to track min/max filters to apply
    if (selectedDurations.length > 0) {
      // Server-side filters are based on minDays/maxDays fields
      let minDays = 0;
      let maxDays = 100;

      if (selectedDurations.includes("1-7 days")) {
        minDays = Math.min(minDays || 1, 1);
        maxDays = Math.min(maxDays, 7);
      }

      if (selectedDurations.includes("7-14 days")) {
        minDays = Math.min(minDays || 7, 7);
        maxDays = Math.min(maxDays, 14);
      }

      if (selectedDurations.includes("14+ days")) {
        minDays = 14;
      }

      if (minDays > 0) {
        params.minDays = minDays;
      }

      if (maxDays < 100) {
        params.maxDays = maxDays;
      }
    }

    return params;
  }, [debouncedSearchQuery, selectedDifficulties, selectedDurations]);

  // Fetch destinations from API with the filter params
  const { data, isLoading, isError } = useDestinations(filterParams);

  // Toggle functions for filters
  const toggleDifficulty = useCallback((difficulty: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty],
    );
  }, []);

  const toggleDuration = useCallback((duration: string) => {
    setSelectedDurations((prev) =>
      prev.includes(duration)
        ? prev.filter((d) => d !== duration)
        : [...prev, duration],
    );
  }, []);

  // Remove a filter
  const removeFilter = useCallback((filter: string) => {
    setSelectedDifficulties((prev) => prev.filter((d) => d !== filter));
    setSelectedDurations((prev) => prev.filter((d) => d !== filter));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedDifficulties([]);
    setSelectedDurations([]);
  }, []);

  // All active filters
  const activeFilters = [...selectedDifficulties, ...selectedDurations];

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Popular Destinations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover Nepal&apos;s most iconic trekking routes and hidden gems,
            each offering unique experiences and breathtaking landscapes.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={cn(
            "relative overflow-hidden",
            "bg-white/95 dark:bg-gray-900/95",
            "backdrop-blur-2xl p-6",
            "rounded-2xl",
            "shadow-[0_8px_40px_rgba(0,0,0,0.08)]",
            "dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]",
            "border border-white/40 dark:border-gray-800/40",
            "max-w-4xl mx-auto mb-16",
            "group",
          )}
        >
          {/* Glass effect overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20 dark:from-white/5 dark:via-white/2 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-100/20 via-transparent to-transparent dark:from-rose-500/[0.05] dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Search and Basic Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative group/input">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-transform duration-300 group-focus-within/input:scale-110">
                  <Search className="h-5 w-5 text-rose-500" />
                </div>
                <Input
                  placeholder="Search destinations by name, location, or description..."
                  className={cn(
                    "pl-10 h-12 w-full",
                    "bg-gray-50/50 dark:bg-gray-800/50",
                    "border-gray-100 dark:border-gray-800",
                    "focus:border-rose-500/50 dark:focus:border-rose-500/50",
                    "focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/10",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "transition-all duration-300",
                    "rounded-xl",
                    "group-hover/input:border-rose-500/30 dark:group-hover/input:border-rose-500/20",
                    "group-hover/input:bg-white dark:group-hover/input:bg-gray-800",
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={() => setSearchQuery("")}
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filter Button with Dropdown */}
              <DropdownMenu
                open={isFiltersOpen}
                onOpenChange={setIsFiltersOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 px-6",
                      "border-gray-100 dark:border-gray-800",
                      "hover:border-rose-500/30 dark:hover:border-rose-500/20",
                      "hover:bg-rose-50 dark:hover:bg-rose-500/10",
                      "text-gray-600 dark:text-gray-300",
                      "hover:text-rose-600 dark:hover:text-rose-400",
                      "transition-all duration-300",
                      "rounded-xl",
                      "group/button",
                      isFiltersOpen &&
                        "bg-rose-50 dark:bg-rose-500/10 border-rose-500/30 dark:border-rose-500/20",
                    )}
                  >
                    <Filter className="h-5 w-5 mr-2 transition-transform duration-300 group-hover/button:scale-110" />
                    Filters
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[280px] p-4">
                  <DropdownMenuGroup>
                    <div className="space-y-4">
                      {/* Difficulty dropdown section */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Difficulty</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {difficultyOptions.map((difficulty) => (
                            <Badge
                              key={difficulty}
                              variant={
                                selectedDifficulties.includes(difficulty)
                                  ? "default"
                                  : "outline"
                              }
                              className={cn(
                                "cursor-pointer justify-start",
                                selectedDifficulties.includes(difficulty)
                                  ? "bg-primary hover:bg-primary/90"
                                  : "hover:bg-primary/10",
                              )}
                              onClick={() => toggleDifficulty(difficulty)}
                            >
                              {difficulty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Duration dropdown section */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Duration</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {durationOptions.map((duration) => (
                            <Badge
                              key={duration}
                              variant={
                                selectedDurations.includes(duration)
                                  ? "default"
                                  : "outline"
                              }
                              className={cn(
                                "cursor-pointer justify-start",
                                selectedDurations.includes(duration)
                                  ? "bg-primary hover:bg-primary/90"
                                  : "hover:bg-primary/10",
                              )}
                              onClick={() => toggleDuration(duration)}
                            >
                              {duration}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          className="mr-2"
                        >
                          Clear all
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setIsFiltersOpen(false)}
                        >
                          Apply filters
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Filters:
                </span>
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter}
                    variant="secondary"
                    className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 group/filter"
                  >
                    {filter}
                    <XCircle
                      className="h-4 w-4 ml-1 cursor-pointer opacity-50 group-hover/filter:opacity-100 transition-opacity"
                      onClick={() => removeFilter(filter)}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}

            {debouncedSearchQuery && searchQuery !== debouncedSearchQuery && (
              <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                Searching...
              </div>
            )}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={item}
                className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-800 p-6 text-center group hover:border-primary/50 transition-all"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 dark:bg-primary/5 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Destinations Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {isLoading ||
          (debouncedSearchQuery && searchQuery !== debouncedSearchQuery) ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-white/20 dark:border-gray-800 overflow-hidden"
              >
                {/* Image Skeleton */}
                <Skeleton className="h-64 w-full" />

                {/* Content Skeleton */}
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-20 w-full" />

                  {/* Stats Grid Skeleton */}
                  <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-32 rounded-lg" />
                  </div>
                </div>
              </div>
            ))
          ) : isError ? (
            // Error state
            <div className="col-span-2 py-10 text-center">
              <p className="text-rose-500 dark:text-rose-400 mb-4">
                Unable to load destinations. Please try again later.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="mx-auto"
              >
                Retry
              </Button>
            </div>
          ) : data?.destinations && data.destinations.length > 0 ? (
            // Destinations from API
            data.destinations.map((destination) => (
              <motion.div
                key={destination.id}
                variants={item}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-white/20 dark:border-gray-800 overflow-hidden hover:border-primary/50 transition-all"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Image
                    width={300}
                    height={300}
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {destination.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {destination.location}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {destination.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {destination.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThermometerSun className="h-4 w-4 text-primary" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {destination.bestSeason}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-primary" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {destination.maxAltitude}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {destination.rating} ({destination.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white px-3 py-1 bg-primary/10 dark:bg-primary/5 rounded-full">
                      {destination.difficulty}
                    </span>
                    <Button
                      onClick={() =>
                        router.push(`/destinations/${destination.id}`)
                      }
                      variant="ghost"
                      className="text-primary hover:text-primary/90"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // No destinations found
            <div className="col-span-2 py-10 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No destinations found matching your criteria. Try adjusting your
                filters.
              </p>
            </div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Can&apos;t Find Your Perfect Trek?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Let our expert guides help you plan a custom itinerary tailored to
              your preferences and experience level.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Contact Our Experts
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
