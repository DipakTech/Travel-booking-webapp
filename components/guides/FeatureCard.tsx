"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { animations } from "@/data/guides-page";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <motion.div
      variants={animations.item}
      className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-800 p-6 text-center group hover:border-primary/50 transition-all"
    >
      <div className="inline-flex p-3 rounded-xl bg-primary/10 dark:bg-primary/5 mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
}
