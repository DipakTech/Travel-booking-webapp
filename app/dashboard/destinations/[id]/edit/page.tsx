"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DestinationForm } from "@/components/dashboard/destinations/DestinationForm";
import {
  useDestination,
  useUpdateDestination,
  DestinationDetail,
} from "@/lib/hooks/use-destinations";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { destinationSchema } from "@/lib/schema/destination";

// Define the form values type based on the DestinationForm component
type DestinationFormValues = z.infer<typeof destinationFormSchema>;

// Import the schema from DestinationForm or define it here
const destinationFormSchema = z.object({
  title: z.string().min(2),
  location: z.string().min(2),
  description: z.string().min(10),
  longDescription: z.string().min(50),
  altitude: z.string().optional(),
  bestSeason: z.string().optional(),
  difficulty: z.string().optional(),
  duration: z.string().optional(),
  averageCost: z.string().optional(),
  status: z.enum(["popular", "trending", "new"]),
  highlights: z.string().optional(),
  activities: z.string().optional(),
  imageFiles: z.any().optional(),
});

// Helper type for difficulty levels from the destination schema
type DifficultyLevel = z.infer<typeof destinationSchema>["difficulty"];

export default function EditDestinationPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();

  // Get destination data
  const {
    data: destination,
    isLoading: isLoadingDestination,
    isError,
  } = useDestination(id);
  const updateDestination = useUpdateDestination(id);

  // Initialize form values when destination data is loaded
  const [formValues, setFormValues] =
    useState<Partial<DestinationFormValues> | null>(null);

  useEffect(() => {
    if (destination) {
      // Transform API data to match form structure
      setFormValues({
        title: destination.title || "",
        location: destination.location ? `${destination.location}` : "",
        description: destination.description || "",
        longDescription: destination.description || "", // Using description as longDescription
        altitude: destination.maxAltitude
          ? `${destination.maxAltitude} meters`
          : "",
        bestSeason: destination.bestSeason || "",
        difficulty: destination.difficulty || "Moderate",
        // duration: destination.duration
        //   ? `${destination.duration.minDays}-${destination.duration.maxDays}`
        //   : "",
        averageCost: destination.price ? `$${destination.price.amount}` : "",
        status: "new", // Default to new if not specified
        highlights: destination.activities?.join("\n") || "",
        activities: destination.activities?.join(", ") || "",
        // We don't set imageFiles here as they're handled separately
      });
    }
  }, [destination]);

  if (isError) {
    notFound();
  }

  const handleSubmit = async (data: DestinationFormValues) => {
    if (!destination) return;

    try {
      // Show loading toast
      toast({
        title: "Updating destination...",
        description: "Please wait while we update the destination details",
      });

      // Process any image files if present
      let images = destination?.images || [];

      if (data.imageFiles && data.imageFiles.length > 0) {
        // Handle new image files similar to the create page
        const newImageUrls = await processImageFiles(data.imageFiles);
        images = [...newImageUrls]; // Replace existing images with new ones
      }

      // Map form difficulty to valid schema difficulty
      const difficultyMap: Record<string, DifficultyLevel> = {
        easy: "easy",
        moderate: "moderate",
        challenging: "challenging",
        difficult: "difficult",
        extreme: "extreme",
      };

      // Default to moderate if not a valid difficulty
      const formDifficulty = data.difficulty?.toLowerCase() || "moderate";
      const validDifficulty: DifficultyLevel =
        difficultyMap[formDifficulty as keyof typeof difficultyMap] ||
        "moderate";

      // Transform form data to match API schema
      const updatedDestination = {
        title: data.title,
        location: {
          country:
            data.location.split(",")[1]?.trim() ||
            destination?.location?.split(",")[1]?.trim() ||
            "Unknown",
          region:
            data.location.split(",")[0]?.trim() ||
            destination?.location?.split(",")[0]?.trim() ||
            data.location,
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
        },
        description: data.description,
        images,
        featured: data.status === "popular",
        price: {
          amount:
            parseInt(data.averageCost?.replace(/[^0-9]/g, "") || "0") || 0,
          currency: "USD",
          period: "per person" as const,
        },
        duration: {
          minDays: parseInt(data.duration?.split("-")[0] || "1") || 1,
          maxDays:
            parseInt(
              data.duration?.split("-")[1] ||
                data.duration?.split("-")[0] ||
                "1",
            ) || 1,
        },
        difficulty: validDifficulty,
        activities: parseActivities(data.activities),
        seasons: parseSeasons(data.bestSeason),
        amenities: destination?.amenities || [],
      };

      // Update the destination
      await updateDestination.mutateAsync(updatedDestination);

      // Success will be handled by the mutation
      router.push(`/dashboard/destinations/${id}`);
    } catch (error) {
      // Error handling will be performed by the mutation
      console.error("Error updating destination:", error);
    }
  };

  // Loading state
  if (isLoadingDestination || !formValues) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading destination data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/destinations/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Edit Destination
          </h2>
          <p className="text-muted-foreground">
            Update information for {destination?.title || "Destination"}
          </p>
        </div>
      </div>

      <DestinationForm
        defaultValues={formValues}
        onSubmit={handleSubmit}
        isLoading={updateDestination.isPending}
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
