import type { NextConfig } from "next";

const config: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://ain-mission-control-backend.vercel.app",
  },
};

export default config;
