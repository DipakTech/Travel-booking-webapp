"use client";

import { notFound, useParams } from "next/navigation";
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
  Loader2,
  Globe,
  Mountain,
  DollarSign,
  Cloud,
  MessageSquare,
  Camera,
  Clock,
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
import { useDestination } from "@/lib/hooks/use-destinations";
import Image from "next/image";

export default function DestinationDetailsPage() {
  const params = useParams();
  const destinationId = params.id as string;

  const { data: destination, isLoading, error } = useDestination(destinationId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading destination details...</span>
      </div>
    );
  }

  if (error || !destination) {
    notFound();
  }

  const {
    title,
    description,
    images,
    difficulty = "Moderate",
    rating = 0,
    // reviewCount = 0,
    activities = [],
  } = destination;

  const location = destination.location
    ? `${destination.location}`
    : "Unknown Location";

  const duration = destination.duration ? `${destination.duration}` : "0";

  const averageCost = destination.price?.amount || 0;

  const bestSeason = destination.bestSeason || [];

  const altitude = destination.maxAltitude || null;

  const mainImage = images && images.length > 0 ? images[0] : null;
  const galleryImages = images && images.length > 1 ? images.slice(1) : [];

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
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  destination.activities && destination.activities.length > 0
                    ? "default"
                    : "outline"
                }
              >
                {destination.activities && destination.activities.length > 0
                  ? "Featured"
                  : "Standard"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/destinations/${destinationId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <DeleteDestinationDialog
            destinationName={title}
            destinationId={destinationId}
          />
        </div>
      </div>

      <div className="aspect-video w-full rounded-lg bg-muted relative overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
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
              {/* {destination.reviews.length.toLocaleString()} */}
            </div>
            <p className="text-xs text-muted-foreground">Based on reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {/*   Based on {destination.reviews.length} reviews */}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{duration}</div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageCost}</div>
            <p className="text-xs text-muted-foreground">
              {destination.price?.period || "per person"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{description}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activities.map((activity: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {activity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Destination Gallery</CardTitle>
              <CardDescription>
                Photos of the destination and surrounding areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-video rounded-md overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  No additional images available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Destination Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Difficulty
                  </h3>
                  <p>{difficulty || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Best Season
                  </h3>
                  {/* <p>{bestSeason.join(", ") || "Not specified"}</p>  */}
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Activities
                  </h3>
                  <p>{activities.join(", ") || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Duration
                  </h3>
                  <p>
                    {destination.duration
                      ? `${destination.duration} days`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Price
                  </h3>
                  <p>
                    {destination.price
                      ? `$${destination.price.amount} ${destination.price.period}`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Amenities
                  </h3>
                  <p>{destination.amenities?.join(", ") || "None"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                What travelers are saying about this destination
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* {reviewCount > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Rating Summary</div>
                        <div className="text-muted-foreground text-sm">
                          Average rating: {rating.toFixed(1)}/5
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1">{rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="mt-2">
                      This destination has {reviewCount} total reviews.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>No reviews yet for this destination.</p>
                </div>
              )} */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
