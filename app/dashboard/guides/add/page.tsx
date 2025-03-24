"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useCreateGuide } from "@/lib/hooks/use-guides";
import { GuideForm } from "@/components/dashboard/guides/GuideForm";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

// export const metadata = {
//   title: "Add New Guide | Travel Booking Dashboard",
//   description: "Add a new tour guide to the system",
// };

export default function AddGuidePage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        heading="Add New Guide"
        text="Create a new guide profile with all necessary details."
      >
        <Button asChild variant="outline">
          <Link href="/dashboard/guides">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Guides
          </Link>
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Guide Information</CardTitle>
          <CardDescription>
            Enter the guide&apos;s details. All fields marked with * are
            required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <AddGuideForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function AddGuideForm() {
  const router = useRouter();
  const { mutate: createGuide, isPending } = useCreateGuide();

  const handleSubmit = async (data: any) => {
    // Map status to availability
    let availability: "available" | "partially_available" | "unavailable";
    if (data.status === "active") {
      availability = "available";
    } else if (data.status === "on_leave") {
      availability = "partially_available";
    } else {
      availability = "unavailable";
    }

    // Transform the form data to match the API schema
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
        level: "intermediate" as
          | "beginner"
          | "intermediate"
          | "expert"
          | "master",
        expeditions: 0, // Default expeditions
      },
      // Add required fields
      bio: data.bio,
      hourlyRate: 25, // Default hourly rate
      availability, // Use the properly typed variable
      // Add default values for required fields
      rating: 0,
      reviewCount: 0,
      destinations: [],
      // Add certifications if provided
      certifications: data.certification
        ? [
            {
              name: data.certification,
              issuedBy: "Certification Authority",
              year: new Date().getFullYear(),
            },
          ]
        : undefined,
    };

    createGuide(transformedData, {
      onSuccess: () => {
        router.push("/dashboard/guides");
      },
    });
  };

  return <GuideForm onSubmit={handleSubmit} isLoading={isPending} />;
}
