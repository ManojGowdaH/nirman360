const buckets = new Map<string, { count: number; reset: number }>();

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const value = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return value.slice(0, 64);
}

/** Returns true when the caller should be blocked. */
export function rateLimit(key: string, limit = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [entry, bucket] of buckets) {
      if (bucket.reset < now) buckets.delete(entry);
    }
  }
  const current = buckets.get(key);
  if (!current || current.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > limit;
}
