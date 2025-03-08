"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Languages, Award, MapPin } from "lucide-react";

interface GuideCardProps {
  name: string;
  image: string;
  specialties: string[];
  rating: number;
  languages: string[];
  location: string;
  price: number;
  certifications: string[];
}

export function GuideCard({
  name,
  image,
  specialties,
  rating,
  languages,
  location,
  price,
  certifications,
}: GuideCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
            {rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {location}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {specialties.map((specialty) => (
            <Badge key={specialty} variant="outline">
              {specialty}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            {languages.join(", ")}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            {certifications[0]}
            {certifications.length > 1 && ` +${certifications.length - 1} more`}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">${price}</span>
            <span className="text-muted-foreground">/day</span>
          </div>
          <Button>View Profile</Button>
        </div>
      </div>
    </Card>
  );
}