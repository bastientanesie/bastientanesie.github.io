const formatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatYearMonth(yearMonth: string): string {
  return formatter.format(new Date(`${yearMonth}-01T00:00:00Z`));
}
