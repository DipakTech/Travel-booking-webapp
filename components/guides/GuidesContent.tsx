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
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GuideMap } from "@/components/map/GuideMap";
import Image from "next/image";

const guides = [
  {
    id: 1,
    name: "Pemba Sherpa",
    image: "/guides/guide-1.jpg",
    location: "Solukhumbu",
    rating: 4.9,
    reviews: 124,
    experience: "12 years",
    languages: ["English", "Nepali", "Sherpa"],
    specialties: ["High Altitude", "Everest Region", "Photography"],
    certifications: ["IFMGA/UIAGM", "Wilderness First Aid"],
    price: "$45/day",
    availability: "Available",
    bio: "Professional mountain guide with extensive experience in the Everest region. Certified in high-altitude expeditions and wilderness first aid.",
  },
  {
    id: 2,
    name: "Maya Gurung",
    image: "/guides/guide-2.jpg",
    location: "Pokhara",
    rating: 4.8,
    reviews: 98,
    experience: "8 years",
    languages: ["English", "Nepali", "Hindi"],
    specialties: ["Cultural Tours", "Annapurna Region", "Yoga"],
    certifications: ["Nepal Guide License", "Yoga Instructor"],
    price: "$35/day",
    availability: "Available from March",
    bio: "Specialized in cultural tours and trekking in the Annapurna region. Certified yoga instructor offering unique trekking and yoga experiences.",
  },
  {
    id: 3,
    name: "Tashi Lama",
    image: "/guides/guide-1.jpg",
    location: "Mustang",
    rating: 4.9,
    reviews: 86,
    experience: "15 years",
    languages: ["English", "Nepali", "Tibetan"],
    specialties: ["Buddhist Culture", "Upper Mustang", "Photography"],
    certifications: ["Cultural Guide License", "Photography"],
    price: "$40/day",
    availability: "Limited Availability",
    bio: "Expert in Upper Mustang region with deep knowledge of Buddhist culture and local traditions. Professional photographer guide.",
  },
  {
    id: 4,
    name: "Nima Tamang",
    image: "/guides/guide-1.jpg",
    location: "Langtang",
    rating: 4.7,
    reviews: 72,
    experience: "10 years",
    languages: ["English", "Nepali", "Tamang"],
    specialties: ["Wildlife", "Langtang Region", "Camping"],
    certifications: ["Trekking Guide License", "Wildlife Expert"],
    price: "$38/day",
    availability: "Available",
    bio: "Specialized in wildlife tours and camping treks in the Langtang region. Expert in local flora, fauna, and wilderness survival.",
  },
];

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
                />
              </div>

              {/* Filter Button */}
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
                )}
              >
                <Filter className="h-5 w-5 mr-2 transition-transform duration-300 group-hover/button:scale-110" />
                Filters
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Specialties */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Specialty:
                </span>
                {["Trekking", "Climbing", "Cultural", "Photography"].map(
                  (specialty) => (
                    <button
                      key={specialty}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm",
                        "bg-gray-100/80 dark:bg-gray-800/80",
                        "hover:bg-rose-50 dark:hover:bg-rose-900/20",
                        "text-gray-600 dark:text-gray-300",
                        "hover:text-rose-600 dark:hover:text-rose-400",
                        "border border-transparent",
                        "hover:border-rose-500/20 dark:hover:border-rose-500/10",
                        "transition-all duration-300",
                      )}
                    >
                      {specialty}
                    </button>
                  ),
                )}
              </div>

              {/* Languages */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Language:
                </span>
                {["English", "Nepali", "Hindi"].map((language) => (
                  <button
                    key={language}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm",
                      "bg-gray-100/80 dark:bg-gray-800/80",
                      "hover:bg-rose-50 dark:hover:bg-rose-900/20",
                      "text-gray-600 dark:text-gray-300",
                      "hover:text-rose-600 dark:hover:text-rose-400",
                      "border border-transparent",
                      "hover:border-rose-500/20 dark:hover:border-rose-500/10",
                      "transition-all duration-300",
                    )}
                  >
                    {language}
                  </button>
                ))}
              </div>

              {/* Experience Level */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Experience:
                </span>
                {["Beginner", "Intermediate", "Expert"].map((level) => (
                  <button
                    key={level}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm",
                      "bg-gray-100/80 dark:bg-gray-800/80",
                      "hover:bg-rose-50 dark:hover:bg-rose-900/20",
                      "text-gray-600 dark:text-gray-300",
                      "hover:text-rose-600 dark:hover:text-rose-400",
                      "border border-transparent",
                      "hover:border-rose-500/20 dark:hover:border-rose-500/10",
                      "transition-all duration-300",
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Filters:
              </span>
              {["Trekking", "English", "Expert"].map((filter) => (
                <span
                  key={filter}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    "bg-rose-50 dark:bg-rose-500/10",
                    "text-rose-600 dark:text-rose-400",
                    "border border-rose-200/50 dark:border-rose-500/20",
                    "flex items-center gap-1",
                    "group/filter",
                  )}
                >
                  {filter}
                  <XCircle className="h-4 w-4 cursor-pointer opacity-50 group-hover/filter:opacity-100 transition-opacity" />
                </span>
              ))}
            </div>
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

            <GuideMap
              locations={[
                {
                  id: 1,
                  name: "Everest Region",
                  coordinates: [86.925026, 27.805646],
                  type: "Trekking & Mountaineering",
                  description:
                    "Home to Mount Everest and iconic high-altitude treks",
                },
                {
                  id: 2,
                  name: "Annapurna Region",
                  coordinates: [83.93765, 28.597427],
                  type: "Trekking & Cultural Tours",
                  description:
                    "Famous for diverse landscapes and cultural experiences",
                },
                {
                  id: 3,
                  name: "Langtang Region",
                  coordinates: [85.61676, 28.2138],
                  type: "Trekking & Wildlife",
                  description:
                    "Known for pristine valleys and rich biodiversity",
                },
                {
                  id: 4,
                  name: "Upper Mustang",
                  coordinates: [83.781944, 29.179167],
                  type: "Cultural & Adventure",
                  description:
                    "Ancient Buddhist kingdom with unique desert landscapes",
                },
              ]}
              className="w-full"
            />

            {/* Region Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Active Regions", value: "4" },
                { label: "Available Guides", value: "24" },
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
          {guides.map((guide) => (
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
                    src={guide.image}
                    alt={guide.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-medium text-white">
                      {guide.availability}
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
                      {guide.price}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {guide.bio}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {guide.specialties.map((specialty) => (
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
                          {guide.rating}
                        </span>
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                          ({guide.reviews})
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {guide.experience} exp.
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
                        onClick={() => router.push("/book")}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
