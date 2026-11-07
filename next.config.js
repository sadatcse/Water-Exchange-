/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Loaded from node_modules at runtime instead of bundled (database driver)
    serverExternalPackages: ['mysql2'],
    images: {
        unoptimized: true
    }
};

export default nextConfig;
