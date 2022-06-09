import { chain } from 'wagmi'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Torus from '@toruslabs/torus-embed';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';

export const ALCHEMY_API_KEY=process.env.REACT_APP_ALCHEMY_API_KEY
export const ALCHEMY_HTTPS=process.env.REACT_APP_ALCHEMY_HTTPS
export const FORTMATIC_DEV_KEY = process.env.REACT_APP_FORTMATIC_DEV_KEY
export const FORTMATIC_PROD_KEY = process.env.REACT_APP_FORTMATIC_PROD_KEY

export const POLYGONSCAN_URL = process.env.NODE_ENV === 'production' ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com'

export const ALCHEMY_RPC = process.env.NODE_ENV === 'production' ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` : `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`

export const POLYGON_MAINNET = {
  ...chain.polygon,
  name: 'Polygon Mainnet',
  rpcUrls: { default: 'https://polygon-rpc.com' }
}

export const POLYGON_MUMBAI = {
  ...chain.polygonMumbai,
  name: 'Polygon Mumbai',
  rpcUrls: { default: 'https://rpc-mumbai.maticvigil.com' }
}

export const CHAIN_ID = 1337 //process.env.NODE_ENV === 'production' ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id

export const providerOptions = {
    /* See Provider Options Section */
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "My Awesome App", // Required
        infuraId: "INFURA_ID", // Required
        rpc: "", // Optional if `infuraId` is provided; otherwise it's required
        chainId: 1, // Optional. It defaults to 1 if not provided
        darkMode: false // Optional. Use dark theme, defaults to false
      }
    },
    torus: {
      package: Torus, // required
      config: {
        buildEnv: process.env.NODE_ENV,
      },
      options: {
        networkParams: {
          host: process.env.NODE_ENV === 'production' ? ALCHEMY_HTTPS : "https://localhost:8545", // optional
          chainId: CHAIN_ID, 
          networkId: CHAIN_ID 
        }
      }
    },
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "INFURA_ID" // required
      }
    },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: process.env.REACT_APP_FORMATIC_DEV_KEY, // required
         // if we don't pass it, it will default to localhost:8454
      }
    }
  };