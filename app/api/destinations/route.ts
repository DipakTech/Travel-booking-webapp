import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { destinationSchema } from "@/lib/schema/destination";
import * as destinationService from "@/lib/services/destinations";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    // Parse query parameters
    const featured = url.searchParams.get("featured") === "true";
    const search = url.searchParams.get("search") || undefined;
    const minPrice = url.searchParams.get("minPrice")
      ? Number(url.searchParams.get("minPrice"))
      : undefined;
    const maxPrice = url.searchParams.get("maxPrice")
      ? Number(url.searchParams.get("maxPrice"))
      : undefined;
    const difficulty = url.searchParams.get("difficulty") || undefined;
    const country = url.searchParams.get("country") || undefined;
    const activities =
      url.searchParams.get("activities")?.split(",") || undefined;
    const seasons = url.searchParams.get("seasons")?.split(",") || undefined;
    const rating = url.searchParams.get("rating")
      ? Number(url.searchParams.get("rating"))
      : undefined;
    const limit = url.searchParams.get("limit")
      ? Number(url.searchParams.get("limit"))
      : 10;
    const offset = url.searchParams.get("offset")
      ? Number(url.searchParams.get("offset"))
      : 0;

    // Get destinations with filters
    const result = await destinationService.getDestinations({
      featured: url.searchParams.has("featured") ? featured : undefined,
      search,
      minPrice,
      maxPrice,
      difficulty,
      country,
      activities,
      seasons,
      rating,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has admin access
    if (
      !session ||
      !session.user ||
      session?.user?.email !== process.env.ADMIN_EMAIL
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can create destinations." },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await req.json();

    try {
      // Validate request data
      destinationSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: validationError.format() },
          { status: 400 },
        );
      }
    }

    // Create destination
    const destination = await destinationService.createDestination(body);

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 },
    );
  }
}
