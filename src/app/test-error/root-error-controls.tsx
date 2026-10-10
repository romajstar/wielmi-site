"use client";

import { useState } from "react";

const syntheticDetails = "email=synthetic@example.invalid token=synthetic-secret Bearer synthetic-bearer";

/** Mounted in the root layout so its render error reaches global-error.tsx. */
export default function RootErrorControls() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) throw new Error(`Wielmi global boundary test ${syntheticDetails}`);

  return (
    <aside className="relative z-50 flex flex-wrap gap-3 bg-white p-4" aria-label="Telemetry test controls">
      <button onClick={() => setShouldThrow(true)}>Trigger global boundary error</button>
      <button onClick={() => setTimeout(() => {
        throw new Error(`Wielmi uncaught test ${syntheticDetails}`);
      }, 0)}>Trigger uncaught error</button>
      <button onClick={() => setTimeout(() => {
        void Promise.reject(new Error(`Wielmi rejection test ${syntheticDetails}`));
      }, 0)}>Trigger unhandled rejection</button>
    </aside>
  );
}
