import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { destinationSchema, Destination } from "@/lib/schema/destination";
import api from "@/lib/api";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

// Types
export interface DestinationFilters {
  search?: string;
  difficulty?: string;
  country?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  activities?: string[];
  seasons?: string[];
  rating?: number;
  limit?: number;
  offset?: number;
}

export interface DestinationResponse {
  id: string;
  title: string;
  image: string;
  location: string;
  duration: string;
  difficulty: string;
  bestSeason: string;
  maxAltitude: string;
  rating: number;
  reviews: number;
  description: string;
}

interface ApiResponse {
  destinations: Array<{
    id: string;
    name: string;
    images: string[];
    region: string;
    country: string;
    minDays: number;
    maxDays: number;
    difficulty: string;
    seasons: string[];
    maxAltitude?: string;
    rating: number;
    reviewCount: number;
    description: string;
    priceAmount: number;
    priceCurrency: string;
    pricePeriod: string;
    activities: string[];
    amenities: string[];
    availableGuides?: Array<{ guide: any }>;
    reviews?: any[];
  }>;
  total: number;
}

// Function to fetch destinations from API
async function fetchDestinations(filters: DestinationFilters = {}): Promise<{
  destinations: DestinationResponse[];
  total: number;
}> {
  // Build query string from filters
  const queryParams = new URLSearchParams();

  if (filters.search) queryParams.append("search", filters.search);
  if (filters.difficulty) queryParams.append("difficulty", filters.difficulty);
  if (filters.country) queryParams.append("country", filters.country);
  if (filters.featured !== undefined)
    queryParams.append("featured", filters.featured.toString());
  if (filters.minPrice !== undefined)
    queryParams.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice !== undefined)
    queryParams.append("maxPrice", filters.maxPrice.toString());
  if (filters.activities?.length)
    queryParams.append("activities", filters.activities.join(","));
  if (filters.seasons?.length)
    queryParams.append("seasons", filters.seasons.join(","));
  if (filters.rating !== undefined)
    queryParams.append("rating", filters.rating.toString());
  if (filters.limit !== undefined)
    queryParams.append("limit", filters.limit.toString());
  if (filters.offset !== undefined)
    queryParams.append("offset", filters.offset.toString());

  const response = await fetch(`/api/destinations?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch destinations");
  }

  const data: ApiResponse = await response.json();

  // Transform data to match frontend expectations
  const formattedDestinations: DestinationResponse[] = data.destinations.map(
    (dest) => ({
      id: dest.id,
      title: dest.name,
      image: dest.images[0] || "/destinations/abc.jpg",
      location: `${dest.region}, ${dest.country}`,
      duration: `${dest.minDays}${
        dest.maxDays > dest.minDays ? `-${dest.maxDays}` : ""
      } days`,
      difficulty:
        dest.difficulty.charAt(0).toUpperCase() + dest.difficulty.slice(1),
      bestSeason: dest.seasons
        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(", "),
      maxAltitude: dest.maxAltitude || "N/A",
      rating: dest.rating,
      reviews: dest.reviewCount,
      description: dest.description,
    }),
  );

  return {
    destinations: formattedDestinations,
    total: data.total,
  };
}

// Hook to get destinations with filters
export function useDestinations(filters: DestinationFilters = {}) {
  return useQuery({
    queryKey: ["destinations", filters],
    queryFn: () => fetchDestinations(filters),
  });
}

// Hook to get popular destinations
export function usePopularDestinations(limit: number = 6) {
  return useQuery({
    queryKey: ["destinations", "popular", limit],
    queryFn: async () => {
      const response = await fetch(`/api/destinations/popular?limit=${limit}`);

      if (!response.ok) {
        throw new Error("Failed to fetch popular destinations");
      }

      const data: ApiResponse = await response.json();

      // Transform data to match frontend expectations
      const formattedDestinations: DestinationResponse[] =
        data.destinations.map((dest) => ({
          id: dest.id,
          title: dest.name,
          image: dest.images[0] || "/destinations/abc.jpg",
          location: `${dest.region}, ${dest.country}`,
          duration: `${dest.minDays}${
            dest.maxDays > dest.minDays ? `-${dest.maxDays}` : ""
          } days`,
          difficulty:
            dest.difficulty.charAt(0).toUpperCase() + dest.difficulty.slice(1),
          bestSeason: dest.seasons
            .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(", "),
          maxAltitude: dest.maxAltitude || "N/A",
          rating: dest.rating,
          reviews: dest.reviewCount,
          description: dest.description,
        }));

      return {
        destinations: formattedDestinations,
        total: data.total,
      };
    },
  });
}

export interface DestinationDetail extends DestinationResponse {
  images: string[];
  activities: string[];
  amenities: string[];
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  guides: any[];
  reviewList: any[];
}

// Hook to get destination by ID
export function useDestination(id: string) {
  return useQuery({
    queryKey: ["destination", id],
    queryFn: async () => {
      const response = await fetch(`/api/destinations/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch destination details");
      }

      const dest = await response.json();

      // Transform data to match frontend expectations
      return {
        id: dest.id,
        title: dest.name,
        image: dest.images[0] || "/destinations/abc.jpg",
        images: dest.images,
        location: `${dest.region}, ${dest.country}`,
        duration: `${dest.minDays}${
          dest.maxDays > dest.minDays ? `-${dest.maxDays}` : ""
        } days`,
        difficulty:
          dest.difficulty.charAt(0).toUpperCase() + dest.difficulty.slice(1),
        bestSeason: dest.seasons
          .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(", "),
        maxAltitude: dest.maxAltitude || "N/A",
        rating: dest.rating,
        reviews: dest.reviewCount,
        description: dest.description,
        activities: dest.activities,
        amenities: dest.amenities,
        price: {
          amount: dest.priceAmount,
          currency: dest.priceCurrency,
          period: dest.pricePeriod,
        },
        guides: dest.availableGuides?.map((g: { guide: any }) => g.guide) || [],
        reviewList: dest.reviews || [],
      } as DestinationDetail;
    },
    enabled: !!id,
  });
}

// Hook to get destination countries for filtering
export function useDestinationCountries() {
  return useQuery({
    queryKey: ["destinations", "countries"],
    queryFn: async () => {
      const response = await fetch("/api/destinations/countries");

      if (!response.ok) {
        throw new Error("Failed to fetch destination countries");
      }

      return response.json();
    },
  });
}

// Hook to get destination statistics
export function useDestinationStats() {
  return useQuery({
    queryKey: ["destinations", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/destinations/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch destination statistics");
      }

      return response.json();
    },
  });
}

/**
 * Hook to create a new destination
 */
export function useCreateDestination() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: z.infer<typeof destinationSchema>) => {
      return api.post<any>("/api/destinations", data);
    },
    onSuccess: (data) => {
      // Show success toast
      toast({
        title: "Destination created",
        description: `"${data.name}" has been successfully created.`,
      });

      // Invalidate destinations queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      queryClient.invalidateQueries({ queryKey: ["popular-destinations"] });
      queryClient.invalidateQueries({ queryKey: ["destination-countries"] });
      queryClient.invalidateQueries({ queryKey: ["destination-stats"] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to create destination",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update an existing destination
 */
export function useUpdateDestination(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<z.infer<typeof destinationSchema>>) => {
      return api.put<any>(`/api/destinations/${id}`, data);
    },
    onSuccess: (data) => {
      // Show success toast
      toast({
        title: "Destination updated",
        description: `"${data.name}" has been successfully updated.`,
      });

      // Invalidate the specific destination query and the destinations list
      queryClient.invalidateQueries({ queryKey: ["destination", id] });
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      queryClient.invalidateQueries({ queryKey: ["popular-destinations"] });
      queryClient.invalidateQueries({ queryKey: ["destination-stats"] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to update destination",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a destination
 */
export function useDeleteDestination() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete<{ success: boolean }>(`/api/destinations/${id}`);
    },
    onSuccess: (_, id) => {
      // Show success toast
      toast({
        title: "Destination deleted",
        description: "The destination has been successfully deleted.",
      });

      // Invalidate destinations queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      queryClient.invalidateQueries({ queryKey: ["popular-destinations"] });
      queryClient.invalidateQueries({ queryKey: ["destination-countries"] });
      queryClient.invalidateQueries({ queryKey: ["destination-stats"] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to delete destination",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}
