import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all guides
    const guides = await prisma.guide.findMany({
      select: {
        specialties: true,
      },
    });

    // Extract all specialties and remove duplicates
    const allSpecialties = guides.flatMap((guide) => guide.specialties);
    const uniqueSpecialties = Array.from(new Set(allSpecialties)).sort();

    return NextResponse.json(uniqueSpecialties);
  } catch (error) {
    console.error("Error fetching guide specialties:", error);
    return NextResponse.json(
      { error: "Failed to fetch guide specialties" },
      { status: 500 },
    );
  }
}
