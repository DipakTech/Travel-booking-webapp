import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface DashboardStats {
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    growth: number;
  };
  destinations: {
    total: number;
    featured: number;
    averageRating: number;
    topRated: any[];
  };
  guides: {
    total: number;
    active: number;
    averageRating: number;
  };
  customers: {
    total: number;
    newThisMonth: number;
    growth: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  travelers: {
    total: number;
    thisMonth: number;
    growth: number;
  };
  charts: {
    monthlyData: {
      name: string;
      month: number;
      bookings: number;
      revenue: number;
    }[];
    topDestinations: {
      id: string;
      name: string;
      location: string;
      image: string | null;
      bookingCount: number;
    }[];
    statusDistribution: {
      name: string;
      value: number;
    }[];
  };
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get<DashboardStats>("/api/dashboard"),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
