"use client";

import { notFound, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { DestinationForm } from "@/components/dashboard/destinations/DestinationForm";

// Mock data - in a real app, this would come from a database
const destinations = [
  {
    id: "D001",
    name: "Everest Base Camp",
    location: "Khumbu Region, Nepal",
    description:
      "Trek to the world's highest mountain base camp. The journey begins with a flight to Lukla, followed by a trek through Sherpa villages, dense forests, and glacial moraines.",
    longDescription:
      "The Everest Base Camp trek is one of the most popular trekking routes in Nepal. It takes you through stunning mountain scenery, traditional Sherpa villages, and ultimately to the base of Mount Everest, the highest mountain in the world. The trek is challenging but rewarding, offering breathtaking views of the Himalayan mountain range including Everest, Lhotse, Nuptse, and Ama Dablam. Along the way, trekkers experience the unique Sherpa culture, visit ancient monasteries, and traverse through the beautiful Sagarmatha National Park.",
    altitude: "5,364 meters",
    bestSeason: "March-May, September-November",
    difficulty: "Moderate to Challenging",
    duration: "12-16 days",
    averageCost: "$1,500 - $3,000",
    rating: 4.9,
    visitors: 2500,
    upcomingTours: 12,
    status: "popular",
    mainImage: "/destinations/everest.jpg",
    gallery: [
      "/destinations/everest-1.jpg",
      "/destinations/everest-2.jpg",
      "/destinations/everest-3.jpg",
    ],
    highlights: [
      "Panoramic views of Mount Everest and surrounding peaks",
      "Experience of Sherpa culture and traditions",
      "Visit to ancient monasteries including Tengboche Monastery",
      "Stay in traditional teahouses along the route",
      "Cross suspension bridges over deep gorges",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        description:
          "Welcome at the airport and transfer to hotel. Briefing about the trek.",
      },
      {
        day: 2,
        title: "Fly to Lukla and trek to Phakding",
        description:
          "Early morning flight to Lukla (2,800m) and trek to Phakding (2,652m).",
      },
      {
        day: 3,
        title: "Trek to Namche Bazaar",
        description:
          "Trek from Phakding to Namche Bazaar (3,440m), the main trading center of the region.",
      },
      {
        day: 4,
        title: "Acclimatization in Namche",
        description:
          "Rest day in Namche with short hike to Everest View Hotel for acclimatization.",
      },
      {
        day: 5,
        title: "Trek to Tengboche",
        description:
          "Trek to Tengboche (3,870m), home to the largest monastery in the region.",
      },
    ],
  },
];

export default function EditDestinationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const destination = destinations.find((d) => d.id === params.id);

  if (!destination) {
    notFound();
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // In a real application, this would send the data to an API
      console.log(data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to destination details
      router.push(`/dashboard/destinations/${params.id}`);
    } catch (error) {
      console.error("Error updating destination:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/destinations/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Edit Destination
          </h2>
          <p className="text-muted-foreground">
            Update information for {destination.name}
          </p>
        </div>
      </div>

      <DestinationForm
        defaultValues={{
          name: destination.name,
          location: destination.location,
          description: destination.description,
          longDescription: destination.longDescription,
          altitude: destination.altitude,
          bestSeason: destination.bestSeason,
          difficulty: destination.difficulty,
          duration: destination.duration,
          averageCost: destination.averageCost,
          status: destination.status,
          highlights: destination.highlights?.join("\n"),
          // Other fields would be passed here
        }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
