"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BraveSearchResult } from "@/lib/brave-search";
import { MapPin, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

// Function to parse HTML entities and tags
function parseHtml(html: string): string {
  // Create a temporary div element
  const temp = document.createElement("div");
  temp.innerHTML = html;
  // Get text content and decode HTML entities
  return temp.textContent || temp.innerText || "";
}

interface SearchResultsProps {
  query: string;
  type?: "general" | "destinations" | "guides" | "latest";
}

export function SearchResults({ query, type = "general" }: SearchResultsProps) {
  const debouncedQuery = useDebounce(query, 800);

  // Fetch search results using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", debouncedQuery, type],
    queryFn: async () => {
      if (!debouncedQuery) return { web: { results: [] } };

      const response = await fetch(
        `/api/search?q=${encodeURIComponent(debouncedQuery)}&type=${type}`,
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Rate limit exceeded. Please try again in a few moments.",
          );
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch results");
      }

      const data = await response.json();

      // Parse HTML in results
      const parsedResults = data.web.results.map(
        (result: BraveSearchResult) => ({
          ...result,
          title: parseHtml(result.title),
          description: parseHtml(result.description),
        }),
      );

      return { web: { results: parsedResults } };
    },
    enabled: !!debouncedQuery,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const results = data?.web?.results || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error instanceof Error ? error.message : "An error occurred"}</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        {debouncedQuery ? (
          <p>No results found for &quot;{debouncedQuery}&quot;</p>
        ) : (
          <p>Enter a search term to find results</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result: BraveSearchResult, index: number) => (
        <Card
          key={index}
          className={cn(
            "p-4 hover:shadow-lg transition-shadow",
            "border border-gray-200 dark:border-gray-800",
            "bg-white dark:bg-gray-900",
          )}
        >
          <div className="flex gap-4">
            {result.thumbnail && (
              <div className="flex-shrink-0">
                <img
                  src={result.thumbnail.src}
                  alt={result.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex-grow">
              <h3 className="text-lg font-semibold mb-1">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {result.title}
                </a>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {result.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {result.published_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(result.published_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {result.source && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{result.source}</span>
                  </div>
                )}
                {result.age && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{result.age}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
