/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type MarketDetailsStruct = {
  exists: boolean;
  id: BigNumberish;
  name: string;
  nameVerifier: string;
  numTokens: BigNumberish;
  baseCost: BigNumberish;
  priceRise: BigNumberish;
  hatchTokens: BigNumberish;
  tradingFeeRate: BigNumberish;
  platformFeeRate: BigNumberish;
  allInterestToPlatform: boolean;
};

export type MarketDetailsStructOutput = [
  boolean,
  BigNumber,
  string,
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean
] & {
  exists: boolean;
  id: BigNumber;
  name: string;
  nameVerifier: string;
  numTokens: BigNumber;
  baseCost: BigNumber;
  priceRise: BigNumber;
  hatchTokens: BigNumber;
  tradingFeeRate: BigNumber;
  platformFeeRate: BigNumber;
  allInterestToPlatform: boolean;
};

export type CostAndPriceAmountsStruct = {
  total: BigNumberish;
  raw: BigNumberish;
  tradingFee: BigNumberish;
  platformFee: BigNumberish;
};

export type CostAndPriceAmountsStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  total: BigNumber;
  raw: BigNumber;
  tradingFee: BigNumber;
  platformFee: BigNumber;
};

export interface ITokenExchangeInterface extends utils.Interface {
  functions: {
    "buyTokens(address,uint256,uint256,uint256,address)": FunctionFragment;
    "getCostForBuyingTokens(address,uint256)": FunctionFragment;
    "getCostsForBuyingTokens((bool,uint256,string,address,uint256,uint256,uint256,uint256,uint256,uint256,bool),uint256,uint256,bool)": FunctionFragment;
    "getInterestPayable(address)": FunctionFragment;
    "getPlatformFeePayable(uint256)": FunctionFragment;
    "getPlatformInterestPayable(uint256)": FunctionFragment;
    "getPriceForSellingTokens(address,uint256)": FunctionFragment;
    "getPricesForSellingTokens((bool,uint256,string,address,uint256,uint256,uint256,uint256,uint256,uint256,bool),uint256,uint256,bool)": FunctionFragment;
    "getTradingFeePayable()": FunctionFragment;
    "isTokenFeeDisabled(address)": FunctionFragment;
    "sellTokens(address,uint256,uint256,address)": FunctionFragment;
    "setAuthorizer(address)": FunctionFragment;
    "setPlatformOwner(uint256,address)": FunctionFragment;
    "setTokenFeeKillswitch(address,bool)": FunctionFragment;
    "setTokenOwner(address,address)": FunctionFragment;
    "withdrawPlatformFee(uint256)": FunctionFragment;
    "withdrawPlatformInterest(uint256)": FunctionFragment;
    "withdrawTokenInterest(address)": FunctionFragment;
    "withdrawTradingFee()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "buyTokens",
    values: [string, BigNumberish, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getCostForBuyingTokens",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCostsForBuyingTokens",
    values: [MarketDetailsStruct, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getInterestPayable",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPlatformFeePayable",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPlatformInterestPayable",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPriceForSellingTokens",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPricesForSellingTokens",
    values: [MarketDetailsStruct, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getTradingFeePayable",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isTokenFeeDisabled",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "sellTokens",
    values: [string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setAuthorizer",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setPlatformOwner",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenFeeKillswitch",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenOwner",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawPlatformFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawPlatformInterest",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTokenInterest",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTradingFee",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "buyTokens", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCostForBuyingTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCostsForBuyingTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInterestPayable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPlatformFeePayable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPlatformInterestPayable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPriceForSellingTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPricesForSellingTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTradingFeePayable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isTokenFeeDisabled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sellTokens", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setAuthorizer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPlatformOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenFeeKillswitch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawPlatformFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawPlatformInterest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawTokenInterest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawTradingFee",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ITokenExchange extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ITokenExchangeInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    buyTokens(
      serviceToken: string,
      amount: BigNumberish,
      fallbackAmount: BigNumberish,
      cost: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getCostForBuyingTokens(
      serviceToken: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getCostsForBuyingTokens(
      marketDetails: MarketDetailsStruct,
      supply: BigNumberish,
      amount: BigNumberish,
      feesDisabled: boolean,
      overrides?: CallOverrides
    ): Promise<[CostAndPriceAmountsStructOutput]>;

    getInterestPayable(
      token: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPlatformFeePayable(
      marketID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPlatformInterestPayable(
      marketID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPriceForSellingTokens(
      serviceToken: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPricesForSellingTokens(
      marketDetails: MarketDetailsStruct,
      supply: BigNumberish,
      amount: BigNumberish,
      feesDisabled: boolean,
      overrides?: CallOverrides
    ): Promise<[CostAndPriceAmountsStructOutput]>;

    getTradingFeePayable(overrides?: CallOverrides): Promise<[BigNumber]>;

    isTokenFeeDisabled(
      serviceToken: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    sellTokens(
      serviceToken: string,
      amount: BigNumberish,
      minPrice: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAuthorizer(
      authorizer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPlatformOwner(
      marketID: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTokenFeeKillswitch(
      serviceToken: string,
      set: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTokenOwner(
      serviceToken: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawPlatformFee(
      marketID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawPlatformInterest(
      marketID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawTokenInterest(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawTradingFee(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  buyTokens(
    serviceToken: string,
    amount: BigNumberish,
    fallbackAmount: BigNumberish,
    cost: BigNumberish,
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getCostForBuyingTokens(
    serviceToken: string,
    amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getCostsForBuyingTokens(
    marketDetails: MarketDetailsStruct,
    supply: BigNumberish,
    amount: BigNumberish,
    feesDisabled: boolean,
    overrides?: CallOverrides
  ): Promise<CostAndPriceAmountsStructOutput>;

  getInterestPayable(
    token: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPlatformFeePayable(
    marketID: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPlatformInterestPayable(
    marketID: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPriceForSellingTokens(
    serviceToken: string,
    amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPricesForSellingTokens(
    marketDetails: MarketDetailsStruct,
    supply: BigNumberish,
    amount: BigNumberish,
    feesDisabled: boolean,
    overrides?: CallOverrides
  ): Promise<CostAndPriceAmountsStructOutput>;

  getTradingFeePayable(overrides?: CallOverrides): Promise<BigNumber>;

  isTokenFeeDisabled(
    serviceToken: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  sellTokens(
    serviceToken: string,
    amount: BigNumberish,
    minPrice: BigNumberish,
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAuthorizer(
    authorizer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPlatformOwner(
    marketID: BigNumberish,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTokenFeeKillswitch(
    serviceToken: string,
    set: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTokenOwner(
    serviceToken: string,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawPlatformFee(
    marketID: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawPlatformInterest(
    marketID: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawTokenInterest(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawTradingFee(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    buyTokens(
      serviceToken: string,
      amount: BigNumberish,
      fallbackAmount: BigNumberish,
      cost: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    getCostForBuyingTokens(
      serviceToken: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getCostsForBuyingTokens(
      marketDetails: MarketDetailsStruct,
      supply: BigNumberish,
      amount: BigNumberish,
      feesDisabled: boolean,
      overrides?: CallOverrides
    ): Promise<CostAndPriceAmountsStructOutput>;

    getInterestPayable(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPlatformFeePayable(
      marketID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPlatformInterestPayable(
      marketID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPriceForSellingTokens(
      serviceToken: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPricesForSellingTokens(
      marketDetails: MarketDetailsStruct,
      supply: BigNumberish,
      amount: BigNumberish,
      feesDisabled: boolean,
      overrides?: CallOverrides
    ): Promise<CostAndPriceAmountsStructOutput>;

    getTradingFeePayable(overrides?: CallOverrides): Promise<BigNumber>;

    isTokenFeeDisabled(
      serviceToken: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    sellTokens(
      serviceToken: string,
      amount: BigNumberish,
      minPrice: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setAuthorizer(authorizer: string, overrides?: CallOverrides): Promise<void>;

    setPlatformOwner(
      marketID: BigNumberish,
      owner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenFeeKillswitch(
      serviceToken: string,
      set: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenOwner(
      serviceToken: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawPlatformFee(
      marketID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawPlatformInterest(
      marketID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawTokenInterest(
      token: string,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawTradingFee(overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    buyTokens(
      serviceToken: string,
      amount: BigNumberish,
      fallbackAmount: BigNumberish,
      cost: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getCostForBuyingTokens(
      serviceToken: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getCostsForBuyingTokens(
      marketDetails: MarketDetailsStruct,
      supply: BigNumberish,
      amount: BigNumberish,
      feesDisabled: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getInterestPayable(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPlatformFeePayable(
      marketID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPlatformInterestPayable(
      marketID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPriceForSellingTokens(
      serviceToken: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPricesForSellingTokens(
      marketDetails: MarketDetailsStruct,
      supply: BigNumberish,
      amount: BigNumberish,
      feesDisabled: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTradingFeePayable(overrides?: CallOverrides): Promise<BigNumber>;

    isTokenFeeDisabled(
      serviceToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    sellTokens(
      serviceToken: string,
      amount: BigNumberish,
      minPrice: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAuthorizer(
      authorizer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPlatformOwner(
      marketID: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTokenFeeKillswitch(
      serviceToken: string,
      set: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTokenOwner(
      serviceToken: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawPlatformFee(
      marketID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawPlatformInterest(
      marketID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawTokenInterest(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawTradingFee(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buyTokens(
      serviceToken: string,
      amount: BigNumberish,
      fallbackAmount: BigNumberish,
      cost: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getCostForBuyingTokens(
      serviceToken: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getCostsForBuyingTokens(
      marketDetails: MarketDetailsStruct,
      supply: BigNumberish,
      amount: BigNumberish,
      feesDisabled: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getInterestPayable(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPlatformFeePayable(
      marketID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPlatformInterestPayable(
      marketID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPriceForSellingTokens(
      serviceToken: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPricesForSellingTokens(
      marketDetails: MarketDetailsStruct,
      supply: BigNumberish,
      amount: BigNumberish,
      feesDisabled: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTradingFeePayable(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTokenFeeDisabled(
      serviceToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    sellTokens(
      serviceToken: string,
      amount: BigNumberish,
      minPrice: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAuthorizer(
      authorizer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPlatformOwner(
      marketID: BigNumberish,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTokenFeeKillswitch(
      serviceToken: string,
      set: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTokenOwner(
      serviceToken: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawPlatformFee(
      marketID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawPlatformInterest(
      marketID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawTokenInterest(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawTradingFee(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}