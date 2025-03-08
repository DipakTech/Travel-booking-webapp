"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

// Replace with your Mapbox token
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlwYWtnaXJlZSIsImEiOiJjbTd1YTRhc2MwMjByMnFzOWJjNjN5bWV6In0.6nhAOX7emxi5yvrmRAG93g";

interface Location {
  id: string | number;
  name: string;
  coordinates: [number, number];
  type: string;
  description: string;
  elevation?: string;
  dayNumber?: number;
}

interface MobileMapProps {
  locations: Location[];
  className?: string;
}

const typeColors = {
  village: "#10b981",
  camp: "#f59e0b",
  peak: "#ef4444",
  landmark: "#6366f1",
};

export function MobileMap({ locations, className }: MobileMapProps) {
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
      center: [86.8525, 28.0021],
      zoom: 10,
      pitch: 40,
      bearing: -25,
    });

    // Add terrain and sky layers
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

    // Add markers
    locations.forEach((location) => {
      const markerEl = document.createElement("div");
      markerEl.className = "relative group";
      markerEl.innerHTML = `
        <div class="w-3 h-3 rounded-full ${
          location.type in typeColors
            ? `bg-[${typeColors[location.type as keyof typeof typeColors]}]`
            : "bg-primary"
        } shadow-lg shadow-black/20 cursor-pointer transform transition-transform duration-300 hover:scale-125"></div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: "250px",
      }).setHTML(`
        <div class="p-2 text-sm">
          <h3 class="font-semibold text-gray-900">${location.name}</h3>
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
            "line-width": 2,
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
  }, [locations]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="relative h-[300px] mb-4">
        <div ref={mapContainer} className="w-full h-full rounded-xl" />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {locations.map((location) => (
            <motion.div
              key={location.id}
              whileHover={{ x: 4 }}
              onClick={() => {
                setSelectedLocation(location);
                map.current?.flyTo({
                  center: location.coordinates,
                  zoom: 12,
                  duration: 2000,
                });
              }}
              className={cn(
                "flex items-start p-3 rounded-lg",
                "bg-white/50 dark:bg-gray-800/50",
                "hover:bg-primary/5 dark:hover:bg-primary/10",
                "border border-transparent",
                "hover:border-primary/20 dark:hover:border-primary/20",
                "transition-all duration-300",
                "cursor-pointer",
                selectedLocation?.id === location.id &&
                  "border-primary/30 bg-primary/5",
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {location.dayNumber && (
                    <span className="text-sm font-medium text-primary">
                      Day {location.dayNumber}
                    </span>
                  )}
                  {location.elevation && (
                    <span className="text-sm text-gray-500">
                      {location.elevation}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {location.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {location.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
