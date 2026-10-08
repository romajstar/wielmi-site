"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/telemetry";

export default function TestErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    captureError(error);
  }, [error]);

  return (
    <main className="section mx-auto max-w-2xl">
      <h1 className="mb-4 text-3xl font-bold">Test error caught</h1>
      <p className="mb-6">The page boundary caught the error. Check the PostHog project for a test exception.</p>
      <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={() => reset()}>
        Reset test page
      </button>
    </main>
  );
}
