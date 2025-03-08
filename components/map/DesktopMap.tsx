"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { mapboxConfig } from "@/lib/config/mapbox";

// Set Mapbox token from environment variable
mapboxgl.accessToken = mapboxConfig.publicToken || "";

interface Location {
  id: string | number;
  name: string;
  coordinates: [number, number];
  type: string;
  description: string;
  elevation?: string;
  dayNumber?: number;
}

interface DesktopMapProps {
  locations: Location[];
  className?: string;
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
}

const typeColors = {
  village: "#10b981",
  camp: "#f59e0b",
  peak: "#ef4444",
  landmark: "#6366f1",
};

export function DesktopMap({
  locations,
  className,
  center = mapboxConfig.defaultCenter,
  zoom = mapboxConfig.defaultZoom,
  pitch = mapboxConfig.defaultPitch,
  bearing = mapboxConfig.defaultBearing,
}: DesktopMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  useEffect(() => {
    if (!mapContainer.current || !mapboxConfig.publicToken) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapboxConfig.style,
      center,
      zoom,
      pitch,
      bearing,
    });

    // Add terrain and sky layers
    map.current.on("load", () => {
      map.current?.addSource("mapbox-dem", {
        type: "raster-dem",
        url: mapboxConfig.terrainSource,
        tileSize: 512,
        maxzoom: 14,
      });

      map.current?.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      map.current?.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 90.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers
    locations.forEach((location) => {
      const markerEl = document.createElement("div");
      markerEl.className = "relative group";
      markerEl.innerHTML = `
        <div class="w-4 h-4 rounded-full ${
          location.type in typeColors
            ? `bg-[${typeColors[location.type as keyof typeof typeColors]}]`
            : "bg-primary"
        } shadow-lg shadow-black/20 cursor-pointer transform transition-transform duration-300 hover:scale-125"></div>
        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg text-sm font-medium text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          ${location.name}
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: "300px",
      }).setHTML(`
        <div class="p-3 text-sm">
          <h3 class="font-semibold text-gray-900">${location.name}</h3>
          ${
            location.dayNumber
              ? `<span class="text-primary text-xs">Day ${location.dayNumber}</span>`
              : ""
          }
          ${
            location.elevation
              ? `<span class="text-gray-500 text-xs ml-2">${location.elevation}</span>`
              : ""
          }
          <p class="text-gray-600 mt-1">${location.description}</p>
        </div>
      `);

      new mapboxgl.Marker(markerEl)
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      markerEl.addEventListener("click", () => {
        setSelectedLocation(location);
      });
    });

    // Draw path
    if (locations.length > 1) {
      map.current.on("load", () => {
        map.current?.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: locations.map((loc) => loc.coordinates),
            },
          },
        });

        map.current?.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#e11d48",
            "line-width": 3,
            "line-opacity": 0.8,
            "line-dasharray": [0.5, 1.5],
          },
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [locations, center, zoom, pitch, bearing]);

  return (
    <div className={cn("relative h-full", className)}>
      {!mapboxConfig.publicToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-xl">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please add your Mapbox token to the environment variables.
          </p>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full rounded-xl" />

      {/* Location Info Overlay */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {selectedLocation.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {selectedLocation.dayNumber && (
              <span className="text-sm font-medium text-primary">
                Day {selectedLocation.dayNumber}
              </span>
            )}
            {selectedLocation.elevation && (
              <span className="text-sm text-gray-500">
                {selectedLocation.elevation}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {selectedLocation.description}
          </p>
          <button
            onClick={() => setSelectedLocation(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            ×
          </button>
        </motion.div>
      )}
    </div>
  );
}
