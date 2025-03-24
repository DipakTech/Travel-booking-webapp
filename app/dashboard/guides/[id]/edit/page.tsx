"use client";

import { notFound, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GuideForm } from "@/components/dashboard/guides/GuideForm";
import { useGuide, useUpdateGuide } from "@/lib/hooks/use-guides";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditGuidePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: guide, isLoading: isLoadingGuide, error } = useGuide(params.id);
  const { mutate: updateGuide, isPending: isUpdating } = useUpdateGuide(
    params.id,
  );

  if (error) {
    notFound();
  }

  const handleSubmit = async (data: any) => {
    // Transform form data to match API schema expectations
    const transformedData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      // Transform location string to object
      location: {
        country: data.location.split(",").pop()?.trim() || "Unknown Country",
        region: data.location.split(",").shift()?.trim() || "Unknown Region",
        city: data.location.includes(",")
          ? data.location.split(",")[0]?.trim()
          : undefined,
      },
      // Transform languages string to array
      languages: data.languages
        .split(",")
        .map((lang: string) => lang.trim())
        .filter(Boolean),
      // Transform specialties string to array
      specialties: data.specialties
        .split(",")
        .map((specialty: string) => specialty.trim())
        .filter(Boolean),
      // Transform experience string to object
      experience: {
        years: parseInt(data.experience.split(" ")[0]) || 0,
        level: determineExperienceLevel(data.experience),
        expeditions: parseInt(
          data.experience.match(/(\d+)\s*expedition/i)?.[1] || "0",
        ),
      },
      bio: data.bio,
      hourlyRate: parseFloat(
        data.hourlyRate || guide?.hourlyRate?.toString() || "25",
      ),
      availability: mapStatusToAvailability(data.status),
    };

    updateGuide(transformedData, {
      onSuccess: () => {
        router.push(`/dashboard/guides/${params.id}`);
      },
    });
  };

  // Helper function to determine experience level from string
  const determineExperienceLevel = (
    experienceStr: string,
  ): "beginner" | "intermediate" | "expert" | "master" => {
    const str = experienceStr.toLowerCase();
    if (str.includes("expert")) return "expert";
    if (str.includes("master")) return "master";
    if (str.includes("beginner")) return "beginner";
    return "intermediate";
  };

  // Helper function to map status to availability
  const mapStatusToAvailability = (
    status: string,
  ): "available" | "partially_available" | "unavailable" => {
    if (status === "active") return "available";
    if (status === "on_leave") return "partially_available";
    return "unavailable";
  };

  // Format the values from API format to form format if guide data is available
  const getFormDefaultValues = () => {
    if (!guide) return {};

    // Ensure the status is one of the expected values
    let status: "active" | "on_leave" | "inactive";
    if (guide.availability === "available") {
      status = "active";
    } else if (guide.availability === "partially_available") {
      status = "on_leave";
    } else {
      status = "inactive";
    }

    return {
      name: guide.name,
      title: guide.specialties?.[0] || "",
      email: guide.email,
      phone: guide.phone,
      location: guide.location
        ? `${guide.location.city ? guide.location.city + ", " : ""}${
            guide.location.region
          }, ${guide.location.country}`
        : "",
      bio: guide.bio,
      experience: guide.experience
        ? `${guide.experience.years} years${
            guide.experience.expeditions
              ? ` (${guide.experience.expeditions} expeditions)`
              : ""
          }`
        : "",
      languages: Array.isArray(guide.languages)
        ? guide.languages.join(", ")
        : "",
      specialties: Array.isArray(guide.specialties)
        ? guide.specialties.join(", ")
        : "",
      certification: guide.certifications
        ? guide.certifications.map((cert) => cert.name).join(", ")
        : "",
      hourlyRate: guide.hourlyRate?.toString() || "",
      status,
    };
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading="Edit Guide"
        text={`Update information for ${guide?.name || "this guide"}`}
      >
        <Button asChild variant="outline">
          <Link href={`/dashboard/guides/${params.id}`}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Guide Details
          </Link>
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Guide Information</CardTitle>
          <CardDescription>
            Update the guide&apos;s details. All fields marked with * are
            required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingGuide ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <GuideForm
              defaultValues={getFormDefaultValues()}
              onSubmit={handleSubmit}
              isLoading={isUpdating}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
