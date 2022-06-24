/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RelationshipFollowModule,
  RelationshipFollowModuleInterface,
} from "../RelationshipFollowModule";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_hub",
        type: "address",
      },
      {
        internalType: "address",
        name: "_governor",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InitParamsInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidConnectRequest",
    type: "error",
  },
  {
    inputs: [],
    name: "NotHub",
    type: "error",
  },
  {
    inputs: [],
    name: "HUB",
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
        name: "profileId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "followNFTTokenId",
        type: "uint256",
      },
    ],
    name: "followModuleTransferHook",
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
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "initializeFollowModule",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
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
        internalType: "address",
        name: "follower",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "followNFTTokenId",
        type: "uint256",
      },
    ],
    name: "isFollowing",
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
        internalType: "address",
        name: "follower",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "profileId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "processFollow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "profileIdToTrust",
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
];

const _bytecode =
  "0x60c060405234801561001057600080fd5b50604051610b2f380380610b2f83398101604081905261002f916100c8565b816001600160a01b038116610057576040516348be0eb360e01b815260040160405180910390fd5b6001600160a01b03811660808190526040514281527ff1a1fa6b64aa95186f5a1285e76198d0da80d9c5a88062641d447f1d7c54e56c9060200160405180910390a2506001600160a01b031660a052506100fb565b80516001600160a01b03811681146100c357600080fd5b919050565b600080604083850312156100db57600080fd5b6100e4836100ac565b91506100f2602084016100ac565b90509250929050565b60805160a0516109fa610135600039600061018901526000818161011a015281816102240152818161033801526104c501526109fa6000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80630e096ae1146100675780633cb22cc41461007c578063451c3d0c1461009057806390ebd814146100b85780639713958a146100f5578063a4c52b8614610115575b600080fd5b61007a610075366004610564565b610154565b005b61007a61008a3660046105c0565b50505050565b6100a361009e366004610608565b610315565b60405190151581526020015b60405180910390f35b6100e36100c6366004610640565b600060208181529281526040808220909352908152205460ff1681565b60405160ff90911681526020016100af565b610108610103366004610679565b6104b8565b6040516100af91906106f1565b61013c7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016100af565b60008061016383850185610724565b604051636641e37360e11b81526004810183905291935091506000906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cc83c6e6906024016000604051808303816000875af11580156101d2573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526101fa9190810190610854565b905060038160e00151600581111561021457610214610978565b1461021e57600080fd5b816000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316636352211e8a6040518263ffffffff1660e01b815260040161027091815260200190565b602060405180830381865afa15801561028d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102b1919061098e565b6001600160a01b03166001600160a01b031681526020019081526020016000206000896001600160a01b03166001600160a01b0316815260200190815260200160002060006101000a81548160ff021916908360ff16021790555050505050505050565b60405163a9ec656360e01b81526004810184905260009081906001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063a9ec656390602401602060405180830381865afa15801561037f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103a3919061098e565b90506001600160a01b0381166103bd5760009150506104b1565b8215610440576040516331a9108f60e11b8152600481018490526001600160a01b038086169190831690636352211e90602401602060405180830381865afa15801561040d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610431919061098e565b6001600160a01b0316146104ad565b6040516370a0823160e01b81526001600160a01b0385811660048301528216906370a0823190602401602060405180830381865afa158015610486573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104aa91906109ab565b15155b9150505b9392505050565b6060336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146104b1576040516313bd2e8360e31b815260040160405180910390fd5b6001600160a01b038116811461051857600080fd5b50565b60008083601f84011261052d57600080fd5b50813567ffffffffffffffff81111561054557600080fd5b60208301915083602082850101111561055d57600080fd5b9250929050565b6000806000806060858703121561057a57600080fd5b843561058581610503565b935060208501359250604085013567ffffffffffffffff8111156105a857600080fd5b6105b48782880161051b565b95989497509550505050565b600080600080608085870312156105d657600080fd5b8435935060208501356105e881610503565b925060408501356105f881610503565b9396929550929360600135925050565b60008060006060848603121561061d57600080fd5b83359250602084013561062f81610503565b929592945050506040919091013590565b6000806040838503121561065357600080fd5b823561065e81610503565b9150602083013561066e81610503565b809150509250929050565b60008060006040848603121561068e57600080fd5b83359250602084013567ffffffffffffffff8111156106ac57600080fd5b6106b88682870161051b565b9497909650939450505050565b60005b838110156106e05781810151838201526020016106c8565b8381111561008a5750506000910152565b60208152600082518060208401526107108160408501602087016106c5565b601f01601f19169190910160400192915050565b6000806040838503121561073757600080fd5b82359150602083013560ff8116811461066e57600080fd5b634e487b7160e01b600052604160045260246000fd5b6040516101a0810167ffffffffffffffff811182821017156107895761078961074f565b60405290565b805161079a81610503565b919050565b600082601f8301126107b057600080fd5b815167ffffffffffffffff808211156107cb576107cb61074f565b604051601f8301601f19908116603f011681019082821181831017156107f3576107f361074f565b8160405283815286602085880101111561080c57600080fd5b61081d8460208301602089016106c5565b9695505050505050565b80516006811061079a57600080fd5b80516003811061079a57600080fd5b80516002811061079a57600080fd5b60006020828403121561086657600080fd5b815167ffffffffffffffff8082111561087e57600080fd5b908301906101a0828603121561089357600080fd5b61089b610765565b6108a48361078f565b8152602083015160208201526108bc6040840161078f565b6040820152606083015160608201526108d76080840161078f565b60808201526108e860a0840161078f565b60a082015260c0830151828111156108ff57600080fd5b61090b8782860161079f565b60c08301525061091d60e08401610827565b60e08201526101009150610932828401610836565b828201526101209150610946828401610845565b918101919091526101408281015190820152610160808301519082015261018091820151918101919091529392505050565b634e487b7160e01b600052602160045260246000fd5b6000602082840312156109a057600080fd5b81516104b181610503565b6000602082840312156109bd57600080fd5b505191905056fea2646970667358221220b11b86815c2c9f8e3d46ff44f500d112f2571b1fe024ca28fec99f6857ce8cee64736f6c634300080a0033";

type RelationshipFollowModuleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RelationshipFollowModuleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RelationshipFollowModule__factory extends ContractFactory {
  constructor(...args: RelationshipFollowModuleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    _hub: string,
    _governor: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RelationshipFollowModule> {
    return super.deploy(
      _hub,
      _governor,
      overrides || {}
    ) as Promise<RelationshipFollowModule>;
  }
  getDeployTransaction(
    _hub: string,
    _governor: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_hub, _governor, overrides || {});
  }
  attach(address: string): RelationshipFollowModule {
    return super.attach(address) as RelationshipFollowModule;
  }
  connect(signer: Signer): RelationshipFollowModule__factory {
    return super.connect(signer) as RelationshipFollowModule__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RelationshipFollowModuleInterface {
    return new utils.Interface(_abi) as RelationshipFollowModuleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RelationshipFollowModule {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as RelationshipFollowModule;
  }
}