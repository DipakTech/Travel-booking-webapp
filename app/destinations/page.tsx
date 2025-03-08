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
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

const destinations = [
  {
    id: 1,
    title: "Everest Base Camp Trek",
    image: "/destinations/abc.jpg",
    location: "Solukhumbu, Nepal",
    duration: "14 days",
    difficulty: "Challenging",
    bestSeason: "Mar-May, Sep-Nov",
    maxAltitude: "5,364m",
    rating: 4.9,
    reviews: 128,
    description:
      "Trek to the base of the world's highest mountain through stunning Sherpa villages, Buddhist monasteries, and breathtaking Himalayan landscapes.",
  },
  {
    id: 2,
    title: "Annapurna Circuit",
    image: "/destinations/annapurna.jpg",
    location: "Annapurna Region, Nepal",
    duration: "12-16 days",
    difficulty: "Moderate to Challenging",
    bestSeason: "Mar-May, Oct-Nov",
    maxAltitude: "5,416m",
    rating: 4.8,
    reviews: 156,
    description:
      "A classic Himalayan trek circumnavigating the Annapurna massif, featuring diverse landscapes from subtropical forests to high alpine terrain.",
  },
  {
    id: 3,
    title: "Langtang Valley Trek",
    image: "/destinations/annapurna.jpg",
    location: "Langtang Region, Nepal",
    duration: "7-10 days",
    difficulty: "Moderate",
    bestSeason: "Mar-May, Sep-Nov",
    maxAltitude: "4,984m",
    rating: 4.7,
    reviews: 92,
    description:
      "Explore the beautiful Langtang Valley, known for its rich Tamang culture, diverse flora and fauna, and stunning mountain views.",
  },
  {
    id: 4,
    title: "Upper Mustang Trek",
    image: "/destinations/mustang.jpg",
    location: "Mustang Region, Nepal",
    duration: "10-12 days",
    difficulty: "Moderate",
    bestSeason: "Mar-Oct",
    maxAltitude: "3,840m",
    rating: 4.9,
    reviews: 74,
    description:
      "Journey through the ancient kingdom of Lo, featuring dramatic landscapes, cave monasteries, and preserved Tibetan Buddhist culture.",
  },
];

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

export default function DestinationsPage() {
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
            Popular Destinations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover Nepal&apos;s most iconic trekking routes and hidden gems,
            each offering unique experiences and breathtaking landscapes.
          </p>
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
          {destinations.map((destination) => (
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
