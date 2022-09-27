import "../../styles/globals.css";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import type { AppProps } from "next/app";
import Opportunity from "../Opportunity";
import theme from "../../material_theme";
import { ThemeProvider } from "@mui/material/styles";
import Header from "../common/components/Head";
import { CssBaseline } from "@mui/material";
import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
  chain,
} from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { ethers, getDefaultProvider } from "ethers";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import apolloClient from "../apollo";
import { SearchProvider } from "../context/SearchContext";
import { Inbox, Mail } from "@mui/icons-material";
import { PINATA_JWT } from "../constant";
import axios from 'axios'
import { generatePinataData, getJSONFromIPFSPinata, pinJSONToIPFSPinata } from "../common/ipfs-helper";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon, chain.polygonMumbai, chain.localhost, chain.hardhat],
  [
    alchemyProvider({
      apiKey: process.env.ALCHEMY_API_KEY,
      priority: 1,
      weight: 100,
    }),
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "http://127.0.0.1:8545",
      }),
      static: false,
    }),
  ]
);
const client = createClient({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains, }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
  ],

  webSocketProvider,

  provider(config) {
    if (Number(process.env.NEXT_PUBLIC_CHAIN_ID) == 1337) {
      return new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545", {
        name: "localhost",
        chainId: 1337,
      });
    } else if (Number(process.env.NEXT_PUBLIC_CHAIN_ID) == 80001) {
      return new ethers.providers.AlchemyProvider(
        80001,
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      );
    } else if (Number(process.env.NEXT_PUBLIC_CHAIN_ID) == 137) {
      return new ethers.providers.AlchemyProvider(
        137,
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      );
    } else {
      return getDefaultProvider();
    }
  },
});



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Header />
      <WagmiConfig client={client}>
          <ReduxProvider store={store}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ApolloProvider client={apolloClient}>
                <SearchProvider>
                  <Opportunity>
                    <Component {...pageProps} />
                  </Opportunity>
                </SearchProvider>
              </ApolloProvider>
            </ThemeProvider>
          </ReduxProvider>
      </WagmiConfig>
    </React.Fragment>
  );
}

export default MyApp;
