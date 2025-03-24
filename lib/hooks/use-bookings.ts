import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingSchema } from "@/lib/schema";
import api from "@/lib/api";
import { z } from "zod";

type BookingFilters = {
  customerId?: string;
  destinationId?: string;
  guideId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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
          // Handle Date objects
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });

      return api.get<{ bookings: any[]; total: number }>(
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
    queryFn: () => api.get<any>(`/api/bookings/${id}`),
    enabled: !!id, // Only run the query if we have an ID
  });
}

/**
 * Hook to create a new booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: z.infer<typeof bookingSchema>) => {
      return api.post<any>("/api/bookings", data);
    },
    onSuccess: () => {
      // Invalidate bookings queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

/**
 * Hook to update an existing booking
 */
export function useUpdateBooking(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<z.infer<typeof bookingSchema>>) => {
      return api.put<any>(`/api/bookings/${id}`, data);
    },
    onSuccess: () => {
      // Invalidate the specific booking query and the bookings list
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

/**
 * Hook to delete a booking
 */
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete<{ success: boolean }>(`/api/bookings/${id}`);
    },
    onSuccess: () => {
      // Invalidate bookings queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
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
