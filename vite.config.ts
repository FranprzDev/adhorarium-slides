import { defineConfig } from "vite";
import { wgslVitePlugin } from "@vgpu/wgsl/loader-vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const INLINED_ASSET = /\.(woff2|svg)$/;

// JS, CSS, fonts and the WGSL shader are inlined into index.html so the deck opens
// from file:// (module scripts and fonts are blocked there when loaded as separate files).
// Screenshots stay in public/shots and are referenced with relative paths.
export default defineConfig({
  base: "./",
  plugins: [wgslVitePlugin(), viteSingleFile({ useRecommendedBuildConfig: false, removeViteModuleLoader: true })],
  build: {
    target: "es2022",
    cssCodeSplit: false,
    modulePreload: false,
    assetsInlineLimit: (filePath: string) => INLINED_ASSET.test(filePath),
    rolldownOptions: { output: { codeSplitting: false } },
  },
});
