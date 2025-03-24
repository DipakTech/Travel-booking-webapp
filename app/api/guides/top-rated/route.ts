import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 5;

    // Fetch top rated guides from the database
    const guides = await prisma.guide.findMany({
      where: {
        rating: { gte: 4.0 }, // Only guides with at least a 4.0 rating
      },
      orderBy: {
        rating: "desc",
      },
      take: limit,
    });

    return NextResponse.json(guides);
  } catch (error) {
    console.error("Error fetching top rated guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch top rated guides" },
      { status: 500 },
    );
  }
}
