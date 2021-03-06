/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IServiceCollectModule,
  IServiceCollectModuleInterface,
} from "../IServiceCollectModule";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "profileId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pubId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "package",
        type: "uint8",
      },
    ],
    name: "emergencyReleaseDisputedFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "profileId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pubId",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "package",
        type: "uint8",
      },
    ],
    name: "releaseCollectedFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IServiceCollectModule__factory {
  static readonly abi = _abi;
  static createInterface(): IServiceCollectModuleInterface {
    return new utils.Interface(_abi) as IServiceCollectModuleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IServiceCollectModule {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IServiceCollectModule;
  }
}
