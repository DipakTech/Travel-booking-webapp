"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  Mountain,
  MapPin,
  Clock,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Guide } from "@/types/guide";
import { Container } from "@/components/ui/container";
import { GuideMap } from "@/components/map/GuideMap";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Destination {
  id: string;
  title: string;
  heroImage: string;
  duration: string;
  maxAltitude: string;
  startPoint: string;
  endPoint: string;
  bestSeason: string;
  overview: string;
  highlights: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  reviews: Array<{
    id: number;
    user: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  price: number;
  difficulty: string;
  distance: string;
  includes: string[];
  excludes: string[];
  recommendedGuides: (string | number)[];
}

interface MapPoint {
  id: string;
  name: string;
  type: "camp" | "peak" | "village" | "landmark";
  coordinates: [number, number];
  elevation: string;
  description: string;
  dayNumber: number;
}

const mockMapPoints: MapPoint[] = [
  {
    id: "p1",
    name: "Lukla",
    type: "village",
    coordinates: [86.7311, 27.6883],
    elevation: "2,860m",
    description:
      "Gateway to the Everest region, featuring a dramatic mountain airstrip",
    dayNumber: 1,
  },
  {
    id: "p2",
    name: "Namche Bazaar",
    type: "village",
    coordinates: [86.7144, 27.8037],
    elevation: "3,440m",
    description:
      "Historic trading hub and acclimatization point with stunning mountain views",
    dayNumber: 2,
  },
  {
    id: "p3",
    name: "Dingboche",
    type: "camp",
    coordinates: [86.8294, 27.8946],
    elevation: "4,410m",
    description: "Popular acclimatization stop with views of Ama Dablam",
    dayNumber: 4,
  },
  {
    id: "p4",
    name: "Everest Base Camp",
    type: "landmark",
    coordinates: [86.8525, 28.0021],
    elevation: "5,364m",
    description: "The legendary base camp of Mount Everest expeditions",
    dayNumber: 8,
  },
  {
    id: "p5",
    name: "Mount Everest",
    type: "peak",
    coordinates: [86.925, 27.9881],
    elevation: "8,848m",
    description: "The world's highest peak, known as Sagarmatha in Nepal",
    dayNumber: 8,
  },
];

interface DestinationDetailProps {
  destination: Destination;
  recommendedGuides: Guide[];
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function DestinationDetail({
  destination,
  recommendedGuides,
}: DestinationDetailProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      {/* Hero Section */}
      <Container>
        <div className="relative h-[60vh]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
            <motion.img
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              src={destination.heroImage}
              alt={destination.title}
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-end pb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent">
              {destination.title}
            </h1>
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="flex flex-wrap gap-4 text-white/90"
            >
              {[
                { icon: Clock, text: destination.duration },
                {
                  icon: Mountain,
                  text: `Max Altitude: ${destination.maxAltitude}`,
                },
                {
                  icon: MapPin,
                  text: `${destination.startPoint} to ${destination.endPoint}`,
                },
                {
                  icon: Calendar,
                  text: `Best Season: ${destination.bestSeason}`,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.text}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Map and Trek Details Bento Grid */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8"
        >
          {/* Interactive Map */}
          <motion.div
            variants={fadeInUp}
            className={cn(
              "md:col-span-2 relative overflow-hidden",
              "bg-gradient-to-br from-white/80 via-white/70 to-white/60",
              "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
              "backdrop-blur-xl rounded-2xl",
              "border border-gray-200/20 dark:border-gray-800/20",
              "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
              "p-6 h-[500px]",
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
            <div className="relative z-10 h-full">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                Trek Route Map
              </h2>
              <GuideMap
                locations={mockMapPoints.map((point) => ({
                  id: point.id,
                  name: point.name,
                  coordinates: point.coordinates,
                  type: point.type,
                  description: `Day ${point.dayNumber} - ${point.elevation}\n${point.description}`,
                }))}
                className="w-full h-[calc(100%-2rem)] rounded-xl overflow-hidden"
              />
            </div>
          </motion.div>

          {/* Trek Stats */}
          <motion.div variants={fadeInUp} className="space-y-4">
            {/* Elevation Profile */}
            <div
              className={cn(
                "relative overflow-hidden",
                "bg-gradient-to-br from-white/80 via-white/70 to-white/60",
                "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
                "backdrop-blur-xl rounded-2xl",
                "border border-gray-200/20 dark:border-gray-800/20",
                "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-semibold p-6 pb-0 text-lg mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  Trek Points
                </h3>
                <ScrollArea className="space-y-4 h-[400px] px-6">
                  {mockMapPoints.map((point) => (
                    <motion.div
                      key={point.id}
                      whileHover={{ x: 4 }}
                      className={cn(
                        "flex items-start p-3 rounded-lg",
                        "bg-white/50 dark:bg-gray-800/50",
                        "hover:bg-primary/5 dark:hover:bg-primary/10",
                        "border border-transparent",
                        "hover:border-primary/20 dark:hover:border-primary/20",
                        "transition-all duration-300",
                        "cursor-pointer",
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">
                            Day {point.dayNumber}
                          </span>
                          <span className="text-sm text-gray-500">
                            {point.elevation}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {point.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {point.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="lg:col-span-2 space-y-8"
            >
              {/* Overview */}
              <motion.div
                variants={fadeInUp}
                className={cn(
                  "relative overflow-hidden",
                  "bg-gradient-to-br from-white/80 via-white/70 to-white/60",
                  "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
                  "backdrop-blur-xl rounded-2xl",
                  "border border-gray-200/20 dark:border-gray-800/20",
                  "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
                  "p-6 transition-all duration-300",
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Overview
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {destination.overview}
                  </p>
                </div>
              </motion.div>

              {/* Highlights */}
              <motion.div
                variants={fadeInUp}
                className={cn(
                  "relative overflow-hidden",
                  "bg-gradient-to-br from-white/80 via-white/70 to-white/60",
                  "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
                  "backdrop-blur-xl rounded-2xl",
                  "border border-gray-200/20 dark:border-gray-800/20",
                  "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
                  "p-6 transition-all duration-300",
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Trek Highlights
                  </h2>
                  <motion.div variants={stagger} className="grid gap-3">
                    {destination.highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        className="flex items-start group"
                      >
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3 transition-transform group-hover:scale-110" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {highlight}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Itinerary */}
              <motion.div
                variants={fadeInUp}
                className={cn(
                  "relative overflow-hidden",
                  "bg-gradient-to-br from-white/80 via-white/70 to-white/60",
                  "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
                  "backdrop-blur-xl rounded-2xl",
                  "border border-gray-200/20 dark:border-gray-800/20",
                  "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
                  "p-6 transition-all duration-300",
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Itinerary
                  </h2>
                  <motion.div variants={stagger} className="space-y-6">
                    {destination.itinerary.map((day) => (
                      <motion.div
                        key={day.day}
                        variants={fadeInUp}
                        className="border-l-2 border-primary pl-4 ml-2 group"
                      >
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">
                          Day {day.day}: {day.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {day.description}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Reviews */}
              <motion.div
                variants={fadeInUp}
                className={cn(
                  "relative overflow-hidden",
                  "bg-gradient-to-br from-white/80 via-white/70 to-white/60",
                  "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
                  "backdrop-blur-xl rounded-2xl",
                  "border border-gray-200/20 dark:border-gray-800/20",
                  "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
                  "p-6 transition-all duration-300",
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Reviews
                  </h2>
                  <motion.div variants={stagger} className="space-y-6">
                    {destination.reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        variants={fadeInUp}
                        className="border-b border-gray-200/20 dark:border-gray-800/20 pb-6 last:border-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {review.user}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex items-center bg-yellow-400/10 px-2 py-1 rounded-full">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-yellow-600 dark:text-yellow-400">
                              {review.rating}.0
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {review.comment}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              {/* Quick Info */}
              <motion.div
                variants={fadeInUp}
                className={cn(
                  "relative overflow-hidden",
                  "bg-gradient-to-br from-white/80 via-white/70 to-white/60",
                  "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
                  "backdrop-blur-xl rounded-2xl",
                  "border border-gray-200/20 dark:border-gray-800/20",
                  "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
                  "p-6 transition-all duration-300",
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
                <div className="relative z-10">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent mb-2">
                    ${destination.price}
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-normal ml-1">
                      /person
                    </span>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
                      Book This Trek
                    </Button>
                  </motion.div>
                  <div className="space-y-4 pt-4 border-t border-gray-200/20 dark:border-gray-800/20">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Difficulty:
                      </span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        {destination.difficulty}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Distance:
                      </span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        {destination.distance}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Includes/Excludes */}
              <motion.div
                variants={fadeInUp}
                className={cn(
                  "relative overflow-hidden",
                  "bg-gradient-to-br from-white/80 via-white/70 to-white/60",
                  "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
                  "backdrop-blur-xl rounded-2xl",
                  "border border-gray-200/20 dark:border-gray-800/20",
                  "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
                  "p-6 transition-all duration-300",
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    What&apos;s Included
                  </h3>
                  <motion.div variants={stagger} className="space-y-2 mb-6">
                    {destination.includes.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        className="flex items-start group"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5 mr-2 transition-transform group-hover:scale-110" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                  <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Not Included
                  </h3>
                  <motion.div variants={stagger} className="space-y-2">
                    {destination.excludes.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        className="flex items-start group"
                      >
                        <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5 mr-2 transition-transform group-hover:scale-110" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Recommended Guides */}
              <motion.div
                variants={fadeInUp}
                className={cn(
                  "relative overflow-hidden",
                  "bg-gradient-to-br from-white/80 via-white/70 to-white/60",
                  "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
                  "backdrop-blur-xl rounded-2xl",
                  "border border-gray-200/20 dark:border-gray-800/20",
                  "shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30",
                  "p-6 transition-all duration-300",
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="font-semibold text-lg mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Recommended Guides
                  </h3>
                  <motion.div variants={stagger} className="space-y-4">
                    {recommendedGuides.map((guide) => (
                      <motion.div
                        key={guide.id}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02 }}
                        className="group"
                      >
                        <Link
                          href={`/guides/${guide.id}`}
                          className={cn(
                            "flex items-center p-3 rounded-lg",
                            "bg-white/50 dark:bg-gray-800/50",
                            "hover:bg-primary/5 dark:hover:bg-primary/10",
                            "border border-transparent",
                            "hover:border-primary/20 dark:hover:border-primary/20",
                            "transition-all duration-300",
                          )}
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                              src={guide.image}
                              alt={guide.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">
                              {guide.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {guide.specialties[0]}
                            </p>
                          </div>
                          <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
}
