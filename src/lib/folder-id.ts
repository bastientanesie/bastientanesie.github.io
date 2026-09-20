const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function folderIdFromEntry(
  kind: "Post" | "Project",
  entry: string,
): string {
  const id = entry.split("/")[0] ?? entry;
  if (!KEBAB_CASE.test(id)) {
    throw new Error(`${kind} folder "${id}" must be kebab-case`);
  }
  return id;
}
