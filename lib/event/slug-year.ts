/** Trailing 4-digit year from slug (e.g. npsc-2026 → "2026"). */
export function yearFromSlug(slug: string): string | null {
  const match = slug.match(/-(\d{4})$/);
  return match ? match[1] : null;
}

/** Admin edition select label: year from slug, optional draft suffix. */
export function formatEditionSelectLabel(event: {
  slug: string;
  isPublished: boolean;
}): string {
  const year = yearFromSlug(event.slug) ?? event.slug;
  return event.isPublished ? year : `${year} · draft`;
}

/** Suggest next edition slug by bumping a trailing 4-digit year (e.g. npsc-2026 → npsc-2027). */
export function suggestNextYearSlug(slug: string): string {
  const match = slug.match(/^(.*-)(\d{4})$/);
  if (match) {
    const year = Number.parseInt(match[2], 10);
    if (!Number.isNaN(year)) {
      return `${match[1]}${year + 1}`;
    }
  }
  return `${slug}-copy`;
}

/** Bump year strings like "2–3 September 2026" → "2–3 September 2027" when possible. */
export function bumpYearInLabel(label: string, increment = 1): string {
  return label.replace(/\b(20\d{2})\b/g, (y) => String(Number.parseInt(y, 10) + increment));
}
