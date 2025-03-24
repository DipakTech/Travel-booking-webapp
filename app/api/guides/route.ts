import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { guideSchema } from "@/lib/schema/guide";
import { z } from "zod";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const location = searchParams.get("location");
    const language = searchParams.get("language");
    const specialty = searchParams.get("specialty");
    const minRatingStr = searchParams.get("minRating");
    const minRating = minRatingStr ? parseFloat(minRatingStr) : undefined;

    // Get query parameters for pagination
    const limitStr = searchParams.get("limit");
    const offsetStr = searchParams.get("offset");
    const limit = limitStr ? parseInt(limitStr) : 10;
    const offset = offsetStr ? parseInt(offsetStr) : 0;

    // Build the filter object for Prisma
    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
        { region: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      const availabilityMap = {
        active: "available",
        on_leave: "partially_available",
        inactive: "unavailable",
      } as const;

      whereClause.availability =
        availabilityMap[status as keyof typeof availabilityMap];
    }

    if (location) {
      whereClause.OR = [
        ...(whereClause.OR || []),
        { country: { contains: location, mode: "insensitive" } },
        { region: { contains: location, mode: "insensitive" } },
        { city: { contains: location, mode: "insensitive" } },
      ];
    }

    if (language) {
      whereClause.languages = {
        has: language,
      };
    }

    if (specialty) {
      whereClause.specialties = {
        has: specialty,
      };
    }

    if (minRating !== undefined) {
      whereClause.rating = {
        gte: minRating,
      };
    }

    // Count total guides matching the filter
    const total = await prisma.guide.count({
      where: whereClause,
    });

    // Fetch guides with pagination
    const guides = await prisma.guide.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: { name: "asc" },
    });

    // Format the response
    const formattedGuides = guides.map((guide) => ({
      id: guide.id,
      name: guide.name,
      location: `${guide.region}, ${guide.country}`,
      rating: guide.rating,
      status:
        guide.availability === "available"
          ? "active"
          : guide.availability === "partially_available"
          ? "on_leave"
          : "inactive",
      experience: `${guide.experienceYears} years`,
      languages: guide.languages,
      photo: guide.photo,
    }));

    return NextResponse.json({ guides: formattedGuides, total });
  } catch (error) {
    console.error("Error fetching guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch guides" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = guideSchema.parse(body);

    // Create a new guide in the database
    const newGuide = await prisma.guide.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        photo: validatedData.photo,
        country: validatedData.location.country,
        region: validatedData.location.region,
        city: validatedData.location.city,
        languages: validatedData.languages,
        specialties: validatedData.specialties,
        experienceYears: validatedData.experience.years,
        experienceLevel: validatedData.experience.level,
        expeditions: validatedData.experience.expeditions,
        bio: validatedData.bio,
        hourlyRate: validatedData.hourlyRate,
        availability: validatedData.availability,
        rating: validatedData.rating || 0,
        reviewCount: validatedData.reviewCount || 0,
        instagram: validatedData.socialMedia?.instagram,
        facebook: validatedData.socialMedia?.facebook,
        twitter: validatedData.socialMedia?.twitter,
        linkedin: validatedData.socialMedia?.linkedin,
        // Create certifications if provided
        certifications: validatedData.certifications
          ? {
              create: validatedData.certifications.map((cert) => ({
                name: cert.name,
                issuedBy: cert.issuedBy,
                year: cert.year,
                expiryYear: cert.expiryYear,
              })),
            }
          : undefined,
        // Create available dates if provided
        availableDates: validatedData.availableDates
          ? {
              create: validatedData.availableDates.map((date) => ({
                from: date.from,
                to: date.to,
              })),
            }
          : undefined,
      },
    });

    return NextResponse.json(newGuide, { status: 201 });
  } catch (error) {
    console.error("Error creating guide:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create guide" },
      { status: 500 },
    );
  }
}
