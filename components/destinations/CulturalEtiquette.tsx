"use client";

import { Heart, Landmark, Camera, Hand } from "lucide-react";

const guidelines = [
  {
    icon: Landmark,
    title: "Religious Sites",
    guidelines: [
      "Remove shoes before entering temples",
      "Walk clockwise around stupas",
      "Dress modestly (cover shoulders and knees)",
      "Ask permission before photographing ceremonies",
    ],
  },
  {
    icon: Heart,
    title: "Social Interactions",
    guidelines: [
      "Greet with 'Namaste' (hands pressed together)",
      "Ask permission before touching someone's head",
      "Use right hand for eating and passing objects",
      "Public displays of affection are discouraged",
    ],
  },
  {
    icon: Camera,
    title: "Photography",
    guidelines: [
      "Always ask before photographing people",
      "Some temples prohibit photography inside",
      "Respect 'no photography' signs",
      "Be mindful during religious ceremonies",
    ],
  },
  {
    icon: Hand,
    title: "General Customs",
    guidelines: [
      "Remove shoes before entering homes",
      "Pointing with feet is considered disrespectful",
      "Dress modestly in rural areas",
      "Accept food/drink with right hand",
    ],
  },
];

export function CulturalEtiquette() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Cultural Etiquette
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {guidelines.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white rounded-lg shadow-sm p-6 space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {section.guidelines.map((guideline) => (
                  <li
                    key={guideline}
                    className="text-sm text-gray-600 flex items-start"
                  >
                    <span className="mr-2">•</span>
                    {guideline}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
