import React, { useEffect, useState } from "react";
import cx from "clsx";
import {
  Card,
  Avatar,
  CardContent,
  Grid,
  Skeleton,
  CardMedia,
  Button,
  CardActions,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  CardActionArea,
  DialogContentText,
  TableCell,
  TableRow,
  Paper,
  DialogContent,
} from "@mui/material";
import { useStyles } from "./ServiceCardStyle";
import DAIIcon from "../../../../node_modules/cryptocurrency-icons/svg/color/dai.svg";
import { NextRouter, useRouter } from "next/router";

import {
  useContract,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
  useSignTypedData,
} from "wagmi";
import { useQuery } from '@apollo/client'
import {
  DAI_ADDRESS,
  FEE_COLLECT_MODULE,
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS,
  ZERO_ADDRESS,
} from "../../../../constant";
import { DaiInterface, LensHubInterface, NetworkManagerInterface } from "../../../../abis";
import { Result } from "ethers/lib/utils";
import fleek from "../../../../fleek";
import { create } from "ipfs-http-client";

import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLens,
  selectUserAddress,
} from "../../../user/userReduxSlice";

import { Check } from "@mui/icons-material";

import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import VerifiedAvatar from "../../../user/components/VerifiedAvatar";
import { hexToDecimal } from "../../../../common/helper";
import { CHAIN_ID } from "../../../../constant/provider";
import { ethers } from "ethers";
import { GET_PURCHASED_SERVICE } from "../../ContractGQLQueries";
import { getJSONFromIPFSPinata, getMetadata } from "../../../../common/ipfs-helper";
import { ConfirmationDialog } from "../../../../common/components/ConfirmationDialog";
import moment from "moment";
import { withStyles } from '@mui/styles'
import { getLensProfileById } from "../../../lens/LensGQLQueries";
import { GET_MARKET_DETAILS_BY_ID } from "../../../market/MarketGQLQueries";
import { QueryResult } from "@apollo/client";
interface IServiceCardProps {
  purchaseData?: any;
  service: any;
  purchase?: boolean;
}

const Box = withStyles((theme) => ({
  root: {
    color: "black",
    fontSize: "12px !important",
    padding: "10px !important",
  },
}))(TableCell);

const abiencoder = ethers.utils.defaultAbiCoder;

const ServiceCard = ({
  service,
  purchaseData,
  purchase = false
}: IServiceCardProps) => {

  const cardStyles = useStyles();
  const router: NextRouter = useRouter();

  const [loading, setLoading] = useState(false)

  const [serviceOwnerLensData, setServiceOwnerLensData] =
    useState<any>({});

  const [serviceOwnerLensProfileId, setServiceOwnerLensProfileId] =
    useState<number>(0);
  const [displayImg, setDisplayImg] = useState<Buffer>();
  const [errors, setErrors] = useState<any>({
    metadataError: false,
  });

  const [resolveServiceDialogIsOpen, setResolveServiceDialogIsOpen] =
    useState<boolean>(false);

  const userAddress = useSelector(selectUserAddress);
  const signTypedData = useSignTypedData({
    onSettled(data, error) { },
    onError(error) { },
  });

  const { write: approveDai, isLoading: isLoadingApproveDai, isSuccess: isSuccessApproveDai } = useContractWrite({
    addressOrName: DAI_ADDRESS,
    contractInterface: DaiInterface,
    mode: "recklesslyUnprepared",
    functionName: "approve",
    args: [FEE_COLLECT_MODULE, typeof service?.offers == 'object' ? 10000 : 10000],
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSuccess(data, variables, context) {

    },
    onError(error, variables, context) {

    },
    onSettled(data, error, variables, context) {

      if (!error) {
        onResolveService()
      } else {
       
      }
    },
  })

  const { write: resolveService, isLoading: isLoadingResolveSerivce, isSuccess: isSuccessResolveService } = useContractWrite({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    enabled: false,
    mode: "recklesslyUnprepared",
    functionName: "resolveService",
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    }
  });

  const networkManager_getLensProfileIdFromAddress = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getLensProfileIdFromAddress",
    enabled: true,
    chainId: CHAIN_ID,
    args: [service?.creator ? service?.creator : ZERO_ADDRESS],
    onSuccess: (data: Result) => {
      setServiceOwnerLensProfileId(Number(data._hex));
    },
    onError: (error) => { },
  });

  const handleOnNavigateToServicePage = () => {
    router.push({
      pathname: `/view/service/${service?.id}`,
      query: {
        ...service,
        id: Number(service.id),
        offers: [
          service?.beginner_offer,
          service?.business_offer,
          service?.enterprise_offer,
        ],
      },
    });
  };

  useEffect(() => {
    async function loadProfile() {
      if (serviceOwnerLensProfileId > 0) {
        const profile = await getLensProfileById(`0x${Math.abs(Number(serviceOwnerLensProfileId)).toString(16)}`)
        setServiceOwnerLensData(profile);
      }
    }

    loadProfile()
  
  }, [serviceOwnerLensProfileId])

  useEffect(() => {
    networkManager_getLensProfileIdFromAddress.refetch();
  }, [service?.creator]);


  const getDomain = () => {
    return {
      name: "Lens Protocol Profiles",
      version: "1",
      chainId: CHAIN_ID,
      verifyingContract: LENS_HUB_PROXY,
    };
  };

  const { data: userLensSigNonce } = useContractRead({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    functionName: "sigNonces",
    args: [userAddress],
    enabled: true,
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSettled(data, error) {

    },
  })

  const getValues = async () => {
    return {
      profileId: Number(serviceOwnerLensProfileId),
      pubId: Number(service?.id),
      data: abiencoder.encode(["uint256", "uint256"], [DAI_ADDRESS, service["offers"][0]]),
      nonce: Number(userLensSigNonce),
      deadline: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    }
  }

  const getTypes = () => {
    return {
      CollectWithSig: [
        { name: "profileId", type: "uint256" },
        { name: "pubId", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    }
  }

  const onSign = async () => {
    const domain = getDomain();
    const types = getTypes();
    const value = await getValues();

    await signTypedData.signTypedData({ domain, types, value });
  }

  const onResolveService = async () => {
    if (signTypedData.isSuccess) {
      const splitSignature: ethers.Signature =
        await ethers.utils.splitSignature(signTypedData.data);

      resolveService({
        recklesslySetUnpreparedArgs: [
          Number(service?.id),
          Number(purchaseData?.purchaseId),
          { v: splitSignature.v, r: splitSignature.r, s: splitSignature.s, deadline: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' },
        ],
      });
    }
  };

  const resolveServiceDialogContent = [
    <DialogContentText id="alert-dialog-description">
      <Typography fontSize={18} fontWeight="bold" py={1}>
        {" "}
        You are about to complete {service?.serviceTitle} which will require three actions:
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Signing a transaction" secondary="Your wallet provider will instruct you to sign the transaction." />
        </ListItem>

        <ListItem>
          <ListItemText primary="Approving the funds" secondary="This will approve Lens Talent to move the appropriate funds out of your wallet and into an escrow." />
        </ListItem>

        <ListItem>
          <ListItemText primary="Executing the transaction" secondary="Finally, you will confirm your transaction. A message will appear in your wallet provider to confirm." />
        </ListItem>
      </List>
    </DialogContentText>,

  <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography fontSize={20} fontWeight="bold" py={1}>
         Sign
        </Typography>
        </DialogContentText>
    <DialogContentText>
      Your wallet will prompt you to sign the transaction.
    </DialogContentText>
  </DialogContent>,

    <DialogContent>
          <DialogContentText id="alert-dialog-description">
        <Typography fontSize={20} fontWeight="bold" py={1}>
          Confirmation
        </Typography>
    </DialogContentText>
      <Typography variant="subtitle2">
          Your wallet will prompt you confirm the transaction. Only accept
          transaction from addresses you trust.
        </Typography>
    </DialogContent>
  ];

  const renderButtonState = () => {
    if (!purchase) {
      return (
        // view service
        <CardActions>
          <Button
            sx={{ borderRadius: 1 }}
            fullWidth
            variant="contained"
            onClick={handleOnNavigateToServicePage}
          >
            View service
          </Button>
        </CardActions>
      );
    }

    // owner is viewing

    if (
      String(service?.creator).toLowerCase() ===
      String(userAddress).toLowerCase()
    ) {
      if (purchaseData) {
        switch (purchaseData.status) {
          case 0:
            return (
              //pending resolution from client and disabled...
              <CardActions>
                <Button fullWidth variant="outlined" disabled>
                  Pending resolution
                </Button>
              </CardActions>
            );
          case 1:
            return (
              //view dispute
              <CardActions>
                <Button fullWidth variant="outlined" color="error">
                  View dispute
                </Button>
              </CardActions>
            );
          case 2:
            return (
              //confirmed with check mark and disabled
              <CardActions>
                <Button
                  fullWidth
                  variant="outlined"
                  disabled={isLoadingApproveDai || isLoadingResolveSerivce || (isSuccessApproveDai && isSuccessResolveService)}
                  startIcon={<Check />}
                >
                  Confirmed
                </Button>
              </CardActions>
            );
        }
      }
    } else {
      //purchaser is viewing
      if (purchaseData) {
        switch (purchaseData.status) {
          case 0:
            return (
              //Complete contract if pending state
              <CardActions>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setResolveServiceDialogIsOpen(true)}
                >
                  Confirm
                </Button>
              </CardActions>
            );
          case 1:
            return (
              //view dispute
              <CardActions>
                <Button fullWidth variant="outlined" color="error">
                  View dispute
                </Button>
              </CardActions>
            );
          case 2:
            return (
              //confirmed with check mark and disabled
              <CardActions>
                <Button
                  fullWidth
                  variant="outlined"
                  disabled
                  startIcon={<Check />}
                >
                  Confirmed
                </Button>
              </CardActions>
            );
        }
      }
    }
  };

  return (
      <Card variant="elevation" className={cx(cardStyles.root)} sx={{
        border: '1px solid #eaeaea !important',
        boxShadow: '0px 6px 15px -3px rgba(0,0,0,0.1)',
      }}>
        <CardActionArea
          onClick={handleOnNavigateToServicePage}
          sx={{ height: 250, width: "100%" }}
        >
          {

            errors.metadataError ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ width: "100%", height: "100%" }}
              >
                <BrokenImageIcon
                  sx={{ color: "#dbdbdb", width: 100, height: 100 }}
                  fontSize="large"
                />
              </Box>
            ) : (
              <CardMedia
                image={URL.createObjectURL(new Blob([displayImg]))}
                sx={{ height: "100%", width: "100%" }}
              />
            )}
        </CardActionArea>

        <CardContent sx={{ width: '100%' }}>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Avatar src={serviceOwnerLensData?.picture?.original?.url} />
              <Typography px={2}>
                {serviceOwnerLensData?.handle}
              </Typography>
            </Stack>

            <Box sx={{ width: '100%' }}>
              <Typography variant='caption' color='rgb(128, 128, 128)'>
                {service?.marketDetails?.name}
              </Typography>
              <Typography
                fontWeight="medium"
                fontSize={14}
                color="#616161"
                style={{
                  width: '100%',
                  paddingTop: "10px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {service?.serviceTitle ? service?.serviceTitle : 'Unable to load title'}
              </Typography>

              <Typography
                paragraph
                fontWeight="medium"
                fontSize={12}
                color="#616161"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {service?.serviceDescription ? service?.serviceDescription : 'Unable to load description'}
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography fontWeight="medium" fontSize={13} color="rgb(94, 94, 94)">
                Price:
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <img
                  src="/assets/images/dai.svg"
                  style={{ width: 15, height: 20 }}
                />
                <Typography fontSize={13}>
                  {Math.random().toPrecision(2)}{" "}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
        {renderButtonState()}
        <ConfirmationDialog
          success={(isSuccessApproveDai && isSuccessResolveService)}
          loading={isLoadingApproveDai || isLoadingResolveSerivce}
          open={resolveServiceDialogIsOpen}
          onOpen={() => { }}
          onClose={() => setResolveServiceDialogIsOpen(false)}
          hasSigningStep={true}
          content={resolveServiceDialogContent}
          signAction={onSign}
          primaryAction={approveDai}
          primaryActionTitle="Confirm"
        />
      </Card>

  )
};

export { type IServiceCardProps };
export default ServiceCard;
