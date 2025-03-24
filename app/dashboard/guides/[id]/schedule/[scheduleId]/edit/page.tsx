"use client";

import { notFound, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TourForm } from "@/components/dashboard/guides/TourForm";
import {
  useGuideSchedule,
  useUpdateGuideSchedule,
} from "@/lib/hooks/use-guide-schedules";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
        maxParticipants: 10,
        price: 1800,
        difficulty: "challenging",
        itinerary: `Day 1: Fly from Kathmandu to Lukla (2,800m) and trek to Phakding (2,610m)
Day 2: Trek from Phakding to Namche Bazaar (3,440m)
Day 3: Acclimatization day in Namche Bazaar with hike to Everest View Hotel
Day 4: Trek from Namche Bazaar to Tengboche (3,860m)
Day 5: Trek from Tengboche to Dingboche (4,410m)
Day 6: Acclimatization day in Dingboche with hike to Nangkartshang Peak
Day 7: Trek from Dingboche to Lobuche (4,940m)
Day 8: Trek from Lobuche to Gorak Shep (5,180m), then to Everest Base Camp (5,364m) and back to Gorak Shep
Day 9: Morning hike to Kala Patthar (5,550m) for sunrise views of Everest, then trek down to Pheriche (4,240m)
Day 10: Trek from Pheriche to Namche Bazaar
Day 11: Trek from Namche Bazaar to Lukla
Day 12: Morning flight from Lukla to Kathmandu`,
      },
      // Other tours...
    ],
  },
];

export default function EditSchedulePage({
  params,
}: {
  params: { id: string; scheduleId: string };
}) {
  const router = useRouter();
  const { toast } = useToast();

  // Fetch schedule data
  const {
    data: schedule,
    isLoading: isLoadingSchedule,
    error: scheduleError,
  } = useGuideSchedule(params.id, params.scheduleId);

  // Update schedule mutation
  const { mutate: updateSchedule, isPending: isUpdating } =
    useUpdateGuideSchedule(params.id, params.scheduleId);

  if (scheduleError) {
    notFound();
  }

  const handleSubmit = async (data: any) => {
    updateSchedule(data, {
      onSuccess: () => {
        toast({
          title: "Tour updated",
          description: "The tour has been successfully updated.",
        });
        router.push(
          `/dashboard/guides/${params.id}/schedule/${params.scheduleId}`,
        );
      },
      onError: (error: any) => {
        toast({
          title: "Failed to update tour",
          description:
            error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  // Format the values from API to form format if schedule data is available
  const getFormDefaultValues = () => {
    if (!schedule) return {};

    return {
      destination: schedule.destination,
      location: schedule.location,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      description: schedule.description,
      maxParticipants: schedule.maxParticipants,
      price: schedule.price,
      status: schedule.status,
      difficulty: schedule.difficulty,
      itinerary: schedule.itinerary,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link
            href={`/dashboard/guides/${params.id}/schedule/${params.scheduleId}`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Tour</h2>
          <p className="text-muted-foreground">
            Update tour details and schedule
          </p>
        </div>
      </div>

      {isLoadingSchedule ? (
        <Card>
          <CardHeader>
            <CardTitle>Tour Information</CardTitle>
            <CardDescription>Loading tour details...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <TourForm
          defaultValues={getFormDefaultValues()}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
