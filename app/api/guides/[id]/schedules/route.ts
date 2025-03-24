import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { prisma } from "@/lib/db";

// Schema for schedule validation
const scheduleSchema = z.object({
  destination: z.string().min(2),
  location: z.string().min(2),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  description: z.string().min(10),
  maxParticipants: z.number().min(1),
  price: z.number().min(0),
  status: z.enum(["confirmed", "pending", "completed", "cancelled"]),
  difficulty: z.enum(["easy", "moderate", "challenging"]),
  itinerary: z.string().min(10),
});

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

    // Get query parameters for filtering
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    // Build the query
    const query: any = {
      where: {
        guideId: id,
      },
    };

    // Add status filter if provided
    if (status) {
      query.where.status = status;
    }

    // Fetch the guide's schedules from the database
    const schedules = await prisma.tour.findMany(query);

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching guide schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch guide schedules" },
      { status: 500 },
    );
  }
}

export async function POST(
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

    // Check if the guide exists
    const existingGuide = await prisma.guide.findUnique({
      where: { id },
    });

    if (!existingGuide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = scheduleSchema.parse(body);

    // Create the schedule entry
    const schedule = await prisma.tour.create({
      data: {
        ...validatedData,
        guideId: id,
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error("Error creating guide schedule:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create guide schedule" },
      { status: 500 },
    );
  }
}
