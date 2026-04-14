/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Prevent serving static HTML files from public/ conflicting with app router
  // The static HTML app (index.html, dashboard.html, etc.) runs independently
  // Next.js app runs on /app routes
};

export default nextConfig;
