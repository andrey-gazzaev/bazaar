/** Tag ids from a repeated field or a comma-separated form value. Empty when none were sent. */
export function splitIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);

  if (typeof value !== 'string' || value.trim() === '') return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
