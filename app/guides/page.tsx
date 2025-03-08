import { Metadata } from "next";
import { GuidesContent } from "@/components/guides/GuidesContent";

export const metadata: Metadata = {
  title: "Find Guides - Nepal Guide Connect",
  description:
    "Connect with certified local guides who will help you explore Nepal safely and authentically. Find experienced trekking guides for your adventure.",
  openGraph: {
    title: "Find Your Perfect Guide - Nepal Guide Connect",
    description:
      "Connect with certified local guides who will help you explore Nepal safely and authentically. Find experienced trekking guides for your adventure.",
    images: [
      {
        url: "/og/guides.jpg",
        width: 1200,
        height: 630,
        alt: "Nepal Guide Connect - Find Guides",
      },
    ],
  },
};

export default function GuidesPage() {
  return <GuidesContent />;
}
