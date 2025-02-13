/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3005",
        pathname: "**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: "",
    NEXT_PUBLIC_ZEGO_SEVER_ID: "",
  },
};

export default nextConfig;