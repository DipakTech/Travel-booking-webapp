import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sampleGuides, guideSchema } from "@/lib/schema/guide";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Find the guide with the matching ID
    const guide = sampleGuides.find((guide) => guide.id === id);

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    return NextResponse.json(guide);
  } catch (error) {
    console.error("Error fetching guide:", error);
    return NextResponse.json(
      { error: "Failed to fetch guide" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Find the guide with the matching ID
    const guideIndex = sampleGuides.findIndex((guide) => guide.id === id);

    if (guideIndex === -1) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // Parse and validate the request body
    const body = await req.json();

    // Allow partial updates by merging with existing data
    const currentGuide = sampleGuides[guideIndex];
    const partialSchema = guideSchema.partial();
    const validatedData = partialSchema.parse(body);

    // In a real application, this would update the guide in the database
    // For now, we'll just simulate a successful update
    const updatedGuide = {
      ...currentGuide,
      ...validatedData,
      updatedAt: new Date(),
    };

    // Update the guide in the sample data (for demo purposes)
    // In a real app, this would be a database update
    sampleGuides[guideIndex] = updatedGuide;

    return NextResponse.json(updatedGuide);
  } catch (error) {
    console.error("Error updating guide:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update guide" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Find the guide with the matching ID
    const guideIndex = sampleGuides.findIndex((guide) => guide.id === id);

    if (guideIndex === -1) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // In a real application, this would delete the guide from the database
    // For now, we'll just simulate a successful deletion
    // sampleGuides.splice(guideIndex, 1); // We don't actually delete from our sample data

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting guide:", error);
    return NextResponse.json(
      { error: "Failed to delete guide" },
      { status: 500 },
    );
  }
}
