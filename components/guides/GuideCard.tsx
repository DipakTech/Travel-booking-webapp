"use client";

import { motion } from "framer-motion";
import { Star, MapPin, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { animations } from "@/data/guides-page";
import { Guide } from "@/types/guide";
import Image from "next/image";

interface GuideCardProps {
  guide: Guide;
}

export function GuideCard({ guide }: GuideCardProps) {
  const router = useRouter();

  return (
    <motion.div
      variants={animations.item}
      className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-white/20 dark:border-gray-800 overflow-hidden hover:border-primary/50 transition-all"
    >
      <div className="flex gap-6 p-6">
        {/* Guide Image */}
        <div className="relative w-32 h-32">
          <Image
            height={300}
            width={300}
            src={guide.image}
            alt={guide.name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-full">
            <span className="text-xs font-medium text-white">
              {guide.availability || "Available"}
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
              $
              {typeof guide.price === "number"
                ? guide.price
                : guide.price.replace(/[^\d]/g, "")}
              /day
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {guide.bio || guide.about}
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
  );
}
