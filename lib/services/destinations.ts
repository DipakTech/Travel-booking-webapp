import { prisma } from "@/lib/prisma";
import { destinationSchema, Destination } from "@/lib/schema/destination";
import { z } from "zod";

export async function getDestinations(options?: {
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  difficulty?: string;
  country?: string;
  activities?: string[];
  seasons?: string[];
  rating?: number;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};

  if (options?.featured !== undefined) {
    where.featured = options.featured;
  }

  if (options?.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { description: { contains: options.search, mode: "insensitive" } },
      { country: { contains: options.search, mode: "insensitive" } },
      { region: { contains: options.search, mode: "insensitive" } },
    ];
  }

  if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
    where.priceAmount = {};
    if (options?.minPrice !== undefined) {
      where.priceAmount.gte = options.minPrice;
    }
    if (options?.maxPrice !== undefined) {
      where.priceAmount.lte = options.maxPrice;
    }
  }

  if (options?.difficulty) {
    where.difficulty = options.difficulty;
  }

  if (options?.country) {
    where.country = options.country;
  }

  if (options?.activities && options.activities.length > 0) {
    where.activities = {
      hasSome: options.activities,
    };
  }

  if (options?.seasons && options.seasons.length > 0) {
    where.seasons = {
      hasSome: options.seasons,
    };
  }

  if (options?.rating) {
    where.rating = {
      gte: options.rating,
    };
  }

  const destinations = await prisma.destination.findMany({
    where,
    include: {
      availableGuides: {
        include: {
          guide: {
            select: {
              id: true,
              name: true,
              photo: true,
              languages: true,
              rating: true,
            },
          },
        },
        take: 3,
      },
      reviews: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        take: 3,
        orderBy: {
          date: "desc",
        },
      },
    },
    take: options?.limit || undefined,
    skip: options?.offset || undefined,
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
  });

  const total = await prisma.destination.count({ where });

  return { destinations, total };
}

export async function getDestinationById(id: string) {
  const destination = await prisma.destination.findUnique({
    where: { id },
    include: {
      availableGuides: {
        include: {
          guide: true,
        },
      },
      reviews: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              nationality: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!destination) {
    throw new Error("Destination not found");
  }

  return destination;
}

export async function createDestination(
  data: z.infer<typeof destinationSchema>,
) {
  // Validate data with Zod schema
  destinationSchema.parse(data);

  // Begin transaction
  return prisma.$transaction(async (tx) => {
    // Create destination with main data
    const destination = await tx.destination.create({
      data: {
        name: data.name,
        description: data.description,
        country: data.location.country,
        region: data.location.region,
        latitude: data.location.coordinates?.latitude || 0,
        longitude: data.location.coordinates?.longitude || 0,
        priceAmount: data.price.amount,
        priceCurrency: data.price.currency,
        pricePeriod: data.price.period || "person",
        minDays: data.duration.minDays,
        maxDays: data.duration.maxDays || data.duration.minDays,
        difficulty: data.difficulty,
        activities: data.activities || [],
        seasons: data.seasons || [],
        amenities: data.amenities || [],
        images: data.images || [],
        featured: data.featured || false,
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
      },
    });

    // Connect guides if provided
    if (data.availableGuides && data.availableGuides.length > 0) {
      await Promise.all(
        data.availableGuides.map((guideId) =>
          tx.guideDestination.create({
            data: {
              guideId,
              destinationId: destination.id,
            },
          }),
        ),
      );
    }

    return destination;
  });
}

export async function updateDestination(
  id: string,
  data: Partial<z.infer<typeof destinationSchema>>,
) {
  // First check if destination exists
  const destination = await prisma.destination.findUnique({
    where: { id },
  });

  if (!destination) {
    throw new Error("Destination not found");
  }

  // Prepare update data
  const updateData: any = {};

  if (data.name) updateData.name = data.name;
  if (data.description) updateData.description = data.description;
  if (data.location) {
    if (data.location.country) updateData.country = data.location.country;
    if (data.location.region) updateData.region = data.location.region;
    if (data.location.coordinates) {
      if (data.location.coordinates.latitude !== undefined)
        updateData.latitude = data.location.coordinates.latitude;
      if (data.location.coordinates.longitude !== undefined)
        updateData.longitude = data.location.coordinates.longitude;
    }
  }
  if (data.price) {
    if (data.price.amount !== undefined)
      updateData.priceAmount = data.price.amount;
    if (data.price.currency) updateData.priceCurrency = data.price.currency;
    if (data.price.period) updateData.pricePeriod = data.price.period;
  }
  if (data.duration) {
    if (data.duration.minDays !== undefined)
      updateData.minDays = data.duration.minDays;
    if (data.duration.maxDays !== undefined)
      updateData.maxDays = data.duration.maxDays;
  }
  if (data.difficulty) updateData.difficulty = data.difficulty;
  if (data.activities) updateData.activities = data.activities;
  if (data.seasons) updateData.seasons = data.seasons;
  if (data.amenities) updateData.amenities = data.amenities;
  if (data.images) updateData.images = data.images;
  if (data.featured !== undefined) updateData.featured = data.featured;

  // Begin transaction
  return prisma.$transaction(async (tx) => {
    // Update destination main data
    const updatedDestination = await tx.destination.update({
      where: { id },
      data: updateData,
    });

    // Update guide connections if provided
    if (data.availableGuides) {
      // Delete existing connections
      await tx.guideDestination.deleteMany({
        where: { destinationId: id },
      });

      // Create new connections
      if (data.availableGuides.length > 0) {
        await Promise.all(
          data.availableGuides.map((guideId) =>
            tx.guideDestination.create({
              data: {
                guideId,
                destinationId: id,
              },
            }),
          ),
        );
      }
    }

    return updatedDestination;
  });
}

export async function deleteDestination(id: string) {
  // Check if destination exists
  const destination = await prisma.destination.findUnique({
    where: { id },
  });

  if (!destination) {
    throw new Error("Destination not found");
  }

  // Begin transaction to delete destination and all related data
  await prisma.$transaction(async (tx) => {
    // Delete guide connections
    await tx.guideDestination.deleteMany({
      where: { destinationId: id },
    });

    // Delete reviews
    await tx.review.deleteMany({
      where: { destinationId: id },
    });

    // Get bookings for this destination
    const bookings = await tx.booking.findMany({
      where: { destinationId: id },
      select: { id: true },
    });

    // Delete booking activities for each booking
    if (bookings.length > 0) {
      await tx.bookingActivity.deleteMany({
        where: {
          bookingId: {
            in: bookings.map((b) => b.id),
          },
        },
      });

      // Delete transactions for each booking
      await tx.transaction.deleteMany({
        where: {
          bookingId: {
            in: bookings.map((b) => b.id),
          },
        },
      });

      // Delete bookings
      await tx.booking.deleteMany({
        where: { destinationId: id },
      });
    }

    // Delete destination
    await tx.destination.delete({
      where: { id },
    });
  });

  return { success: true };
}

export async function getPopularDestinations(limit = 5) {
  return prisma.destination.findMany({
    where: {
      rating: { gt: 4 },
      reviewCount: { gt: 0 },
    },
    orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
    take: limit,
    include: {
      reviews: {
        take: 1,
        orderBy: { date: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
}

export async function updateDestinationRating(destinationId: string) {
  // Calculate new average rating
  const reviews = await prisma.review.findMany({
    where: { destinationId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  // Update destination with new rating and review count
  await prisma.destination.update({
    where: { id: destinationId },
    data: {
      rating: averageRating,
      reviewCount: reviews.length,
    },
  });
}

export async function getDestinationCountries() {
  const countryGroups = await prisma.destination.groupBy({
    by: ["country"],
    _count: {
      country: true,
    },
  });

  return countryGroups.map((group) => ({
    country: group.country,
    count: group._count.country,
  }));
}

export async function getDestinationStats() {
  const totalDestinations = await prisma.destination.count();

  const featuredCount = await prisma.destination.count({
    where: { featured: true },
  });

  const averageRating = await prisma.destination.aggregate({
    _avg: {
      rating: true,
    },
  });

  const topRated = await prisma.destination.findMany({
    where: {
      rating: { gt: 0 },
    },
    orderBy: {
      rating: "desc",
    },
    take: 5,
    select: {
      id: true,
      name: true,
      country: true,
      rating: true,
      reviewCount: true,
    },
  });

  const mostBooked = await prisma.destination.findMany({
    orderBy: {
      reviewCount: "desc",
    },
    take: 5,
    select: {
      id: true,
      name: true,
      country: true,
      reviewCount: true,
    },
  });

  const difficultyBreakdown = await prisma.destination.groupBy({
    by: ["difficulty"],
    _count: {
      difficulty: true,
    },
  });

  return {
    totalDestinations,
    featuredCount,
    averageRating: averageRating._avg.rating || 0,
    topRated,
    mostBooked,
    difficultyBreakdown: difficultyBreakdown.map((group) => ({
      difficulty: group.difficulty,
      count: group._count.difficulty,
    })),
  };
}
