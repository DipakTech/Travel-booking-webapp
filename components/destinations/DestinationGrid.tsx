"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Mountain, Calendar } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "Everest Base Camp Trek",
    image: "/destinations/abc.jpg",
    duration: "14 days",
    difficulty: "Challenging",
    bestSeason: "Mar-May, Sep-Nov",
    description:
      "Trek to the base of the world's highest mountain through Sherpa villages and Buddhist monasteries.",
  },
  {
    id: 2,
    name: "Annapurna Circuit",
    image: "/destinations/annapurna.jpg",
    duration: "12-16 days",
    difficulty: "Moderate to Challenging",
    bestSeason: "Oct-Nov, Mar-Apr",
    description:
      "A classic Himalayan trek circling the Annapurna massif through diverse landscapes and cultures.",
  },
  {
    id: 3,
    name: "Kathmandu Cultural Tour",
    image: "/destinations/kathmandu.jpg",
    duration: "3-5 days",
    difficulty: "Easy",
    bestSeason: "Year-round",
    description:
      "Explore UNESCO World Heritage sites and ancient temples in the Kathmandu Valley.",
  },
  {
    id: 4,
    name: "Upper Mustang Trek",
    image: "/destinations/mustang.jpg",
    duration: "10-12 days",
    difficulty: "Moderate",
    bestSeason: "Jun-Aug",
    description:
      "Journey through the hidden kingdom of Lo, featuring Tibetan culture and dramatic desert landscapes.",
  },
];

export function DestinationGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {destinations.map((destination) => (
        <Link
          key={destination.id}
          href={`/destinations/${destination.id}`}
          className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          <div className="aspect-w-16 aspect-h-9 relative">
            <Image
              src={destination.image}
              alt={destination.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary">
              {destination.name}
            </h3>
            <p className="text-gray-600">{destination.description}</p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {destination.duration}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mountain className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {destination.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {destination.bestSeason}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
