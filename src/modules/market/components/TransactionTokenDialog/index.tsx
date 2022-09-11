import React, { FC, useState, useEffect, ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Table,
  FormControl,
  Typography,
  Divider,
  Avatar,
  Box,
  Tabs,
  Tab,
  TextField,
  FormHelperText,
  Stack,
  styled,
  Paper,
  IconButton,
  Menu,
  InputBase,
  Theme,
  CardContent,
  CircularProgress,
  Chip,
} from "@mui/material";
import VerifiedAvatar from "../../../user/components/VerifiedAvatar";
import TabPanel from "../../../../common/components/TabPanel/TabPanel";

import {
  useContractRead,
  useContractWrite,
  useFeeData,
  usePrepareContractWrite,
  useProvider,
  useSigner,
} from "wagmi";
import {
  DAI_ADDRESS,
  NETWORK_MANAGER_ADDRESS,
  TOKEN_EXCHANGE_ADDRESS,
  TOKEN_FACTORY_ADDRESS,
  ZERO_ADDRESS,
} from "../../../../constant";
import {
  DaiInterface,
  ERC20Interface,
  NetworkManagerInterface,
  TokenExchangeInterface,
  TokenFactoryInterface,
} from "../../../../abis";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../../../user/userReduxSlice";
import { Result } from "ethers/lib/utils";
import { BigNumber, BigNumberish } from "ethers";
import { hexToDecimal } from "../../../../common/helper";
import { CHAIN_ID } from "../../../../constant/provider";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_SERVICE_BY_ID } from "../../../contract/ContractGQLQueries";
import { a11yProps } from "../../../../common/components/TabPanel/helper";
import { ethers } from "ethers";
import {
  GET_MARKET_DETAILS_BY_ID,
  GET_TOKEN_INFO_BY_SERVICE_ID,
} from "../../MarketGQLQueries";
import Countdown from "react-countdown";
import { Directions, Refresh, Search, SwapVert } from "@mui/icons-material";
import { FaChevronDown, FaEthereum } from "react-icons/fa";

import TokenSelectInput from "../TokenSelectionInput";

interface ITransactionDialogProps {
  open: boolean;
  handleClose: () => void;
}

interface ITransactionDialogInfoProps {
  serviceId: BigNumberish;
}

const TransactionTokenDialog: FC<
  ITransactionDialogProps & ITransactionDialogInfoProps
> = ({ open = true, handleClose, serviceId = -1 }) => {
  const [tokenPriceRefreshCounter, setTokenPriceRefreshCounter] =
    useState("0.00");
  const [tabValue, setTabValue] = useState<number>(0);
  const [numTokens, setNumTokensToPurchase] = useState<any>(0);
  const [costForBuying, setCostForBuying] = useState<any>(0);
  const [returnFromSelling, setCostForSelling] = useState<any>(0);
  const [fallbackAmount, setFallbackAmount] = useState<number>(300);
  const [desiredCost, setDesiredCost] = useState<number>(500);
  const [protocolFee, setProtocolFee] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(Date.now() + 30000);
  const [tokenMarketDetails, setTokenMarketDetails] = useState<any>({});
  const [tokenSupply, setTokenSupply] = useState<any>(0);
  const signer = useSigner()
  const [balanceOf, setBalance] = useState<number>(0)

  const [buyingEnabled, setBuyingEnabled] = useState<boolean>(false)
  const feeData = useFeeData();

  const [tokenInfo, setTokenInfo] = useState<any>({
    exists: false,
    id: -1,
    name: "",
    serviceToken: ZERO_ADDRESS,
    address: ZERO_ADDRESS
  });


  const [serviceData, setServiceData] = useState<any>({});

  const serviceDataQuery = useQuery(GET_SERVICE_BY_ID, {
    variables: {
      serviceId: serviceId,
    },
  });

  const tokenAddress = tokenInfo?.address

  useEffect(() => {
    if (!serviceDataQuery.loading && serviceDataQuery.data) {
      setServiceData(serviceDataQuery.data.service);
    }
  }, [serviceDataQuery.loading]);

  const userAddress = useSelector(selectUserAddress);

  useEffect(() => {
    networkManager_getProtocolFee.refetch();
  }, []);

  useEffect(() => {
    if (serviceId >= 0) {
      serviceDataQuery.refetch();
      tokenInfoQuery.refetch();
      serviceCollectModule_isFamiliar.refetch()
    }
  }, [serviceId]);

  useEffect(() => {
    if (Number(serviceData?.marketId) && serviceId >= -1) {
      tokenFactory_getMarketsDetailsById.refetch();
    }
  }, [serviceData?.marketId, serviceId]);

  const networkManager_getProtocolFee = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    functionName: "getProtocolFee",
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      args: [],
      onSuccess(data: Result) {
        setProtocolFee(hexToDecimal(data._hex));
      },
    }
  );

  const tokenExchange_buyTokensPrepare = usePrepareContractWrite(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface,
    functionName: "buyTokens",
      args: [
        tokenAddress,
        numTokens,
        fallbackAmount,
        desiredCost,
        userAddress,
      ],
      overrides: {
        gasLimit: BigNumber.from("900000"),
      },
    }
  )

  const tokenExchange_buyTokens = useContractWrite(tokenExchange_buyTokensPrepare.config);

  const onBuy = async () => {
    await dai_approve.writeAsync().then(() => {
      tokenExchange_buyTokens.write();
    })
  }

  const tokenExchange_sellTokensPrepare = usePrepareContractWrite(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface,
    functionName: "sellTokens",
      args: [tokenAddress, numTokens, 0, userAddress],
      overrides: {
        gasLimit: BigNumber.from("900000"),
      },
    }
  )

  const tokenExchange_sellTokens = useContractWrite(tokenExchange_sellTokensPrepare.config);

  const tokenExchange_getCostForBuyingTokens = useContractRead(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface,
    functionName: "getCostForBuyingTokens",
      args: [tokenAddress, numTokens],
      enabled: false,
      watch: false,
      cacheTime: 30000,
      chainId: CHAIN_ID,
      overrides: {
        gasLimit: BigNumber.from("900000"),
      },
      onSuccess(data) {
        setCostForBuying(hexToDecimal(data._hex));
      },
    }
  );

  const serviceCollectModule_isFamiliar = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
      functionName: "isFamiliar",
      args: [userAddress, serviceId],
      enabled: true,
      watch: true,
      cacheTime: 30000,
      chainId: CHAIN_ID,
      overrides: {
        gasLimit: BigNumber.from("900000"),
      },
      onSuccess(data) {
        setBuyingEnabled(true)
      },
      onError(err) {
        setBuyingEnabled(true)
      },
    }
  )

  const marketDetailsQuery: QueryResult = useQuery(GET_MARKET_DETAILS_BY_ID, {
    variables: {
      id: Number(serviceData?.marketId),
    },
  });

  const tokenInfoQuery: QueryResult = useQuery(GET_TOKEN_INFO_BY_SERVICE_ID, {
    variables: {
      serviceId: Number(serviceId),
      id: Number(serviceId),
    },
  });

  useEffect(() => {
    if (!tokenInfoQuery.loading && tokenInfoQuery.data) {
      setTokenInfo(tokenInfoQuery.data.serviceTokens[0]);
      getBalance()
    }
  }, [tokenInfoQuery.loading]);


  useEffect(() => {
    if (!marketDetailsQuery.loading && marketDetailsQuery.data) {
      setTokenMarketDetails(marketDetailsQuery.data.market);
    }
  }, [marketDetailsQuery.loading]);

  const tokenExchange_getPriceForSellingTokens = useContractRead(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface,
    functionName: "getPriceForSellingTokens",
      args: [tokenAddress, numTokens],
      enabled: false,
      watch: false,
      cacheTime: 30000,
      chainId: CHAIN_ID,
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },
      onSuccess(data) {
        setCostForSelling(hexToDecimal(data._hex));
      },
      onError(err) {
     
      },
    }
  );

  const tokenFactory_getMarketsDetailsById = useContractRead(
    {
      addressOrName: TOKEN_FACTORY_ADDRESS,
      contractInterface: TokenFactoryInterface,
    functionName: "getMarketDetailsByID",
      args: [Number(serviceData?.marketId)],
      enabled: false,
      watch: false,
      cacheTime: 30000,
      chainId: CHAIN_ID,
      overrides: {
        gasLimit: BigNumber.from("900000"),
      },
      onSuccess(data) {
        setTokenMarketDetails(data);
      },
      onError(err) {

      },
    }
  );

  const dai_approvePrepare = usePrepareContractWrite(
    {
      addressOrName: DAI_ADDRESS,
      contractInterface: DaiInterface,
    functionName: "approve",
      args: [TOKEN_EXCHANGE_ADDRESS, costForBuying + 100],
    }
  )

  const dai_approve = useContractWrite(dai_approvePrepare.config);

  const handleOnChangeNumTokensToBuy = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNumTokensToPurchase(e.target.value);
  };

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      event.preventDefault();

      if (tokenAddress != ZERO_ADDRESS && numTokens > 0) {
        tokenExchange_getCostForBuyingTokens.refetch();
      }
    }
  };

  const onKeyDownSellHandler = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.code === "Enter") {
      event.preventDefault();

      if (numTokens > balanceOf) {
        alert('Insufficient balance')
        return
      }

      if (tokenAddress != ZERO_ADDRESS && numTokens > 0) {
        tokenExchange_getPriceForSellingTokens.refetch();
      }
    }
  };

  const handleOnChangeTab = (e, newValue: number) => {
    setTabValue(newValue);
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      )
    } else {
      // Render a countdown
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };


  const getBalance = async () => {
    if (tokenAddress != ZERO_ADDRESS) {
    setBalance(await new ethers.Contract(tokenAddress, DaiInterface, signer.data.provider).balanceOf(userAddress))
    }
  }
  
  const onRefresh = () => {
    switch(tabValue) {
      case 0:
        getBalance()
        networkManager_getProtocolFee.refetch();
      case 1:
        getBalance()
        networkManager_getProtocolFee.refetch();
        tokenExchange_getPriceForSellingTokens.refetch();
      default:
        getBalance()
    }
  }

  return (
    <Dialog maxWidth="sm" open={open} onClose={handleClose} sx={{}}>
      <Box
        textAlign="center"
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <DialogTitle> Earn passive income from quality freelancers</DialogTitle>
        <DialogContent>
          <DialogContentText fontWeight="medium" maxWidth={450}>
            Invest in high quality services from verified freelancers. Earn as
            the quality of their service goes up.
          </DialogContentText>
        </DialogContent>

        <VerifiedAvatar />
      </Box>

      <DialogContent>
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={tabValue}
            onChange={handleOnChangeTab}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab {...a11yProps(0)} label="Buy tokens" />
            <Tab {...a11yProps(1)} label="Sell tokens" />
          </Tabs>
          <Divider sx={{ borderBottom: "1px solid #ddd" }} />
        </Box>
        <Stack mt={1}>
          <Chip onClick={onRefresh} sx={{ width: '100px' }} icon={<Refresh />} size='small' label='Refresh' />
        </Stack>
        <TabPanel index={0} value={tabValue}>
          <Stack spacing={2}>
            <Stack alignItems="center" spacing={1}>
              <Box>
                <TokenSelectInput
                  instruction="Enter an amount and submit to get cost"
                  onChange={handleOnChangeNumTokensToBuy}
                  value={numTokens}
                  placeholder="0"
                  onKeyDownHandler={onKeyDownHandler}
                />
              </Box>

              <Paper
                sx={{
                  zIndex: 100,
                  width: 35,
                  height: 35,
                  borderRadius: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton disabled>
                  <SwapVert color="primary" />
                </IconButton>
              </Paper>

              <Box>
                <TokenSelectInput
                  instruction={`${numTokens} X token will cost`}
                  placeholder="0"
                  disabled
                  value={costForBuying}
                />
              </Box>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography fontSize={14} fontWeight="700">
                Slippage Tollerance
              </Typography>
              <Typography fontSize={14} fontWeight="bold">
                4.0
              </Typography>
            </Stack>

            <Divider />

            <Box>
              <Typography variant="subtitle2" pb={1.5}>
                Purchase Summary
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  height: "auto",
                  borderRadius: 2,
                  bgcolor: "rgb(246, 247, 249)",
                  border: "1px solid #eee",
                  width: "100%",
                }}
              >
                <Stack py={0.5} direction='row' alignItems='center' justifyContent='space-between'>
                  <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    Cost
                  </Typography>

                  <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    {costForBuying} DAI
                  </Typography>
                </Stack>

                <Stack py={0.5} direction='row' alignItems='center' justifyContent='space-between'>
                <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    Protocol Fee
                  </Typography>

                  <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    {protocolFee} DAI
                  </Typography>
                </Stack>

                <Stack py={0.5} direction='row' alignItems='center' justifyContent='space-between'>
                <Typography fontSize={12} fontWeight='bold' color='#212121'>
                    Total Cost
                  </Typography>

                  <Typography fontSize={12} fontWeight='bold' color='#212121'>
                  {costForBuying + protocolFee} DAI
                  </Typography>
                </Stack>

                <Divider />

                <Stack py={0.5} direction='row' alignItems='center' justifyContent='space-between'>
                <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    Gas fee
                  </Typography>

                  <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    ~{feeData?.data?.formatted?.gasPrice}
                  </Typography>
                </Stack>
              </Paper>
              <Typography variant="caption">
                Prices, fees and balance will refresh in {" "}
                <Countdown
                  onComplete={() => {
                    getBalance()
                    networkManager_getProtocolFee.refetch();
                    tokenExchange_getPriceForSellingTokens.refetch();
                    setCountdown(Date.now() + 30000);
                  }}
                  date={countdown}
                  renderer={renderer}
                />{" "}
                seconds
              </Typography>
            </Box>

            <Button
              disabled={!buyingEnabled}
              variant="contained"
              onClick={onBuy}
            >
              Purchase {numTokens} tokens
            </Button>
          </Stack>
        </TabPanel>

        <TabPanel index={1} value={tabValue}>
          <Stack spacing={2}>
            <Stack alignItems="center" spacing={1}>
              <Box>
                <TokenSelectInput
                  instruction={`Enter an amount of tokens to sell (Max: ${balanceOf})`}
                  placeholder="0"
                  onChange={handleOnChangeNumTokensToBuy}
                  onKeyDownHandler={onKeyDownSellHandler}
                  value={numTokens}
                />
              </Box>

              <Paper
                sx={{
                  zIndex: 100,
                  width: 35,
                  height: 35,
                  borderRadius: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton disabled>
                  <SwapVert color='primary' />
                </IconButton>
              </Paper>

              <Box>
                <TokenSelectInput
                  instruction={`${numTokens} will return`}
                  placeholder="0"
                  disabled
                />
              </Box>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography fontSize={14} fontWeight="700">
                Slippage Tollerance
              </Typography>
              <Typography fontSize={14} fontWeight="bold">
                4.0
              </Typography>
            </Stack>

            <Divider />

            <Box>
            <Typography variant="subtitle2" pb={1.5}>
                Purchase Summary
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  height: "auto",
                  borderRadius: 2,
                  bgcolor: "rgb(246, 247, 249)",
                  border: "1px solid #eee",
                  width: "100%",
                }}
              >
                <Stack py={0.5} direction='row' alignItems='center' justifyContent='space-between'>
                  <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    Earnings:  
                  </Typography>

                  <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                  {returnFromSelling} DAI
                  </Typography>
                </Stack>

                <Stack py={0.5} direction='row' alignItems='center' justifyContent='space-between'>
                <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    Protocol Fee
                  </Typography>

                  <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    {protocolFee} DAI
                  </Typography>
                </Stack>

                <Stack py={0.5} direction='row' alignItems='center' justifyContent='space-between'>
                <Typography fontSize={12} fontWeight='bold' color='#212121'>
                    Total Earned
                  </Typography>

                  <Typography fontSize={12} fontWeight='bold' color='#212121'>
                  {returnFromSelling - protocolFee} DAI
                  </Typography>
                </Stack>

                <Divider />

                <Stack py={0.5} direction='row' alignItems='center' justifyContent='space-between'>
                <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    Gas fee
                  </Typography>

                  <Typography fontSize={12} fontWeight='bold' color='rgb(96, 99, 104)'>
                    ~{feeData?.data?.formatted?.gasPrice}
                  </Typography>
                </Stack>
              </Paper>

              <Typography variant="caption">
                Prices, fees and balance will refresh in{" "}
                <Countdown
                  onComplete={() => {
                    getBalance()
                    networkManager_getProtocolFee.refetch();
                    tokenExchange_getPriceForSellingTokens.refetch();
                    setCountdown(Date.now() + 30000);
                  }}
                  date={countdown}
                  renderer={renderer}
                />{" "}
                seconds
              </Typography>
            </Box>

            <Button
              color="primary"
              variant="contained"
              onClick={async () => {
                await tokenExchange_sellTokens.write();
              }}
            >
              Sell {numTokens} tokens
            </Button>
          </Stack>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionTokenDialog;
