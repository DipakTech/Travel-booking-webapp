import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Fetch the review from the database
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        author: true,
        destination: true,
        guide: true,
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Format the response to match the expected frontend format
    const formattedReview = {
      id: review.id,
      type: review.guideId ? "guide" : "destination",
      entityId: review.guideId || review.destinationId || "",
      entityName: review.guideId
        ? review.guide?.name || "Unknown Guide"
        : review.destination?.name || "Unknown Destination",
      userName: review.author.name,
      userAvatar: review.author.avatar || "/avatars/default.png",
      rating: review.rating,
      title: review.title,
      comment: review.content,
      date: review.date.toISOString(),
      status: review.verified
        ? "approved"
        : review.tags?.includes("flagged")
        ? "flagged"
        : "pending",
      response: review.responseContent,
      photos: review.photos || [],
      highlights: review.highlights || [],
      tags: review.tags || [],
      featured: review.featured,
      helpfulCount: review.helpfulCount,
      unhelpfulCount: review.unhelpfulCount,
      tripDetails: review.tripStartDate
        ? {
            startDate: review.tripStartDate,
            endDate: review.tripEndDate,
            duration: review.tripDuration,
            type: review.tripType,
          }
        : null,
      responseDetails: review.responseContent
        ? {
            content: review.responseContent,
            date: review.responseDate,
            responderName: review.responderName,
            responderRole: review.responderRole,
            responderId: review.responderId,
          }
        : null,
    };

    return NextResponse.json(formattedReview);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 },
    );
  }
}
