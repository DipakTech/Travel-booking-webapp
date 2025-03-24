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
        languages: true,
      },
    });

    // Extract all languages and remove duplicates
    const allLanguages = guides.flatMap((guide) => guide.languages);
    const uniqueLanguages = Array.from(new Set(allLanguages)).sort();

    return NextResponse.json(uniqueLanguages);
  } catch (error) {
    console.error("Error fetching guide languages:", error);
    return NextResponse.json(
      { error: "Failed to fetch guide languages" },
      { status: 500 },
    );
  }
}
