/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ControlledERC20,
  ControlledERC20Interface,
} from "../ControlledERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "_burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "_mint",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
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
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000ddf38038062000ddf8339810160408190526200003491620001db565b81516200004990600390602085019062000068565b5080516200005f90600490602084019062000068565b50505062000282565b828054620000769062000245565b90600052602060002090601f0160209004810192826200009a5760008555620000e5565b82601f10620000b557805160ff1916838001178555620000e5565b82800160010185558215620000e5579182015b82811115620000e5578251825591602001919060010190620000c8565b50620000f3929150620000f7565b5090565b5b80821115620000f35760008155600101620000f8565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200013657600080fd5b81516001600160401b03808211156200015357620001536200010e565b604051601f8301601f19908116603f011681019082821181831017156200017e576200017e6200010e565b816040528381526020925086838588010111156200019b57600080fd5b600091505b83821015620001bf5785820183015181830184015290820190620001a0565b83821115620001d15760008385830101525b9695505050505050565b60008060408385031215620001ef57600080fd5b82516001600160401b03808211156200020757600080fd5b620002158683870162000124565b935060208501519150808211156200022c57600080fd5b506200023b8582860162000124565b9150509250929050565b600181811c908216806200025a57607f821691505b602082108114156200027c57634e487b7160e01b600052602260045260246000fd5b50919050565b610b4d80620002926000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80634e6ec2471161008c57806395d89b411161006657806395d89b41146101db578063a457c2d7146101e3578063a9059cbb146101f6578063dd62ed3e1461020957600080fd5b80634e6ec2471461018c5780636161eb181461019f57806370a08231146101b257600080fd5b806323b872dd116100c857806323b872dd14610142578063313ce56714610155578063395093511461016457806340c10f191461017757600080fd5b806306fdde03146100ef578063095ea7b31461010d57806318160ddd14610130575b600080fd5b6100f7610242565b60405161010491906108dd565b60405180910390f35b61012061011b36600461094e565b6102d4565b6040519015158152602001610104565b6002545b604051908152602001610104565b610120610150366004610978565b6102ea565b60405160128152602001610104565b61012061017236600461094e565b610353565b61018a61018536600461094e565b610389565b005b61018a61019a36600461094e565b610397565b61018a6101ad36600461094e565b61047b565b6101346101c03660046109b4565b6001600160a01b031660009081526020819052604090205490565b6100f761057f565b6101206101f136600461094e565b61058e565b61012061020436600461094e565b6105dd565b6101346102173660046109cf565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b60606003805461025190610a02565b80601f016020809104026020016040519081016040528092919081815260200182805461027d90610a02565b80156102ca5780601f1061029f576101008083540402835291602001916102ca565b820191906000526020600020905b8154815290600101906020018083116102ad57829003601f168201915b5050505050905090565b60006102e13384846105ea565b50600192915050565b60006102f784848461070f565b610349843361034485604051806060016040528060288152602001610acb602891396001600160a01b038a1660009081526001602090815260408083203384529091529020549190610892565b6105ea565b5060019392505050565b3360008181526001602090815260408083206001600160a01b038716845290915281205490916102e191859061034490866108be565b6103938282610397565b5050565b6001600160a01b0382166103f25760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064015b60405180910390fd5b6002546103ff90826108be565b6002556001600160a01b03821660009081526020819052604090205461042590826108be565b6001600160a01b038316600081815260208181526040808320949094559251848152919290917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91015b60405180910390a35050565b6001600160a01b0382166104db5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016103e9565b61051881604051806060016040528060228152602001610a83602291396001600160a01b0385166000908152602081905260409020549190610892565b6001600160a01b03831660009081526020819052604090205560025461053e90826108d1565b6002556040518181526000906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200161046f565b60606004805461025190610a02565b60006102e1338461034485604051806060016040528060258152602001610af3602591393360009081526001602090815260408083206001600160a01b038d1684529091529020549190610892565b60006102e133848461070f565b6001600160a01b03831661064c5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016103e9565b6001600160a01b0382166106ad5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016103e9565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b6001600160a01b0383166107735760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016103e9565b6001600160a01b0382166107d55760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016103e9565b61081281604051806060016040528060268152602001610aa5602691396001600160a01b0386166000908152602081905260409020549190610892565b6001600160a01b03808516600090815260208190526040808220939093559084168152205461084190826108be565b6001600160a01b038381166000818152602081815260409182902094909455518481529092918616917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101610702565b600081848411156108b65760405162461bcd60e51b81526004016103e991906108dd565b505050900390565b60006108ca8284610a53565b9392505050565b60006108ca8284610a6b565b600060208083528351808285015260005b8181101561090a578581018301518582016040015282016108ee565b8181111561091c576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b038116811461094957600080fd5b919050565b6000806040838503121561096157600080fd5b61096a83610932565b946020939093013593505050565b60008060006060848603121561098d57600080fd5b61099684610932565b92506109a460208501610932565b9150604084013590509250925092565b6000602082840312156109c657600080fd5b6108ca82610932565b600080604083850312156109e257600080fd5b6109eb83610932565b91506109f960208401610932565b90509250929050565b600181811c90821680610a1657607f821691505b60208210811415610a3757634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b60008219821115610a6657610a66610a3d565b500190565b600082821015610a7d57610a7d610a3d565b50039056fe45524332303a206275726e20616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa264697066735822122022328bee89b621820a9f3a6394dd93fc50184b2775b0219dd40312ba77ea2f3964736f6c634300080a0033";

type ControlledERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ControlledERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ControlledERC20__factory extends ContractFactory {
  constructor(...args: ControlledERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ControlledERC20> {
    return super.deploy(
      name_,
      symbol_,
      overrides || {}
    ) as Promise<ControlledERC20>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  attach(address: string): ControlledERC20 {
    return super.attach(address) as ControlledERC20;
  }
  connect(signer: Signer): ControlledERC20__factory {
    return super.connect(signer) as ControlledERC20__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ControlledERC20Interface {
    return new utils.Interface(_abi) as ControlledERC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ControlledERC20 {
    return new Contract(address, _abi, signerOrProvider) as ControlledERC20;
  }
}