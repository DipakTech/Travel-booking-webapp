"use client";

import { Sun, Cloud, CloudRain, Snowflake } from "lucide-react";

const seasons = [
  {
    name: "Spring (March-May)",
    icon: Sun,
    weather: "Moderate temperatures, clear skies",
    trekking: "Ideal for most treks, rhododendrons in bloom",
    crowdLevel: "High",
    recommendation: "Highly Recommended",
  },
  {
    name: "Summer/Monsoon (June-August)",
    icon: CloudRain,
    weather: "Warm, heavy rainfall, humid",
    trekking: "Limited visibility, leeches present",
    crowdLevel: "Low",
    recommendation: "Not Recommended",
  },
  {
    name: "Autumn (September-November)",
    icon: Cloud,
    weather: "Clear skies, stable conditions",
    trekking: "Perfect visibility, stable trails",
    crowdLevel: "Very High",
    recommendation: "Most Recommended",
  },
  {
    name: "Winter (December-February)",
    icon: Snowflake,
    weather: "Cold, possible snow at altitude",
    trekking: "Challenging conditions, some passes closed",
    crowdLevel: "Low",
    recommendation: "For Experienced Trekkers",
  },
];

export function SeasonalGuide() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Seasonal Guide</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {seasons.map((season) => {
          const Icon = season.icon;
          return (
            <div
              key={season.name}
              className="bg-white rounded-lg shadow-sm p-6 space-y-4"
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {season.name}
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Weather:</span> {season.weather}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Trekking:</span>{" "}
                  {season.trekking}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Crowd Level:</span>{" "}
                  {season.crowdLevel}
                </p>
                <p
                  className={`text-sm font-medium ${
                    season.recommendation.includes("Not")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {season.recommendation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
