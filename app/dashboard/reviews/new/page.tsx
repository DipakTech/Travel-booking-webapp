"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NewReviewForm } from "@/components/dashboard/reviews/NewReviewForm";
import { useCreateReview } from "@/lib/hooks/use-reviews";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function AddReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createReviewMutation = useCreateReview();
  const { data: session } = useSession();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    if (!session) {
      toast.error("No session found");
      return;
    }

    if (!data.reviewType || !data.entityId) {
      toast.error("Please select what you are reviewing and choose an item");
      return;
    }

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

    try {
      console.log("Submitting review data:", reviewData);
      await createReviewMutation.mutateAsync(reviewData);
      toast.success("Review submitted successfully");
      router.push("/dashboard/reviews");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/reviews">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Review</h2>
          <p className="text-muted-foreground">
            Create a new review for a guide or destination
          </p>
        </div>
      </div>

      <NewReviewForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
