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
    NEXT_PUBLIC_ZEGO_APP_ID: 256258028,
    NEXT_PUBLIC_ZEGO_SEVER_ID: "8eb121f31739ef8163f2749809d60a58",
  },
};

export default nextConfig;