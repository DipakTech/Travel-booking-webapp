import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingSchema, Booking } from "@/lib/schema/booking";
import api from "@/lib/api";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

type BookingFilters = {
  search?: string;
  status?: string;
  destination?: string;
  guide?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
};

/**
 * Hook to fetch bookings with optional filters
 */
export function useBookings(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => {
      // Convert filters to URLSearchParams
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });

      return api.get<{ bookings: Booking[]; total: number }>(
        `/api/bookings?${params.toString()}`,
      );
    },
  });
}

/**
 * Hook to fetch a single booking by ID
 */
export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => api.get<Booking>(`/api/bookings/${id}`),
    enabled: !!id, // Only run the query if we have an ID
  });
}

/**
 * Hook to create a new booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: z.infer<typeof bookingSchema>) => {
      // Create a deep copy to avoid mutating the original data
      const processedData = JSON.parse(JSON.stringify(data));

      // Convert main date fields
      if (processedData.dates) {
        if (processedData.dates.startDate) {
          processedData.dates.startDate = new Date(
            processedData.dates.startDate,
          );
        }
        if (processedData.dates.endDate) {
          processedData.dates.endDate = new Date(processedData.dates.endDate);
        }
      }

      return api.post<Booking>("/api/bookings", processedData);
    },
    onSuccess: (data) => {
      // Show success toast
      toast({
        title: "Booking created",
        description: `Booking #${data.bookingNumber} has been successfully created.`,
      });

      // Invalidate bookings queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to create booking",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update an existing booking
 */
export function useUpdateBooking(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<z.infer<typeof bookingSchema>>) => {
      // Create a deep copy to avoid mutating the original data
      const processedData = JSON.parse(JSON.stringify(data));

      // Convert main date fields
      if (processedData.dates) {
        if (processedData.dates.startDate) {
          processedData.dates.startDate = new Date(
            processedData.dates.startDate,
          );
        }
        if (processedData.dates.endDate) {
          processedData.dates.endDate = new Date(processedData.dates.endDate);
        }
      }

      // We'll use this approach to avoid TypeScript errors by sending the data as-is to the backend
      // The backend will handle the date conversions

      return api.put<Booking>(`/api/bookings/${id}`, processedData);
    },
    onSuccess: (data) => {
      // Show success toast
      toast({
        title: "Booking updated",
        description: `Booking #${data.bookingNumber} has been successfully updated.`,
      });

      // Invalidate the specific booking query and the bookings list
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to update booking",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a booking
 */
export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete<{ success: boolean }>(`/api/bookings/${id}`);
    },
    onSuccess: (_, id) => {
      // Show success toast
      toast({
        title: "Booking removed",
        description:
          "The booking has been successfully removed from the system.",
      });

      // Invalidate bookings queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: any) => {
      // Show error toast
      toast({
        title: "Failed to remove booking",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to fetch booking statistics
 */
export function useBookingStats() {
  return useQuery({
    queryKey: ["booking-stats"],
    queryFn: () => api.get<any>("/api/bookings/stats"),
  });
}

/**
 * Hook to fetch recent bookings
 */
export function useRecentBookings(limit = 5) {
  return useQuery({
    queryKey: ["recent-bookings", limit],
    queryFn: () => api.get<Booking[]>(`/api/bookings/recent?limit=${limit}`),
  });
}
