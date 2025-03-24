import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  read?: boolean;
  createdAt: string;
  recipientId: string;
  actionUrl?: string;
  actionLabel?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  relatedEntityName?: string;
  timeAgo?: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  total: number;
}

interface NotificationFilters {
  type?: string;
  status?: "all" | "read" | "unread";
  search?: string;
  limit?: number;
  offset?: number;
}

// Hook to fetch notifications
export function useNotifications(filters?: NotificationFilters) {
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.type) {
        params.append("type", filters.type);
      }

      if (filters?.status && filters.status !== "all") {
        params.append("status", filters.status);
      }

      if (filters?.search) {
        params.append("search", filters.search);
      }

      if (filters?.limit) {
        params.append("limit", filters.limit.toString());
      }

      if (filters?.offset) {
        params.append("offset", filters.offset.toString());
      }

      const url = `/api/notifications${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      return api.get<NotificationsResponse>(url);
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

// Hook to mark a notification as read
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.patch("/api/notifications", {
        action: "markAsRead",
        id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Hook to mark multiple notifications as read
export function useMarkNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      return api.patch("/api/notifications", {
        action: "markSelectedAsRead",
        ids,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Hook to mark all notifications as read
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api.patch("/api/notifications", {
        action: "markAllAsRead",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Hook to delete a notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.patch("/api/notifications", {
        action: "delete",
        id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Hook to delete multiple notifications
export function useDeleteNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      return api.patch("/api/notifications", {
        action: "deleteSelected",
        ids,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Hook to create a notification
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      notification: Omit<Notification, "id" | "createdAt" | "timeAgo">,
    ) => {
      return api.post("/api/notifications", notification);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
