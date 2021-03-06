/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestComptroller,
  TestComptrollerInterface,
} from "../TestComptroller";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "holder",
        type: "address",
      },
    ],
    name: "claimComp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052348015600f57600080fd5b5060a18061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063e9af029214602d575b600080fd5b603b6038366004603d565b50565b005b600060208284031215604e57600080fd5b81356001600160a01b0381168114606457600080fd5b939250505056fea26469706673582212206eeab45ecc28c6c4a9ef240b1a10cd94a9b4b73c2890e6bfd3b12b13220505fd64736f6c634300080a0033";

type TestComptrollerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestComptrollerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestComptroller__factory extends ContractFactory {
  constructor(...args: TestComptrollerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestComptroller> {
    return super.deploy(overrides || {}) as Promise<TestComptroller>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TestComptroller {
    return super.attach(address) as TestComptroller;
  }
  connect(signer: Signer): TestComptroller__factory {
    return super.connect(signer) as TestComptroller__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestComptrollerInterface {
    return new utils.Interface(_abi) as TestComptrollerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestComptroller {
    return new Contract(address, _abi, signerOrProvider) as TestComptroller;
  }
}
