import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sampleGuides } from "@/lib/schema/guide";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse limit from query parameters or default to 5
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    // Sort guides by rating in descending order
    const topRatedGuides = [...sampleGuides]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map((guide) => ({
        id: guide.id,
        name: guide.name,
        photo: guide.photo || "/images/avatars/default.jpg", // Use the photo field from the guide schema
        location: guide.location,
        languages: guide.languages,
        specialties: guide.specialties.slice(0, 2), // Show only top 2 specialties
        rating: guide.rating,
        reviewCount: guide.reviewCount,
        hourlyRate: guide.hourlyRate,
        availability: guide.availability,
      }));

    return NextResponse.json(topRatedGuides);
  } catch (error) {
    console.error("Error fetching top-rated guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch top-rated guides" },
      { status: 500 },
    );
  }
}
