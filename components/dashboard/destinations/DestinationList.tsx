"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, MapPin, Users, DollarSign, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDestinations } from "@/lib/hooks/use-destinations";
import { useState, useEffect } from "react";

interface Destination {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  status: string;
  priceRange: {
    min: number;
    max: number;
  };
  groupSize: {
    min: number;
    max: number;
  };
  image?: string;
}

// Fallback mock data if API fails
const mockDestinations: Destination[] = [
  {
    id: "D001",
    name: "Everest Base Camp Trek",
    location: "Solukhumbu, Nepal",
    category: "Trekking",
    rating: 4.9,
    status: "active",
    priceRange: {
      min: 1200,
      max: 2500,
    },
    groupSize: {
      min: 2,
      max: 12,
    },
    image: "/destinations/everest.jpg",
  },
  // ... other mock destinations
];

interface DestinationListProps {
  searchTerm?: string;
}

export function DestinationList({ searchTerm = "" }: DestinationListProps) {
  const [filters, setFilters] = useState({
    search: searchTerm,
  });

  // Update filters when searchTerm changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  }, [searchTerm]);

  const { data, isLoading, isError } = useDestinations(filters);

  // Transform API data to match component's expected format
  const transformDestinations = (): Destination[] => {
    if (isLoading) {
      return []; // Return empty during loading
    }

    if (isError || !data?.destinations || data.destinations.length === 0) {
      if (filters.search && filters.search.trim() !== "") {
        return []; // Return empty array if searching but no results
      }
      return mockDestinations; // Use mock data as fallback
    }

    return data.destinations.map((dest: any) => ({
      id: dest.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
      name: dest.name || "Unnamed Destination",
      location: dest.location
        ? `${dest.location.region || ""}, ${dest.location.country || ""}`.trim()
        : "Unknown Location",
      category:
        dest.activities && dest.activities.length > 0
          ? dest.activities[0]
          : "Trekking", // Using the first activity as category
      rating: typeof dest.rating === "number" ? dest.rating : 0,
      status: dest.featured ? "active" : "inactive",
      priceRange: {
        min: dest.price?.amount ? dest.price.amount * 0.8 : 1000, // Estimating price range
        max: dest.price?.amount ? dest.price.amount * 1.2 : 2000,
      },
      groupSize: {
        min: 1,
        max: 10, // Default group size
      },
      image: dest.images && dest.images.length > 0 ? dest.images[0] : undefined,
    }));
  };

  const destinations = transformDestinations();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Maintenance
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case "trekking":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Trekking
          </Badge>
        );
      case "wildlife":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Wildlife
          </Badge>
        );
      case "spiritual":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Spiritual
          </Badge>
        );
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  if (destinations.length === 0 && filters.search) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No destinations found matching &ldquo;{filters.search}&rdquo;. Try a
        different search term.
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No destinations found. Add your first destination to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Destination</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price Range</TableHead>
            <TableHead>Group Size</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {destinations.map((destination) => (
            <TableRow key={destination.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {destination.image ? (
                      <AvatarImage
                        src={destination.image}
                        alt={destination.name}
                      />
                    ) : null}
                    <AvatarFallback>
                      {destination.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/dashboard/destinations/${destination.id}`}
                      className="font-medium hover:underline"
                    >
                      {destination.name}
                    </Link>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{destination.location}</span>
                </div>
              </TableCell>
              <TableCell>{getCategoryBadge(destination.category)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>
                    ${destination.priceRange.min} - $
                    {destination.priceRange.max}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {destination.groupSize.min} - {destination.groupSize.max}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{destination.rating}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(destination.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/destinations/${destination.id}`}>
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/destinations/${destination.id}/edit`}
                      >
                        Edit destination
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/destinations/${destination.id}/tours`}
                      >
                        View tours
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Remove destination
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
