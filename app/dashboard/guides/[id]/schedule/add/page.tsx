"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TourForm } from "@/components/dashboard/guides/TourForm";

export default function AddTourPage({ params }: { params: { id: string } }) {
  const handleSubmit = async (data: any) => {
    // TODO: Implement tour creation logic
    console.log("Tour data:", data);
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

      <TourForm onSubmit={handleSubmit} />
    </div>
  );
}
