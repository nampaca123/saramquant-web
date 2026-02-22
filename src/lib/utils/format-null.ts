export function formatNull(value: unknown): string {
  return value == null ? '—' : String(value);
}
