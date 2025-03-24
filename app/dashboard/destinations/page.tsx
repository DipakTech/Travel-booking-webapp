"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Star,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DestinationList } from "@/components/dashboard/destinations/DestinationList";
import { useRouter } from "next/navigation";
import {
  useDestinations,
  useDestinationStats,
} from "@/lib/hooks/use-destinations";
import { useState, useEffect } from "react";

export default function DestinationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: statsData } = useDestinationStats();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Destinations</h1>
          <p className="text-muted-foreground">
            Explore and manage travel destinations
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/destinations/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Destination
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Destinations
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData?.totalDestinations || "..."}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsData?.featuredCount || "..."} featured destinations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData?.averageRating?.toFixed(1) || "..."}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on all destinations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Tours
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Destinations</CardTitle>
          <CardDescription>
            {debouncedSearch
              ? `Search results for "${debouncedSearch}"`
              : "A list of all available travel destinations"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DestinationList searchTerm={debouncedSearch} />
        </CardContent>
      </Card>
    </div>
  );
}
