"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

const guides = [
  {
    id: 1,
    name: "Pemba Sherpa",
    image: "/guides/guide-1.jpg",
    specialties: ["Himalayan Trekking", "Cultural Heritage"],
    languages: ["English", "Nepali", "Sherpa"],
    rating: 4.9,
    reviews: 127,
    location: "Solukhumbu",
    price: 45,
  },
  {
    id: 2,
    name: "Maya Tamang",
    image: "/guides/guide-2.jpg",
    specialties: ["Cultural Heritage", "Spiritual Tours"],
    languages: ["English", "Nepali", "Hindi"],
    rating: 4.8,
    reviews: 93,
    location: "Kathmandu",
    price: 35,
  },
  // Add more guide data here
];

export function GuideGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {guides.map((guide) => (
        <Link
          key={guide.id}
          href={`/guides/${guide.id}`}
          className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="aspect-w-16 aspect-h-9 relative rounded-t-lg overflow-hidden">
            <Image
              src={guide.image}
              alt={guide.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                {guide.name}
              </h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">
                  {guide.rating}
                </span>
                <span className="text-sm text-gray-500">
                  ({guide.reviews} reviews)
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500">{guide.location}</p>
            <div className="flex flex-wrap gap-2">
              {guide.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="text-sm text-gray-500">
                Speaks: {guide.languages.join(", ")}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                ${guide.price}/day
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
