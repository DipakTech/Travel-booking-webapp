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

  const guide = guides.find((g) => g.id === params.id);

  if (!guide) {
    notFound();
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

  // Sort tours by date (most recent first)
  const sortedTours = [...guide.schedule].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  // Separate upcoming and past tours
  const now = new Date();
  const upcomingTours = sortedTours.filter(
    (tour) => new Date(tour.startDate) >= now,
  );
  const pastTours = sortedTours.filter(
    (tour) => new Date(tour.startDate) < now,
  );

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
            <div className="text-2xl font-bold">{guide.schedule.length}</div>
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
            <CardTitle className="text-sm font-medium">Next Tour</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {upcomingTours.length > 0
                ? formatDate(upcomingTours[0].startDate)
                : "No upcoming tours"}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingTours.length > 0 ? upcomingTours[0].destination : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 py-4">
        <Input placeholder="Search tours..." className="max-w-sm" />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destination</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>
                  <div className="font-medium">{tour.destination}</div>
                  <div className="text-sm text-muted-foreground">
                    {tour.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(tour.startDate)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground pl-5">
                    to {formatDate(tour.endDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {calculateDuration(tour.startDate, tour.endDate)} days
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{tour.participants}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(tour.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={`/dashboard/guides/${params.id}/schedule/${tour.id}`}
                    >
                      Details
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sortedTours.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No tours scheduled for this guide yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
