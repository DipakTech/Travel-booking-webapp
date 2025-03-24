"use client";

import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
  LanguagesIcon,
  AwardIcon,
  EditIcon,
  Trash2Icon,
  MailIcon,
  PhoneIcon,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
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
import { useGuide } from "@/lib/hooks/use-guides";
import { Skeleton } from "@/components/ui/skeleton";

export default function GuideDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: guide, isLoading, error } = useGuide(params.id);

  if (error) {
    notFound();
  }

  if (isLoading || !guide) {
    return <GuideDetailsSkeleton />;
  }

  // Format the availability status
  const getStatusBadge = () => {
    switch (guide.availability) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "partially_available":
        return <Badge className="bg-yellow-500">Partially Available</Badge>;
      case "unavailable":
        return <Badge className="bg-red-500">Unavailable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Format social media links
  const socialMediaLinks = [];
  if (guide.socialMedia?.instagram) {
    socialMediaLinks.push({
      name: "Instagram",
      url: `https://instagram.com/${(guide.socialMedia.instagram || "").replace(
        "@",
        "",
      )}`,
      icon: <Instagram className="h-4 w-4" />,
    });
  }
  if (guide.socialMedia?.facebook) {
    socialMediaLinks.push({
      name: "Facebook",
      url: `https://facebook.com/${guide.socialMedia.facebook || ""}`,
      icon: <Facebook className="h-4 w-4" />,
    });
  }
  if (guide.socialMedia?.twitter) {
    socialMediaLinks.push({
      name: "Twitter",
      url: `https://twitter.com/${(guide.socialMedia.twitter || "").replace(
        "@",
        "",
      )}`,
      icon: <Twitter className="h-4 w-4" />,
    });
  }
  if (guide.socialMedia?.linkedin) {
    socialMediaLinks.push({
      name: "LinkedIn",
      url: `https://linkedin.com/in/${guide.socialMedia.linkedin || ""}`,
      icon: <Linkedin className="h-4 w-4" />,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/guides">
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{guide.name}</h2>
          <p className="text-muted-foreground">
            {guide.specialties && guide.specialties.length > 0
              ? guide.specialties[0]
              : "Tour Guide"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/guides/${guide.id}/edit`}>
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/guides/${guide.id}/schedule`}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule
            </Link>
          </Button>
          <DeleteGuideDialog
            guideName={guide.name || ""}
            guideId={guide.id || ""}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-28 w-28">
                  <AvatarImage
                    src={guide.photo || "/images/avatars/default.jpg"}
                    alt={guide.name}
                  />
                  <AvatarFallback>
                    {guide.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-semibold">{guide.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getStatusBadge()}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <MapPinIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>
                    {guide.location?.city && `${guide.location.city}, `}
                    {guide.location?.region}, {guide.location?.country}
                  </span>
                </div>
                <div className="flex items-center">
                  <MailIcon className="mr-2 h-4 w-4 opacity-70" />
                  <a
                    href={`mailto:${guide.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {guide.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="mr-2 h-4 w-4 opacity-70" />
                  <a
                    href={`tel:${guide.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {guide.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <StarIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>
                    {guide.rating.toFixed(1)} ({guide.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <AwardIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>
                    {guide.experience?.years} years experience (
                    {guide.experience?.level})
                  </span>
                </div>
                <div className="flex items-start">
                  <LanguagesIcon className="mr-2 h-4 w-4 opacity-70 mt-1" />
                  <div>
                    {guide.languages?.map((language, i) => (
                      <Badge key={i} variant="secondary" className="mr-1 mb-1">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
                {socialMediaLinks.length > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    {socialMediaLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-muted/80"
                        title={social.name}
                      >
                        {social.icon}
                        <span className="sr-only">{social.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${guide.hourlyRate.toFixed(2)}
                <span className="text-sm text-muted-foreground font-normal">
                  {" "}
                  / hour
                </span>
              </div>
            </CardContent>
          </Card>

          {guide.certifications && guide.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {guide.certifications.map((cert, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <AwardIcon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuedBy}, {cert.year}
                          {cert.expiryYear && ` - ${cert.expiryYear}`}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specialties">Specialties</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{guide.bio}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specialties" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Areas of Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {guide.specialties?.map((specialty, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-sm py-1"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="availability" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  {guide.availableDates && guide.availableDates.length > 0 ? (
                    <ul className="space-y-2">
                      {guide.availableDates.map((date, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                          <div>
                            <p>
                              {new Date(date.from).toLocaleDateString()} -{" "}
                              {new Date(date.to).toLocaleDateString()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No available dates specified.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function GuideDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[150px] mt-2" />
        </div>
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-28 w-28 rounded-full" />
                <div className="space-y-1 text-center">
                  <Skeleton className="h-6 w-[150px] mx-auto" />
                  <Skeleton className="h-5 w-[100px] mx-auto" />
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Skeleton className="h-10 w-[300px]" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
