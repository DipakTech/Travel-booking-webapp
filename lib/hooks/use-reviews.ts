import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

// Types
export type ReviewType = "destination" | "guide";
export type ReviewStatus = "pending" | "approved" | "rejected" | "flagged";

export interface Review {
  id: string;
  type: ReviewType;
  entityId: string;
  entityName?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  status: ReviewStatus;
  response?: string;
  photos?: string[];
  highlights?: string[];
  tags?: string[];
  featured?: boolean;
  helpfulCount?: number;
  unhelpfulCount?: number;
  tripDetails?: {
    startDate: string;
    endDate: string;
    duration: number;
    type: string;
  };
  responseDetails?: {
    content: string;
    date: string;
    responderName: string;
    responderRole: string;
    responderId: string;
  };
}

export interface ReviewFilters {
  type?: ReviewType;
  status?: ReviewStatus;
  entityId?: string;
  authorId?: string;
  featured?: boolean;
  verified?: boolean;
  limit?: number;
  offset?: number;
}

// Validation schema
export const reviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(100),
  content: z
    .string()
    .min(20, "Review must be at least 20 characters long")
    .max(5000),
  rating: z.number().min(1).max(5),
  photos: z.array(z.string().url()).optional(),
  highlights: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  authorId: z.string(),
  destinationId: z.string().optional(),
  guideId: z.string().optional(),
  tripStartDate: z.string().optional(),
  tripEndDate: z.string().optional(),
  tripDuration: z.number().optional(),
  tripType: z.string().optional(),
});

// Hooks
export function useReviews(filters?: ReviewFilters) {
  // Build URL parameters from filters
  const params = new URLSearchParams();
  if (filters) {
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);
    if (filters.entityId) params.append("entityId", filters.entityId);
    if (filters.authorId) params.append("authorId", filters.authorId);
    if (filters.featured !== undefined)
      params.append("featured", filters.featured.toString());
    if (filters.verified !== undefined)
      params.append("verified", filters.verified.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());
  }

  return useQuery({
    queryKey: ["reviews", filters],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json() as Promise<Review[]>;
    },
  });
}

export function useReview(id?: string) {
  return useQuery({
    queryKey: ["review", id],
    queryFn: async () => {
      if (!id) throw new Error("Review ID is required");
      const response = await fetch(`/api/reviews/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch review");
      }
      return response.json() as Promise<Review>;
    },
    enabled: !!id, // Only execute if id is provided
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: z.infer<typeof reviewSchema>) => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Review submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Review> }) => {
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update review");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      toast.success("Review updated successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review", variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update review");
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete review");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
}

export function useRespondToReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      responseContent,
      responderName,
      responderRole,
      responderId,
    }: {
      id: string;
      responseContent: string;
      responderName: string;
      responderRole: string;
      responderId: string;
    }) => {
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          responseContent,
          responderName,
          responderRole,
          responderId,
          responseDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit response");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      toast.success("Response submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review", variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit response");
    },
  });
}

export function useModerateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: "approve" | "reject" | "flag" | "feature" | "unfeature";
    }) => {
      let data = {};

      switch (action) {
        case "approve":
          data = { verified: true };
          break;
        case "reject":
          data = { verified: false };
          break;
        case "flag":
          data = { tags: ["flagged"] };
          break;
        case "feature":
          data = { featured: true };
          break;
        case "unfeature":
          data = { featured: false };
          break;
      }

      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to moderate review");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      const actionMessages = {
        approve: "Review approved successfully",
        reject: "Review rejected successfully",
        flag: "Review flagged successfully",
        feature: "Review featured successfully",
        unfeature: "Review unfeatured successfully",
      };

      toast.success(actionMessages[variables.action]);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review", variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to moderate review");
    },
  });
}
