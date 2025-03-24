import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sampleGuides, guideSchema } from "@/lib/schema/guide";
import { z } from "zod";

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

    // Filter guides based on the query parameters
    let filteredGuides = [...sampleGuides];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredGuides = filteredGuides.filter(
        (guide) =>
          guide.name.toLowerCase().includes(searchLower) ||
          guide.location.country.toLowerCase().includes(searchLower) ||
          guide.location.region.toLowerCase().includes(searchLower) ||
          guide.bio.toLowerCase().includes(searchLower),
      );
    }

    if (status) {
      const availabilityMap = {
        active: "available",
        on_leave: "partially_available",
        inactive: "unavailable",
      } as const;

      filteredGuides = filteredGuides.filter(
        (guide) =>
          guide.availability ===
          availabilityMap[status as keyof typeof availabilityMap],
      );
    }

    if (location) {
      const locationLower = location.toLowerCase();
      filteredGuides = filteredGuides.filter(
        (guide) =>
          guide.location.country.toLowerCase().includes(locationLower) ||
          guide.location.region.toLowerCase().includes(locationLower) ||
          (guide.location.city &&
            guide.location.city.toLowerCase().includes(locationLower)),
      );
    }

    if (language) {
      const languageLower = language.toLowerCase();
      filteredGuides = filteredGuides.filter((guide) =>
        guide.languages.some((lang) =>
          lang.toLowerCase().includes(languageLower),
        ),
      );
    }

    if (specialty) {
      const specialtyLower = specialty.toLowerCase();
      filteredGuides = filteredGuides.filter((guide) =>
        guide.specialties.some((spec) =>
          spec.toLowerCase().includes(specialtyLower),
        ),
      );
    }

    if (minRating !== undefined) {
      filteredGuides = filteredGuides.filter(
        (guide) => guide.rating >= minRating,
      );
    }

    // Calculate total count before pagination
    const total = filteredGuides.length;

    // Apply pagination
    const paginatedGuides = filteredGuides.slice(offset, offset + limit);

    // Format the response
    const guides = paginatedGuides.map((guide) => ({
      id: guide.id,
      name: guide.name,
      location: `${guide.location.region}, ${guide.location.country}`,
      rating: guide.rating,
      status:
        guide.availability === "available"
          ? "active"
          : guide.availability === "partially_available"
          ? "on_leave"
          : "inactive",
      experience: `${guide.experience.years} years`,
      languages: guide.languages,
      profileImage: guide.photo,
    }));

    return NextResponse.json({ guides, total });
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

    // In a real application, this would create a new guide in the database
    // For now, we'll just simulate a successful creation by returning the data with an ID
    const newGuide = {
      ...validatedData,
      id: `guide${sampleGuides.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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
