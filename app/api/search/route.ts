import { NextResponse } from "next/server";
import {
  searchNepal,
  searchDestinations,
  searchGuides,
  searchLatestInfo,
} from "@/lib/brave-search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "general";
    const count = parseInt(searchParams.get("count") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    let results;
    switch (type) {
      case "destinations":
        results = await searchDestinations(query, { count, offset });
        break;
      case "guides":
        results = await searchGuides(query, { count, offset });
        break;
      case "latest":
        results = await searchLatestInfo(query, { count, offset });
        break;
      default:
        results = await searchNepal(query, { count, offset });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 },
    );
  }
}
