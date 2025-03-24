"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { DestinationForm } from "@/components/dashboard/destinations/DestinationForm";
import { useCreateDestination } from "@/lib/hooks/use-destinations";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function AddDestinationPage() {
  const createDestination = useCreateDestination();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      // Show a loading toast when starting the destination creation
      toast({
        title: "Processing images...",
        description: data.imageFiles?.length
          ? `Uploading ${data.imageFiles.length} image${
              data.imageFiles.length > 1 ? "s" : ""
            }`
          : "Using default image",
      });

      // Transform form data to match the API schema
      const destinationData = {
        name: data.name,
        location: {
          country: data.location.split(",")[1]?.trim() || "Unknown",
          region: data.location.split(",")[0]?.trim() || data.location,
          coordinates: {
            latitude: 0, // Default coordinates
            longitude: 0,
          },
        },
        description: data.description,
        images:
          data.imageFiles && data.imageFiles.length > 0
            ? await processImageFiles(data.imageFiles)
            : ["/destinations/placeholder.jpg"], // Default image if no files selected
        featured: data.status === "popular",
        rating: 0, // New destinations start with 0 rating
        reviewCount: 0, // New destinations start with 0 reviews
        price: {
          amount: parseInt(data.averageCost?.replace(/[^0-9]/g, "") || "1000"),
          currency: "USD",
          period: "per person" as
            | "per day"
            | "per person"
            | "per group"
            | "total",
        },
        duration: {
          minDays: parseInt(data.duration?.split("-")[0] || "1"),
          maxDays: parseInt(
            data.duration?.split("-")[1] || data.duration?.split("-")[0] || "1",
          ),
        },
        difficulty: data.difficulty?.toLowerCase() || "moderate",
        activities: parseActivities(data.activities),
        seasons: parseSeasons(data.bestSeason),
        amenities: [],
      };

      await createDestination.mutateAsync(destinationData);

      // Show success toast
      toast({
        title: "Destination created!",
        description: `Successfully created ${data.name}`,
        variant: "default",
      });

      // Redirect to destinations list on success
      router.push("/dashboard/destinations");
    } catch (error) {
      // Show error toast - this may be redundant if the hook already shows toasts
      toast({
        title: "Error creating destination",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });

      console.error("Error during destination creation:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/destinations">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Add New Destination
          </h2>
          <p className="text-muted-foreground">
            Add a new travel destination to your catalog
          </p>
        </div>
      </div>

      <DestinationForm
        onSubmit={handleSubmit}
        isLoading={createDestination.isPending}
      />
    </div>
  );
}

// Helper function to parse seasons from the bestSeason input
const parseSeasons = (
  seasonInput?: string,
): ("spring" | "summer" | "autumn" | "winter" | "all year")[] => {
  if (!seasonInput) return ["spring", "autumn"];

  const validSeasons = [
    "spring",
    "summer",
    "autumn",
    "winter",
    "all year",
  ] as const;
  const result: ("spring" | "summer" | "autumn" | "winter" | "all year")[] = [];

  // Check for common season keywords in the input
  const lowercaseInput = seasonInput.toLowerCase();

  validSeasons.forEach((season) => {
    if (lowercaseInput.includes(season)) {
      result.push(season);
    }
  });

  // If no seasons were found, return default
  return result.length > 0 ? result : ["spring", "autumn"];
};

// Helper function to parse activities from the activities input
const parseActivities = (activitiesInput?: string): string[] => {
  if (!activitiesInput || activitiesInput.trim() === "") {
    return ["trekking", "hiking"];
  }

  return activitiesInput
    .split(",")
    .map((activity) => activity.trim())
    .filter((activity) => activity.length > 0);
};

// Helper function to process image files and convert them to usable URLs
const processImageFiles = async (files: File[]): Promise<string[]> => {
  // In a real application, you would upload these files to a cloud storage service
  // and return the URLs. For this example, we'll create object URLs.
  // NOTE: In production, replace this with actual file uploads to your storage solution.

  const imageUrls: string[] = [];

  // Simulate an async process of uploading files
  for (const file of files) {
    // Create a temporary URL for preview purposes
    const objectUrl = URL.createObjectURL(file);
    imageUrls.push(objectUrl);

    // In a real app, you would:
    // 1. Upload the file to storage
    // 2. Get back a permanent URL
    // 3. Add that URL to the imageUrls array
    // const uploadedUrl = await uploadFileToStorage(file);
    // imageUrls.push(uploadedUrl);
  }

  return imageUrls;
};
