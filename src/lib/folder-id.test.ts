import { describe, expect, it } from "vitest";
import { folderIdFromEntry } from "./folder-id";

describe("folderIdFromEntry", () => {
  it("returns the folder name of a kebab-case entry", () => {
    expect(folderIdFromEntry("Project", "my-project-2/index.md")).toBe(
      "my-project-2",
    );
  });

  it.each([
    "MyProject",
    "my_project",
    "my project",
    "-leading",
    "double--dash",
  ])("rejects the non kebab-case folder %s", (folder) => {
    expect(() => folderIdFromEntry("Project", `${folder}/index.md`)).toThrow(
      `Project folder "${folder}" must be kebab-case`,
    );
  });

  it("names the kind of entry in the error", () => {
    expect(() => folderIdFromEntry("Post", "Bad/index.md")).toThrow(
      'Post folder "Bad"',
    );
  });
});
