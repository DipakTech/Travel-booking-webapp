import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Star,
  Users,
  TrendingUp,
  Eye,
  Edit,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteDestinationDialog } from "@/components/dashboard/destinations/DeleteDestinationDialog";

export const metadata: Metadata = {
  title: "Destination Details | Travel Booking Dashboard",
  description: "View and manage destination details",
};

// Mock data - in a real app, this would come from a database
const destinations = [
  {
    id: "D001",
    name: "Everest Base Camp",
    location: "Khumbu Region, Nepal",
    description:
      "Trek to the world's highest mountain base camp. The journey begins with a flight to Lukla, followed by a trek through Sherpa villages, dense forests, and glacial moraines.",
    longDescription:
      "The Everest Base Camp trek is one of the most popular trekking routes in Nepal. It takes you through stunning mountain scenery, traditional Sherpa villages, and ultimately to the base of Mount Everest, the highest mountain in the world. The trek is challenging but rewarding, offering breathtaking views of the Himalayan mountain range including Everest, Lhotse, Nuptse, and Ama Dablam. Along the way, trekkers experience the unique Sherpa culture, visit ancient monasteries, and traverse through the beautiful Sagarmatha National Park.",
    altitude: "5,364 meters",
    bestSeason: "March-May, September-November",
    difficulty: "Moderate to Challenging",
    duration: "12-16 days",
    averageCost: "$1,500 - $3,000",
    rating: 4.9,
    visitors: 2500,
    upcomingTours: 12,
    status: "popular",
    mainImage: "/destinations/annapurna.jpg",
    gallery: [
      "/destinations/abc.jpg",
      "/destinations/annapurna.jpg",
      "/destinations/kathmandu.jpg",
    ],
    highlights: [
      "Panoramic views of Mount Everest and surrounding peaks",
      "Experience of Sherpa culture and traditions",
      "Visit to ancient monasteries including Tengboche Monastery",
      "Stay in traditional teahouses along the route",
      "Cross suspension bridges over deep gorges",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        description:
          "Welcome at the airport and transfer to hotel. Briefing about the trek.",
      },
      {
        day: 2,
        title: "Fly to Lukla and trek to Phakding",
        description:
          "Early morning flight to Lukla (2,800m) and trek to Phakding (2,652m).",
      },
      {
        day: 3,
        title: "Trek to Namche Bazaar",
        description:
          "Trek from Phakding to Namche Bazaar (3,440m), the main trading center of the region.",
      },
      {
        day: 4,
        title: "Acclimatization in Namche",
        description:
          "Rest day in Namche with short hike to Everest View Hotel for acclimatization.",
      },
      {
        day: 5,
        title: "Trek to Tengboche",
        description:
          "Trek to Tengboche (3,870m), home to the largest monastery in the region.",
      },
    ],
    reviews: [
      {
        id: "R001",
        user: "Alex M.",
        rating: 5,
        date: "2023-08-15",
        comment:
          "Incredible experience! The views were breathtaking and our guide was extremely knowledgeable.",
      },
      {
        id: "R002",
        user: "Sarah W.",
        rating: 4,
        date: "2023-07-22",
        comment:
          "Challenging but very rewarding. Pack layers as the weather changes quickly.",
      },
      {
        id: "R003",
        user: "Michael T.",
        rating: 5,
        date: "2023-09-05",
        comment:
          "Once in a lifetime journey. The Sherpa culture was fascinating and the mountains were majestic.",
      },
    ],
  },
];

export default function DestinationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const destination = destinations.find((d) => d.id === params.id);

  if (!destination) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/destinations">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              {destination.name}
            </h2>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  destination.status === "popular"
                    ? "default"
                    : destination.status === "trending"
                    ? "secondary"
                    : "outline"
                }
              >
                {destination.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{destination.location}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/destinations/${destination.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/destinations/${destination.id}/tours`}>
              <List className="h-4 w-4 mr-2" />
              Tours
            </Link>
          </Button>
          <DeleteDestinationDialog
            destinationName={destination.name}
            destinationId={destination.id}
          />
        </div>
      </div>

      <div className="aspect-video w-full rounded-lg bg-muted relative overflow-hidden">
        {destination.mainImage ? (
          <img
            src={destination.mainImage}
            alt={destination.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <MapPin className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {destination.visitors.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {destination.rating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {destination.reviews?.length || 0} reviews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Tours
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {destination.upcomingTours}
            </div>
            <p className="text-xs text-muted-foreground">Next 3 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Popularity Trend
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <p className="text-xs text-muted-foreground">
              Compared to last year
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="p-4 border rounded-md mt-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p>{destination.longDescription}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Highlights</h3>
              <ul className="list-disc pl-5 space-y-1">
                {destination.highlights?.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="details" className="p-4 border rounded-md mt-2">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Trip Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="font-medium">{destination.difficulty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{destination.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Altitude</p>
                  <p className="font-medium">{destination.altitude}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best Season</p>
                  <p className="font-medium">{destination.bestSeason}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Cost</p>
                  <p className="font-medium">{destination.averageCost}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Gallery</h3>
              {destination.gallery?.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {destination.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-md overflow-hidden bg-muted"
                    >
                      <img
                        src={image}
                        alt={`${destination.name} gallery image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No gallery images available
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="itinerary" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-medium mb-4">Trip Itinerary</h3>
          <div className="space-y-4">
            {destination.itinerary?.map((item) => (
              <div key={item.day} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    Day {item.day}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="p-4 border rounded-md mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Customer Reviews</h3>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">
                {destination.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({destination.reviews?.length || 0} reviews)
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {destination.reviews?.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{review.user}</div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{review.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(review.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
