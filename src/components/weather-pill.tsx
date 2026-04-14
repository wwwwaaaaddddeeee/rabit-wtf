"use client";

import { useState, useEffect } from "react";

interface LocationData {
  lat: number;
  lon: number;
}

interface WeatherData {
  low: number;
  high: number;
  label: string;
  icon: string;
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getLocation(): Promise<LocationData | null> {
  let lat: number | null = null;
  let lon: number | null = null;

  if (navigator.geolocation) {
    const pos = await new Promise<GeolocationPosition | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), {
        timeout: 5000,
      });
    });
    if (pos) {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    }
  }

  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      return {
        lat: lat ?? data.latitude,
        lon: lon ?? data.longitude,
      };
    }
  } catch {}

  if (lat !== null && lon !== null) {
    return { lat, lon };
  }

  return null;
}

export function HeaderPills() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const loc = await getLocation();
      if (!loc || cancelled) return;
      setLocation(loc);

      const w = await fetchWeather(loc.lat, loc.lon);
      if (w && !cancelled) setWeather(w);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (!location) return null;

  const pillBase = "px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]";

  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {weather && (
        <div className={`${pillBase} border border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400`}>
          {weather.icon} {weather.low}–{weather.high}°F, {weather.label}
        </div>
      )}
    </div>
  );
}
