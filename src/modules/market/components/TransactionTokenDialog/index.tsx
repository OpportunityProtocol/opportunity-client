import React, { FC, useState, useEffect, ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
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
} from "@mui/material";
import VerifiedAvatar from "../../../user/components/VerifiedAvatar";
import TabPanel from "../../../../common/components/TabPanel/TabPanel";
import { InfoRounded } from "@material-ui/icons";
import { useContractRead, useContractWrite, useFeeData, useProvider, useSigner } from "wagmi";
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
import { TokenInfoStruct } from "../../../../typechain-types/ITokenFactory";
import { ServiceStruct } from "../../../../typechain-types/NetworkManager";
import { Result } from "ethers/lib/utils";
import { BigNumber, BigNumberish } from "ethers";
import { hexToDecimal } from "../../../../common/helper";
import { CHAIN_ID } from "../../../../constant/provider";
import { useQuery } from "@apollo/client";
import { GET_SERVICE_BY_ID } from "../../../contract/ContractGQLQueries";
import { a11yProps } from "../../../../common/components/TabPanel/helper";
import { ethers } from 'ethers'
interface ITransactionDialogProps {
  open: boolean;
  handleClose: () => void;
}

interface ITransactionDialogInfoProps {
  serviceId: BigNumberish;
}

const FlatTextField = styled(TextField)`
  & .MuiTextField-root {
    border: 'none !important',
    borderBottom: 'none'
  }
`;

const TransactionTokenDialog: FC<
  ITransactionDialogProps & ITransactionDialogInfoProps
> = ({ open = true, handleClose, serviceId = -1 }) => {
  const [tokenPriceRefreshCounter, setTokenPriceRefreshCounter] =
    useState("0.00");
  const [tabValue, setTabValue] = useState<number>(0);
  const [numTokens, setNumTokensToPurchase] = useState<any>(500);
  const [costForBuying, setCostForBuying] = useState<any>(0);
  const [costForSelling, setCostForSelling] = useState<any>(0);
  const [fallbackAmount, setFallbackAmount] = useState<number>(300);
  const [desiredCost, setDesiredCost] = useState<number>(500);
  const [protocolFee, setProtocolFee] = useState<number>(0);
  const [tokenMarketDetails, setTokenMarketDetails] = useState<any>({});
  const [tokenSupply, setTokenSupply] = useState<any>(0);
  const feeData = useFeeData();

  const signer = useSigner()

  // const erc20_totalSupply = useContractRead(
  //   {
  //     addressOrName: tokenInfo?.serviceToken,
  //     contractInterface: ERC20Interface
  //   },
  //   "totalSupply",
  //   {
  //     args: [],
  //     onSuccess(data) {
  //       console.log("DATA")
  //       console.log(data)
  //     },
  //     onError(err) {
  //       console.log(err)
  //     }
  //   }
  // )



  const [tokenInfo, setTokenInfo] = useState<TokenInfoStruct>({
    exists: false,
    id: -1,
    name: "",
    serviceToken: ZERO_ADDRESS,
  });

  const [serviceData, setServiceData] = useState<any>({});

  const serviceDataQuery = useQuery(GET_SERVICE_BY_ID, {
    variables: {
      serviceId: serviceId,
    },
  });

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
    }
  }, [serviceId]);

  useEffect(() => {
    if (serviceId != -1) {
      tokenFactory_getTokenInfo.refetch();
    }

    if (Number(serviceData?.marketId) && serviceId != -1) {
      console.log('FETCH NOW::  ', "    " + serviceData?.marketId + '  ' + Number(serviceData.marketId))
      tokenFactory_getMarketsDetailsById.refetch();
    }
  }, [serviceData?.marketId, serviceId]);

  const networkManager_getProtocolFee = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getProtocolFee",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      args: [],
      onSuccess(data: Result) {
        setProtocolFee(hexToDecimal(data._hex));
      },
    }
  );

  const provider = useProvider()
  const tokenFactory_getTokenInfo = useContractRead(
    {
      addressOrName: TOKEN_FACTORY_ADDRESS,
      contractInterface: TokenFactoryInterface,
    },
    "getTokenInfo",
    {
      enabled: false,
      watch: true,
      chainId: CHAIN_ID,
      args: [Number(serviceData?.marketId), serviceId],
      async onSuccess(data: Result) {
        const ERC20TokenContract = new ethers.Contract(data?.serviceToken, ERC20Interface, provider);
        const totalSupply = await ERC20TokenContract.totalSupply()
        const balanceOf = await ERC20TokenContract.balanceOf(userAddress)
        console.log('balanceOf')
        console.log(hexToDecimal(balanceOf._hex))
        console.log("HI")
        console.log(totalSupply)
        setTokenSupply(hexToDecimal(totalSupply._hex))

        setTokenInfo(data);
      },
      onError(err) {
        console.log('Get token info fail')
      },
    }
  );

  const tokenExchange_buyTokens = useContractWrite(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface,
    },
    "buyTokens",

    {
      args: [
        tokenInfo.serviceToken,
        numTokens,
        fallbackAmount,
        desiredCost,
        userAddress,
      ],
      overrides: {
        gasLimit: BigNumber.from("900000"),
      },
      onSuccess(data, variables, context) {
        console.log(data)
      },
    }
  );

  const tokenExchange_sellTokens = useContractWrite(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface,
    },
    "sellTokens",
    {
      args: [tokenInfo.serviceToken, numTokens, 0, userAddress],
      overrides: {
        gasLimit: BigNumber.from("900000"),
      },
      onError(error, variables, context) {
        console.log(numTokens)
      },
    }
  );

  const tokenExchange_getCostForBuyingTokens = useContractRead(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface,
    },
    "getCostForBuyingTokens",
    {
      args: [tokenInfo.serviceToken, numTokens],
      enabled: false,
      watch: false,
      cacheTime: 30000,
      chainId: CHAIN_ID,
      overrides: {
        gasLimit: BigNumber.from("900000"),
      },
      onSuccess(data) {
        console.log('@@')
        setCostForBuying(hexToDecimal(data._hex));
      },
      onError(err) {
        console.log("tokenExchange_getCostForBuyingTokens");
        console.log(err);
      },
    }
  );

  const tokenExchange_getPricesForSellingTokens = useContractRead(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface,
    },
    "getPricesForSellingTokens",
    {
      args: [tokenMarketDetails, tokenSupply, numTokens, false],
      enabled: false,
      watch: false,
      cacheTime: 30000,
      chainId: CHAIN_ID,
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },
      onSuccess(data) {
        console.log("BBBBCC")
        console.log(data)
        console.log("OOOOH")
        setCostForSelling(hexToDecimal(data.total._hex));
      },
      onError(err) {
        console.log("tokenExchange_getCostForSellingTokens");
        console.log(err);
      },
    }
  );

  const tokenFactory_getMarketsDetailsById = useContractRead(
    {
      addressOrName: TOKEN_FACTORY_ADDRESS,
      contractInterface: TokenFactoryInterface,
    },
    "getMarketDetailsByID",
    {
      args: [Number(serviceData?.marketId)],
      enabled: false,
      watch: false,
      cacheTime: 30000,
      chainId: CHAIN_ID,
      overrides: {
        gasLimit: BigNumber.from("900000"),
      },
      onSuccess(data) {
        console.log('SUCCESS FETCh')
        console.log(data)
        setTokenMarketDetails(data);
      },
      onError(err) {
        console.log("FAIL FETCH")
        console.log(serviceData)
        console.log("tokenFactory_getMarketsDetailsById");
        console.log(err);
      },
    }
  );

  const handleOnChangeNumTokensToBuy = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNumTokensToPurchase(e.target.value);
  };

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      event.preventDefault();

      if (tokenInfo.serviceToken != ZERO_ADDRESS && numTokens > 0) {
        tokenExchange_getCostForBuyingTokens.refetch();
      }
    }
  };

  const handleOnChangeNumTokensToSell = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNumTokensToPurchase(e.target.value);
  };

  const onKeyDownSellHandler = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.code === "Enter") {
      event.preventDefault();

      if (tokenInfo.serviceToken != ZERO_ADDRESS && numTokens > 0) {
        tokenExchange_getPricesForSellingTokens.refetch();
      }
    }
  };

  const handleOnChangeTab = (e, newValue: Number) => {
    setTabValue(newValue);
  };

  const dai_approve = useContractWrite(
    {
      addressOrName: DAI_ADDRESS,
      contractInterface: DaiInterface,
    },
    "approve",
    {
      args: [TOKEN_EXCHANGE_ADDRESS, costForBuying + 100],
    }
  );

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
          <DialogContentText fontWeight="bold" maxWidth={400}>
            Invest in high quality services from verified freelancers. Earn as
            the quality of their service goes up.
          </DialogContentText>
        </DialogContent>

        <VerifiedAvatar />
      </Box>

      <DialogContent>
        <Box sx={{ width: "100%", mt: 1, mb: 3 }}>
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
        <TabPanel index={0} value={tabValue}>
          <Stack spacing={2}>
            <Box>
              <Typography pb={1.5} fontWeight="medium" fontSize={15}>
                Enter an amount of tokens to buy
              </Typography>
              <FlatTextField
                onKeyDown={onKeyDownHandler}
                onChange={(e) => handleOnChangeNumTokensToBuy(e)}
                label="I want to buy"
                fullWidth
              />
            </Box>

            <Box>
              <Typography pb={1.5} fontWeight="medium" fontSize={15}>
                {numTokens} will cost
              </Typography>
              <FlatTextField disabled fullWidth value={costForBuying} />
            </Box>

            <Box>
              <Typography pb={1.5} fontWeight="medium" fontSize={12}>
                Purchase Summary
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  height: 120,
                  borderRadius: 2,
                  bgcolor: "#f7f7f7",
                  width: "100%",
                }}
              >
                <Typography fontSize={15} pb={1} fontWeight="medium">
                  You will get{" "}
                  <Typography fontWeight="bold" component="span">
                    {numTokens}
                  </Typography>{" "}
                  for{" "}
                  <Typography component="span" fontWeight="bold">
                    {costForBuying} DAI
                  </Typography>
                  .
                </Typography>
                <Divider />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{ display: "flex", alignItems: "center" }}
                    fontWeight="medium"
                    fontSize={14}
                    py={0.5}
                  >
                    Protocol Fee:{" "}
                    <Box component="span">
                      <InfoRounded fontSize="small" />
                    </Box>
                  </Typography>
                  <Typography fontWeight="medium" fontSize={14} py={0.5}>
                    {protocolFee}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{ display: "flex", alignItems: "center" }}
                    fontWeight="medium"
                    fontSize={14}
                    py={0.5}
                  >
                    Network Fee:
                    <Box component="span">
                      <InfoRounded fontSize="small" />
                    </Box>
                  </Typography>
                  <Typography fontWeight="medium" fontSize={14} py={0.5}>
                    {feeData.isLoading ? (
                      <Typography>...</Typography>
                    ) : (
                      <Typography>{feeData.data.formatted.gasPrice}</Typography>
                    )}
                  </Typography>
                </Stack>
              </Paper>
              <Typography variant="caption">
                Token price will refresh in {tokenPriceRefreshCounter} seconds
              </Typography>
            </Box>

            <Stack>
              <Button
                variant="contained"
                onClick={async () => {
                  await dai_approve.write();
                }}
              >
                Approve
              </Button>

              <Button
                variant="contained"
                onClick={async () => {
                  await tokenExchange_buyTokens.write();
                }}
              >
                Purchase
              </Button>
            </Stack>
          </Stack>
        </TabPanel>

        <TabPanel index={1} value={tabValue}>
          <Stack spacing={2}>
            <Box>
              <Typography pb={1.5} fontWeight="medium" fontSize={15}>
                Enter an amount of tokens to sell
              </Typography>
              <FlatTextField
                onKeyDown={onKeyDownSellHandler}
                onChange={(e) => handleOnChangeNumTokensToSell(e)}
                label="I want to sell"
                fullWidth
              />
            </Box>

            <Box>
              <Typography pb={1.5} fontWeight="medium" fontSize={15}>
                {costForSelling} will return
              </Typography>
              <FlatTextField disabled fullWidth value={costForSelling} />
            </Box>

            <Box>
              <Typography pb={1.5} fontWeight="medium" fontSize={12}>
                Purchase Summary
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  height: 120,
                  borderRadius: 2,
                  bgcolor: "#f7f7f7",
                  width: "100%",
                }}
              >
                <Typography fontSize={15} pb={1} fontWeight="medium">
                  You will get{" "}
                  <Typography fontWeight="bold" component="span">
                    {numTokens}
                  </Typography>{" "}
                  for{" "}
                  <Typography component="span" fontWeight="bold">
                    {costForSelling} DAI
                  </Typography>
                  .
                </Typography>
                <Divider />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{ display: "flex", alignItems: "center" }}
                    fontWeight="medium"
                    fontSize={14}
                    py={0.5}
                  >
                    Protocol Fee:{" "}
                    <Box component="span">
                      <InfoRounded fontSize="small" />
                    </Box>
                  </Typography>
                  <Typography fontWeight="medium" fontSize={14} py={0.5}>
                    {protocolFee}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    sx={{ display: "flex", alignItems: "center" }}
                    fontWeight="medium"
                    fontSize={14}
                    py={0.5}
                  >
                    Network Fee:
                    <Box component="span">
                      <InfoRounded fontSize="small" />
                    </Box>
                  </Typography>
                  <Typography fontWeight="medium" fontSize={14} py={0.5}>
                    {feeData.isLoading ? (
                      <Typography>...</Typography>
                    ) : (
                      <Typography>{feeData.data.formatted.gasPrice}</Typography>
                    )}
                  </Typography>
                </Stack>
              </Paper>
              <Typography variant="caption">
                Token price will refresh in {tokenPriceRefreshCounter} seconds
              </Typography>
            </Box>

            <Stack>
              <Button
                variant="contained"
                onClick={async () => {
                  await dai_approve.write();
                }}
              >
                Approve
              </Button>

              <Button
                variant="contained"
                onClick={async () => {
                  await tokenExchange_sellTokens.write();
                }}
              >
                Purchase
              </Button>
            </Stack>
          </Stack>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionTokenDialog;
