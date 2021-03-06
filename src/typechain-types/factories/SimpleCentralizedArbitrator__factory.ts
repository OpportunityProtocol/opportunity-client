/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SimpleCentralizedArbitrator,
  SimpleCentralizedArbitratorInterface,
} from "../SimpleCentralizedArbitrator";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_available",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_required",
        type: "uint256",
      },
    ],
    name: "InsufficientPayment",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ruling",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_numberOfChoices",
        type: "uint256",
      },
    ],
    name: "InvalidRuling",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "enum IArbitrator.DisputeStatus",
        name: "_current",
        type: "uint8",
      },
      {
        internalType: "enum IArbitrator.DisputeStatus",
        name: "_expected",
        type: "uint8",
      },
    ],
    name: "InvalidStatus",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOwner",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "contract IArbitrable",
        name: "_arbitrable",
        type: "address",
      },
    ],
    name: "AppealDecision",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "contract IArbitrable",
        name: "_arbitrable",
        type: "address",
      },
    ],
    name: "AppealPossible",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "contract IArbitrable",
        name: "_arbitrable",
        type: "address",
      },
    ],
    name: "DisputeCreation",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_extraData",
        type: "bytes",
      },
    ],
    name: "appeal",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_extraData",
        type: "bytes",
      },
    ],
    name: "appealCost",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
    ],
    name: "appealPeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_extraData",
        type: "bytes",
      },
    ],
    name: "arbitrationCost",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_choices",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_extraData",
        type: "bytes",
      },
    ],
    name: "createDispute",
    outputs: [
      {
        internalType: "uint256",
        name: "disputeID",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
    ],
    name: "currentRuling",
    outputs: [
      {
        internalType: "uint256",
        name: "ruling",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
    ],
    name: "disputeStatus",
    outputs: [
      {
        internalType: "enum IArbitrator.DisputeStatus",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "disputes",
    outputs: [
      {
        internalType: "contract IArbitrable",
        name: "arbitrated",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "choices",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ruling",
        type: "uint256",
      },
      {
        internalType: "enum IArbitrator.DisputeStatus",
        name: "status",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
        internalType: "uint256",
        name: "_disputeID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ruling",
        type: "uint256",
      },
    ],
    name: "rule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052600080546001600160a01b0319163317905534801561002257600080fd5b50610893806100326000396000f3fe6080604052600436106100915760003560e01c80638da5cb5b116100595780638da5cb5b1461015f578063afe15cfb14610197578063c13517e1146101cf578063f23f16e6146101e2578063f7434ea91461020257600080fd5b806310f169e8146100965780631c3db16d146100cc578063311a6c56146100fa57806349912f881461011c578063564a565d1461012f575b600080fd5b3480156100a257600080fd5b506100b66100b1366004610624565b61022a565b6040516100c39190610675565b60405180910390f35b3480156100d857600080fd5b506100ec6100e7366004610624565b61025c565b6040519081526020016100c3565b34801561010657600080fd5b5061011a610115366004610683565b61028a565b005b61011a61012a366004610748565b61040a565b34801561013b57600080fd5b5061014f61014a366004610624565b610447565b6040516100c3949392919061078f565b34801561016b57600080fd5b5060005461017f906001600160a01b031681565b6040516001600160a01b0390911681526020016100c3565b3480156101a357600080fd5b506101ba6101b2366004610624565b506000908190565b604080519283526020830191909152016100c3565b6100ec6101dd366004610748565b61048e565b3480156101ee57600080fd5b506100ec6101fd366004610748565b610618565b34801561020e57600080fd5b506100ec61021d3660046107c3565b5067016345785d8a000090565b60006001828154811061023f5761023f610800565b600091825260209091206003600490920201015460ff1692915050565b60006001828154811061027157610271610800565b9060005260206000209060040201600201549050919050565b6000546001600160a01b031633146102b5576040516330cd747160e01b815260040160405180910390fd5b6000600183815481106102ca576102ca610800565b906000526020600020906004020190508060010154821115610318576001810154604051635babddd760e01b815261030f918491600401918252602082015260400190565b60405180910390fd5b6000600382015460ff1660028111156103335761033361063d565b1461035d57600381015460405163f924664d60e01b815261030f9160ff1690600090600401610816565b600281810183905560038201805460ff1916909117905560408051602081018252600090819052905133919067016345785d8a00009082818181858883f15050835460405163188d362b60e11b815260048101889052602481018790526001600160a01b03909116935063311a6c5692506044019050600060405180830381600087803b1580156103ed57600080fd5b505af1158015610401573d6000803e3d6000fd5b50505050505050565b60006104168383610618565b9050803410156104425760405163b99e2ab760e01b81523460048201526024810182905260440161030f565b505050565b6001818154811061045757600080fd5b600091825260209091206004909102018054600182015460028301546003909301546001600160a01b039092169350919060ff1684565b600067016345785d8a0000348111156104c35760405163b99e2ab760e01b81523460048201526024810182905260440161030f565b604080516080810182523381526020810186815260009282018381526060830184815260018054808201825595819052845160049096027fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6810180546001600160a01b039098166001600160a01b031990981697909717875593517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf785015591517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf8840155517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf99092018054939493909160ff19909116908360028111156105cd576105cd61063d565b021790555050600180546105e19250610838565b604051909250339083907f141dfc18aa6a56fc816f44f0e9e2f1ebc92b15ab167770e17db5b084c10ed99590600090a35092915050565b600160fa1b5b92915050565b60006020828403121561063657600080fd5b5035919050565b634e487b7160e01b600052602160045260246000fd5b6003811061067157634e487b7160e01b600052602160045260246000fd5b9052565b6020810161061e8284610653565b6000806040838503121561069657600080fd5b50508035926020909101359150565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126106cc57600080fd5b813567ffffffffffffffff808211156106e7576106e76106a5565b604051601f8301601f19908116603f0116810190828211818310171561070f5761070f6106a5565b8160405283815286602085880101111561072857600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806040838503121561075b57600080fd5b82359150602083013567ffffffffffffffff81111561077957600080fd5b610785858286016106bb565b9150509250929050565b6001600160a01b03851681526020810184905260408101839052608081016107ba6060830184610653565b95945050505050565b6000602082840312156107d557600080fd5b813567ffffffffffffffff8111156107ec57600080fd5b6107f8848285016106bb565b949350505050565b634e487b7160e01b600052603260045260246000fd5b604081016108248285610653565b6108316020830184610653565b9392505050565b60008282101561085857634e487b7160e01b600052601160045260246000fd5b50039056fea2646970667358221220e4f72bbd31c94745d7863bf6681175bfef3784820a7ac8cb230783979c8ad74a64736f6c634300080a0033";

type SimpleCentralizedArbitratorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SimpleCentralizedArbitratorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SimpleCentralizedArbitrator__factory extends ContractFactory {
  constructor(...args: SimpleCentralizedArbitratorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SimpleCentralizedArbitrator> {
    return super.deploy(
      overrides || {}
    ) as Promise<SimpleCentralizedArbitrator>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): SimpleCentralizedArbitrator {
    return super.attach(address) as SimpleCentralizedArbitrator;
  }
  connect(signer: Signer): SimpleCentralizedArbitrator__factory {
    return super.connect(signer) as SimpleCentralizedArbitrator__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SimpleCentralizedArbitratorInterface {
    return new utils.Interface(_abi) as SimpleCentralizedArbitratorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SimpleCentralizedArbitrator {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as SimpleCentralizedArbitrator;
  }
}
