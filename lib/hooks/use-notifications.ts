import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationSchema } from "@/lib/schema";
import api from "@/lib/api";
import { z } from "zod";

type NotificationFilters = {
  type?: string;
  status?: "read" | "unread" | "all";
  search?: string;
  limit?: number;
  offset?: number;
};

/**
 * Hook to fetch notifications with optional filters
 */
export function useNotifications(filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => {
      // Convert filters to URLSearchParams
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });

      return api.get<{ notifications: any[]; total: number }>(
        `/api/notifications?${params.toString()}`,
      );
    },
  });
}

/**
 * Hook to fetch unread notification count
 */
export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: () =>
      api.get<{ count: number }>("/api/notifications/unread-count"),
  });
}

/**
 * Hook to create a new notification
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: z.infer<typeof notificationSchema> & { recipientId?: string },
    ) => {
      return api.post<any>("/api/notifications", data);
    },
    onSuccess: () => {
      // Invalidate notifications queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });
}

/**
 * Hook to mark a notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.patch<{ success: boolean }>("/api/notifications", {
        action: "markAsRead",
        id,
      });
    },
    onSuccess: () => {
      // Invalidate notifications queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });
}

/**
 * Hook to mark multiple notifications as read
 */
export function useMarkNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => {
      return api.patch<{ success: boolean }>("/api/notifications", {
        action: "markSelectedAsRead",
        ids,
      });
    },
    onSuccess: () => {
      // Invalidate notifications queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return api.patch<{ success: boolean }>("/api/notifications", {
        action: "markAllAsRead",
      });
    },
    onSuccess: () => {
      // Invalidate notifications queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      });
    },
  });
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.patch<{ success: boolean }>("/api/notifications", {
        action: "delete",
        id,
      });
    },
    onSuccess: () => {
      // Invalidate notifications queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook to delete multiple notifications
 */
export function useDeleteNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => {
      return api.patch<{ success: boolean }>("/api/notifications", {
        action: "deleteSelected",
        ids,
      });
    },
    onSuccess: () => {
      // Invalidate notifications queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
