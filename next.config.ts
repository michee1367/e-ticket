import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Autorise l'accès au serveur de dev depuis d'autres appareils du réseau local
  allowedDevOrigins: ["172.20.10.2", "172.20.10.9", "192.168.*", "10.*"],
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
};

export default nextConfig;

