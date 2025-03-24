import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

// Schedule schema for validation
const scheduleSchema = z.object({
  id: z.string().optional(),
  destination: z.string().min(2),
  location: z.string().min(2),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  description: z.string().min(10),
  maxParticipants: z.number().min(1),
  price: z.number().min(0),
  status: z.enum(["confirmed", "pending", "completed", "cancelled"]),
  difficulty: z.enum(["easy", "moderate", "challenging"]),
  itinerary: z.string().min(10),
  guideId: z.string().optional(),
});

export type Schedule = z.infer<typeof scheduleSchema>;

/**
 * Hook to fetch all schedules for a guide
 */
export function useGuideSchedules(guideId: string, status?: string) {
  const queryParams = status ? `?status=${status}` : "";
  return useQuery({
    queryKey: ["guide-schedules", guideId, status],
    queryFn: () =>
      api.get<Schedule[]>(`/api/guides/${guideId}/schedules${queryParams}`),
    enabled: !!guideId,
  });
}

/**
 * Hook to fetch a specific schedule by ID
 */
export function useGuideSchedule(guideId: string, scheduleId: string) {
  return useQuery({
    queryKey: ["guide-schedule", guideId, scheduleId],
    queryFn: () =>
      api.get<Schedule>(`/api/guides/${guideId}/schedules/${scheduleId}`),
    enabled: !!guideId && !!scheduleId,
  });
}

/**
 * Hook to create a new schedule for a guide
 */
export function useCreateGuideSchedule(guideId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Schedule, "id" | "guideId">) => {
      return api.post<Schedule>(`/api/guides/${guideId}/schedules`, data);
    },
    onSuccess: () => {
      // Show success toast
      toast({
        title: "Schedule created",
        description:
          "The tour has been successfully added to the guide's schedule.",
      });

      // Invalidate guide schedules queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["guide-schedules", guideId] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to create schedule",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update a guide schedule
 */
export function useUpdateGuideSchedule(guideId: string, scheduleId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<Schedule>) => {
      return api.put<Schedule>(
        `/api/guides/${guideId}/schedules/${scheduleId}`,
        data,
      );
    },
    onSuccess: () => {
      // Show success toast
      toast({
        title: "Schedule updated",
        description: "The tour schedule has been successfully updated.",
      });

      // Invalidate the specific schedule query and the schedules list
      queryClient.invalidateQueries({
        queryKey: ["guide-schedule", guideId, scheduleId],
      });
      queryClient.invalidateQueries({ queryKey: ["guide-schedules", guideId] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to update schedule",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a guide schedule
 */
export function useDeleteGuideSchedule(guideId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (scheduleId: string) => {
      return api.delete<{ success: boolean }>(
        `/api/guides/${guideId}/schedules/${scheduleId}`,
      );
    },
    onSuccess: () => {
      // Show success toast
      toast({
        title: "Schedule removed",
        description:
          "The tour has been successfully removed from the guide's schedule.",
      });

      // Invalidate guide schedules queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["guide-schedules", guideId] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to remove schedule",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}
