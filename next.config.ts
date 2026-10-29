import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH (e.g. "/voltstay") when deploying under a sub-path such as GitHub Pages.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Fully static build: no server runtime, so the same output deploys to Vercel, GitHub Pages or any CDN.
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
