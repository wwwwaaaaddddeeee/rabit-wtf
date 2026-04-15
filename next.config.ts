import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Keeps Turbopack scoped to this repo when a parent folder has another lockfile (faster dev). */
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
  allowedDevOrigins: ["192.168.1.123"],
};

export default nextConfig;
