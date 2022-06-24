import '../../styles/globals.css';
import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material'
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
import MarketDisplay from '../modules/market/components/MarketDisplay';
import MarketToolbar from '../modules/market/components/MarketToolbar';
import { ethers, getDefaultProvider } from 'ethers';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';

const { chains, provider, webSocketProvider } = configureChains([chain.polygon, chain.polygonMumbai, chain.localhost, chain.hardhat], [
  alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  publicProvider(),
  jsonRpcProvider({
    rpc: (chain) => ({
      http: 'http://127.0.0.1:8545'
    }),
    static: false
  }),
])

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
  provider(config) {
    if (Number(process.env.NEXT_PUBLIC_CHAIN_ID) == 1337) {
      return new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545', { name: 'unknown', chainId: 1337 })
    } else if (Number(process.env.NEXT_PUBLIC_CHAIN_ID) == 80001) {
      return new ethers.providers.AlchemyProvider(config.chainId, process.env.NEXT_PUBLIC_ALCHEMY_HTTPS)
    } else if (Number(process.env.NEXT_PUBLIC_CHAIN_ID) == 137) {
      return new ethers.providers.AlchemyProvider(config.chainId, process.env.NEXT_PUBLIC_ALCHEMY_HTTPS)
    } else {
      return getDefaultProvider()
    }
  },
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
        <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <Opportunity>
          <NavigationBreadcrumbs />
          <Component {...pageProps} />
        </Opportunity>
      </ThemeProvider>
      </ReduxProvider>
      </WagmiConfig>
    </React.Fragment>
  );
}

export default MyApp;
