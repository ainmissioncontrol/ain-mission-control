import type { NextConfig } from "next";

const config: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://mc.angelinvestorsnetwork.com/api",
  },
};

export default config;
