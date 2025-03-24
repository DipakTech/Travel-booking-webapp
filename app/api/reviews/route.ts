import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Define validation schema
const reviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  rating: z.number().int().min(1).max(5),
  photos: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  authorId: z.string(),
  destinationId: z.string().optional(),
  guideId: z.string().optional(),
  tripStartDate: z.date().optional(),
  tripEndDate: z.date().optional(),
  tripDuration: z.number().int().optional(),
  tripType: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    // Get URL and parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const status = searchParams.get("status");
    const entityId = searchParams.get("entityId");
    const authorId = searchParams.get("authorId");
    const featured = searchParams.get("featured") === "true";
    const verified = searchParams.get("verified") === "true";

    // Build the where clause for prisma query
    const where: any = {};

    // Filter by type
    if (type !== "all") {
      if (type === "guides") {
        where.guideId = { not: null };
      } else if (type === "destinations") {
        where.destinationId = { not: null };
      } else if (type === "flagged") {
        // For flagged reviews, we could check a specific field or criteria
        // This is an example assuming we might track this with tags
        where.tags = { has: "flagged" };
      }
    }

    // Filter by entityId if provided
    if (entityId) {
      if (
        type === "guides" ||
        (entityId && searchParams.get("isGuide") === "true")
      ) {
        where.guideId = entityId;
      } else {
        where.destinationId = entityId;
      }
    }

    // Filter by authorId if provided
    if (authorId) {
      where.authorId = authorId;
    }

    // Filter by featured status if specified
    if (featured) {
      where.featured = true;
    }

    // Filter by verification status if specified
    if (verified) {
      where.verified = true;
    }

    // Fetch reviews from database
    const reviews = await prisma.review.findMany({
      where,
      include: {
        author: true,
        destination: true,
        guide: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Map to the format expected by the frontend
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      type: review.guideId ? "guide" : "destination",
      entityId: review.guideId || review.destinationId || "",
      entityName: review.guideId
        ? review.guide?.name || "Unknown Guide"
        : review.destination?.name || "Unknown Destination",
      userName: review.author.name,
      userAvatar: review.author.avatar || "/avatars/default.png",
      rating: review.rating,
      comment: review.content,
      title: review.title,
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
    }));

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received review data:", JSON.stringify(body, null, 2));

    // Validate the request data
    try {
      const validatedData = reviewSchema.parse(body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.log("Validation error:", validationError.format());
        return NextResponse.json(
          { error: "Validation error", details: validationError.format() },
          { status: 400 },
        );
      }
    }

    // Ensure at least one of destinationId or guideId is provided
    if (!body.destinationId && !body.guideId) {
      console.log("Missing both destinationId and guideId");
      return NextResponse.json(
        { error: "Either destinationId or guideId must be provided" },
        { status: 400 },
      );
    }

    // Create a new review in the database
    const newReview = await prisma.review.create({
      data: {
        title: body.title,
        content: body.content,
        rating: body.rating,
        date: new Date(),
        photos: body.photos || [],
        highlights: body.highlights || [],
        tags: body.tags || [],
        authorId: body.authorId,
        destinationId: body.destinationId || null,
        guideId: body.guideId || null,
        tripStartDate: body.tripStartDate ? new Date(body.tripStartDate) : null,
        tripEndDate: body.tripEndDate ? new Date(body.tripEndDate) : null,
        tripDuration: body.tripDuration || null,
        tripType: body.tripType || null,
      },
      include: {
        author: true,
        destination: true,
        guide: true,
      },
    });

    // Update destination rating if review is for a destination
    if (newReview.destinationId) {
      await updateDestinationRating(newReview.destinationId);
    }

    // Update guide rating if review is for a guide
    if (newReview.guideId) {
      await updateGuideRating(newReview.guideId);
    }

    return NextResponse.json({
      review: newReview,
      success: true,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: body.id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Update the review
    const updateData: any = {};

    // Handle status updates
    if (body.action) {
      switch (body.action) {
        case "approve":
          updateData.verified = true;
          updateData.tags = existingReview.tags.filter(
            (tag) => tag !== "flagged",
          );
          break;
        case "reject":
          // Depending on requirements, you might want to delete or mark as rejected
          const result = await prisma.review.delete({
            where: { id: body.id },
          });
          return NextResponse.json({ success: true, deletedReview: result });
        case "flag":
          updateData.verified = false;
          if (!existingReview.tags.includes("flagged")) {
            updateData.tags = [...existingReview.tags, "flagged"];
          }
          break;
        case "feature":
          updateData.featured = true;
          break;
        case "unfeature":
          updateData.featured = false;
          break;
      }
    }

    // Handle response updates
    if (body.response) {
      updateData.responseContent = body.response;
      updateData.responseDate = new Date();
      updateData.responderName =
        body.responderName || session.user?.name || "Admin";
      updateData.responderRole = body.responderRole || "Admin";
      updateData.responderId = body.responderId || session.user?.id;
    }

    // Handle vote updates
    if (body.voteAction) {
      if (body.voteAction === "helpful") {
        updateData.helpfulCount = existingReview.helpfulCount + 1;
      } else if (body.voteAction === "unhelpful") {
        updateData.unhelpfulCount = existingReview.unhelpfulCount + 1;
      }
    }

    // Handle content updates
    if (body.title) updateData.title = body.title;
    if (body.content) updateData.content = body.content;
    if (body.rating) updateData.rating = body.rating;
    if (body.photos) updateData.photos = body.photos;
    if (body.highlights) updateData.highlights = body.highlights;
    if (body.tags) updateData.tags = body.tags;

    // Update review in database
    const updatedReview = await prisma.review.update({
      where: { id: body.id },
      data: updateData,
    });

    // If rating was updated, update entity ratings
    if (body.rating) {
      if (updatedReview.destinationId) {
        await updateDestinationRating(updatedReview.destinationId);
      }
      if (updatedReview.guideId) {
        await updateGuideRating(updatedReview.guideId);
      }
    }

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
    }

    // Get review before deletion to update entity ratings
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id },
    });

    // Update entity ratings
    if (review.destinationId) {
      await updateDestinationRating(review.destinationId);
    }
    if (review.guideId) {
      await updateGuideRating(review.guideId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}

// Helper function to update destination rating
async function updateDestinationRating(destinationId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      destinationId,
      verified: true,
    },
  });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await prisma.destination.update({
      where: { id: destinationId },
      data: {
        rating: averageRating,
        reviewCount: reviews.length,
      },
    });
  } else {
    // If no verified reviews, reset ratings
    await prisma.destination.update({
      where: { id: destinationId },
      data: {
        rating: 0,
        reviewCount: 0,
      },
    });
  }
}

// Helper function to update guide rating
async function updateGuideRating(guideId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      guideId,
      verified: true,
    },
  });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await prisma.guide.update({
      where: { id: guideId },
      data: {
        rating: averageRating,
        reviewCount: reviews.length,
      },
    });
  } else {
    // If no verified reviews, reset ratings
    await prisma.guide.update({
      where: { id: guideId },
      data: {
        rating: 0,
        reviewCount: 0,
      },
    });
  }
}
