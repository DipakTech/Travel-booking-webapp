import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { guideSchema } from "@/lib/schema";
import api from "@/lib/api";
import { z } from "zod";

type GuideFilters = {
  search?: string;
  country?: string;
  region?: string;
  languages?: string[];
  specialties?: string[];
  minRating?: number;
  experienceLevel?: string;
  available?: boolean;
  destinationId?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Hook to fetch guides with optional filters
 */
export function useGuides(filters: GuideFilters = {}) {
  return useQuery({
    queryKey: ["guides", filters],
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

      return api.get<{ guides: any[]; total: number }>(
        `/api/guides?${params.toString()}`,
      );
    },
  });
}

/**
 * Hook to fetch top rated guides
 */
export function useTopGuides(limit = 5) {
  return useQuery({
    queryKey: ["top-guides", limit],
    queryFn: () => api.get<any[]>(`/api/guides/top?limit=${limit}`),
  });
}

/**
 * Hook to fetch guides for a specific destination
 */
export function useDestinationGuides(destinationId: string | undefined) {
  return useQuery({
    queryKey: ["destination-guides", destinationId],
    queryFn: () => api.get<any[]>(`/api/destinations/${destinationId}/guides`),
    enabled: !!destinationId, // Only run the query if we have a destination ID
  });
}

/**
 * Hook to fetch a single guide by ID
 */
export function useGuide(id: string | undefined) {
  return useQuery({
    queryKey: ["guide", id],
    queryFn: () => api.get<any>(`/api/guides/${id}`),
    enabled: !!id, // Only run the query if we have an ID
  });
}

/**
 * Hook to fetch guide availability for a specific period
 */
export function useGuideAvailability(
  guideId: string | undefined,
  startDate?: Date,
  endDate?: Date,
) {
  return useQuery({
    queryKey: ["guide-availability", guideId, startDate, endDate],
    queryFn: () => {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());

      return api.get<{ available: boolean; dates: Date[] }>(
        `/api/guides/${guideId}/availability?${params.toString()}`,
      );
    },
    enabled: !!guideId, // Only run the query if we have a guide ID
  });
}

/**
 * Hook to create a new guide
 */
export function useCreateGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: z.infer<typeof guideSchema>) => {
      return api.post<any>("/api/guides", data);
    },
    onSuccess: () => {
      // Invalidate guides queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["guides"] });
    },
  });
}

/**
 * Hook to update an existing guide
 */
export function useUpdateGuide(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<z.infer<typeof guideSchema>>) => {
      return api.put<any>(`/api/guides/${id}`, data);
    },
    onSuccess: () => {
      // Invalidate the specific guide query and the guides list
      queryClient.invalidateQueries({ queryKey: ["guide", id] });
      queryClient.invalidateQueries({ queryKey: ["guides"] });
    },
  });
}

/**
 * Hook to delete a guide
 */
export function useDeleteGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete<{ success: boolean }>(`/api/guides/${id}`);
    },
    onSuccess: () => {
      // Invalidate guides queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["guides"] });
    },
  });
}

/**
 * Hook to update guide availability
 */
export function useUpdateGuideAvailability(guideId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      availableDates,
    }: {
      availableDates: { from: Date; to: Date }[];
    }) => {
      return api.put<any>(`/api/guides/${guideId}/availability`, {
        availableDates,
      });
    },
    onSuccess: () => {
      // Invalidate availability queries
      queryClient.invalidateQueries({
        queryKey: ["guide-availability", guideId],
      });
      queryClient.invalidateQueries({ queryKey: ["guide", guideId] });
    },
  });
}

/**
 * Hook to assign a guide to a destination
 */
export function useAssignGuideToDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      guideId,
      destinationId,
    }: {
      guideId: string;
      destinationId: string;
    }) => {
      return api.post<any>(`/api/destinations/${destinationId}/guides`, {
        guideId,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["destination-guides", variables.destinationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["destination", variables.destinationId],
      });
      queryClient.invalidateQueries({ queryKey: ["guide", variables.guideId] });
    },
  });
}

/**
 * Hook to remove a guide from a destination
 */
export function useRemoveGuideFromDestination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      guideId,
      destinationId,
    }: {
      guideId: string;
      destinationId: string;
    }) => {
      return api.delete<any>(
        `/api/destinations/${destinationId}/guides/${guideId}`,
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["destination-guides", variables.destinationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["destination", variables.destinationId],
      });
      queryClient.invalidateQueries({ queryKey: ["guide", variables.guideId] });
    },
  });
}
