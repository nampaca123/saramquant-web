export function isError(val: unknown): val is { error: string } {
  return val != null && typeof val === 'object' && 'error' in val;
}
