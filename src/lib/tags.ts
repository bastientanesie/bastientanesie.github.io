export interface TagSummary<Tag extends string> {
  tag: Tag;
  count: number;
}

export function summarizeTags<Tag extends string>(
  entries: { data: { tags: Tag[] } }[],
): TagSummary<Tag>[] {
  const counts = new Map<Tag, number>();
  for (const { data } of entries) {
    for (const tag of data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function filterByTag<
  Tag extends string,
  Entry extends { data: { tags: Tag[] } },
>(entries: Entry[], tag: Tag): Entry[] {
  return entries.filter(({ data }) => data.tags.includes(tag));
}
