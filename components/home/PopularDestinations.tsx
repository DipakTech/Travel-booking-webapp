"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const popularDestinations = [
  {
    id: 1,
    title: "Everest Base Camp",
    image: "/destinations/abc.jpg",
    description: "Trek to the foot of the world's highest peak",
    duration: "14 days",
    difficulty: "Challenging",
    guideId: "1",
  },
  {
    id: 2,
    title: "Annapurna Circuit",
    image: "/destinations/annapurna.jpg",
    description: "A classic trek through diverse landscapes",
    duration: "12-16 days",
    difficulty: "Moderate",
    guideId: "2",
  },
  {
    id: 3,
    title: "Upper Mustang",
    image: "/destinations/mustang.jpg",
    description: "Explore the hidden kingdom of Lo",
    duration: "10 days",
    difficulty: "Moderate",
    guideId: "3",
  },
];

export function PopularDestinations() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the most sought-after trekking routes and cultural
            experiences in Nepal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularDestinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/guides/${destination.guideId}`}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  width={1000}
                  height={1000}
                  src={destination.image}
                  alt={destination.title}
                  className="object-cover  h-[400px] group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {destination.title}
                  </h3>
                  <p className="text-white/90 mb-3">
                    {destination.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{destination.duration}</span>
                    <span>•</span>
                    <span>{destination.difficulty}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/destinations">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90"
            >
              Explore All Destinations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
