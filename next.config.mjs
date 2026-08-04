import { withSentryConfig } from "@sentry/nextjs";
import withExportImages from "next-export-optimize-images";
import analyzer from "@next/bundle-analyzer";

const basePath = process.env.BASE_PATH ?? "";

const config = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    deviceSizes: [440, 640, 768, 1024, 1280, 1480],
  },
};

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === "true",
})(config);

const withSentry = withSentryConfig(withBundleAnalyzer, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "mastyka-rc",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});

const nextConfig = withExportImages(withSentry);

export default nextConfig;
