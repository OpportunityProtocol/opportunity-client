import '../../styles/globals.css';
import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Opportunity from '../Opportunity';
import theme from '../../material_theme';
import { ThemeProvider } from '@mui/material/styles';
import NavigationBreadcrumbs from '../common/components/Breadcrumbs/Breadcrumbs';
import Header from '../common/components/Head';
import { CssBaseline } from '@mui/material';
import { WagmiConfig, createClient, defaultChains, configureChains, chain } from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ALCHEMY_API_KEY, ALCHEMY_HTTPS, NETWORK_MANAGER_ADDRESS } from '../constant';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const getConfiguredChain = () => {
  switch(process.env.NODE_ENV) {
    case 'production':
      return chain.polygon
    case 'development':
      return chain.localhost
    case 'test':
      return chain.polygonMumbai
    default:
      return chain.localhost
  }
}

const { chains, provider, webSocketProvider } = configureChains([getConfiguredChain()], [
  alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, priority: 0 }),
  jsonRpcProvider({
    rpc: (chain) => ({
      http: 'http://localhost:8545'
    }),
  }),
])

console.log(chains)

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

function MyApp({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  return (
    <React.Fragment>
      <Header />
      <WagmiConfig client={client}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <Opportunity>
          <NavigationBreadcrumbs />
          <Component {...pageProps} />
        </Opportunity>
      </ThemeProvider>
      </WagmiConfig>
    </React.Fragment>
  );
}

export default MyApp;
