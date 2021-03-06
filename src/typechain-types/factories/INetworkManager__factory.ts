/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  INetworkManager,
  INetworkManagerInterface,
} from "../INetworkManager";

const _abi = [
  {
    inputs: [],
    name: "getProtocolFee",
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
];

export class INetworkManager__factory {
  static readonly abi = _abi;
  static createInterface(): INetworkManagerInterface {
    return new utils.Interface(_abi) as INetworkManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): INetworkManager {
    return new Contract(address, _abi, signerOrProvider) as INetworkManager;
  }
}
