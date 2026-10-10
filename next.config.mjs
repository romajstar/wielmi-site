import withExportImages from "next-export-optimize-images";
import analyzer from "@next/bundle-analyzer";
import { withPostHogConfig } from "@posthog/nextjs-config";

const basePath = process.env.BASE_PATH ?? "";

const config = {
  output: "export",
  trailingSlash: true,
  productionBrowserSourceMaps: false,
  basePath: process.env.BASE_PATH ?? "",
  images: { deviceSizes: [440, 640, 768, 1024, 1280, 1480] },
};

const nextConfig = withExportImages(analyzer({ enabled: process.env.ANALYZE === "true" })(config));
const uploadSourceMaps = process.env.POSTHOG_SOURCEMAPS_ENABLED === "true";

if (uploadSourceMaps && (!process.env.POSTHOG_API_KEY || !process.env.POSTHOG_PROJECT_ID)) {
  throw new Error("PostHog source map uploads require POSTHOG_API_KEY and POSTHOG_PROJECT_ID.");
}

export default uploadSourceMaps
  ? withPostHogConfig(nextConfig, {
      personalApiKey: process.env.POSTHOG_API_KEY,
      projectId: process.env.POSTHOG_PROJECT_ID,
      host: "https://eu.posthog.com",
      sourcemaps: {
        enabled: true,
        releaseName: "wielmi-site",
        releaseVersion: process.env.GITHUB_SHA,
        deleteAfterUpload: true,
      },
    })
  : nextConfig;
