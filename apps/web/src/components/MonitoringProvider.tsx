"use client";

import React, { useEffect } from "react";

export default function MonitoringProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const logrocketId = process.env.NEXT_PUBLIC_LOGROCKET_ID;
    if (logrocketId && typeof window !== "undefined") {
      import("logrocket").then((LogRocket) => {
        LogRocket.default.init(logrocketId);
        console.log("[INFRASTRUCTURE MONITORING] LogRocket initialized successfully.");
      }).catch((err) => {
        console.warn("LogRocket initialization bypassed or failed:", err);
      });
    }
  }, []);

  return <>{children}</>;
}
