import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  Users,
  Languages,
  Award,
  Edit,
  Delete,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteGuideDialog } from "@/components/dashboard/guides/DeleteGuideDialog";

export const metadata: Metadata = {
  title: "Guide Details | Travel Booking Dashboard",
  description: "View and manage guide details",
};

// Mock data - in a real app, this would come from a database
const guides = [
  {
    id: "G001",
    name: "Tenzing Sherpa",
    title: "Senior Trekking Guide",
    email: "tenzing@travelnepal.com",
    phone: "+977 9801234567",
    location: "Solukhumbu, Nepal",
    bio: "With over 15 years of experience guiding trekkers in the Himalayas, Tenzing is one of our most experienced guides. Born and raised in the Khumbu region, he has summited Everest three times and guided hundreds of trekkers to Everest Base Camp.",
    experience: "15 years",
    languages: ["English", "Nepali", "Sherpa", "Hindi", "Basic Chinese"],
    specialties: [
      "High Altitude Trekking",
      "Mountaineering",
      "Photography",
      "Cultural History",
    ],
    certification: [
      "Nepal Mountaineering Association",
      "Wilderness First Responder",
      "Avalanche Safety",
    ],
    rating: 4.9,
    totalTours: 187,
    upcomingTours: 4,
    profileImage: "/guides/tenzing.jpg",
    gallery: [
      "/guides/tenzing-1.jpg",
      "/guides/tenzing-2.jpg",
      "/guides/tenzing-3.jpg",
    ],
    schedule: [
      {
        id: "T001",
        destination: "Everest Base Camp",
        startDate: "2023-10-15",
        endDate: "2023-10-28",
        status: "confirmed",
        participants: 6,
      },
      {
        id: "T002",
        destination: "Annapurna Circuit",
        startDate: "2023-11-10",
        endDate: "2023-11-25",
        status: "confirmed",
        participants: 4,
      },
      {
        id: "T003",
        destination: "Langtang Valley",
        startDate: "2023-12-05",
        endDate: "2023-12-15",
        status: "pending",
        participants: 3,
      },
      {
        id: "T004",
        destination: "Everest Three Passes",
        startDate: "2024-03-10",
        endDate: "2024-03-28",
        status: "pending",
        participants: 2,
      },
    ],
    reviews: [
      {
        id: "R001",
        user: "Sarah J.",
        date: "2023-08-12",
        rating: 5,
        comment:
          "Tenzing made our Everest Base Camp trek unforgettable. His knowledge of the mountains and local culture enriched our experience tremendously. He was always patient and encouraging during challenging sections.",
      },
      {
        id: "R002",
        user: "Michael T.",
        date: "2023-07-25",
        rating: 5,
        comment:
          "We felt safe the entire time with Tenzing. His experience was obvious, and he had solutions for every problem that arose. His stories about local traditions and mountaineering history were fascinating.",
      },
      {
        id: "R003",
        user: "Emma L.",
        date: "2023-06-18",
        rating: 4,
        comment:
          "Great guide with extensive knowledge. Very attentive to safety and everyone's well-being. Would definitely recommend for high altitude treks.",
      },
    ],
  },
];

export default function GuideDetailsPage({
  params,
}: {
  params: { id: string };
}) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/guides">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{guide.name}</h2>
          <p className="text-muted-foreground">{guide.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/guides/${guide.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/guides/${guide.id}/schedule`}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Link>
          </Button>
          <DeleteGuideDialog guideName={guide.name} guideId={guide.id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <div className="rounded-lg overflow-hidden bg-muted">
            {guide.profileImage ? (
              <img
                src={guide.profileImage}
                alt={guide.name}
                className="w-full object-cover aspect-square"
              />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-muted">
                <Avatar className="h-24 w-24">
                  <AvatarFallback>
                    {guide.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{guide.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>
                {guide.rating} rating ({guide.reviews.length} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{guide.experience} experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <span>{guide.languages.join(", ")}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-medium">Contact Information</h3>
            <div className="text-sm">
              <div className="mb-1">
                <span className="font-medium">Email:</span> {guide.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {guide.phone}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-medium">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {guide.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-medium">Certifications</h3>
            <div className="flex flex-col gap-1">
              {guide.certification.map((cert, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tours
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guide.totalTours}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime tours led
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
                <div className="text-2xl font-bold">{guide.upcomingTours}</div>
                <p className="text-xs text-muted-foreground">Next 3 months</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {guide.rating.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {guide.reviews.length} reviews
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bio">
            <TabsList>
              <TabsTrigger value="bio">Bio</TabsTrigger>
              <TabsTrigger value="schedule">Upcoming Schedule</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            <TabsContent value="bio" className="p-4 border rounded-md mt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    About {guide.name}
                  </h3>
                  <p>{guide.bio}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="schedule"
              className="p-4 border rounded-md mt-2"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Upcoming Tours</h3>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/guides/${guide.id}/schedule`}>
                      View Full Schedule
                    </Link>
                  </Button>
                </div>
                <div className="space-y-3">
                  {guide.schedule.map((tour) => (
                    <div
                      key={tour.id}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div>
                        <div className="font-medium">{tour.destination}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(tour.startDate)} -{" "}
                          {formatDate(tour.endDate)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{tour.participants}</span>
                        </div>
                        {getStatusBadge(tour.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="p-4 border rounded-md mt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Client Reviews</h3>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {guide.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({guide.reviews.length} reviews)
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {guide.reviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{review.user}</div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="gallery" className="p-4 border rounded-md mt-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Photo Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {guide.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-md overflow-hidden bg-muted"
                    >
                      <img
                        src={image}
                        alt={`${guide.name} gallery image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
