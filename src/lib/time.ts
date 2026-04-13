export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("month")}/${get("day")}/${get("year")} ${get("hour")}:${get("minute")} ${get("dayPeriod")} CST`;
}
