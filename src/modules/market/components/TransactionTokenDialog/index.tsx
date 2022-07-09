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
import { useContractRead, useContractWrite, useFeeData } from "wagmi";
import { DAI_ADDRESS, NETWORK_MANAGER_ADDRESS, TOKEN_EXCHANGE_ADDRESS, TOKEN_FACTORY_ADDRESS, ZERO_ADDRESS } from "../../../../constant";
import { DaiInterface, NetworkManagerInterface, TokenExchangeInterface, TokenFactoryInterface } from "../../../../abis";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../../../user/userReduxSlice";
import { TokenInfoStruct } from "../../../../typechain-types/ITokenFactory";
import { ServiceStruct } from "../../../../typechain-types/NetworkManager";
import { Result } from "ethers/lib/utils";
import { BigNumber, BigNumberish } from "ethers";
import { hexToDecimal } from "../../../../common/helper";
import { CHAIN_ID } from "../../../../constant/provider";

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

const TransactionTokenDialog: FC<ITransactionDialogProps & ITransactionDialogInfoProps> = ({
  open = true,
  handleClose,
  serviceId=-1
}) => {
  const [tokenPriceRefreshCounter, setTokenPriceRefreshCounter] = useState('0.00')
  const [numTokens, setNumTokensToPurchase] = useState<any>(500)
  const [costForBuying, setCostForBuying] = useState<any>(0)
  const [fallbackAmount, setFallbackAmount] = useState<number>(300)
  const [desiredCost, setDesiredCost] = useState<number>(500)
  const [protocolFee, setProtocolFee] = useState<number>(0)
  const feeData = useFeeData()

console.log("SERVICE ID: ", serviceId)
  const [tokenInfo, setTokenInfo] = useState<TokenInfoStruct>({
    exists: false,
    id: -1,
    name: '',
    serviceToken: ZERO_ADDRESS
  })
  const [serviceData, setServiceData] = useState<ServiceStruct>({
    marketId: -1,
    owner: ZERO_ADDRESS,
    metadataPtr: "",
    wad: [],
    referralShare: 0,
    exist: false,
    id: -1,
    collectModule: ZERO_ADDRESS
  })
  const userAddress = useSelector(selectUserAddress)

  useEffect(() => {
    console.log('Call for  fee')
    networkManager_getProtocolFee.refetch()
  }, [])

  useEffect(() => {
    if (serviceId >= 0) {
      networkManager_getServiceData.refetch()
    }
  }, [serviceId])

  useEffect(() => {
    console.log(serviceData)
    tokenFactory_getTokenInfo.refetch()
  }, [serviceData.marketId])

  useEffect(() => {
    if (serviceData.marketId >= 0) {
      console.log("ID : ", serviceData.marketId)
      tokenFactory_getTokenInfo.refetch()
    }

  }, [serviceData.marketId, serviceData.id])

  useEffect(() => {
    console.log(tokenInfo)
  }, [tokenInfo.serviceToken])

  const networkManager_getServiceData = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface
    },
    "getServiceData",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      args: [serviceId],
      onSuccess(data: Result) {
        console.log('Success')
        console.log(data)
        setServiceData(data)

      },
    }
  )

  const networkManager_getProtocolFee = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface
    },
    "getProtocolFee",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      args: [],
      onSuccess(data: Result) {
        console.log('Success protocol fee')
        console.log(data)
        setProtocolFee(data)

      },
    }
  )

  const tokenFactory_getTokenInfo = useContractRead(
    {
      addressOrName: TOKEN_FACTORY_ADDRESS,
      contractInterface: TokenFactoryInterface
    },
    "getTokenInfo",
    {
      enabled: false,
      watch: true,
      chainId: CHAIN_ID,
      args: [hexToDecimal(Number(serviceData.marketId)), hexToDecimal(Number(serviceData.id))],
      onSuccess(data: Result) {
        console.log("info success")
        setTokenInfo(data)
      },
      onError(err) {
        console.log("B")
        console.log(err)
      },
    }
  )

  const tokenExchange_buyTokens = useContractWrite(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface
    },
    "buyTokens",
    
    {
      args: [tokenInfo.serviceToken, numTokens, fallbackAmount, desiredCost, userAddress],
      overrides: {
        gasLimit: BigNumber.from('900000'),
      },
    }
  )

  const tokenExchange_sellTokens = useContractWrite(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface
    },
    "sellTokens",
    {
      args: []
    }
  )

  const tokenExchange_getCostForBuyingTokens = useContractRead(
    {
      addressOrName: TOKEN_EXCHANGE_ADDRESS,
      contractInterface: TokenExchangeInterface
    },
    "getCostForBuyingTokens",
    {
      args: [tokenInfo.serviceToken, numTokens],
      enabled: false,
      watch: false,
      cacheTime: 30000,
      chainId: CHAIN_ID,
      overrides: {
        gasLimit: BigNumber.from('900000'),
      },
      onSuccess(data) {
        console.log(data)
        console.log(serviceData)
        console.log(tokenInfo)
        setCostForBuying(data)
      },
      onError(err) {
        console.log('tokenExchange_getCostForBuyingTokens')
        console.log(err)
      },
    }
  )

  const handleOnChangeNumTokensToBuy = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNumTokensToPurchase(e.target.value)
  }

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      event.preventDefault()
      console.log(tokenInfo.serviceToken)
      console.log(numTokens)

      if (tokenInfo.serviceToken != ZERO_ADDRESS && numTokens > 0) {
        tokenExchange_getCostForBuyingTokens.refetch()
      }

      
    }
  };

  const dai_approve = useContractWrite(
    {
      addressOrName: DAI_ADDRESS,
      contractInterface: DaiInterface
    },
    "approve",
    {
      args: [TOKEN_EXCHANGE_ADDRESS, costForBuying + 100]
    }
  )

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


            <DialogTitle
            >
              {" "}
              Earn passive income from quality freelancers
            </DialogTitle>
            <DialogContent>
              <DialogContentText fontWeight="bold" maxWidth={400}>
                Invest in high quality services from verified freelancers. Earn as the quality of their service goes up.
              </DialogContentText>
            </DialogContent>

            <VerifiedAvatar />

        
          </Box>

          <DialogContent>
          <Box sx={{ width: "100%", mt: 1, mb: 3 }}>
          <Tabs
            value={0}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              value={0}
              label="Buy tokens"
            />
            <Tab value={1} label="Sell tokens" />
          </Tabs>
          <Divider sx={{ borderBottom: "1px solid #ddd" }} />
        </Box>
        <TabPanel index={0} value={0}>
            <Stack spacing={2}>
            <Box>
            <Typography pb={1.5} fontWeight='medium' fontSize={15}>
                Enter an amount of tokens to mint
              </Typography>
              <FlatTextField onKeyDown={onKeyDownHandler} onChange={e => handleOnChangeNumTokensToBuy(e)} label='I want to buy' fullWidth />
            </Box>

              <Box>
              <Typography pb={1.5} fontWeight='medium' fontSize={15}>
                {numTokens} will cost
              </Typography>
           <FlatTextField disabled fullWidth value={hexToDecimal(Number(costForBuying))} />
              </Box>


            <Box>
       
              <Typography pb={1.5} fontWeight='medium' fontSize={12}>
              Purchase Summary
            </Typography>


            <Paper elevation={0} sx={{p: 1, height: 120, borderRadius: 2,  bgcolor: '#f7f7f7', width: '100%' }}>
              <Typography fontSize={15} pb={1} fontWeight='medium'>
                You will get <Typography fontWeight='bold' component='span'>{numTokens}</Typography> for <Typography component='span' fontWeight='bold'>{hexToDecimal(Number(costForBuying))} DAI</Typography>.
              </Typography>
              <Divider />
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
              <Typography  sx={{ display: 'flex', alignItems: 'center' }} fontWeight='medium' fontSize={14} py={0.5}>
                  Protocol Fee:  <Box component='span'>
                    <InfoRounded fontSize='small' />
                  </Box>
              </Typography>
              <Typography fontWeight='medium' fontSize={14} py={0.5}>
                  {hexToDecimal(Number(networkManager_getProtocolFee.data))}
              </Typography>
              </Stack>

              <Stack direction='row' alignItems='center' justifyContent='space-between'>
              <Typography sx={{ display: 'flex', alignItems: 'center' }} fontWeight='medium' fontSize={14} py={0.5}>
                 Network Fee: 
                 <Box component='span'>
                    <InfoRounded fontSize='small' />
                  </Box>
              </Typography>
              <Typography fontWeight='medium' fontSize={14} py={0.5}>
                  {feeData.isLoading ? <Typography>...</Typography> : <Typography>{feeData.data.formatted.gasPrice}</Typography>}
              </Typography>
              </Stack>
           </Paper>
           <Typography variant='caption'>
              Token price will refresh in {tokenPriceRefreshCounter} seconds
            </Typography>
            </Box>


           <Button variant='contained' onClick={async () => {
            await dai_approve.write()
            await tokenExchange_buyTokens.write()
           }}>
              Purchase
           </Button>
           </Stack>
        </TabPanel>

        <TabPanel index={1} value={0}>
          
          </TabPanel>
          </DialogContent>


      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionTokenDialog;
