import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Torus from '@toruslabs/torus-embed';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';

const providerOptions = {
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
        buildEnv: "development" // optional
      }
     /* options: {
        networkParams: {
          host: "https://localhost:8545", // optional
          chainId: 1337, // optional
          networkId: 1337 // optional
        }
      }*/
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
        key: process.env.FORMATIC_DEV_KEY, // required
         // if we don't pass it, it will default to localhost:8454
      }
    }
  };

export { providerOptions }