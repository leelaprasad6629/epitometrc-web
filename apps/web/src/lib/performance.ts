export function startPerformanceMeasure(label: string, limitMs = 500) {
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      if (duration > limitMs) {
        console.warn(`[PERF WARNING] ${label} took ${duration.toFixed(2)}ms (Limit: ${limitMs}ms)`);
      } else {
        console.log(`[PERF] ${label} took ${duration.toFixed(2)}ms`);
      }
      return duration;
    }
  };
}
