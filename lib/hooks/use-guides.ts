import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { guideSchema, Guide } from "@/lib/schema/guide";
import api from "@/lib/api";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

type GuideFilters = {
  search?: string;
  status?: string;
  location?: string;
  specialty?: string;
  language?: string;
  experienceLevel?: string;
  minRating?: number;
  limit?: number;
  offset?: number;
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
          params.append(key, String(value));
        }
      });

      return api.get<{ guides: Guide[]; total: number }>(
        `/api/guides?${params.toString()}`,
      );
    },
  });
}

/**
 * Hook to fetch a single guide by ID
 */
export function useGuide(id: string | undefined) {
  return useQuery({
    queryKey: ["guide", id],
    queryFn: () => api.get<Guide>(`/api/guides/${id}`),
    enabled: !!id, // Only run the query if we have an ID
  });
}

/**
 * Hook to create a new guide
 */
export function useCreateGuide() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: z.infer<typeof guideSchema>) => {
      return api.post<Guide>("/api/guides", data);
    },
    onSuccess: (data) => {
      // Show success toast
      toast({
        title: "Guide created",
        description: `"${data.name}" has been successfully added to the team.`,
      });

      // Invalidate guides queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["guides"] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to create guide",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update an existing guide
 */
export function useUpdateGuide(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<z.infer<typeof guideSchema>>) => {
      return api.put<Guide>(`/api/guides/${id}`, data);
    },
    onSuccess: (data) => {
      // Show success toast
      toast({
        title: "Guide updated",
        description: `"${data.name}" has been successfully updated.`,
      });

      // Invalidate the specific guide query and the guides list
      queryClient.invalidateQueries({ queryKey: ["guide", id] });
      queryClient.invalidateQueries({ queryKey: ["guides"] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to update guide",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a guide
 */
export function useDeleteGuide() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete<{ success: boolean }>(`/api/guides/${id}`);
    },
    onSuccess: (_, id) => {
      // Show success toast
      toast({
        title: "Guide removed",
        description: "The guide has been successfully removed from the system.",
      });

      // Invalidate guides queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["guides"] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to remove guide",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to fetch top-rated guides
 */
export function useTopRatedGuides(limit = 5) {
  return useQuery({
    queryKey: ["top-rated-guides", limit],
    queryFn: () => api.get<Guide[]>(`/api/guides/top-rated?limit=${limit}`),
  });
}

/**
 * Hook to fetch guide statistics
 */
export function useGuideStats() {
  return useQuery({
    queryKey: ["guide-stats"],
    queryFn: () => api.get<any>("/api/guides/stats"),
  });
}

/**
 * Hook to fetch guide locations for the map
 */
export function useGuideLocations() {
  return useQuery({
    queryKey: ["guide-locations"],
    queryFn: async () => {
      const { guides } = await api.get<{ guides: Guide[]; total: number }>(
        "/api/guides",
      );

      // Transform guides data to location format needed for the map
      return guides.map((guide) => ({
        id: guide.id,
        name: `${guide.name}`,
        coordinates: [86.925026, 27.805646], // Default coordinates, ideally we'd have actual coordinates
        type: guide.specialties.slice(0, 2).join(" & "),
        description: guide.bio.substring(0, 100) + "...",
      }));
    },
  });
}

/**
 * Hook to get all available languages from guides
 */
export function useGuideLanguages() {
  return useQuery({
    queryKey: ["guide-languages"],
    queryFn: async () => {
      const response = await api.get<string[]>("/api/guides/languages");
      return response || ["English", "Nepali", "Hindi", "Sherpa", "Tibetan"];
    },
  });
}

/**
 * Hook to get all available specialties from guides
 */
export function useGuideSpecialties() {
  return useQuery({
    queryKey: ["guide-specialties"],
    queryFn: async () => {
      const response = await api.get<string[]>("/api/guides/specialties");
      return (
        response || [
          "Trekking",
          "Climbing",
          "Cultural",
          "Photography",
          "Wildlife",
        ]
      );
    },
  });
}
