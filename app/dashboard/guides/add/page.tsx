"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GuideForm } from "@/components/dashboard/guides/GuideForm";

export default function AddGuidePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/guides">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Guide</h2>
          <p className="text-muted-foreground">
            Add a new tour guide to your team
          </p>
        </div>
      </div>

      <GuideForm onSubmit={() => {}} />
    </div>
  );
}
