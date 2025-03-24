import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type UserFilters = {
  role?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/**
 * Hook to fetch users with optional filters
 */
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => {
      // Convert filters to URLSearchParams
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });

      return api.get<{ users: any[]; total: number }>(
        `/api/users?${params.toString()}`,
      );
    },
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => api.get<any>(`/api/users/${id}`),
    enabled: !!id, // Only run the query if we have an ID
  });
}

/**
 * Hook to fetch current user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get<any>(`/api/profile`),
  });
}

/**
 * Hook to fetch user bookings
 */
export function useUserBookings(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-bookings", userId],
    queryFn: () => api.get<any[]>(`/api/users/${userId}/bookings`),
    enabled: !!userId, // Only run the query if we have a user ID
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      return api.put<any>(`/api/profile`, data);
    },
    onSuccess: () => {
      // Invalidate profile query to refetch data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      return api.put<any>(`/api/users/${id}`, data);
    },
    onSuccess: () => {
      // Invalidate the specific user query and the users list
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // If this is the current user, also invalidate profile
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete<{ success: boolean }>(`/api/users/${id}`);
    },
    onSuccess: (_, id) => {
      // Invalidate users queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}

/**
 * Hook to change user password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      return api.put<{ success: boolean }>(`/api/profile/password`, {
        oldPassword,
        newPassword,
      });
    },
  });
}

/**
 * Hook to upload user avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);

      return api.post<{ avatarUrl: string }>(`/api/profile/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      // Invalidate profile query to refetch data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
