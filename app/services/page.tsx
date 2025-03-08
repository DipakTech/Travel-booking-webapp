"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Mountain,
  Camera,
  Users,
  Bike,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Mountain,
    title: "Trekking Expeditions",
    description:
      "Experience the majesty of the Himalayas with our expert mountain guides.",
    price: "from $799",
    duration: "7-14 days",
    features: [
      "Expert local guides",
      "All necessary permits",
      "Safety equipment",
      "Accommodation",
      "Meals during trek",
      "Transportation",
    ],
  },
  {
    icon: Camera,
    title: "Photography Tours",
    description:
      "Capture stunning landscapes and cultural moments with professional guidance.",
    price: "from $599",
    duration: "5-10 days",
    features: [
      "Professional photographer guide",
      "Location scouting",
      "Post-processing tips",
      "Cultural insights",
      "Transport to locations",
      "Accommodation",
    ],
  },
  {
    icon: Users,
    title: "Cultural Immersion",
    description:
      "Dive deep into Nepal's rich traditions and authentic local experiences.",
    price: "from $399",
    duration: "3-7 days",
    features: [
      "Local family homestays",
      "Traditional cooking classes",
      "Festival celebrations",
      "Art & craft workshops",
      "Language lessons",
      "Cultural performances",
    ],
  },
  {
    icon: Bike,
    title: "Adventure Sports",
    description:
      "Get your adrenaline pumping with thrilling outdoor activities.",
    price: "from $299",
    duration: "1-3 days",
    features: [
      "Professional instructors",
      "Quality equipment",
      "Safety briefings",
      "Transport to venues",
      "Insurance coverage",
      "Photo/video service",
    ],
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description:
      "All our services and guides are fully licensed and insured for your peace of mind.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description:
      "Choose from various dates and customize your itinerary to suit your needs.",
  },
  {
    icon: Users,
    title: "Expert Local Guides",
    description:
      "Experienced local guides with deep knowledge of the region and culture.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description:
      "High standards of service with attention to detail and customer satisfaction.",
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

export default function ServicesPage() {
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
            Our Services
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from our range of carefully curated experiences, each
            designed to showcase the best of Nepal while ensuring your comfort
            and safety.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={item}
                className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 dark:border-gray-800 p-8 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/5">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-primary font-medium">
                        {service.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        • {service.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-primary/10 dark:bg-primary/5 hover:bg-primary/20 dark:hover:bg-primary/10 text-primary transition-colors">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:via-transparent dark:to-primary/10 p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We strive to provide the best possible experience for our clients
              through our commitment to quality and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 dark:bg-primary/5 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Contact us to customize any of our services to your specific needs
            and preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Book Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Contact Us
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
