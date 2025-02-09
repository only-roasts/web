import type {PrivyClientConfig} from '@privy-io/react-auth';
// Replace this with any of the networks listed at https://github.com/wevm/viem/blob/main/src/chains/index.ts
import {base, polygon, arbitrum, storyOdyssey, mantle,baseSepolia} from 'viem/chains';
// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    showWalletUIs: true,
  },
  loginMethods: ['wallet', 'email', 'sms','apple','discord','farcaster','github','google','spotify','linkedin','telegram','tiktok'],
  appearance: {
    showWalletLoginFirst: true,
    
  },
  defaultChain:baseSepolia
};