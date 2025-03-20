"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DestinationForm } from "@/components/dashboard/destinations/DestinationForm";

export default function AddDestinationPage() {
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

      <DestinationForm onSubmit={() => {}} />
    </div>
  );
}
