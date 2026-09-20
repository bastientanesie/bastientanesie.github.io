import { describe, expect, it } from "vitest";
import { formatYearMonth } from "./year-month";

describe("formatYearMonth", () => {
  it.each([
    ["2023-03", "Mar 2023"],
    ["2024-12", "Dec 2024"],
    ["2025-01", "Jan 2025"],
  ])("formats %s as %s", (yearMonth, expected) => {
    expect(formatYearMonth(yearMonth)).toBe(expected);
  });
});
