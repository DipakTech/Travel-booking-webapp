"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Mountain,
  Camera,
  Heart,
  Star,
  ArrowRight,
  Shield,
  Award,
  Clock,
  Link,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

const popularDestinations = [
  {
    title: "Everest Base Camp",
    image: "/destinations/abc.jpg",
    location: "Solukhumbu",
    rating: 4.9,
    reviews: 128,
    price: "from $1,299",
  },
  {
    title: "Annapurna Circuit",
    image: "/destinations/annapurna.jpg",
    location: "Annapurna",
    rating: 4.8,
    reviews: 156,
    price: "from $999",
  },
  {
    title: "Upper Mustang",
    image: "/destinations/mustang.jpg",
    location: "Mustang",
    rating: 4.9,
    reviews: 74,
    price: "from $1,499",
  },
];

const features = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description: "All our guides and services are fully licensed and insured",
  },
  {
    icon: Award,
    title: "Expert Local Guides",
    description: "Professional guides with years of experience",
  },
  {
    icon: Heart,
    title: "Personalized Service",
    description: "Customized experiences for your needs",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance during your trip",
  },
];

const services = [
  {
    icon: Mountain,
    title: "Trekking Tours",
    description: "Guided treks through Nepal's most stunning routes",
  },
  {
    icon: Camera,
    title: "Photography Tours",
    description: "Capture the beauty of Nepal with expert guidance",
  },
  {
    icon: Users,
    title: "Cultural Tours",
    description: "Immerse yourself in Nepal's rich traditions",
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

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center">
        {/* Video Background */}
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

        {/* Hero Content */}
        <Container className="relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Nepal Adventure{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Begins Here
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl">
              Connect with expert local guides for authentic Himalayan
              experiences. From trekking to cultural tours, we&apos;ve got you
              covered.
            </p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={cn(
                "relative overflow-hidden",
                "bg-white/95 dark:bg-gray-900/95",
                "backdrop-blur-2xl p-6 sm:p-8",
                "rounded-[2rem]",
                "shadow-[0_8px_40px_rgba(0,0,0,0.12)]",
                "dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]",
                "border border-white/40 dark:border-gray-800/40",
                "group",
              )}
            >
              {/* Glass effect overlays */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20 dark:from-white/5 dark:via-white/2 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-100/20 via-transparent to-transparent dark:from-rose-500/[0.05] dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Find Your Perfect Guide
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Search through our network of professional mountain guides
                  </p>
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  {/* Location Input */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="relative group/input md:col-span-2"
                  >
                    <div className="absolute left-3 top-3 transition-transform duration-300 group-focus-within/input:scale-110">
                      <MapPin className="h-5 w-5 text-rose-500" />
                    </div>
                    <Input
                      placeholder="Where would you like to go?"
                      className={cn(
                        "pl-10 h-12",
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
                  </motion.div>

                  {/* Date Input */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="relative group/input"
                  >
                    <div className="absolute left-3 top-3 transition-transform duration-300 group-focus-within/input:scale-110">
                      <Calendar className="h-5 w-5 text-rose-500" />
                    </div>
                    <Input
                      type="date"
                      className={cn(
                        "pl-10 h-12",
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
                  </motion.div>

                  {/* Search Button */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Button
                      className={cn(
                        "w-full h-12",
                        "bg-gradient-to-r from-rose-500 to-rose-600",
                        "hover:from-rose-600 hover:to-rose-700",
                        "text-white font-medium",
                        "shadow-lg shadow-rose-500/25 dark:shadow-rose-500/15",
                        "rounded-xl",
                        "transition-all duration-300",
                        "group/button",
                        "border border-rose-400/20",
                      )}
                    >
                      <Search className="h-5 w-5 mr-2 transition-transform duration-300 group-hover/button:scale-110" />
                      <span className="relative">
                        Search
                        <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-white/0 via-white to-white/0" />
                      </span>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Popular Searches */}
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Popular:
                  </span>
                  {["Everest Base Camp", "Annapurna", "Langtang"].map(
                    (term, index) => (
                      <button
                        key={term}
                        className={cn(
                          "px-3 py-1 rounded-full",
                          "text-gray-600 dark:text-gray-300",
                          "bg-gray-100/80 dark:bg-gray-800/80",
                          "hover:bg-rose-50 dark:hover:bg-rose-900/20",
                          "hover:text-rose-600 dark:hover:text-rose-400",
                          "transition-all duration-300",
                          "text-sm",
                        )}
                      >
                        {term}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <Container>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={item}
                  className="text-center group"
                >
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 dark:bg-primary/5 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
              Popular Destinations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover Nepal&apos;s most sought-after destinations and start
              planning your next adventure.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {popularDestinations.map((destination) => (
              <motion.div
                key={destination.title}
                variants={item}
                className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-white/20 dark:border-gray-800 overflow-hidden hover:border-primary/50 transition-all"
              >
                <div className="relative h-64">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Image
                    width={200}
                    height={200}
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {destination.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/90">
                        <MapPin className="h-4 w-4" />
                        <span>{destination.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-white">
                          {destination.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">
                      {destination.price}
                    </span>
                    <Button
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
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose from our range of expertly crafted experiences.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  variants={item}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center group hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                >
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 dark:bg-primary/5 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {service.description}
                  </p>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Learn More
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Light mode background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 dark:opacity-0" />
          {/* Dark mode background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 opacity-0 dark:opacity-100" />
          {/* Common overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        {/* Animated Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl animate-pulse delay-1000" />

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top decorative line */}
          <div className="absolute top-10 left-0 right-0 h-[1px]">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/30 to-transparent" />
          </div>
          {/* Bottom decorative line */}
          <div className="absolute bottom-10 left-0 right-0 h-[1px]">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/20 dark:via-primary/30 to-transparent" />
          </div>
        </div>

        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative max-w-3xl mx-auto text-center"
          >
            {/* Floating Elements */}
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                rotate: [0, 1, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-8 -top-8 w-16 h-16 border-2 border-primary/20 dark:border-primary/30 rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, -1, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-4 -bottom-4 w-20 h-20 border-2 border-primary/20 dark:border-primary/30 rounded-full"
            />

            {/* Main Content */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                Ready to Start Your{" "}
                <span className="relative inline-block">
                  Nepal Adventure?
                  <span className="absolute inset-x-0 bottom-0 h-[6px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                </span>
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg mb-12 leading-relaxed text-gray-700 dark:text-gray-300"
            >
              Connect with expert local guides and create unforgettable memories
              in the heart of the Himalayas. Your journey begins with a single
              step.
            </motion.p>

            {/* Buttons with Enhanced Effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button
                size="lg"
                onClick={() => router.push("/guides")}
                className="relative group bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] min-w-[180px]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Find a Guide
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="relative group border-2 border-primary text-primary dark:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 backdrop-blur-sm min-w-[180px] overflow-hidden"
              >
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
