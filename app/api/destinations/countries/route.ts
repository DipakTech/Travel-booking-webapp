import { NextRequest, NextResponse } from "next/server";
import * as destinationService from "@/lib/services/destinations";

export async function GET(req: NextRequest) {
  try {
    // Get all distinct destination countries
    const countries = await destinationService.getDestinationCountries();

    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error fetching destination countries:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination countries" },
      { status: 500 },
    );
  }
}
