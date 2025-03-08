"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";

// Replace with your Mapbox token
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlwYWtnaXJlZSIsImEiOiJjbTd1YTRhc2MwMjByMnFzOWJjNjN5bWV6In0.6nhAOX7emxi5yvrmRAG93g";

interface Location {
  id: string | number;
  name: string;
  coordinates: [number, number];
  type: string;
  description: string;
}

interface GuideMapProps {
  locations: Location[];
  className?: string;
}

const typeColors = {
  village: "#10b981", // emerald-500
  camp: "#f59e0b", // amber-500
  peak: "#ef4444", // red-500
  landmark: "#6366f1", // indigo-500
};

export function GuideMap({ locations, className }: GuideMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [86.8525, 28.0021], // Centered on EBC
      zoom: 11,
      pitch: 45, // Add some tilt
      bearing: -30, // Rotate slightly
    });

    // Add terrain and sky layers for a more immersive 3D experience
    map.current.on("load", () => {
      map.current?.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
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

    // Add markers for each location
    locations.forEach((location) => {
      // Create custom marker element
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

      // Create and add the custom popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: "300px",
      }).setHTML(`
        <div class="p-3 text-sm">
          <h3 class="font-semibold text-gray-900">${location.name}</h3>
          <p class="text-gray-600 mt-1">${location.description}</p>
        </div>
      `);

      // Add marker to map
      new mapboxgl.Marker(markerEl)
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      markerEl.addEventListener("click", () => {
        setSelectedLocation(location);
      });
    });

    // Draw a path connecting all points in sequence
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

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [locations]);

  return (
    <div className={cn("relative", className)}>
      <div ref={mapContainer} className="w-full h-full rounded-xl" />

      {/* Location Info Overlay */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {selectedLocation.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {selectedLocation.description}
          </p>
          <button
            onClick={() => setSelectedLocation(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
