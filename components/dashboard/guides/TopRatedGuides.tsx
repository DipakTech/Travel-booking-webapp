"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTopRatedGuides } from "@/lib/hooks/use-guides";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function TopRatedGuides() {
  const { data: guides, isLoading, error } = useTopRatedGuides(5);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-center py-10 text-muted-foreground">
            Loading top guides...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error || !guides || guides.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-center py-10 text-muted-foreground">
            No top rated guides available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/dashboard/guides/${guide.id}`}
              className="block hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-4 p-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage
                    src={guide.photo || "/images/avatars/default.jpg"}
                    alt={guide.name}
                  />
                  <AvatarFallback>
                    {guide.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium leading-none">{guide.name}</h4>
                    <div className="flex items-center">
                      <StarIcon className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                      <span className="text-sm">
                        {guide.rating.toFixed(1)} ({guide.reviewCount})
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {guide.location.country}
                    {guide.location.city && `, ${guide.location.city}`}
                  </div>

                  <div className="pt-1 flex gap-1 flex-wrap">
                    {guide.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="outline"
                        className="text-xs"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-sm flex justify-between items-center pt-1">
                    <span>${guide.hourlyRate}/hr</span>
                    <Badge
                      variant={
                        guide.availability === "available"
                          ? "success"
                          : guide.availability === "partially_available"
                          ? "warning"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {guide.availability === "available"
                        ? "Available"
                        : guide.availability === "partially_available"
                        ? "On Leave"
                        : "Unavailable"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
