"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NewReviewForm } from "@/components/dashboard/reviews/NewReviewForm";

export default function AddReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // In a real application, this would send data to an API
      console.log("Submitting review:", data);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to reviews list
      router.push("/dashboard/reviews");
    } catch (error) {
      console.error("Error submitting review:", error);
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
