/** @type {import('next').NextConfig} */
const MS_PER_SECOND = 1000;
const SECONDS_PER_DAY = 86400;

const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            { hostname: '**', protocol: 'https' }
        ]
    },
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: SECONDS_PER_DAY * MS_PER_SECOND,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 100,
    },
};

export default nextConfig;
