import assert from "node:assert/strict";
import test from "node:test";
import { publicAssetPath } from "@/lib/public-asset";

test("prefixes local public assets with the configured base path", () => {
  assert.equal(publicAssetPath("/videos/portfolio/demo.mp4", "/wielmi-site"), "/wielmi-site/videos/portfolio/demo.mp4");
  assert.equal(publicAssetPath("videos/portfolio/demo.mp4", "/wielmi-site/"), "/wielmi-site/videos/portfolio/demo.mp4");
  assert.equal(publicAssetPath("/videos/portfolio/demo.mp4", "wielmi-site"), "/wielmi-site/videos/portfolio/demo.mp4");
});

test("does not duplicate base paths or modify external URLs", () => {
  assert.equal(publicAssetPath("/wielmi-site/videos/demo.mp4", "/wielmi-site"), "/wielmi-site/videos/demo.mp4");
  assert.equal(
    publicAssetPath("https://media.example.com/demo.mp4", "/wielmi-site"),
    "https://media.example.com/demo.mp4",
  );
});
