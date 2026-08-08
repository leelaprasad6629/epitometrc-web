// Sentry initialization configuration (Optional monitoring SDK)
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  try {
    const Sentry = require("@sentry/nextjs");
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  } catch {
    // Sentry SDK not installed
  }
}

export {};
