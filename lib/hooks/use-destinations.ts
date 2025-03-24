import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { destinationSchema, Destination } from "@/lib/schema/destination";
import api from "@/lib/api";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

type DestinationFilters = {
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  difficulty?: string;
  country?: string;
  activities?: string[];
  seasons?: string[];
  rating?: number;
  limit?: number;
  offset?: number;
};

/**
 * Hook to fetch destinations with optional filters
 */
export function useDestinations(filters: DestinationFilters = {}) {
  return useQuery({
    queryKey: ["destinations", filters],
    queryFn: () => {
      // Convert filters to URLSearchParams
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            params.append(key, value.join(","));
          } else {
            params.append(key, String(value));
          }
        }
      });

      return api.get<{ destinations: any[]; total: number }>(
        `/api/destinations?${params.toString()}`,
      );
    },
  });
}

/**
 * Hook to fetch popular destinations
 */
export function usePopularDestinations(limit = 5) {
  return useQuery({
    queryKey: ["popular-destinations", limit],
    queryFn: () => api.get<any[]>(`/api/destinations/popular?limit=${limit}`),
  });
}

/**
 * Hook to fetch a single destination by ID
 */
export function useDestination(id: string | undefined) {
  return useQuery({
    queryKey: ["destination", id],
    queryFn: () => api.get<any>(`/api/destinations/${id}`),
    enabled: !!id, // Only run the query if we have an ID
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

/**
 * Hook to fetch distinct destination countries
 */
export function useDestinationCountries() {
  return useQuery({
    queryKey: ["destination-countries"],
    queryFn: () => api.get<string[]>("/api/destinations/countries"),
  });
}

/**
 * Hook to fetch destination statistics
 */
export function useDestinationStats() {
  return useQuery({
    queryKey: ["destination-stats"],
    queryFn: () => api.get<any>("/api/destinations/stats"),
  });
}
