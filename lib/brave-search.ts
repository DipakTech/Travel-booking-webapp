/**
 * Brave Search API client
 */

export interface BraveSearchParams {
  q: string;
  count?: number;
  offset?: number;
  search_lang?: string;
  country?: string;
  safesearch?: "strict" | "moderate" | "off";
  freshness?: "past1d" | "past1w" | "past1m" | "past1y";
}

export interface BraveSearchResult {
  url: string;
  title: string;
  description: string;
  published_date?: string;
  thumbnail?: {
    src: string;
  };
  age?: string;
  source?: string;
}

export interface BraveSearchResponse {
  query: {
    original: string;
  };
  web: {
    results: BraveSearchResult[];
    count: number;
  };
  type_info?: {
    is_query_location_country: boolean;
    is_query_location: boolean;
  };
}

/**
 * Perform a search using Brave Search API
 */
export async function searchNepal(
  query: string,
  options: Partial<BraveSearchParams> = {},
): Promise<BraveSearchResponse> {
  // Add "Nepal" to the query if it's not already included
  const nepalQuery = query.toLowerCase().includes("nepal")
    ? query
    : `${query} Nepal`;

  // Prepare search parameters
  const params: BraveSearchParams = {
    q: nepalQuery,
    count: options.count || 10,
    offset: options.offset || 0,
    search_lang: options.search_lang || "en",
    safesearch: options.safesearch || "moderate",
    freshness: options.freshness,
  };

  // Convert params to URL search params
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  // Fetch from Brave Search API
  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?${searchParams.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY || "",
      },
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brave Search API error: ${error}`);
  }

  return response.json();
}

/**
 * Search specifically for Nepal destinations
 */
export async function searchDestinations(
  query: string,
  options: Partial<BraveSearchParams> = {},
): Promise<BraveSearchResponse> {
  return searchNepal(`${query} destinations tourism travel`, options);
}

/**
 * Search specifically for Nepal travel guides
 */
export async function searchGuides(
  query: string,
  options: Partial<BraveSearchParams> = {},
): Promise<BraveSearchResponse> {
  return searchNepal(`${query} travel guides tours trekking`, options);
}

/**
 * Search for latest Nepal travel information
 */
export async function searchLatestInfo(
  query: string,
  options: Partial<BraveSearchParams> = {},
): Promise<BraveSearchResponse> {
  return searchNepal(query, {
    ...options,
    freshness: "past1m", // Only content from the past month
  });
}
