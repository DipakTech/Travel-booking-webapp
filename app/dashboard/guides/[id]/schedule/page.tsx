"use client";

// import { Metadata } from "next";
import { notFound, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Plus,
  CalendarIcon,
  Clock,
  Users,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScheduleForm } from "@/components/dashboard/guides/ScheduleForm";
import { useGuide } from "@/lib/hooks/use-guides";
import { useGuideSchedules } from "@/lib/hooks/use-guide-schedules";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
// export const metadata: Metadata = {
//   title: "Guide Schedule | Travel Booking Dashboard",
//   description: "Manage guide tour schedule and assignments",
// };

// Mock data - in a real app, this would come from a database
const guides = [
  {
    id: "G001",
    name: "Tenzing Sherpa",
    title: "Senior Trekking Guide",
    experience: "15 years",
    profileImage: "/guides/tenzing.jpg",
    schedule: [
      {
        id: "T001",
        destination: "Everest Base Camp",
        startDate: "2023-10-15",
        endDate: "2023-10-28",
        status: "confirmed",
        participants: 6,
        location: "Khumbu Region, Nepal",
        description:
          "Classic trek to Everest Base Camp via Namche Bazaar and Tengboche Monastery",
      },
      {
        id: "T002",
        destination: "Annapurna Circuit",
        startDate: "2023-11-10",
        endDate: "2023-11-25",
        status: "confirmed",
        participants: 4,
        location: "Annapurna Region, Nepal",
        description: "Complete circuit trek around the Annapurna massif",
      },
      {
        id: "T003",
        destination: "Langtang Valley",
        startDate: "2023-12-05",
        endDate: "2023-12-15",
        status: "pending",
        participants: 3,
        location: "Langtang National Park, Nepal",
        description:
          "Trek through beautiful Langtang Valley, recovering from the 2015 earthquake",
      },
      {
        id: "T004",
        destination: "Everest Three Passes",
        startDate: "2024-03-10",
        endDate: "2024-03-28",
        status: "pending",
        participants: 2,
        location: "Khumbu Region, Nepal",
        description:
          "Advanced trek crossing Renjo La, Cho La, and Kongma La passes",
      },
      {
        id: "T005",
        destination: "Gokyo Lakes",
        startDate: "2024-04-15",
        endDate: "2024-04-30",
        status: "pending",
        participants: 0,
        location: "Khumbu Region, Nepal",
        description:
          "Trek to the turquoise lakes of Gokyo and Gokyo Ri viewpoint",
      },
    ],
  },
];

export default function GuideSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch guide data
  const {
    data: guide,
    isLoading: isLoadingGuide,
    error: guideError,
  } = useGuide(params.id);

  // Fetch guide schedules
  const {
    data: schedules,
    isLoading: isLoadingSchedules,
    error: schedulesError,
  } = useGuideSchedules(params.id);

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (guideError) {
    notFound();
  }

  // Show loading states
  if (isLoadingGuide || !guide) {
    return <SchedulePageSkeleton />;
  }

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Calculate date duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Sort and filter schedules
  const processSchedules = () => {
    if (!schedules) return { upcomingTours: [], pastTours: [] };

    // Sort tours by date (most recent first)
    const sortedTours = [...schedules].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    // Separate upcoming and past tours
    const now = new Date();
    const upcomingTours = sortedTours.filter(
      (tour) => new Date(tour.startDate) >= now,
    );
    const pastTours = sortedTours.filter(
      (tour) => new Date(tour.startDate) < now,
    );

    return { upcomingTours, pastTours };
  };

  const { upcomingTours, pastTours } = processSchedules();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/guides/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {guide.name} Schedule
            </h2>
            <p className="text-muted-foreground">
              Manage tour assignments and schedule
            </p>
          </div>
        </div>
        <Link href={`/dashboard/guides/${params.id}/schedule/add`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tour
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All assigned tours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Tours
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTours.length}</div>
            <p className="text-xs text-muted-foreground">
              Future scheduled tours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tours
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastTours.length}</div>
            <p className="text-xs text-muted-foreground">Past tours</p>
          </CardContent>
        </Card>
      </div>

      {schedulesError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load schedule data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      {isLoadingSchedules ? (
        <ScheduleTableSkeleton />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tours</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTours.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destination</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingTours.map((tour) => (
                      <TableRow key={tour.id}>
                        <TableCell className="font-medium">
                          {tour.destination}
                          <div className="text-xs text-muted-foreground">
                            {tour.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(tour.startDate)}
                          <div className="text-xs text-muted-foreground">
                            to {formatDate(tour.endDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {calculateDuration(tour.startDate, tour.endDate)} days
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-1 h-3 w-3 opacity-70" />
                            {tour.maxParticipants}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(tour.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/dashboard/guides/${params.id}/schedule/${tour.id}`}
                              >
                                Details
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No upcoming tours scheduled for this guide.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Tours</CardTitle>
            </CardHeader>
            <CardContent>
              {pastTours.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destination</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastTours.map((tour) => (
                      <TableRow key={tour.id}>
                        <TableCell className="font-medium">
                          {tour.destination}
                          <div className="text-xs text-muted-foreground">
                            {tour.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(tour.startDate)}
                          <div className="text-xs text-muted-foreground">
                            to {formatDate(tour.endDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {calculateDuration(tour.startDate, tour.endDate)} days
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-1 h-3 w-3 opacity-70" />
                            {tour.maxParticipants}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(tour.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/dashboard/guides/${params.id}/schedule/${tour.id}`}
                              >
                                Details
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No tours scheduled for this guide yet.
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function SchedulePageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[50px]" />
                <Skeleton className="h-4 w-[120px] mt-1" />
              </CardContent>
            </Card>
          ))}
      </div>

      <ScheduleTableSkeleton />
    </div>
  );
}

function ScheduleTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[150px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
