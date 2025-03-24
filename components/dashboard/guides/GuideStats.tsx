"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGuideStats } from "@/lib/hooks/use-guides";
import { UsersIcon, AwardIcon, StarIcon, CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function GuideStats() {
  const { data, isLoading, error } = useGuideStats();

  // Show empty cards if loading or error
  if (isLoading || error || !data) {
    return <EmptyGuideStats />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Guides</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalGuides}</div>
          <p className="text-xs text-muted-foreground">
            {data.activeGuides} active guides
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Guide Availability
          </CardTitle>
          <AwardIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activeGuides}</div>
          <p className="text-xs text-muted-foreground">
            {data.onLeaveGuides} on leave, {data.inactiveGuides} inactive
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <StarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.averageRating.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            From {data.totalReviews} client reviews
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tours This Month
          </CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.toursThisMonth}</div>
          <p className="text-xs text-muted-foreground">
            {data.changeFromLastMonth > 0
              ? `+${data.changeFromLastMonth}%`
              : `${data.changeFromLastMonth}%`}{" "}
            from last month
          </p>
        </CardContent>
      </Card>
    </>
  );
}

function EmptyGuideStats() {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Guides</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-</div>
          <p className="text-xs text-muted-foreground">Loading data...</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Guide Availability
          </CardTitle>
          <AwardIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-</div>
          <p className="text-xs text-muted-foreground">Loading data...</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <StarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-</div>
          <p className="text-xs text-muted-foreground">Loading data...</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tours This Month
          </CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-</div>
          <p className="text-xs text-muted-foreground">Loading data...</p>
        </CardContent>
      </Card>
    </>
  );
}
