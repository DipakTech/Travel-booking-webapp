import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { destinationSchema } from "@/lib/schema";
import api from "@/lib/api";
import { z } from "zod";

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

  return useMutation({
    mutationFn: (data: z.infer<typeof destinationSchema>) => {
      return api.post<any>("/api/destinations", data);
    },
    onSuccess: () => {
      // Invalidate destinations queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
    },
  });
}

/**
 * Hook to update an existing destination
 */
export function useUpdateDestination(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<z.infer<typeof destinationSchema>>) => {
      return api.put<any>(`/api/destinations/${id}`, data);
    },
    onSuccess: () => {
      // Invalidate the specific destination query and the destinations list
      queryClient.invalidateQueries({ queryKey: ["destination", id] });
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
    },
  });
}

/**
 * Hook to delete a destination
 */
export function useDeleteDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete<{ success: boolean }>(`/api/destinations/${id}`);
    },
    onSuccess: () => {
      // Invalidate destinations queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
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
