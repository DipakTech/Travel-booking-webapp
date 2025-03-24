import { NextRequest, NextResponse } from "next/server";
import * as destinationService from "@/lib/services/destinations";

// Force this route to be dynamically rendered at runtime
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    // Parse query parameters
    const limit = url.searchParams.get("limit")
      ? Number(url.searchParams.get("limit"))
      : 5;

    // Get top rated destinations limited by the limit parameter
    const destinations = await destinationService.getPopularDestinations(limit);

    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Error fetching popular destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular destinations" },
      { status: 500 },
    );
  }
}
