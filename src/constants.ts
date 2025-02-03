export const NEXT_PUBLIC_PROJECT_ID = "64fa04740ab4284806bd0df2ea67c791";
export const ETH_TOKEN_ADDRESS = "0x".padEnd(42, "0") as `0x${string}`;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const FEE_URL = process.env.NEXT_PUBLIC_FEE_URL;
export const VRUN_CHAIN_CONFIG = {
  1: {
    rpc: process.env.NEXT_PUBLIC_MAINNET_RPC,
    beacon_node_rpc: process.env.NEXT_PUBLIC_BEACON_NODE_MAINNET_RPC,
    rocket_storage: "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46" as `0x${string}`,
    explorer_uri: "https://beaconcha.in/validator/",
  },
  17000: {
    rpc: process.env.NEXT_PUBLIC_HOLESKY_RPC,
    beacon_node_rpc: process.env.NEXT_PUBLIC_BEACON_NODE_HOLESKY_RPC,
    rocket_storage: "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" as `0x${string}`,
    explorer_uri: "https://holesky.beaconcha.in/validator/",
  }
} as const;
