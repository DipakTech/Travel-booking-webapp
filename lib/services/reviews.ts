import { prisma } from "@/lib/prisma";
import { Review, reviewSchema } from "@/lib/schema";
import { z } from "zod";

export async function getReviews(options?: {
  destinationId?: string;
  guideId?: string;
  userId?: string;
  minRating?: number;
  limit?: number;
  offset?: number;
  sortBy?: "date" | "rating";
  sortOrder?: "asc" | "desc";
}) {
  const where: any = {};

  if (options?.destinationId) {
    where.destinationId = options.destinationId;
  }

  if (options?.guideId) {
    where.guideId = options.guideId;
  }

  if (options?.userId) {
    where.authorId = options.userId;
  }

  if (options?.minRating) {
    where.rating = {
      gte: options.minRating,
    };
  }

  const sortField = options?.sortBy || "date";
  const sortOrder = options?.sortOrder || "desc";

  const reviews = await prisma.review.findMany({
    where,
    include: {
      destination: true,
      guide: true,
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    take: options?.limit || undefined,
    skip: options?.offset || undefined,
    orderBy: {
      [sortField]: sortOrder,
    },
  });

  const total = await prisma.review.count({ where });

  return { reviews, total };
}

export async function getReviewById(id: string) {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      destination: true,
      guide: true,
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
          nationality: true,
        },
      },
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
}

export async function createReview(data: z.infer<typeof reviewSchema>) {
  // Validate data with Zod schema
  reviewSchema.parse(data);

  // Create DB-compatible data from the schema
  const dbData = {
    title: data.title,
    content: data.content,
    rating: data.rating,
    date: data.date || new Date(),
    authorId: data.author.id,
    destinationId: data.destination?.id,
    guideId: data.guide?.id,
    tripStartDate: data.trip?.startDate,
    tripEndDate: data.trip?.endDate,
    tripDuration: data.trip?.duration,
    tripType: data.trip?.type,
    photos: data.photos || [],
    highlights: data.highlights || [],
    tags: data.tags || [],
    featured: data.featured || false,
    verified: data.verified || false,
    helpfulCount: data.helpfulCount || 0,
    unhelpfulCount: data.unhelpfulCount || 0,
  };

  // Check if user has already reviewed this destination/guide
  if (dbData.destinationId) {
    const existingReview = await prisma.review.findFirst({
      where: {
        authorId: dbData.authorId,
        destinationId: dbData.destinationId,
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this destination");
    }
  }

  if (dbData.guideId) {
    const existingReview = await prisma.review.findFirst({
      where: {
        authorId: dbData.authorId,
        guideId: dbData.guideId,
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this guide");
    }
  }

  // Begin transaction
  return prisma.$transaction(async (tx) => {
    // Create review
    const review = await tx.review.create({
      data: dbData,
    });

    // Update destination rating if applicable
    if (dbData.destinationId) {
      await updateDestinationRating(tx, dbData.destinationId);
    }

    // Update guide rating if applicable
    if (dbData.guideId) {
      await updateGuideRating(tx, dbData.guideId);
    }

    return review;
  });
}

export async function updateReview(
  id: string,
  data: Partial<z.infer<typeof reviewSchema>>,
) {
  // Find the review
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  // Prepare update data
  const updateData: any = {};

  if (data.title) updateData.title = data.title;
  if (data.content) updateData.content = data.content;
  if (data.rating) updateData.rating = data.rating;
  if (data.photos) updateData.photos = data.photos;
  if (data.highlights) updateData.highlights = data.highlights;
  if (data.tags) updateData.tags = data.tags;
  if (data.trip?.startDate) updateData.tripStartDate = data.trip.startDate;
  if (data.trip?.endDate) updateData.tripEndDate = data.trip.endDate;
  if (data.trip?.duration) updateData.tripDuration = data.trip.duration;
  if (data.trip?.type) updateData.tripType = data.trip.type;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.verified !== undefined) updateData.verified = data.verified;

  // Only allow author update if the user is the author
  if (data.author?.id && review.authorId !== data.author.id) {
    throw new Error("You can only update your own reviews");
  }

  // Begin transaction
  return prisma.$transaction(async (tx) => {
    // Update review
    const updatedReview = await tx.review.update({
      where: { id },
      data: updateData,
    });

    // Update destination rating if applicable
    if (review.destinationId) {
      await updateDestinationRating(tx, review.destinationId);
    }

    // Update guide rating if applicable
    if (review.guideId) {
      await updateGuideRating(tx, review.guideId);
    }

    return updatedReview;
  });
}

export async function deleteReview(id: string, userId: string) {
  // Find the review
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.authorId !== userId) {
    throw new Error("You can only delete your own reviews");
  }

  // Begin transaction to delete review and update ratings
  return prisma.$transaction(async (tx) => {
    try {
      // Check if ReviewHelpful table exists and delete records if it does
      await tx.$executeRaw`
        DELETE FROM "ReviewHelpful"
        WHERE "reviewId" = ${id}
      `;
    } catch (error) {
      // Silently continue if table doesn't exist or other error
      console.log("No ReviewHelpful table or other error:", error);
    }

    try {
      // Check if ReviewReport table exists and delete records if it does
      await tx.$executeRaw`
        DELETE FROM "ReviewReport"
        WHERE "reviewId" = ${id}
      `;
    } catch (error) {
      // Silently continue if table doesn't exist or other error
      console.log("No ReviewReport table or other error:", error);
    }

    // Delete review
    await tx.review.delete({
      where: { id },
    });

    // Update destination rating if applicable
    if (review.destinationId) {
      await updateDestinationRating(tx, review.destinationId);
    }

    // Update guide rating if applicable
    if (review.guideId) {
      await updateGuideRating(tx, review.guideId);
    }

    return { success: true };
  });
}

// Helper function to update destination rating
async function updateDestinationRating(tx: any, destinationId: string) {
  // Get all reviews for this destination
  const reviews = await tx.review.findMany({
    where: { destinationId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    // No reviews, reset rating to 0
    await tx.destination.update({
      where: { id: destinationId },
      data: {
        rating: 0,
        reviewCount: 0,
      },
    });
    return;
  }

  // Calculate average rating
  const totalRating = reviews.reduce(
    (sum: number, review: any) => sum + review.rating,
    0,
  );
  const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

  // Update destination with new rating and review count
  await tx.destination.update({
    where: { id: destinationId },
    data: {
      rating: averageRating,
      reviewCount: reviews.length,
    },
  });
}

// Helper function to update guide rating
async function updateGuideRating(tx: any, guideId: string) {
  // Get all reviews for this guide
  const reviews = await tx.review.findMany({
    where: { guideId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    // No reviews, reset rating to 0
    await tx.guide.update({
      where: { id: guideId },
      data: {
        rating: 0,
        reviewCount: 0,
      },
    });
    return;
  }

  // Calculate average rating
  const totalRating = reviews.reduce(
    (sum: number, review: any) => sum + review.rating,
    0,
  );
  const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

  // Update guide with new rating and review count
  await tx.guide.update({
    where: { id: guideId },
    data: {
      rating: averageRating,
      reviewCount: reviews.length,
    },
  });
}

export async function markReviewHelpful(id: string, userId: string) {
  // Find the review
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  try {
    // Check if user already marked this review as helpful
    // This assumes you have a reviewHelpful junction table
    const helpfulRecord = await prisma.$queryRaw`
      SELECT * FROM "ReviewHelpful" 
      WHERE "reviewId" = ${id} AND "userId" = ${userId}
    `;

    if (Array.isArray(helpfulRecord) && helpfulRecord.length > 0) {
      // User already marked this as helpful, remove their mark
      await prisma.$executeRaw`
        DELETE FROM "ReviewHelpful"
        WHERE "reviewId" = ${id} AND "userId" = ${userId}
      `;

      // Decrement helpful count
      await prisma.review.update({
        where: { id },
        data: {
          helpfulCount: {
            decrement: 1,
          },
        },
      });

      return { helpful: false };
    } else {
      // User hasn't marked this as helpful yet, add their mark
      await prisma.$executeRaw`
        INSERT INTO "ReviewHelpful" ("reviewId", "userId")
        VALUES (${id}, ${userId})
      `;

      // Increment helpful count
      await prisma.review.update({
        where: { id },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      });

      return { helpful: true };
    }
  } catch (error) {
    // If there's an error (like table doesn't exist), handle gracefully
    console.error("Error managing helpful status:", error);
    return { error: "Could not update helpful status" };
  }
}

export async function reportReview(id: string, userId: string, reason: string) {
  // Find the review
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  try {
    // Check if user already reported this review
    const reportRecord = await prisma.$queryRaw`
      SELECT * FROM "ReviewReport" 
      WHERE "reviewId" = ${id} AND "userId" = ${userId}
    `;

    if (Array.isArray(reportRecord) && reportRecord.length > 0) {
      throw new Error("You have already reported this review");
    }

    // Create report record
    await prisma.$executeRaw`
      INSERT INTO "ReviewReport" ("reviewId", "userId", "reason")
      VALUES (${id}, ${userId}, ${reason})
    `;

    // Increment report count if the field exists
    try {
      await prisma.$executeRaw`
        UPDATE "Review"
        SET "reportCount" = "reportCount" + 1
        WHERE "id" = ${id}
      `;
    } catch (error) {
      // Field might not exist, continue anyway
      console.warn("Could not update reportCount");
    }

    return { success: true };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "You have already reported this review"
    ) {
      throw error;
    }
    // If there's an error (like table doesn't exist), handle gracefully
    console.error("Error reporting review:", error);
    return { error: "Could not report review" };
  }
}
