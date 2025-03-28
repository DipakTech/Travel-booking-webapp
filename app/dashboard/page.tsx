"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, MapPin, DollarSign } from "lucide-react";
import Link from "next/link";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { BookingStats } from "@/components/dashboard/BookingStats";
import { useDashboardStats } from "@/lib/hooks/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your travel bookings.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {data?.bookings?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(data?.bookings?.growth || 0) > 0 ? "+" : ""}
                  {Math.round(data?.bookings?.growth || 0)}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {data?.bookings?.confirmed || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data?.bookings?.pending || 0} trips pending confirmation
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Travelers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {data?.travelers?.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(data?.travelers?.growth || 0) > 0 ? "+" : ""}
                  {Math.round(data?.travelers?.growth || 0)}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ${(data?.revenue?.total || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(data?.revenue?.growth || 0) > 0 ? "+" : ""}
                  {Math.round(data?.revenue?.growth || 0)}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Booking Statistics</CardTitle>
            <CardDescription>
              Your booking activity over the last year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingStats />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your most recent travel bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentBookings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
