"use client";

import { useEffect } from "react";

/** "Download PDF" via the browser's print-to-PDF; opens automatically for links ending in ?print=1. */
export function PrintButton() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("print") === "1") {
      const id = setTimeout(() => window.print(), 400);
      return () => clearTimeout(id);
    }
  }, []);

  return (
    <button onClick={() => window.print()} className="btn-primary">
      Download PDF <span aria-hidden>↓</span>
    </button>
  );
}
