"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Mountain,
  Clock,
  ThermometerSun,
  AlertTriangle,
  Download,
} from "lucide-react";
import Image from "next/image";

interface DestinationCardProps {
  title: string;
  image: string;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Hard" | "Extreme";
  bestSeason: string;
  maxAltitude: string;
  warning?: string;
  price: string;
}

export function DestinationCard({
  title,
  image,
  duration,
  difficulty,
  bestSeason,
  maxAltitude,
  warning,
  price,
}: DestinationCardProps) {
  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Moderate: "bg-yellow-100 text-yellow-800",
    Hard: "bg-orange-100 text-orange-800",
    Extreme: "bg-red-100 text-red-800",
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          width={200}
          height={200}
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={difficultyColor[difficulty]}>{difficulty}</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Best Season: {bestSeason}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mountain className="h-4 w-4" />
            <span>Max Altitude: {maxAltitude}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ThermometerSun className="h-4 w-4" />
            <span>Weather: 10°C to 25°C</span>
          </div>
        </div>

        {warning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm">{warning}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">${price}</span>
            <span className="text-muted-foreground">/person</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Map
            </Button>
            <Button size="sm">View Details</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
