"use client";

import { notFound, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TourForm } from "@/components/dashboard/guides/TourForm";
import { useSession } from "next-auth/react";

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

export default function EditTourPage({
  params,
}: {
  params: { id: string; tourId: string };
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

  const tour = guide.schedule.find((t) => t.id === params.tourId);

  if (!tour) {
    notFound();
  }

  const handleSubmit = async (data: any) => {
    // TODO: Implement tour update logic
    console.log("Updated tour data:", data);
    // Here you could use the session user info to track who made the change
    console.log("Updated by:", session?.user?.email);

    // Navigate back to the tour details page after successful update
    router.push(`/dashboard/guides/${params.id}/schedule/${params.tourId}`);
  };

  // Cast the status and difficulty to the expected enum types
  const defaultValues = {
    destination: tour.destination,
    location: tour.location,
    startDate: tour.startDate,
    endDate: tour.endDate,
    description: tour.description,
    maxParticipants: tour.maxParticipants || 10,
    price: tour.price || 0,
    status: tour.status as "confirmed" | "pending" | "cancelled" | "completed",
    difficulty: tour.difficulty as "easy" | "moderate" | "challenging",
    itinerary: tour.itinerary || "",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link
            href={`/dashboard/guides/${params.id}/schedule/${params.tourId}`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Tour</h2>
          <p className="text-muted-foreground">
            Update tour details for {tour.destination}
          </p>
        </div>
      </div>

      <TourForm onSubmit={handleSubmit} defaultValues={defaultValues} />
    </div>
  );
}
