export function logDebug(message: string) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEBUG] ${message}`);
  }
}
