import withExportImages from "next-export-optimize-images";
import analyzer from "@next/bundle-analyzer";

const config = {
  output: "export",
  trailingSlash: true,
  productionBrowserSourceMaps: false,
  basePath: process.env.BASE_PATH ?? "",
  images: { deviceSizes: [440, 640, 768, 1024, 1280, 1480] },
};

export default withExportImages(analyzer({ enabled: process.env.ANALYZE === "true" })(config));
