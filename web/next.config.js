/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    GRAPHQL_URI: process.env.GRAPHQL_URI,
    GRAPHQLWS_URI: process.env.GRAPHQLWS_URI,
  },
};

module.exports = nextConfig;
