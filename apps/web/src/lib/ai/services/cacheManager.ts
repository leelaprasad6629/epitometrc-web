interface CacheEntry {
  response: string;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 1000 * 60 * 10; // 10 minutes cache expiration time

export function getCachedAIResponse(promptKey: string): string | null {
  const entry = cache.get(promptKey);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(promptKey);
    return null;
  }
  return entry.response;
}

export function setCachedAIResponse(promptKey: string, response: string): void {
  cache.set(promptKey, {
    response,
    timestamp: Date.now(),
  });
}

export function clearAICache(): void {
  cache.clear();
}
