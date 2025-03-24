"use client";

import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Flag,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useGuide } from "@/lib/hooks/use-guides";
import {
  useGuideSchedule,
  useDeleteGuideSchedule,
} from "@/lib/hooks/use-guide-schedules";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function ScheduleDetailPage({
  params,
}: {
  params: { id: string; scheduleId: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch guide data
  const { data: guide, isLoading: isLoadingGuide } = useGuide(params.id);

  // Fetch schedule data
  const {
    data: schedule,
    isLoading: isLoadingSchedule,
    error: scheduleError,
  } = useGuideSchedule(params.id, params.scheduleId);

  // Delete schedule mutation
  const { mutate: deleteSchedule, isPending: isDeleting } =
    useDeleteGuideSchedule(params.id);

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

  if (scheduleError) {
    notFound();
  }

  if (isLoadingGuide || isLoadingSchedule || !guide || !schedule) {
    return <ScheduleDetailSkeleton />;
  }

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
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

  // Get difficulty badge
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Easy
          </Badge>
        );
      case "moderate":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Moderate
          </Badge>
        );
      case "challenging":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Challenging
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format itinerary
  const formatItinerary = (itinerary: string) => {
    return itinerary.split("\n").map((line, index) => (
      <p key={index} className="py-1">
        {line}
      </p>
    ));
  };

  // Handle delete schedule
  const handleDelete = () => {
    deleteSchedule(params.scheduleId, {
      onSuccess: () => {
        toast({
          title: "Tour deleted",
          description: "The tour has been removed from the guide's schedule.",
        });
        router.push(`/dashboard/guides/${params.id}/schedule`);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/guides/${params.id}/schedule`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {schedule.destination}
            </h2>
            <p className="text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {schedule.location}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link
              href={`/dashboard/guides/${params.id}/schedule/${params.scheduleId}/edit`}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the tour from the guide&apos;s
                  schedule. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tour Details</CardTitle>
            <CardDescription>Basic information about the tour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Guide
              </div>
              <div>{guide.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </div>
              <div>{getStatusBadge(schedule.status)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Difficulty
              </div>
              <div>{getDifficultyBadge(schedule.difficulty)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Price
              </div>
              <div className="text-xl font-bold">
                ${schedule.price.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>Dates and duration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Start Date
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {formatDate(schedule.startDate)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                End Date
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {formatDate(schedule.endDate)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Duration
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                {calculateDuration(schedule.startDate, schedule.endDate)} days
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>Group information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Maximum Participants
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                {schedule.maxParticipants}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{schedule.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{schedule.itinerary}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ScheduleDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[200px] mt-2" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-4 w-[180px] mt-1" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, j) => (
                    <div key={j}>
                      <Skeleton className="h-4 w-[100px] mb-1" />
                      <Skeleton className="h-5 w-[180px]" />
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[120px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[120px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
