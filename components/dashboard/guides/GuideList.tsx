"use client";

import React from "react";
import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useGuides } from "@/lib/hooks/use-guides";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Complete Guide interface for when we get the full guide object
export interface Guide {
  id: string;
  name: string;
  location: {
    country: string;
    region: string;
    city?: string;
  };
  rating: number;
  availability: "available" | "unavailable" | "partially_available";
  experience: {
    years: number;
    level: "beginner" | "intermediate" | "expert" | "master";
  };
  languages: string[];
  photo?: string;
  email: string;
  active: boolean;
}

// Guide list item interface from the API response
interface GuideListItem {
  id: string;
  name: string;
  location: {
    country: string;
    region: string;
    city?: string;
  };
  rating: number;
  availability: "available" | "unavailable" | "partially_available";
  experience: {
    years: number;
    level: "beginner" | "intermediate" | "expert" | "master";
  };
  languages: string[];
  photo?: string;
  email: string;
}

interface GuideAPIResponse {
  guides: GuideListItem[];
  total: number;
}

const formatLocation = (location: {
  country: string;
  region: string;
  city?: string;
}) => {
  return `${location.city ? location.city + ", " : ""}${location.region}, ${
    location.country
  }`;
};

const formatExperience = (experience: { years: number; level: string }) => {
  return `${experience.years} years (${experience.level})`;
};

const getStatusBadgeProps = (availability: string) => {
  switch (availability) {
    case "available":
      return { variant: "success" as const, label: "Available" };
    case "unavailable":
      return { variant: "destructive" as const, label: "Unavailable" };
    case "partially_available":
      return { variant: "warning" as const, label: "Partially Available" };
    default:
      return { variant: "outline" as const, label: "Unknown" };
  }
};

export function GuideList() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading, error } = useGuides();

  const handleEdit = (guideId: string) => {
    router.push(`/dashboard/guides/${guideId}/edit`);
  };

  const handleView = (guideId: string) => {
    router.push(`/dashboard/guides/${guideId}`);
  };

  const handleDelete = (guideId: string) => {
    // Will be implemented with delete dialog integration
    toast({
      title: "Not implemented",
      description: "Delete functionality will be implemented soon",
    });
  };

  if (isLoading) {
    return <GuideListSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium">Failed to load guides</h3>
          <p className="text-muted-foreground mt-2">
            Please try again later or contact support if the problem persists.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const guides = data?.guides || [];
  const total = data?.total || 0;

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead className="w-[200px]">Location</TableHead>
            <TableHead className="w-[100px]">Rating</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[200px]">Experience</TableHead>
            <TableHead className="w-[200px]">Languages</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guides && guides.length > 0 ? (
            guides.map((guide) => (
              <TableRow key={guide.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={guide.photo || `/images/avatars/default.jpg`}
                        alt={guide.name}
                      />
                      <AvatarFallback>
                        {guide.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{guide.name}</span>
                  </div>
                </TableCell>
                <TableCell>{formatLocation(guide.location)}</TableCell>
                <TableCell>{guide.rating.toFixed(1)}/5.0</TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeProps(guide.availability).variant}
                  >
                    {getStatusBadgeProps(guide.availability).label}
                  </Badge>
                </TableCell>
                <TableCell>{formatExperience(guide.experience)}</TableCell>
                <TableCell>
                  {guide.languages.slice(0, 2).join(", ")}
                  {guide.languages.length > 2 &&
                    ` +${guide.languages.length - 2} more`}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleView(guide.id || "")}
                      >
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(guide.id || "")}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(guide.id || "")}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No guides found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function GuideListSkeleton() {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead className="w-[200px]">Location</TableHead>
            <TableHead className="w-[100px]">Rating</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[200px]">Experience</TableHead>
            <TableHead className="w-[200px]">Languages</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[120px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[40px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[80px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[140px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[140px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
