"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Mountain,
  Languages,
  Star,
  Award,
  MapPin,
  Filter,
  MessageSquare,
  Phone,
  XCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GuideMap } from "@/components/map/GuideMap";
import Image from "next/image";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  useGuides,
  useGuideLanguages,
  useGuideSpecialties,
  useGuideLocations,
} from "@/lib/hooks/use-guides";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Define type for guide objects in the guides list
type GuideDisplay = {
  id: string;
  name: string;
  photo?: string;
  location: string;
  rating: number;
  reviewCount: number;
  bio: string;
  specialties: string[];
  hourlyRate?: number;
  status?: string;
  experience?: string;
};

// Define location for the map
type MapLocation = {
  id: string | number;
  name: string;
  coordinates: [number, number]; // Use tuple type for coordinates
  type: string;
  description: string;
};

const features = [
  {
    icon: Mountain,
    title: "Expert Guides",
    description: "Certified and experienced professionals",
  },
  {
    icon: Languages,
    title: "Multilingual",
    description: "Guides fluent in multiple languages",
  },
  {
    icon: Award,
    title: "Certified",
    description: "Licensed and insured guides",
  },
  {
    icon: Star,
    title: "Top Rated",
    description: "Consistently high-rated services",
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

export function GuidesContent() {
  const router = useRouter();

  // State for active filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<
    string[]
  >([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters from selected values
  const filters = useMemo(() => {
    const result: Record<string, any> = {
      limit: 8,
    };

    if (debouncedSearchQuery) {
      result.search = debouncedSearchQuery;
    }

    if (selectedSpecialties.length > 0) {
      result.specialty = selectedSpecialties.join(",");
    }

    if (selectedLanguages.length > 0) {
      result.language = selectedLanguages.join(",");
    }

    if (selectedExperienceLevels.length > 0) {
      result.experienceLevel = selectedExperienceLevels.join(",");
    }

    return result;
  }, [
    debouncedSearchQuery,
    selectedSpecialties,
    selectedLanguages,
    selectedExperienceLevels,
  ]);

  // Fetch guides with filters
  const { data: guidesData, isLoading: isLoadingGuides } = useGuides(filters);

  // Fetch guide locations for map
  const { data: locationData, isLoading: isLoadingLocations } =
    useGuideLocations();

  // Fetch languages and specialties for filters
  const { data: languages, isLoading: isLoadingLanguages } =
    useGuideLanguages();
  const { data: specialties, isLoading: isLoadingSpecialties } =
    useGuideSpecialties();

  // Format guides data for display
  const formattedGuides: GuideDisplay[] = useMemo(() => {
    if (!guidesData?.guides) return [];

    return guidesData.guides.map((guide) => {
      // Format the guide for display
      return {
        id: guide.id || "",
        name: guide.name,
        photo: guide.photo,
        location: `${guide.location?.region || ""}, ${
          guide.location?.country || ""
        }`,
        rating: guide.rating || 0,
        reviewCount: guide.reviewCount || 0,
        bio: guide.bio || "Professional guide with expertise in local areas",
        specialties: guide.specialties || [],
        hourlyRate: guide.hourlyRate,
        status: guide.availability,
        experience: `${guide.experience?.years || 0} years`,
      };
    });
  }, [guidesData]);

  // Format locations for the map
  const mapLocations: MapLocation[] = useMemo(() => {
    if (!locationData) return [];

    return locationData.map((loc) => ({
      id: loc.id || "default",
      name: loc.name,
      coordinates: loc.coordinates as [number, number], // Ensure coordinates are correctly typed
      type: loc.type,
      description: loc.description,
    }));
  }, [locationData]);

  // Active filters for display
  const activeFilters = [
    ...selectedSpecialties,
    ...selectedLanguages,
    ...selectedExperienceLevels,
  ];

  // Toggle functions for filters
  const toggleSpecialty = useCallback((specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty],
    );
  }, []);

  const toggleLanguage = useCallback((language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language],
    );
  }, []);

  const toggleExperienceLevel = useCallback((level: string) => {
    setSelectedExperienceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  }, []);

  // Remove a filter
  const removeFilter = useCallback((filter: string) => {
    setSelectedSpecialties((prev) => prev.filter((s) => s !== filter));
    setSelectedLanguages((prev) => prev.filter((l) => l !== filter));
    setSelectedExperienceLevels((prev) => prev.filter((l) => l !== filter));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedSpecialties([]);
    setSelectedLanguages([]);
    setSelectedExperienceLevels([]);
  }, []);

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
            Find Your Perfect Guide
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with certified local guides who will help you explore Nepal
            safely and authentically.
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
                  placeholder="Search guides by name, location, or specialty..."
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
                      {/* Specialties dropdown section */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Specialties
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {isLoadingSpecialties ? (
                            <>
                              <Skeleton className="h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                            </>
                          ) : (
                            (
                              specialties || [
                                "Trekking",
                                "Climbing",
                                "Cultural",
                                "Photography",
                                "Wildlife",
                                "Adventure",
                              ]
                            ).map((specialty) => (
                              <Badge
                                key={specialty}
                                variant={
                                  selectedSpecialties.includes(specialty)
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "cursor-pointer justify-start",
                                  selectedSpecialties.includes(specialty)
                                    ? "bg-primary hover:bg-primary/90"
                                    : "hover:bg-primary/10",
                                )}
                                onClick={() => toggleSpecialty(specialty)}
                              >
                                {specialty}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Languages dropdown section */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Languages</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {isLoadingLanguages ? (
                            <>
                              <Skeleton className="h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                              <Skeleton className="h-8 w-full" />
                            </>
                          ) : (
                            (
                              languages || [
                                "English",
                                "Nepali",
                                "Hindi",
                                "Sherpa",
                                "Tibetan",
                              ]
                            ).map((language) => (
                              <Badge
                                key={language}
                                variant={
                                  selectedLanguages.includes(language)
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "cursor-pointer justify-start",
                                  selectedLanguages.includes(language)
                                    ? "bg-primary hover:bg-primary/90"
                                    : "hover:bg-primary/10",
                                )}
                                onClick={() => toggleLanguage(language)}
                              >
                                {language}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Experience Levels dropdown section */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Experience Level
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {["beginner", "intermediate", "expert"].map(
                            (level) => (
                              <Badge
                                key={level}
                                variant={
                                  selectedExperienceLevels.includes(level)
                                    ? "default"
                                    : "outline"
                                }
                                className={cn(
                                  "cursor-pointer justify-start",
                                  selectedExperienceLevels.includes(level)
                                    ? "bg-primary hover:bg-primary/90"
                                    : "hover:bg-primary/10",
                                )}
                                onClick={() => toggleExperienceLevel(level)}
                              >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </Badge>
                            ),
                          )}
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

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <div
            className={cn(
              "relative overflow-hidden",
              "bg-white/95 dark:bg-gray-900/95",
              "backdrop-blur-2xl p-6",
              "rounded-2xl",
              "shadow-[0_8px_40px_rgba(0,0,0,0.08)]",
              "dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]",
              "border border-white/40 dark:border-gray-800/40",
            )}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Guide Locations
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Explore where our guides operate and their areas of expertise
              </p>
            </div>

            {isLoadingLocations ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : (
              <GuideMap
                locations={
                  mapLocations.length > 0
                    ? mapLocations
                    : [
                        {
                          id: "1",
                          name: "Everest Region",
                          coordinates: [86.925026, 27.805646],
                          type: "Trekking & Mountaineering",
                          description:
                            "Home to Mount Everest and iconic high-altitude treks",
                        },
                        {
                          id: "2",
                          name: "Annapurna Region",
                          coordinates: [83.93765, 28.597427],
                          type: "Trekking & Cultural Tours",
                          description:
                            "Famous for diverse landscapes and cultural experiences",
                        },
                        {
                          id: "3",
                          name: "Langtang Region",
                          coordinates: [85.61676, 28.2138],
                          type: "Trekking & Wildlife",
                          description:
                            "Known for pristine valleys and rich biodiversity",
                        },
                        {
                          id: "4",
                          name: "Upper Mustang",
                          coordinates: [83.781944, 29.179167],
                          type: "Cultural & Adventure",
                          description:
                            "Ancient Buddhist kingdom with unique desert landscapes",
                        },
                      ]
                }
                className="w-full"
              />
            )}

            {/* Region Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Active Regions", value: mapLocations.length || "4" },
                { label: "Available Guides", value: guidesData?.total || "24" },
                { label: "Total Treks", value: "50+" },
                { label: "Altitude Range", value: "1,400-5,644m" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 text-center"
                >
                  <div className="text-xl font-semibold text-rose-600 dark:text-rose-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
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

        {/* Guides Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {isLoadingGuides ||
          (debouncedSearchQuery && searchQuery !== debouncedSearchQuery) ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-white/20 dark:border-gray-800 overflow-hidden p-6"
              >
                <div className="flex gap-6">
                  {/* Guide Image Skeleton */}
                  <Skeleton className="w-32 h-32 rounded-xl" />

                  {/* Guide Info Skeleton */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>

                    <Skeleton className="h-10 w-full mt-2" />

                    {/* Tags Skeleton */}
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>

                    {/* Stats and Actions Skeleton */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-20 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : formattedGuides.length > 0 ? (
            // Guides data
            formattedGuides.map((guide) => (
              <motion.div
                key={guide.id}
                variants={item}
                className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-white/20 dark:border-gray-800 overflow-hidden hover:border-primary/50 transition-all"
              >
                <div className="flex gap-6 p-6">
                  {/* Guide Image */}
                  <div className="relative w-32 h-32">
                    <Image
                      width={200}
                      height={200}
                      src={guide.photo || "/guides/guide-1.jpg"}
                      alt={guide.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-full">
                      <span className="text-xs font-medium text-white">
                        {guide.status || "Available"}
                      </span>
                    </div>
                  </div>

                  {/* Guide Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {guide.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 text-primary" />
                          {guide.location}
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-primary">
                        ${guide.hourlyRate || "40"}/day
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {guide.bio}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(guide.specialties || [])
                        .slice(0, 3)
                        .map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/5 text-primary rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                            {guide.rating || "4.5"}
                          </span>
                          <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                            ({guide.reviewCount || "0"})
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {guide.experience || "5+ years"} exp.
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/90"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/90"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => router.push(`/book?guide=${guide.id}`)}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // No guides found
            <div className="col-span-2 py-10 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No guides found matching your criteria. Try adjusting your
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
              Want to Become a Guide?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Join our community of professional guides and share your expertise
              with travelers from around the world.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Apply as Guide
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
