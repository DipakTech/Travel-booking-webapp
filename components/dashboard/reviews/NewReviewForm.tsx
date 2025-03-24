"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import {
  useDestinations,
  DestinationResponse,
} from "@/lib/hooks/use-destinations";
import { useGuides } from "@/lib/hooks/use-guides";
import { useCreateReview } from "@/lib/hooks/use-reviews";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Define ReviewFormValues type
export type ReviewFormValues = {
  title: string;
  content: string;
  rating: number;
  authorId: string;
  guideId?: string | undefined;
  destinationId?: string | undefined;
  tripStartDate?: string;
  tripEndDate?: string;
  tripDuration?: number;
  tripType?: string;
};

// Define the validation schema for the form
const reviewFormSchema = z.object({
  reviewType: z.enum(["guide", "destination"], {
    required_error: "Please select what you are reviewing",
  }),
  entityId: z.string().min(1, "Please select a guide or destination"),
  title: z.string().min(3, "Title must be at least 3 characters long").max(100),
  content: z
    .string()
    .min(20, "Review must be at least 20 characters long")
    .max(5000),
  rating: z.number().min(1).max(5),
  tripStartDate: z.date().optional(),
  tripEndDate: z.date().optional(),
  tripDuration: z.number().optional(),
  tripType: z.string().optional(),
});

type FormValues = z.infer<typeof reviewFormSchema>;

interface NewReviewFormProps {
  onSubmit?: (data: ReviewFormValues) => void;
  isSubmitting?: boolean;
  defaultReviewType?: "guide" | "destination";
  defaultEntityId?: string;
}

// Define interface for destinations with necessary properties
interface FormattedDestination {
  id: string;
  name: string;
}

// Define interface for guides with necessary properties
interface FormattedGuide {
  id: string;
  name: string;
}

export function NewReviewForm({
  onSubmit,
  isSubmitting = false,
  defaultReviewType,
  defaultEntityId,
}: NewReviewFormProps) {
  const [selectedType, setSelectedType] = useState<
    "guide" | "destination" | null
  >(defaultReviewType || null);

  // Initialize the create review mutation
  const createReviewMutation = useCreateReview();

  // Fetch real data
  const { data: destinationsData, isLoading: isLoadingDestinations } =
    useDestinations();
  const { data: guidesData, isLoading: isLoadingGuides } = useGuides();

  // Ensure guides and destinations are always treated as arrays and properly formatted
  const guides: FormattedGuide[] =
    guidesData?.guides?.map((guide) => ({
      id: guide.id || "",
      name: guide.name || "Unknown Guide",
    })) || [];

  const destinations: FormattedDestination[] =
    destinationsData?.destinations?.map((dest) => ({
      id: dest.id || "",
      name: dest.title || "Unknown Destination", // Use 'title' from DestinationResponse
    })) || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      reviewType: defaultReviewType || undefined,
      entityId: defaultEntityId || "",
      title: "",
      content: "",
      rating: 5,
    },
  });

  // When defaultReviewType or defaultEntityId change, update the form
  useEffect(() => {
    if (defaultReviewType) {
      form.setValue("reviewType", defaultReviewType);
      setSelectedType(defaultReviewType);
    }
    if (defaultEntityId) {
      form.setValue("entityId", defaultEntityId);
    }
  }, [defaultReviewType, defaultEntityId, form]);

  // When review type changes, reset the entityId field unless defaultEntityId is set
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "reviewType") {
        if (!defaultEntityId) {
          form.setValue("entityId", "");
        }
        setSelectedType(value.reviewType as "guide" | "destination" | null);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, defaultEntityId]);

  const { data: session } = useSession();

  const handleSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    if (!session?.user?.id) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    // Create a properly formatted review object to submit
    const reviewData = {
      title: data.title,
      content: data.content,
      rating: data.rating,
      authorId: session.user.id,
      // Set the appropriate ID based on review type
      ...(data.reviewType === "guide"
        ? { guideId: data.entityId }
        : { destinationId: data.entityId }),
      // Add trip details if provided
      ...(data.tripStartDate && {
        tripStartDate: data.tripStartDate.toISOString(),
      }),
      ...(data.tripEndDate && { tripEndDate: data.tripEndDate.toISOString() }),
      ...(data.tripDuration && { tripDuration: data.tripDuration }),
      ...(data.tripType && { tripType: data.tripType }),
    };

    // Log the exact data being sent
    console.log("Review type:", data.reviewType);
    console.log("Entity ID:", data.entityId);
    console.log("Final review data:", JSON.stringify(reviewData, null, 2));

    // Submit the review using our mutation if no onSubmit is provided
    if (onSubmit) {
      onSubmit(reviewData);
    } else {
      createReviewMutation.mutate(reviewData);
    }
  };

  const renderStarRating = () => {
    const rating = form.watch("rating") || 0;

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "p-0 h-auto",
              star <= rating ? "text-yellow-500" : "text-gray-300",
            )}
            onClick={() => form.setValue("rating", star)}
          >
            <Star
              className={cn(
                "h-8 w-8",
                star <= rating ? "fill-yellow-400 text-yellow-400" : "",
              )}
            />
            <span className="sr-only">{star} stars</span>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="reviewType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What are you reviewing?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedType(value as "guide" | "destination");
                      }}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="guide" />
                        </FormControl>
                        <FormLabel className="font-normal">Guide</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="destination" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Destination
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType && (
              <FormField
                control={form.control}
                name="entityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedType === "guide"
                        ? "Select Guide"
                        : "Select Destination"}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select a ${selectedType}`}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedType === "guide"
                          ? guides.map((guide) => (
                              <SelectItem key={guide.id} value={guide.id || ""}>
                                {guide.name}
                              </SelectItem>
                            ))
                          : destinations.map((destination) => (
                              <SelectItem
                                key={destination.id}
                                value={destination.id || ""}
                              >
                                {destination.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter review title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  {renderStarRating()}
                  <FormDescription>
                    Click on a star to set the rating
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the review"
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || createReviewMutation.isPending}
              >
                {isSubmitting || createReviewMutation.isPending
                  ? "Submitting..."
                  : "Submit Review"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
