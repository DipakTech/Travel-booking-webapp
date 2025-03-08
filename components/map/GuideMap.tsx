"use client";

import { useEffect, useState } from "react";
import { MobileMap } from "./MobileMap";
import { DesktopMap } from "./DesktopMap";

interface Location {
  id: string | number;
  name: string;
  coordinates: [number, number];
  type: string;
  description: string;
  elevation?: string;
  dayNumber?: number;
}

interface GuideMapProps {
  locations: Location[];
  className?: string;
}

export function GuideMap({ locations, className }: GuideMapProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? (
    <MobileMap locations={locations} className={className} />
  ) : (
    <DesktopMap locations={locations} className={className} />
  );
}
