import { Mountain, Languages, Award, Star } from "lucide-react";

export interface Feature {
  icon: typeof Mountain;
  title: string;
  description: string;
}

export const features: Feature[] = [
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

export const animations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  },
};
