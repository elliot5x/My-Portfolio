import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["192.168.100.71"],
  turbopack: {
    // O monorepo tem um lockfile na raiz; fixe a raiz do bundler no app web.
    root: path.join(__dirname),
  },
};

export default nextConfig;