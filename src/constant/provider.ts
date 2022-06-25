import { chain } from 'wagmi'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Torus from '@toruslabs/torus-embed';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';

export const ALCHEMY_API_KEY=process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
export const ALCHEMY_HTTPS=process.env.NEXT_PUBLIC_ALCHEMY_HTTPS
export const FORTMATIC_DEV_KEY = process.env.NEXT_PUBLIC_FORTMATIC_DEV_KEY
export const FORTMATIC_PROD_KEY = process.env.NEXT_PUBLIC_FORTMATIC_PROD_KEY

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

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID)