/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ITokenFactory, ITokenFactoryInterface } from "../ITokenFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "marketName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "baseCost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "priceRise",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "hatchTokens",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tradingFeeRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "platformFeeRate",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "allInterestToPlatform",
        type: "bool",
      },
    ],
    name: "addMarket",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "marketID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "lister",
        type: "address",
      },
    ],
    name: "addToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "marketID",
        type: "uint256",
      },
    ],
    name: "getMarketDetailsByID",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "contract ITokenNameVerifier",
            name: "nameVerifier",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "numTokens",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "priceRise",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hatchTokens",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tradingFeeRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "platformFeeRate",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "allInterestToPlatform",
            type: "bool",
          },
        ],
        internalType: "struct MarketDetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "marketName",
        type: "string",
      },
    ],
    name: "getMarketDetailsByName",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "contract ITokenNameVerifier",
            name: "nameVerifier",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "numTokens",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "priceRise",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hatchTokens",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tradingFeeRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "platformFeeRate",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "allInterestToPlatform",
            type: "bool",
          },
        ],
        internalType: "struct MarketDetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "serviceToken",
        type: "address",
      },
    ],
    name: "getMarketDetailsByTokenAddress",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "contract ITokenNameVerifier",
            name: "nameVerifier",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "numTokens",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseCost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "priceRise",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hatchTokens",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tradingFeeRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "platformFeeRate",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "allInterestToPlatform",
            type: "bool",
          },
        ],
        internalType: "struct MarketDetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "marketName",
        type: "string",
      },
    ],
    name: "getMarketIDByName",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "getMarketIDByTokenAddress",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNumMarkets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "marketID",
        type: "uint256",
      },
    ],
    name: "getTokenIDByName",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "getTokenIDPair",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "marketID",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenID",
            type: "uint256",
          },
        ],
        internalType: "struct IDPair",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "marketID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
    ],
    name: "getTokenInfo",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "contract IServiceToken",
            name: "serviceToken",
            type: "address",
          },
        ],
        internalType: "struct TokenInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "marketID",
        type: "uint256",
      },
    ],
    name: "isValidTokenName",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "marketID",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "nameVerifier",
        type: "address",
      },
    ],
    name: "setNameVerifier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "marketID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "platformFeeRate",
        type: "uint256",
      },
    ],
    name: "setPlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "marketID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tradingFeeRate",
        type: "uint256",
      },
    ],
    name: "setTradingFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ITokenFactory__factory {
  static readonly abi = _abi;
  static createInterface(): ITokenFactoryInterface {
    return new utils.Interface(_abi) as ITokenFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITokenFactory {
    return new Contract(address, _abi, signerOrProvider) as ITokenFactory;
  }
}
