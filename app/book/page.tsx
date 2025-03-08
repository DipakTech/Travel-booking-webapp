"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  MapPin,
  Mountain,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  Info,
  Star,
  Shield,
  Heart,
} from "lucide-react";

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

export default function BookingPage() {
  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Background */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 dark:from-primary/10 dark:to-blue-500/10" /> */}

        {/* Animated Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />

        {/* Decorative Circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      <Container className="relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Book Your Adventure
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Fill out the form below to start planning your perfect Nepal
              adventure. Our expert team will get back to you within 24 hours.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: Shield,
                title: "Secure Booking",
                description: "Safe & encrypted process",
              },
              {
                icon: Star,
                title: "Best Price",
                description: "Guaranteed fair pricing",
              },
              {
                icon: Heart,
                title: "Personalized",
                description: "Customized to your needs",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="relative group"
              >
                <div className="relative p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 dark:from-primary/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex flex-col items-center text-center">
                    <feature.icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Booking Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden"
          >
            {/* Card Decoration */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-blue-500 to-primary" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]" />

            <div className="relative p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Trip Details */}
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                      <Mountain className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                      Trip Details
                    </h2>
                  </div>

                  <motion.div variants={item} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Destination
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                      <select className="w-full pl-10 h-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary dark:focus:border-primary text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                        <option value="">Select Destination</option>
                        <option value="everest">Everest Base Camp</option>
                        <option value="annapurna">Annapurna Circuit</option>
                        <option value="mustang">Upper Mustang</option>
                      </select>
                    </div>
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Start Date
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                      <Input
                        type="date"
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary dark:focus:border-primary transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Duration (Days)
                    </label>
                    <div className="relative group">
                      <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                      <Input
                        type="number"
                        min="1"
                        placeholder="Number of days"
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary dark:focus:border-primary transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Group Size
                    </label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                      <Input
                        type="number"
                        min="1"
                        placeholder="Number of travelers"
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary dark:focus:border-primary transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Column - Contact Information */}
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                      <Info className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                      Contact Information
                    </h2>
                  </div>

                  <motion.div variants={item} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary dark:focus:border-primary transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary dark:focus:border-primary transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary dark:focus:border-primary transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={item} className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Special Requirements
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Any special requirements or preferences?"
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary dark:focus:border-primary text-gray-900 dark:text-white resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
              >
                <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <span className="flex items-center justify-center gap-2">
                    Book Now
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                  By clicking Book Now, you agree to our{" "}
                  <a
                    href="/terms"
                    className="text-primary hover:text-primary/90 underline"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-primary hover:text-primary/90 underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
