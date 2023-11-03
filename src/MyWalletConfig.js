import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import {
  polygon,
  polygonMumbai
} from 'wagmi/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ polygon, polygonMumbai ],
  [alchemyProvider({ apiKey: '9f0c2c77d3c186de174304e92a92768a' }), publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: 'My Staking App',
  projectId: '9f0c2c77d3c186de174304e92a92768a',
  chains
});

// Set up wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  // webSocketPublicClient,
})

export default function MyWalletConfig({ children }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}