"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Sun,
  Snowflake,
  Umbrella
} from "lucide-react";

interface SeasonProps {
  name: string;
  months: string;
  icon: JSX.Element;
  conditions: string;
  recommended: boolean;
}

const seasons: SeasonProps[] = [
  {
    name: "Spring",
    months: "March - May",
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
    conditions: "Clear skies, moderate temperatures",
    recommended: true
  },
  {
    name: "Monsoon",
    months: "June - August",
    icon: <Umbrella className="h-6 w-6 text-blue-500" />,
    conditions: "Heavy rainfall, limited visibility",
    recommended: false
  },
  {
    name: "Autumn",
    months: "September - November",
    icon: <Cloud className="h-6 w-6 text-gray-500" />,
    conditions: "Clear skies, perfect visibility",
    recommended: true
  },
  {
    name: "Winter",
    months: "December - February",
    icon: <Snowflake className="h-6 w-6 text-blue-300" />,
    conditions: "Cold temperatures, possible snow",
    recommended: false
  }
];

export function SeasonalIndicator() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {seasons.map((season) => (
        <Card key={season.name} className="p-4">
          <div className="flex items-center gap-3 mb-3">
            {season.icon}
            <div>
              <h3 className="font-semibold">{season.name}</h3>
              <p className="text-sm text-muted-foreground">{season.months}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {season.conditions}
          </p>
          <Badge 
            variant={season.recommended ? "default" : "secondary"}
            className="w-full justify-center"
          >
            {season.recommended ? "Recommended" : "Not Recommended"}
          </Badge>
        </Card>
      ))}
    </div>
  );
}