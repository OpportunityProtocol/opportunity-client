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
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface InterestManagerAaveInterface extends utils.Interface {
  functions: {
    "getOwner()": FunctionFragment;
    "initialize(address,address,address,address)": FunctionFragment;
    "invest(uint256)": FunctionFragment;
    "investmentTokenToUnderlying(uint256)": FunctionFragment;
    "redeem(address,uint256)": FunctionFragment;
    "redeemInvestmentToken(address,uint256)": FunctionFragment;
    "setOwner(address)": FunctionFragment;
    "underlyingToInvestmentToken(uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "invest",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "investmentTokenToUnderlying",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemInvestmentToken",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setOwner", values: [string]): string;
  encodeFunctionData(
    functionFragment: "underlyingToInvestmentToken",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "invest", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "investmentTokenToUnderlying",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "redeemInvestmentToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "underlyingToInvestmentToken",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipChanged(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipChanged"): EventFragment;
}

export type OwnershipChangedEvent = TypedEvent<
  [string, string],
  { oldOwner: string; newOwner: string }
>;

export type OwnershipChangedEventFilter =
  TypedEventFilter<OwnershipChangedEvent>;

export interface InterestManagerAave extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: InterestManagerAaveInterface;

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
    getOwner(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      owner: string,
      dai: string,
      aDai: string,
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    invest(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    investmentTokenToUnderlying(
      investmentTokenAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    redeem(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    redeemInvestmentToken(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    underlyingToInvestmentToken(
      underlyingAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  getOwner(overrides?: CallOverrides): Promise<string>;

  initialize(
    owner: string,
    dai: string,
    aDai: string,
    pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  invest(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  investmentTokenToUnderlying(
    investmentTokenAmount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  redeem(
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  redeemInvestmentToken(
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setOwner(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  underlyingToInvestmentToken(
    underlyingAmount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    getOwner(overrides?: CallOverrides): Promise<string>;

    initialize(
      owner: string,
      dai: string,
      aDai: string,
      pool: string,
      overrides?: CallOverrides
    ): Promise<void>;

    invest(amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    investmentTokenToUnderlying(
      investmentTokenAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeem(
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeemInvestmentToken(
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setOwner(newOwner: string, overrides?: CallOverrides): Promise<void>;

    underlyingToInvestmentToken(
      underlyingAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "OwnershipChanged(address,address)"(
      oldOwner?: null,
      newOwner?: null
    ): OwnershipChangedEventFilter;
    OwnershipChanged(
      oldOwner?: null,
      newOwner?: null
    ): OwnershipChangedEventFilter;
  };

  estimateGas: {
    getOwner(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      owner: string,
      dai: string,
      aDai: string,
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    invest(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    investmentTokenToUnderlying(
      investmentTokenAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeem(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    redeemInvestmentToken(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    underlyingToInvestmentToken(
      underlyingAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      owner: string,
      dai: string,
      aDai: string,
      pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    invest(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    investmentTokenToUnderlying(
      investmentTokenAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    redeem(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    redeemInvestmentToken(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    underlyingToInvestmentToken(
      underlyingAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
