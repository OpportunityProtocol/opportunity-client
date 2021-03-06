/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  InterestManagerAave,
  InterestManagerAaveInterface,
} from "../InterestManagerAave";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "dai",
        type: "address",
      },
      {
        internalType: "address",
        name: "aDai",
        type: "address",
      },
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "invest",
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
        name: "investmentTokenAmount",
        type: "uint256",
      },
    ],
    name: "investmentTokenToUnderlying",
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
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "redeem",
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
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "redeemInvestmentToken",
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
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "underlyingAmount",
        type: "uint256",
      },
    ],
    name: "underlyingToInvestmentToken",
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

const _bytecode =
  "0x608060405234801561001057600080fd5b506109a1806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063d84d5e901161005b578063d84d5e90146100f6578063df6395ce146100f6578063f3e08e1f146100a2578063f8c8765e1461010757600080fd5b806313af40351461008d5780631e9a6950146100a25780632afcf480146100c8578063893d20e8146100db575b600080fd5b6100a061009b366004610859565b61011a565b005b6100b56100b0366004610874565b610126565b6040519081526020015b60405180910390f35b6100b56100d636600461089e565b610349565b6000546040516001600160a01b0390911681526020016100bf565b6100b561010436600461089e565b90565b6100a06101153660046108b7565b610622565b6101238161078c565b50565b6034546040516370a0823160e01b815230600482015260009182916001600160a01b03909116906370a0823190602401602060405180830381865afa158015610173573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610197919061090b565b603554603354604051631a4ca37b60e21b81526001600160a01b03918216600482015260248101879052878216604482015292935016906369328dec906064016020604051808303816000875af11580156101f6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061021a919061090b565b506034546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610264573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610288919061090b565b60335460405163a9059cbb60e01b81526001600160a01b0388811660048301526024820188905292935091169063a9059cbb906044016020604051808303816000875af11580156102dd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103019190610924565b6103415760405162461bcd60e51b815260206004820152600c60248201526b3230b496ba3930b739b332b960a11b60448201526064015b60405180910390fd5b949350505050565b6034546040516370a0823160e01b815230600482015260009182916001600160a01b03909116906370a0823190602401602060405180830381865afa158015610396573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ba919061090b565b6033546040516370a0823160e01b815230600482015291925084916001600160a01b03909116906370a0823190602401602060405180830381865afa158015610407573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061042b919061090b565b101561046c5760405162461bcd60e51b815260206004820152601060248201526f696e73756666696369656e742d64616960801b6044820152606401610338565b60335460355460405163095ea7b360e01b81526001600160a01b0391821660048201526024810186905291169063095ea7b3906044016020604051808303816000875af11580156104c1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104e59190610924565b6105285760405162461bcd60e51b81526020600482015260146024820152736461692d61617665706f6f6c2d617070726f766560601b6044820152606401610338565b60355460335460405163617ba03760e01b81526001600160a01b039182166004820152602481018690523060448201526000606482015291169063617ba03790608401600060405180830381600087803b15801561058557600080fd5b505af1158015610599573d6000803e3d6000fd5b50506034546040516370a0823160e01b8152306004820152600093506001600160a01b0390911691506370a0823190602401602060405180830381865afa1580156105e8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061060c919061090b565b9050610618818361082f565b925050505b919050565b600054600160a81b900460ff16806106395750303b155b8061064e5750600054600160a01b900460ff16155b6106905760405162461bcd60e51b8152602060048201526013602482015272185b1c9958591e4b5a5b9a5d1a585b1a5e9959606a1b6044820152606401610338565b600054600160a81b900460ff161580156106ba576000805461ffff60a01b191661010160a01b1790555b6001600160a01b038416158015906106da57506001600160a01b03831615155b80156106ee57506001600160a01b03821615155b61072b5760405162461bcd60e51b815260206004820152600e60248201526d696e76616c69642d706172616d7360901b6044820152606401610338565b6107348561078c565b603380546001600160a01b038087166001600160a01b0319928316179092556034805486841690831617905560358054928516929091169190911790558015610785576000805460ff60a81b191690555b5050505050565b6001600160a01b0381166107ce5760405162461bcd60e51b81526020600482015260096024820152683d32b93796b0b2323960b91b6044820152606401610338565b600080546001600160a01b038381166001600160a01b031983168117909355604080519190921680825260208201939093527f0384899bd253d83b23daa4d29aaa2efe0563d1132b43101e9ad667235aeb951b910160405180910390a15050565b600061083b8284610946565b9392505050565b80356001600160a01b038116811461061d57600080fd5b60006020828403121561086b57600080fd5b61083b82610842565b6000806040838503121561088757600080fd5b61089083610842565b946020939093013593505050565b6000602082840312156108b057600080fd5b5035919050565b600080600080608085870312156108cd57600080fd5b6108d685610842565b93506108e460208601610842565b92506108f260408601610842565b915061090060608601610842565b905092959194509250565b60006020828403121561091d57600080fd5b5051919050565b60006020828403121561093657600080fd5b8151801515811461083b57600080fd5b60008282101561096657634e487b7160e01b600052601160045260246000fd5b50039056fea2646970667358221220d60dbb46b2a4a5554fadb531ffb9e9d1387eeefdbd5f8990db44473c32189beb64736f6c634300080a0033";

type InterestManagerAaveConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: InterestManagerAaveConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class InterestManagerAave__factory extends ContractFactory {
  constructor(...args: InterestManagerAaveConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<InterestManagerAave> {
    return super.deploy(overrides || {}) as Promise<InterestManagerAave>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): InterestManagerAave {
    return super.attach(address) as InterestManagerAave;
  }
  connect(signer: Signer): InterestManagerAave__factory {
    return super.connect(signer) as InterestManagerAave__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): InterestManagerAaveInterface {
    return new utils.Interface(_abi) as InterestManagerAaveInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InterestManagerAave {
    return new Contract(address, _abi, signerOrProvider) as InterestManagerAave;
  }
}
