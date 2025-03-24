import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { destinationSchema } from "@/lib/schema/destination";
import * as destinationService from "@/lib/services/destinations";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const destination = await destinationService.getDestinationById(params.id);
    return NextResponse.json(destination);
  } catch (error: any) {
    if (error.message === "Destination not found") {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 },
      );
    }

    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verify authentication
    const session = await getServerSession();

    // Check if user is authenticated and has admin access
    if (
      !session ||
      !session.user ||
      session?.user?.email !== process.env.ADMIN_EMAIL
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can update destinations." },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await req.json();

    try {
      // Validate request data - partial validation for updates
      destinationSchema.partial().parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: validationError.format() },
          { status: 400 },
        );
      }
    }

    // Update destination
    const destination = await destinationService.updateDestination(
      params.id,
      body,
    );

    return NextResponse.json(destination);
  } catch (error: any) {
    if (error.message === "Destination not found") {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 },
      );
    }

    console.error("Error updating destination:", error);
    return NextResponse.json(
      { error: "Failed to update destination" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verify authentication
    const session = await getServerSession();

    // Check if user is authenticated and has admin access
    if (
      !session ||
      !session.user ||
      session?.user?.email !== process.env.ADMIN_EMAIL
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can delete destinations." },
        { status: 403 },
      );
    }

    // Delete destination
    await destinationService.deleteDestination(params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === "Destination not found") {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 },
      );
    }

    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 },
    );
  }
}
