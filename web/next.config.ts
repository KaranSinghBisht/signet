import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@signet/shared"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "media-src 'self' https://d8j0ntlcm91z4.cloudfront.net https:",
              "connect-src 'self' http://localhost:3001 https://x402.org https://developer.world.org https://staging-developer.worldcoin.org https://worldcoin.org wss: https:",
              "frame-src https://worldcoin.org https://id.worldcoin.org https://simulator.worldcoin.org",
              "font-src 'self' data:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
