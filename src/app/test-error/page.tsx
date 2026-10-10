import { notFound } from "next/navigation";
import TestErrorButton from "./test-error-button";

export default function TestErrorPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_TEST_ERROR_PAGE !== "true") notFound();

  return (
    <main className="section mx-auto max-w-2xl">
      <h1 className="mb-4 text-3xl font-bold">Test error reporting</h1>
      <p className="mb-6">Use this page to check that the error boundary and PostHog receive a test exception.</p>
      <TestErrorButton />
    </main>
  );
}
