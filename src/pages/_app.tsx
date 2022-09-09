import "../../styles/globals.css";
import React, { useEffect, useState } from "react";
import { Box, Container, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
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

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ALCHEMY_API_KEY, ALCHEMY_HTTPS } from '../constant';


import { jsonRpcProvider } from "wagmi/providers/jsonRpc";


import { ethers, getDefaultProvider } from "ethers";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store";
import NavigationBar from "../common/components/NavigationBar/NavigationBar";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/lab";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import apolloClient from "../apollo";
import { SearchProvider } from "../context/SearchContext";
import { Inbox, Mail } from "@mui/icons-material";
const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon, chain.polygonMumbai, chain.localhost, chain.hardhat],
  [
   // alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  //  publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "http://127.0.0.1:8545",
      }),
      static: false,
    }),
  ]
);
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
        config.chainId,
        process.env.NEXT_PUBLIC_ALCHEMY_HTTPS
      );
    } else if (Number(process.env.NEXT_PUBLIC_CHAIN_ID) == 137) {
      return new ethers.providers.AlchemyProvider(
        config.chainId,
        process.env.NEXT_PUBLIC_ALCHEMY_HTTPS
      );
    } else {
      return getDefaultProvider();
    }
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  const { window } = pageProps;


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;


  return (
    <React.Fragment>
      <Header />
      <WagmiConfig client={client}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
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
        </LocalizationProvider>
      </WagmiConfig>
    </React.Fragment>
  );
}

export default MyApp;
