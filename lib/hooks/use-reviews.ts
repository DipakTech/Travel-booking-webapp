import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewSchema } from "@/lib/schema";
import api from "@/lib/api";
import { z } from "zod";

type ReviewFilters = {
  destinationId?: string;
  guideId?: string;
  userId?: string;
  minRating?: number;
  limit?: number;
  offset?: number;
  sortBy?: "date" | "rating";
  sortOrder?: "asc" | "desc";
};

/**
 * Hook to fetch reviews with optional filters
 */
export function useReviews(filters: ReviewFilters = {}) {
  return useQuery({
    queryKey: ["reviews", filters],
    queryFn: () => {
      // Convert filters to URLSearchParams
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });

      return api.get<{ reviews: any[]; total: number }>(
        `/api/reviews?${params.toString()}`,
      );
    },
  });
}

/**
 * Hook to fetch a single review by ID
 */
export function useReview(id: string | undefined) {
  return useQuery({
    queryKey: ["review", id],
    queryFn: () => api.get<any>(`/api/reviews/${id}`),
    enabled: !!id, // Only run the query if we have an ID
  });
}

/**
 * Hook to fetch destination reviews
 */
export function useDestinationReviews(destinationId: string | undefined) {
  return useQuery({
    queryKey: ["destination-reviews", destinationId],
    queryFn: () => api.get<any[]>(`/api/destinations/${destinationId}/reviews`),
    enabled: !!destinationId, // Only run the query if we have a destination ID
  });
}

/**
 * Hook to fetch guide reviews
 */
export function useGuideReviews(guideId: string | undefined) {
  return useQuery({
    queryKey: ["guide-reviews", guideId],
    queryFn: () => api.get<any[]>(`/api/guides/${guideId}/reviews`),
    enabled: !!guideId, // Only run the query if we have a guide ID
  });
}

/**
 * Hook to fetch user reviews
 */
export function useUserReviews(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-reviews", userId],
    queryFn: () => api.get<any[]>(`/api/users/${userId}/reviews`),
    enabled: !!userId, // Only run the query if we have a user ID
  });
}

/**
 * Hook to create a new review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: z.infer<typeof reviewSchema>) => {
      return api.post<any>("/api/reviews", data);
    },
    onSuccess: (data) => {
      // Invalidate reviews queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      // Invalidate specific related queries
      if (data.destinationId) {
        queryClient.invalidateQueries({
          queryKey: ["destination-reviews", data.destinationId],
        });
        queryClient.invalidateQueries({
          queryKey: ["destination", data.destinationId],
        });
      }

      if (data.guideId) {
        queryClient.invalidateQueries({
          queryKey: ["guide-reviews", data.guideId],
        });
        queryClient.invalidateQueries({
          queryKey: ["guide", data.guideId],
        });
      }

      if (data.authorId) {
        queryClient.invalidateQueries({
          queryKey: ["user-reviews", data.authorId],
        });
      }
    },
  });
}

/**
 * Hook to update an existing review
 */
export function useUpdateReview(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<z.infer<typeof reviewSchema>>) => {
      return api.put<any>(`/api/reviews/${id}`, data);
    },
    onSuccess: (data) => {
      // Invalidate the specific review query and the reviews list
      queryClient.invalidateQueries({ queryKey: ["review", id] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      // Invalidate specific related queries
      if (data.destinationId) {
        queryClient.invalidateQueries({
          queryKey: ["destination-reviews", data.destinationId],
        });
        queryClient.invalidateQueries({
          queryKey: ["destination", data.destinationId],
        });
      }

      if (data.guideId) {
        queryClient.invalidateQueries({
          queryKey: ["guide-reviews", data.guideId],
        });
        queryClient.invalidateQueries({
          queryKey: ["guide", data.guideId],
        });
      }
    },
  });
}

/**
 * Hook to delete a review
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete<{ success: boolean }>(`/api/reviews/${id}`);
    },
    onSuccess: (_, id) => {
      // Get review data from cache
      const review = queryClient.getQueryData<any>(["review", id]);

      // Invalidate reviews queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review", id] });

      // Invalidate specific related queries if we have the review data
      if (review) {
        if (review.destinationId) {
          queryClient.invalidateQueries({
            queryKey: ["destination-reviews", review.destinationId],
          });
          queryClient.invalidateQueries({
            queryKey: ["destination", review.destinationId],
          });
        }

        if (review.guideId) {
          queryClient.invalidateQueries({
            queryKey: ["guide-reviews", review.guideId],
          });
          queryClient.invalidateQueries({
            queryKey: ["guide", review.guideId],
          });
        }

        if (review.authorId) {
          queryClient.invalidateQueries({
            queryKey: ["user-reviews", review.authorId],
          });
        }
      }
    },
  });
}

/**
 * Hook to mark a review as helpful
 */
export function useMarkReviewHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      userId,
    }: {
      reviewId: string;
      userId: string;
    }) => {
      return api.post<{ helpful: boolean }>(
        `/api/reviews/${reviewId}/helpful`,
        {
          userId,
        },
      );
    },
    onSuccess: (_, variables) => {
      // Invalidate specific review query
      queryClient.invalidateQueries({
        queryKey: ["review", variables.reviewId],
      });
    },
  });
}

/**
 * Hook to report a review
 */
export function useReportReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      userId,
      reason,
    }: {
      reviewId: string;
      userId: string;
      reason: string;
    }) => {
      return api.post<{ success: boolean }>(`/api/reviews/${reviewId}/report`, {
        userId,
        reason,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate specific review query
      queryClient.invalidateQueries({
        queryKey: ["review", variables.reviewId],
      });
    },
  });
}
