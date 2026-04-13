const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "clear sky", icon: "☀️" },
  1: { label: "mostly clear", icon: "🌤" },
  2: { label: "partly cloudy", icon: "⛅" },
  3: { label: "overcast", icon: "☁️" },
  45: { label: "fog", icon: "🌫" },
  48: { label: "rime fog", icon: "🌫" },
  51: { label: "light drizzle", icon: "🌦" },
  53: { label: "drizzle", icon: "🌦" },
  55: { label: "heavy drizzle", icon: "🌧" },
  61: { label: "light rain", icon: "🌧" },
  63: { label: "medium rain", icon: "🌧" },
  65: { label: "heavy rain", icon: "🌧" },
  71: { label: "light snow", icon: "🌨" },
  73: { label: "snow", icon: "🌨" },
  75: { label: "heavy snow", icon: "❄️" },
  80: { label: "light showers", icon: "🌦" },
  81: { label: "showers", icon: "🌧" },
  82: { label: "heavy showers", icon: "⛈" },
  95: { label: "thunderstorm", icon: "⛈" },
  96: { label: "thunderstorm w/ hail", icon: "⛈" },
  99: { label: "thunderstorm w/ hail", icon: "⛈" },
};

export async function GET(req: Request) {
  try {
    const lat = new URL(req.url).searchParams.get("lat");
    const lon = new URL(req.url).searchParams.get("lon");

    if (!lat || !lon) {
      return Response.json({ error: "lat and lon required" }, { status: 400 });
    }

    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", lat);
    weatherUrl.searchParams.set("longitude", lon);
    weatherUrl.searchParams.set("daily", "temperature_2m_min,temperature_2m_max,weather_code");
    weatherUrl.searchParams.set("temperature_unit", "fahrenheit");
    weatherUrl.searchParams.set("timezone", "America/Chicago");
    weatherUrl.searchParams.set("forecast_days", "1");

    const res = await fetch(weatherUrl.toString(), { next: { revalidate: 600 } });
    if (!res.ok) throw new Error("Weather API failed");

    const data = await res.json();
    const daily = data.daily;
    const code = daily.weather_code[0] as number;
    const wmo = WMO_CODES[code] ?? { label: "unknown", icon: "🌡" };

    return Response.json({
      low: Math.round(daily.temperature_2m_min[0]),
      high: Math.round(daily.temperature_2m_max[0]),
      label: wmo.label,
      icon: wmo.icon,
    });
  } catch {
    return Response.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
