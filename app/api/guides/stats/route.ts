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

    // Calculate statistics from sample guides data
    const totalGuides = sampleGuides.length;

    const activeGuides = sampleGuides.filter(
      (guide) => guide.availability === "available",
    ).length;

    const onLeaveGuides = sampleGuides.filter(
      (guide) => guide.availability === "partially_available",
    ).length;

    const inactiveGuides = sampleGuides.filter(
      (guide) => guide.availability === "unavailable",
    ).length;

    // Calculate average rating
    const totalRating = sampleGuides.reduce(
      (sum, guide) => sum + guide.rating,
      0,
    );
    const averageRating = totalRating / totalGuides;

    // Count total reviews
    const totalReviews = sampleGuides.reduce(
      (sum, guide) => sum + guide.reviewCount,
      0,
    );

    // Get guides by experience level
    const beginnerGuides = sampleGuides.filter(
      (guide) => guide.experience.level === "beginner",
    ).length;

    const intermediateGuides = sampleGuides.filter(
      (guide) => guide.experience.level === "intermediate",
    ).length;

    const expertGuides = sampleGuides.filter(
      (guide) => guide.experience.level === "expert",
    ).length;

    const masterGuides = sampleGuides.filter(
      (guide) => guide.experience.level === "master",
    ).length;

    // Get active tours this month (mock data)
    const toursThisMonth = 36;
    const changeFromLastMonth = 12; // Percentage increase

    return NextResponse.json({
      totalGuides,
      activeGuides,
      onLeaveGuides,
      inactiveGuides,
      averageRating,
      totalReviews,
      experienceLevels: {
        beginner: beginnerGuides,
        intermediate: intermediateGuides,
        expert: expertGuides,
        master: masterGuides,
      },
      toursThisMonth,
      changeFromLastMonth,
    });
  } catch (error) {
    console.error("Error fetching guide statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch guide statistics" },
      { status: 500 },
    );
  }
}
