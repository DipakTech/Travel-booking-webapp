import { prisma } from "@/lib/prisma";
import { Guide, guideSchema } from "@/lib/schema";
import { z } from "zod";
import { Prisma } from "@prisma/client";

type CertificationType = {
  name: string;
  issuedBy: string;
  year: number;
  expiryYear?: number | null;
};

type AvailableDateType = {
  from: Date;
  to: Date;
};

export async function getGuides(options?: {
  search?: string;
  languages?: string[];
  specialties?: string[];
  experienceLevel?: string;
  availability?: string;
  destinationId?: string;
  minRating?: number;
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.GuideWhereInput = {};

  if (options?.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { bio: { contains: options.search, mode: "insensitive" } },
      { specialties: { has: options.search } },
    ];
  }

  if (options?.languages && options.languages.length > 0) {
    where.languages = { hasSome: options.languages };
  }

  if (options?.specialties && options.specialties.length > 0) {
    where.specialties = { hasSome: options.specialties };
  }

  if (options?.experienceLevel) {
    where.experienceLevel = options.experienceLevel;
  }

  if (options?.availability) {
    where.availability = options.availability;
  }

  if (options?.minRating !== undefined) {
    where.rating = { gte: options.minRating };
  }

  // If destination ID is provided, filter guides associated with that destination
  if (options?.destinationId) {
    where.destinations = {
      some: {
        destinationId: options.destinationId,
      },
    };
  }

  const guides = await prisma.guide.findMany({
    where,
    include: {
      destinations: {
        include: {
          destination: {
            select: {
              id: true,
              name: true,
              country: true,
            },
          },
        },
      },
      certifications: true,
    },
    take: options?.limit || undefined,
    skip: options?.offset || undefined,
    orderBy: [{ rating: "desc" }, { experienceYears: "desc" }],
  });

  const total = await prisma.guide.count({ where });

  return { guides, total };
}

export async function getGuideById(id: string) {
  const guide = await prisma.guide.findUnique({
    where: { id },
    include: {
      destinations: {
        include: {
          destination: true,
        },
      },
      certifications: true,
      availableDates: true,
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
        take: 5,
        orderBy: { date: "desc" },
      },
    },
  });

  if (!guide) {
    throw new Error("Guide not found");
  }

  return guide;
}

export async function createGuide(data: z.infer<typeof guideSchema>) {
  // Validate data with Zod schema
  guideSchema.parse(data);

  // Begin transaction
  return prisma.$transaction(async (tx) => {
    // Create guide with main data
    const guide = await tx.guide.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        photo: data.photo,
        country: data.location.country,
        region: data.location.region,
        city: data.location.city,
        languages: data.languages,
        specialties: data.specialties,
        experienceYears: data.experience.years,
        experienceLevel: data.experience.level,
        expeditions: data.experience.expeditions,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        availability: data.availability,
        rating: data.rating,
        reviewCount: data.reviewCount,
        instagram: data.socialMedia?.instagram,
        facebook: data.socialMedia?.facebook,
        twitter: data.socialMedia?.twitter,
        linkedin: data.socialMedia?.linkedin,
      },
    });

    // Add certifications if available
    if (data.certifications && data.certifications.length > 0) {
      await Promise.all(
        data.certifications.map((cert: CertificationType) =>
          tx.certification.create({
            data: {
              name: cert.name,
              issuedBy: cert.issuedBy,
              year: cert.year,
              expiryYear: cert.expiryYear,
              guideId: guide.id,
            },
          }),
        ),
      );
    }

    // Add available dates if provided
    if (data.availableDates && data.availableDates.length > 0) {
      await Promise.all(
        data.availableDates.map((date: AvailableDateType) =>
          tx.availableDate.create({
            data: {
              from: date.from,
              to: date.to,
              guideId: guide.id,
            },
          }),
        ),
      );
    }

    // Add destinations if provided
    if (data.destinations && data.destinations.length > 0) {
      await Promise.all(
        data.destinations.map((destId: string) =>
          tx.guideDestination.create({
            data: {
              guideId: guide.id,
              destinationId: destId,
            },
          }),
        ),
      );
    }

    return guide;
  });
}

export async function updateGuide(
  id: string,
  data: Partial<z.infer<typeof guideSchema>>,
) {
  // First check if guide exists
  const guide = await prisma.guide.findUnique({
    where: { id },
    include: {
      certifications: true,
      availableDates: true,
      destinations: true,
    },
  });

  if (!guide) {
    throw new Error("Guide not found");
  }

  // Prepare update data
  const updateData: any = {};

  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.phone) updateData.phone = data.phone;
  if (data.photo !== undefined) updateData.photo = data.photo;
  if (data.location) {
    if (data.location.country) updateData.country = data.location.country;
    if (data.location.region) updateData.region = data.location.region;
    if (data.location.city !== undefined) updateData.city = data.location.city;
  }
  if (data.languages) updateData.languages = data.languages;
  if (data.specialties) updateData.specialties = data.specialties;
  if (data.experience) {
    if (data.experience.years !== undefined)
      updateData.experienceYears = data.experience.years;
    if (data.experience.level)
      updateData.experienceLevel = data.experience.level;
    if (data.experience.expeditions !== undefined)
      updateData.expeditions = data.experience.expeditions;
  }
  if (data.bio) updateData.bio = data.bio;
  if (data.hourlyRate) updateData.hourlyRate = data.hourlyRate;
  if (data.availability) updateData.availability = data.availability;
  if (data.socialMedia) {
    if (data.socialMedia.instagram !== undefined)
      updateData.instagram = data.socialMedia.instagram;
    if (data.socialMedia.facebook !== undefined)
      updateData.facebook = data.socialMedia.facebook;
    if (data.socialMedia.twitter !== undefined)
      updateData.twitter = data.socialMedia.twitter;
    if (data.socialMedia.linkedin !== undefined)
      updateData.linkedin = data.socialMedia.linkedin;
  }

  // Begin transaction
  return prisma.$transaction(async (tx) => {
    // Update guide main data
    const updatedGuide = await tx.guide.update({
      where: { id },
      data: updateData,
    });

    // Update certifications if provided
    if (data.certifications) {
      // Delete existing certifications
      await tx.certification.deleteMany({
        where: { guideId: id },
      });

      // Create new certifications
      if (data.certifications.length > 0) {
        await Promise.all(
          data.certifications.map((cert: CertificationType) =>
            tx.certification.create({
              data: {
                name: cert.name,
                issuedBy: cert.issuedBy,
                year: cert.year,
                expiryYear: cert.expiryYear,
                guideId: id,
              },
            }),
          ),
        );
      }
    }

    // Update available dates if provided
    if (data.availableDates) {
      // Delete existing dates
      await tx.availableDate.deleteMany({
        where: { guideId: id },
      });

      // Create new dates
      if (data.availableDates.length > 0) {
        await Promise.all(
          data.availableDates.map((date: AvailableDateType) =>
            tx.availableDate.create({
              data: {
                from: date.from,
                to: date.to,
                guideId: id,
              },
            }),
          ),
        );
      }
    }

    // Update destination links if provided
    if (data.destinations) {
      // Delete existing links
      await tx.guideDestination.deleteMany({
        where: { guideId: id },
      });

      // Create new links
      if (data.destinations.length > 0) {
        await Promise.all(
          data.destinations.map((destId: string) =>
            tx.guideDestination.create({
              data: {
                guideId: id,
                destinationId: destId,
              },
            }),
          ),
        );
      }
    }

    return updatedGuide;
  });
}

export async function deleteGuide(id: string) {
  // Check if guide exists
  const guide = await prisma.guide.findUnique({
    where: { id },
  });

  if (!guide) {
    throw new Error("Guide not found");
  }

  // Begin transaction to delete guide and all related data
  await prisma.$transaction(async (tx) => {
    // Delete certifications
    await tx.certification.deleteMany({
      where: { guideId: id },
    });

    // Delete available dates
    await tx.availableDate.deleteMany({
      where: { guideId: id },
    });

    // Delete destination connections
    await tx.guideDestination.deleteMany({
      where: { guideId: id },
    });

    // Delete guide
    await tx.guide.delete({
      where: { id },
    });
  });

  return { success: true };
}

export async function getTopGuides(limit = 4) {
  return prisma.guide.findMany({
    where: {
      rating: { gte: 4 },
      availability: { not: "unavailable" },
    },
    orderBy: [{ rating: "desc" }, { experienceYears: "desc" }],
    take: limit,
    include: {
      destinations: {
        include: {
          destination: {
            select: {
              id: true,
              name: true,
              country: true,
            },
          },
        },
      },
    },
  });
}

export async function updateGuideRating(guideId: string) {
  // Calculate new average rating
  const reviews = await prisma.review.findMany({
    where: { guideId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  // Update guide with new rating and review count
  await prisma.guide.update({
    where: { id: guideId },
    data: {
      rating: averageRating,
      reviewCount: reviews.length,
    },
  });
}
