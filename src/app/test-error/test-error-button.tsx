"use client";

import { useState } from "react";

export default function TestErrorButton() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) throw new Error("Wielmi PostHog test error email=synthetic@example.invalid token=synthetic-secret");

  return (
    <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={() => setShouldThrow(true)}>
      Trigger test error
    </button>
  );
}
