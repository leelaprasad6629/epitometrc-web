export interface ClientMetadata {
  browser: string;
  operatingSystem: string;
  device: "Desktop" | "Tablet" | "Mobile";
  screenResolution: string;
  timezone: string;
  language: string;
  referrerUrl: string;
  currentPage: string;
}

export function getClientMetadata(): ClientMetadata {
  if (typeof window === "undefined") {
    return {
      browser: "Unknown",
      operatingSystem: "Unknown",
      device: "Desktop",
      screenResolution: "1920x1080",
      timezone: "UTC",
      language: "en-US",
      referrerUrl: "",
      currentPage: "/",
    };
  }

  const ua = navigator.userAgent;

  // Browser detection
  let browser = "Chrome";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";
  else if (ua.includes("OPR/") || ua.includes("Opera/")) browser = "Opera";

  // Operating System detection
  let operatingSystem = "Windows";
  if (ua.includes("Mac OS X")) operatingSystem = "macOS";
  else if (ua.includes("Android")) operatingSystem = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) operatingSystem = "iOS";
  else if (ua.includes("Linux")) operatingSystem = "Linux";

  // Device type detection
  let device: "Desktop" | "Tablet" | "Mobile" = "Desktop";
  const width = window.innerWidth;
  if (/Mobi|Android|iPhone/i.test(ua) || width < 640) {
    device = "Mobile";
  } else if (/iPad|Tablet/i.test(ua) || (width >= 640 && width < 1024)) {
    device = "Tablet";
  }

  return {
    browser,
    operatingSystem,
    device,
    screenResolution: `${window.screen?.width || width}x${window.screen?.height || window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    language: navigator.language || "en-US",
    referrerUrl: document.referrer || "",
    currentPage: window.location.pathname || "/",
  };
}
