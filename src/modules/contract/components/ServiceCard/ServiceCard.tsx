import React, { useEffect, useState } from "react";
import cx from "clsx";
import {
  Card,
  Avatar,
  CardContent,
  Grid,
  CardMedia,
  Button,
  Box,
  CardActions,
  Divider,
  Stack,
  Typography,
  Chip,
  CardActionArea,
  DialogContentText,
  TableCell,
  TableRow,
  Paper,
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
  useQuery,
  useSignTypedData,
} from "wagmi";
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
  selectVerificationStatus,
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
interface IServiceCardProps {
  id: string;
  purchaseData?: any;
  data?: any;
  purchase?: boolean;
  table: boolean;
}

const TableBodyCell = withStyles((theme) => ({
  root: {
    color: "black",
    fontSize: "12px !important",
    padding: "10px !important",
  },
}))(TableCell);

const StatusChip = ({ status }: { status: string }) => {
  const bgcolor = () => {
    switch (status) {
      case "Reclaimed":
        return "rgba(255, 138, 0, .24)";
      case "Dispute":
        return "rgba(255, 0, 0, .19)";
      case "Unclaimed":
        return "rgba(36, 227, 32, 0.4)";
      case "Claimed":
      default:
    }
  };
  const formStatus = () => {
    switch (status) {
      case "Reclaimed":
        return "Pending Dispute";
      default:
        return status;
    }
  };

  return (
    <Chip
      label={formStatus()}
      sx={{
        display: "flex",
        borderRadius: 1,
        fontSize: 10,
        bgcolor: bgcolor(),
        width: "80px",
        height: "30px",
      }}
    />
  );
};

const ServiceCard = ({
  id,
  data,
  purchaseData,
  purchase = false,
  table = false
}: IServiceCardProps) => {
  const cardStyles = useStyles();
  const router: NextRouter = useRouter();
  const provider = useProvider()

  const [loadedData, setLoadedData] = useState<any>(data);

  const [serviceOwnerLensData, setServiceOwnerLensData] =
    useState<any>({});
  const [servicePubId, setServicePubId] = useState<number>(0);
  const [serviceOwnerLensProfileId, setServiceOwnerLensProfileId] =
    useState<number>(0);
  const [serviceMetadata, setServiceMetadata] = useState<any>({});
  const [displayImg, setDisplayImg] = useState<Buffer>();
  const [errors, setErrors] = useState<any>({
    metadataError: false,
  });

  const [resolveServiceSuccessful, setResolveServiceSuccessful] =
  useState<boolean>(false);
const [resolveServiceLoading, setResolveServiceLoading] =
  useState<boolean>(false);
const [resolveServiceDialogIsOpen, setResolveServiceDialogIsOpen] =
  useState<boolean>(false);

  const dispatch = useDispatch();
  const userAddress = useSelector(selectUserAddress);
  const signTypedData = useSignTypedData({
    onSettled(data, error) {},
    onError(error) {},
  });

  const { write: approveDai } = useContractWrite({
    addressOrName: DAI_ADDRESS,
    contractInterface: DaiInterface,
    mode: "recklesslyUnprepared",
    functionName: "approve",
    args: [FEE_COLLECT_MODULE, typeof loadedData?.offers == 'object' ? 10000 : 10000],
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
      }
    },
  })

  const { write: resolveService } = useContractWrite({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    enabled: false,
    mode: "recklesslyUnprepared",
    functionName: "resolveService",
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSettled: (data, error) => {
      if (error) {

        setResolveServiceSuccessful(false);
      } else {
        setResolveServiceSuccessful(true);
      }

      setResolveServiceLoading(false);
    },
    onError(error, variables, context) {
  
    },
});

  const lensHub_getProfile = useContractRead({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    functionName: "getProfile",
    enabled: false,
    watch: false,
    chainId: CHAIN_ID,
    args: [serviceOwnerLensProfileId],
    onSuccess: (data) => {
      setServiceOwnerLensData(data);
    },
  });

  const networkManager_getLensProfileIdFromAddress = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getLensProfileIdFromAddress",
    enabled: true,
    chainId: CHAIN_ID,
    args: [loadedData?.creator ? loadedData?.creator : ZERO_ADDRESS],
    onSuccess: (data: Result) => {
      setServiceOwnerLensProfileId(Number(data._hex));
    },
    onError: (error) => {},
  });

  const handleOnNavigateToServicePage = () => {
    router.push({
      pathname: `/view/service/${loadedData?.id}`,
      query: {
        ...loadedData,
        id: Number(loadedData.id),
        offers: [
          serviceMetadata?.beginner_offer,
          serviceMetadata?.business_offer,
          serviceMetadata?.enterprise_offer,
        ],
      },
    });
  };

  //fetch lens profile among  lens profile id change
  useEffect(() => {
      lensHub_getProfile.refetch({
        throwOnError: true,
      });
  }, [serviceOwnerLensProfileId]);

  useEffect(() => {
    if (serviceOwnerLensProfileId !== 0) {
      lensHub_getProfile.refetch({
        throwOnError: false,
      });
    }
  }, [serviceOwnerLensProfileId]);

  useEffect(() => {
    networkManager_getLensProfileIdFromAddress.refetch();
  }, [loadedData?.creator]);

  useEffect(() => {
    async function loadMetadata() {
      const metadata = await getJSONFromIPFSPinata(data?.metadataPtr);
      setServiceMetadata(metadata);
    }

    loadMetadata();
  }, [data?.metadataPtr]);

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



  const abiencoder = ethers.utils.defaultAbiCoder;
  const getValues = async () => {
    return {
      profileId: Number(serviceOwnerLensProfileId),
      pubId: Number(data?.pubId),
      data: abiencoder.encode(["uint256", "uint256"], [DAI_ADDRESS, 100]),
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
          Number(data?.id),
          Number(purchaseData?.purchaseId),
          { v: splitSignature.v, r: splitSignature.r, s: splitSignature.s, deadline: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' },
        ],
      });
    }
  };

  const confirmationDialogContent = [
    <DialogContentText id="alert-dialog-description">
      <Typography fontSize={20} fontWeight="bold" py={1}>
        {" "}
        You are about to purchase a service which will require three actions:
      </Typography>

      <ul>
        <li>
          {" "}
          <Typography>Signing a transaction</Typography>
        </li>
        <li>
          {" "}
          <Typography>Approving the funds</Typography>
        </li>
        <li>
          <Typography>Executing the transaction</Typography>
        </li>
      </ul>
    </DialogContentText>,

    <DialogContentText>Sign</DialogContentText>,

    <DialogContentText id="alert-dialog-description">
      <Box py={2}>
        <Typography fontSize={20} fontWeight="bold" py={1}>
          Confirm purchase
        </Typography>
        <Typography variant="subtitle2">
          Your wallet will prompt you to sign the transaction. Only accept
          transaction from addresses you trust.
        </Typography>
      </Box>
    </DialogContentText>,
  ];

  const renderButtonState = () => {
    if (!purchase) {
      return (
        // view service
        <CardActions>
          <Button
            sx={{ borderRadius: 1 }}
            fullWidth
            variant="text"
            onClick={handleOnNavigateToServicePage}
          >
            View service
          </Button>
        </CardActions>
      );
    }

    // owner is viewing

    if (
      String(loadedData?.creator).toLowerCase() ===
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
                  disabled
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
    table ?
    (
    <Grid item xs={12} md={6} lg={4}>
      <TableRow
        onClick={
          userAddress
            ? () => router.push(`/view/service/${data?.id}`)
            : () => {}
        }
        component={Paper}
        sx={{
          boxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
          WebkitBoxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
          MozBoxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
          width: "100%",
        //  minWidth: "100% !important",
          display: "flex",
          height: 130,
          cursor: userAddress ? "pointer" : "auto",
        }}
      >
        <TableBodyCell sx={{ width: "100% !important" }}>
          <Box display="flex">
            {errors?.metadataError ? (
              <img src="" style={{ height: 110, width: 110 }} />
            ) : (
              <img
                src={URL.createObjectURL(new Blob([displayImg]))}
                style={{
                  marginRight: 15,
                  borderRadius: 6,
                  width: 110,
                  height: 110,
                }}
              />
            )}

            <Box>
              <Typography fontWeight="medium" fontSize={14}>
                {serviceMetadata?.serviceTitle
                  ? serviceMetadata?.serviceTitle
                  : "Unable to load service title"}
              </Typography>
              <Typography paragraph fontWeight="medium" fontSize={12}>
                {serviceMetadata?.serviceDescription
                  ? serviceMetadata?.serviceDescription
                  : "Unable to load service description"}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
            {serviceMetadata?.tags &&
            serviceMetadata?.tags?.length > 0 ? (
              serviceMetadata?.tags?.map((tag) => {
                return (
                  <Chip
                    variant="filled"
                    sx={{ fontSize: 12, padding: 1, backgroundColor: "#eee" }}
                    label={tag}
                    size="small"
                  />
                );
              })
            ) : (
              <Typography color="text.secondary" variant="caption">
                Unable to load tags
              </Typography>
            )}
          </Stack>
            </Box>
          </Box>
       
        </TableBodyCell>
        <TableBodyCell sx={{ width: 150 }}>
          <Stack direction="row" spacing={0.5}>
            <img
              src="/assets/images/dai.svg"
              style={{ width: 18, height: 18 }}
            />
            <Typography variant="body2" fontSize={12}>
              $25.99
            </Typography>
          </Stack>
        </TableBodyCell>
        <TableBodyCell sx={{ width: 150 }}>
          <StatusChip status="Unclaimed" />
        </TableBodyCell>
        <TableBodyCell sx={{ width: 150 }}>
          {moment().format("h:mm A")}
        </TableBodyCell>
      </TableRow>

      {/*renderButtonState()*/}
      <ConfirmationDialog
        success={resolveServiceSuccessful}
        loading={resolveServiceLoading}
        open={resolveServiceDialogIsOpen}
        onOpen={() => {}}
        onClose={() => setResolveServiceDialogIsOpen(false)}
        hasSigningStep={false}
        content={confirmationDialogContent}
        signAction={onSign}
        primaryAction={approveDai}
        primaryActionTitle="Confirm"
      />
    </Grid>)
    :
    (
      <Grid item xs={12} md={6} lg={4}>
      <Card variant="outlined" className={cx(cardStyles.root)} sx={{
        boxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
        WebkitBoxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
        MozBoxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
      }}>
      <CardActionArea
        onClick={handleOnNavigateToServicePage}
        sx={{ height: 250, width: "100%" }}
      >
        {errors.metadataError ? (
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

      <CardContent>
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
            <Avatar />
          </Stack>
        </Box>

        <Box>
        <Typography
          fontWeight="medium"
          fontSize={14}
          color="#616161"
          style={{
            paddingTop: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {serviceMetadata?.serviceTitle}
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
          {serviceMetadata?.serviceDescription}
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
      </CardContent>
      {renderButtonState()}
      <ConfirmationDialog
      success={resolveServiceSuccessful}
      loading={resolveServiceLoading}
      open={resolveServiceDialogIsOpen}
      onOpen={() => {}}
      onClose={() => setResolveServiceDialogIsOpen(false)}
      hasSigningStep={true}
      content={confirmationDialogContent}
      signAction={onSign}
      primaryAction={approveDai}
      primaryActionTitle="Confirm"
    />
    </Card>
    </Grid>
    )
  );
};

export { type IServiceCardProps };
export default ServiceCard;
