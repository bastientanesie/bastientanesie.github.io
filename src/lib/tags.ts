export interface TagSummary<Tag extends string> {
  tag: Tag;
  label: string;
  count: number;
}

export function summarizeTags<Tag extends string, Entry>(
  entries: Entry[],
  tagsOf: (entry: Entry) => Tag[],
  labels: Record<Tag, string>,
): TagSummary<Tag>[] {
  const counts = new Map<Tag, number>();
  for (const entry of entries) {
    for (const tag of tagsOf(entry)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, label: labels[tag], count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function filterByTag<Tag extends string, Entry>(
  entries: Entry[],
  tag: Tag,
  tagsOf: (entry: Entry) => Tag[],
): Entry[] {
  return entries.filter((entry) => tagsOf(entry).includes(tag));
}
