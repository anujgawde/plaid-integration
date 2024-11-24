/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
    PLAID_VERSION: process.env.PLAID_VERSION,
    REDIRECT_URI: process.env.REDIRECT_URI,
  },
};

module.exports = nextConfig;
