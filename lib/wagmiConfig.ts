import {mainnet, sepolia} from 'viem/chains';
import {http} from 'wagmi';
import { injected, metaMask, safe} from 'wagmi/connectors'
import {createConfig} from '@privy-io/wagmi';

// Replace these with your app's chains

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});