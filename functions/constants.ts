const holeskyURL = (holeskyRPCKey: string | undefined) => {
  return `https://ultra-holy-road.ethereum-holesky.quiknode.pro/${holeskyRPCKey}/`
};

const mainnetURL = (mainnetRPCKey: string | undefined) => {
  return `https://chaotic-alpha-glade.quiknode.pro/${mainnetRPCKey}/`
};

// `${currentRPC}eth/v1/beacon/states/finalized/validators/${pubkey}`

// `https://${chainString}beaconcha.in/api/v1/validator/eth1/${address}?apikey=${beaconAPIKey}`

const apiURL = (currentChain: number, address: `0x${string}` | undefined) => {
  return `https://api.vrün.com/${currentChain}/${address}/`
};

const nextIndexURL = (currentChain: number, address: `0x${string}` | undefined) => {
  return `https://api.vrün.com/${currentChain}/${address}/nextindex`
};

const batchURL = (currentChain: number, address: `0x${string}` | undefined) => {
  return `https://api.vrün.com/${currentChain}/${address}/batch`
};

// const batchURL = (currentChain: number, address: `0x${string}` | undefined) => {
//   return `https://api.vrün.com/${currentChain}/${address}/batch`
// };

// `https://api.vrün.com/${currentChain}/${address}/pubkey/${i}`

// `https://api.vrün.com/${currentChain}/${address}/${index}`

// `https://api.vrün.com/${currentChain}/${address}/${pubkey}/logs?type=SetEnabled&start=-1`

// `https://api.vrün.com/${currentChain}/${address}/${pubkey}/logs?type=SetGraffiti&start=-1`

// `https://fee.vrün.com/${currentChain}/${address}/${data.pubkey}/charges`

// `https://fee.vrün.com/${currentChain}/${address}/payments`

