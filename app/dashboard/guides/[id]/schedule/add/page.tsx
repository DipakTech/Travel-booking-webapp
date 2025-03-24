"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TourForm } from "@/components/dashboard/guides/TourForm";
import { useRouter } from "next/navigation";
import { useCreateGuideSchedule } from "@/lib/hooks/use-guide-schedules";
import { useToast } from "@/components/ui/use-toast";

export default function AddTourPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createSchedule, isPending } = useCreateGuideSchedule(
    params.id,
  );

  const handleSubmit = async (data: any) => {
    createSchedule(data, {
      onSuccess: () => {
        toast({
          title: "Tour created",
          description:
            "The tour has been successfully added to the guide's schedule.",
        });
        router.push(`/dashboard/guides/${params.id}/schedule`);
      },
      onError: (error: any) => {
        toast({
          title: "Failed to create tour",
          description:
            error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/guides/${params.id}/schedule`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Tour</h2>
          <p className="text-muted-foreground">
            Create a new tour assignment for the guide
          </p>
        </div>
      </div>

      <TourForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
