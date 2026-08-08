"use client";

import React, { useEffect } from "react";

export default function MonitoringProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const logrocketId = process.env.NEXT_PUBLIC_LOGROCKET_ID;
    if (logrocketId && typeof window !== "undefined") {
      try {
        // Dynamic import with string variable to avoid static Turbopack module resolution failure
        const pkgName = "logrocket";
        import(/* webpackIgnore: true */ pkgName).then((LogRocket) => {
          LogRocket.default.init(logrocketId);
          console.log("[INFRASTRUCTURE MONITORING] LogRocket initialized successfully.");
        }).catch(() => {
          // LogRocket optional dependency not installed
        });
      } catch (e) {
        // Ignore optional monitoring init error
      }
    }
  }, []);

  return <>{children}</>;
}
