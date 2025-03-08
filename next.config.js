/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   appDir: true,
  //   serverActions: true,
  //   serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  // },
  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     crypto: false,
  //   };
  //   return config;
  // },
  // productionBrowserSourceMaps: false,
  // basePath: "",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tokens.rojiapi.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
