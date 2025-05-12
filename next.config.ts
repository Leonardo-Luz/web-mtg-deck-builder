import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_CARDS_IMGS ? process.env.NEXT_PUBLIC_CARDS_IMGS : "",
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
