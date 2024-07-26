/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mui/x-charts'],
  env : {
    NEXT_PUBLIC_ENABLE_TESTNETS: 'true',
    MAINNET_RPC: "2dbf1a6251414357d941b7308e318a279d9856ec",
    HOLESKY_RPC: "b4bcc06d64cddbacb06daf0e82de1026a324ce77",
    BEACON: "7f0daf71-cc5e-4a97-8106-a3b3d6b2332d"
  },
  reactStrictMode: true,
  output: 'standalone',
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
