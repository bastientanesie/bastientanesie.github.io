import { describe, expect, it } from "vitest";
import { projectSkillTags, projectTechTags, tagKeys } from "../data/tags";
import { filterByTag, summarizeTags } from "./tags";

const labels = { a: "Alpha", b: "Beta" };
const entries = [{ tags: ["b", "a"] }, { tags: ["b"] }] as {
  tags: ("a" | "b")[];
}[];
const tagsOf = (entry: { tags: ("a" | "b")[] }) => entry.tags;

describe("summarizeTags", () => {
  it("counts tags and sorts them by label", () => {
    expect(summarizeTags(entries, tagsOf, labels)).toEqual([
      { tag: "a", label: "Alpha", count: 1 },
      { tag: "b", label: "Beta", count: 2 },
    ]);
  });
});

describe("filterByTag", () => {
  it("keeps entries carrying the tag", () => {
    expect(filterByTag(entries, "a", tagsOf)).toEqual([entries[0]]);
  });
});

describe("Project tags", () => {
  it("never reuse a key between Tech tags and Skill tags", () => {
    const shared = tagKeys(projectTechTags).filter(
      (key) => key in projectSkillTags,
    );
    expect(shared).toEqual([]);
  });
});
