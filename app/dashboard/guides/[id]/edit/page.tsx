"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GuideForm } from "@/components/dashboard/guides/GuideForm";

// Mock data - in a real app, this would come from a database
const guides = [
  {
    id: "G001",
    name: "Tenzing Sherpa",
    title: "Senior Trekking Guide",
    email: "tenzing@travelnepal.com",
    phone: "+977 9801234567",
    location: "Solukhumbu, Nepal",
    bio: "With over 15 years of experience guiding trekkers in the Himalayas, Tenzing is one of our most experienced guides. Born and raised in the Khumbu region, he has summited Everest three times and guided hundreds of trekkers to Everest Base Camp.",
    experience: "15 years",
    languages: ["English", "Nepali", "Sherpa", "Hindi", "Basic Chinese"],
    specialties: [
      "High Altitude Trekking",
      "Mountaineering",
      "Photography",
      "Cultural History",
    ],
    certification: [
      "Nepal Mountaineering Association",
      "Wilderness First Responder",
      "Avalanche Safety",
    ],
    status: "active",
  },
];

export default function EditGuidePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const guide = guides.find((g) => g.id === params.id);

  if (!guide) {
    notFound();
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // In a real application, this would send the data to an API
      console.log("Updating guide:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to guide details
      router.push(`/dashboard/guides/${params.id}`);
    } catch (error) {
      console.error("Error updating guide:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/guides/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Guide</h2>
          <p className="text-muted-foreground">
            Update information for {guide.name}
          </p>
        </div>
      </div>

      <GuideForm
        defaultValues={{
          name: guide.name,
          title: guide.title,
          email: guide.email,
          phone: guide.phone,
          location: guide.location,
          bio: guide.bio,
          experience: guide.experience,
          languages: guide.languages.join(", "),
          specialties: guide.specialties.join(", "),
          certification: guide.certification.join(", "),
          status: guide.status,
        }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
