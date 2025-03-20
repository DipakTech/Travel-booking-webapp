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
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      {
        id: "T002",
        destination: "Annapurna Circuit",
        startDate: "2023-11-10",
        endDate: "2023-11-25",
        status: "confirmed",
        participants: 4,
        location: "Annapurna Region, Nepal",
        description: "Complete circuit trek around the Annapurna massif",
        maxParticipants: 8,
        price: 1500,
        difficulty: "moderate",
        itinerary: `Day 1: Drive from Kathmandu to Besisahar and trek to Bhulbhule
Day 2: Trek from Bhulbhule to Jagat
Day 3-12: Continue the circuit through Dharapani, Chame, Upper Pisang, Manang, Yak Kharka, Thorung Phedi, Muktinath, Marpha, Kalopani, and Tatopani
Day 13: Trek from Tatopani to Ghorepani
Day 14: Early morning hike to Poon Hill for sunrise, then trek to Tikhedhunga
Day 15: Trek to Nayapul and drive to Pokhara`,
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
        maxParticipants: 6,
        price: 1200,
        difficulty: "moderate",
        itinerary: `Day 1: Drive from Kathmandu to Syabrubesi
Day 2: Trek from Syabrubesi to Lama Hotel
Day 3: Trek from Lama Hotel to Langtang village
Day 4: Trek from Langtang village to Kyanjin Gompa
Day 5: Rest and exploration day in Kyanjin Gompa, optional hike to Kyanjin Ri
Day 6: Trek from Kyanjin Gompa to Lama Hotel
Day 7: Trek from Lama Hotel to Syabrubesi
Day 8: Drive back to Kathmandu`,
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
        maxParticipants: 4,
        price: 2200,
        difficulty: "challenging",
        itinerary: `Day 1-4: Follow the Everest Base Camp route to Namche and acclimatize
Day 5-6: Trek to Thame and Lungden
Day 7: Cross Renjo La Pass (5,360m) to Gokyo Lakes
Day 8: Rest day at Gokyo Lakes with hike to Gokyo Ri
Day 9: Cross Cho La Pass (5,420m) to Dzongla
Day 10: Trek to Lobuche
Day 11: Visit Everest Base Camp and sleep at Gorak Shep
Day 12: Sunrise at Kala Patthar, then to Lobuche
Day 13: Cross Kongma La Pass (5,535m) to Chhukung
Day 14-18: Return via Dingboche, Tengboche, Namche, and Lukla`,
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
        maxParticipants: 8,
        price: 1600,
        difficulty: "moderate",
        itinerary: `Day 1: Fly from Kathmandu to Lukla, trek to Phakding
Day 2: Trek to Namche Bazaar and acclimatize
Day 3: Rest day in Namche Bazaar
Day 4: Trek to Dole
Day 5: Trek to Machhermo
Day 6: Trek to Gokyo
Day 7: Rest day with hike to Gokyo Ri
Day 8: Explore Fifth Lake
Day 9-12: Return journey to Lukla via Dole and Namche
Day 13: Fly from Lukla to Kathmandu`,
      },
    ],
  },
];

export default function TourDetailsPage({
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
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
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
              {tour.destination}
            </h2>
            <p className="text-muted-foreground">
              Tour details and information
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link
              href={`/dashboard/guides/${params.id}/schedule/${params.tourId}/edit`}
            >
              Edit Tour
            </Link>
          </Button>
          {tour.status !== "cancelled" && (
            <Button variant="destructive">Cancel Tour</Button>
          )}
        </div>
      </div>

      {/* Tour Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tour Overview</CardTitle>
            <CardDescription>Key information about the tour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <div>{getStatusBadge(tour.status)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Difficulty
                </p>
                <div>{getDifficultyBadge(tour.difficulty)}</div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Location
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {tour.location}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Guide</p>
              <p>
                {guide.name} ({guide.title})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Start Date
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(tour.startDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  End Date
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(tour.endDate)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Duration
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {calculateDuration(tour.startDate, tour.endDate)} days
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Price per Person
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {formatPrice(tour.price)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Participants
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {tour.participants}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Maximum Participants
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {tour.maxParticipants}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tour Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6">{tour.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Itinerary</CardTitle>
          <CardDescription>Day-by-day schedule for the tour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm leading-6">
            {formatItinerary(tour.itinerary)}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/guides/${params.id}/schedule`}>
            Back to Schedule
          </Link>
        </Button>
      </div>
    </div>
  );
}
