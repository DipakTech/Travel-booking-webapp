import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL from environment variable or default
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://travel.oneclickresult.com";

  // Static routes
  const staticRoutes = [
    "",
    "/guides",
    "/destinations",
    "/services",
    "/community",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // TODO: Add dynamic routes from database
  // Example for guides
  // const guides = await prisma.guide.findMany();
  // const guideRoutes = guides.map((guide) => ({
  //   url: `${baseUrl}/guides/${guide.id}`,
  //   lastModified: guide.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }));

  return [...staticRoutes];
}
