export const mapboxConfig = {
  publicToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  secretToken: process.env.MAPBOX_SECRET_TOKEN,
  defaultCenter: [86.8525, 28.0021] as [number, number], // Nepal center coordinates
  defaultZoom: 11,
  defaultPitch: 45,
  defaultBearing: -30,
  style: "mapbox://styles/mapbox/outdoors-v12",
  terrainSource: "mapbox://mapbox.mapbox-terrain-dem-v1",
} as const;

// Validate Mapbox token
if (!mapboxConfig.publicToken) {
  throw new Error(
    "Missing NEXT_PUBLIC_MAPBOX_TOKEN. Please add it to your environment variables.",
  );
}
