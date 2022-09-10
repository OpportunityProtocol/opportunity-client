import React, { useEffect, useState } from "react";
import cx from "clsx";
import {
  Card,
  Avatar,
  CardContent,
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
  PurchasedServiceMetadataStruct,
  ServiceStruct,
} from "../../../../typechain-types/NetworkManager";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useQuery,
  useSignTypedData,
} from "wagmi";
import {
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS,
  ZERO_ADDRESS,
} from "../../../../constant";
import { LensHubInterface, NetworkManagerInterface } from "../../../../abis";
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
import { ProfileStructStruct } from "../../../../typechain-types/ILensHub";
import { hexToDecimal } from "../../../../common/helper";
import { CHAIN_ID } from "../../../../constant/provider";
import {
  activePublishedServiceDataAdded,
  purchasedServiceDataAdded,
} from "../../contractReduxSlice";
import { ethers } from "ethers";
import { GET_PURCHASED_SERVICE } from "../../ContractGQLQueries";
import { getMetadata } from "../../../../common/ipfs-helper";
import { ConfirmationDialog } from "../../../../common/components/ConfirmationDialog";
import moment from "moment";
import { withStyles } from '@mui/styles'
interface IServiceCardProps {
  id: string;
  purchaseData?: PurchasedServiceMetadataStruct;
  data?: ServiceStruct;
  purchase?: boolean;
  outlined: string;
  text?: boolean;
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
  outlined = true,
}: IServiceCardProps) => {
  const cardStyles = useStyles();
  const router: NextRouter = useRouter();
  const [loadedData, setLoadedData] = useState<ServiceStruct>(data);

  const [serviceOwnerLensData, setServiceOwnerLensData] =
    useState<ProfileStructStruct>({});
  const [servicePubId, setServicePubId] = useState<number>(0);
  const [serviceOwnerLensProfileId, setServiceOwnerLensProfileId] =
    useState<number>(0);
  const [serviceMetadata, setServiceMetadata] = useState<any>({});
  const [displayImg, setDisplayImg] = useState<Buffer>();
  const [errors, setErrors] = useState<any>({
    metadataError: false,
  });

  const dispatch = useDispatch();

  const userAddress = useSelector(selectUserAddress);

  const networkManager_resolveServicePrepare = usePrepareContractWrite({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "resolveService",
    onSettled: (data, error) => {
      if (error) {
        setResolveServiceSuccessful(false);
      } else {
        setResolveServiceSuccessful(true);
      }

      setResolveServiceLoading(false);
    },
    overrides: {
      from: userAddress,
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    args: [
      Number(loadedData?.id),
      Number(purchaseData?.purchaseId),
      { v: 0, r: 0, s: 0 },
    ],
  });
  const networkManager_resolveService = useContractWrite(
    networkManager_resolveServicePrepare.config
  );

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

  //fetch lens profile among  lens profile id change
  useEffect(() => {
    lensHub_getProfile.refetch({
      throwOnError: true,
    });
  }, [serviceOwnerLensProfileId]);

  const networkManager_getLensProfileIdFromAddress = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getLensProfileIdFromAddress",
    enabled: false,
    chainId: CHAIN_ID,
    args: [loadedData?.creator ? loadedData?.creator : ZERO_ADDRESS],
    onSuccess: (data: Result) => {
      setServiceOwnerLensProfileId(hexToDecimal(data._hex));
    },
    onError: (error) => {},
  });

  const handleOnNavigateToServicePage = () => {
    router.push({
      pathname: "/view/service/1",
      query: {
        ...loadedData,
        id: Number(loadedData.id),
        offers: [
          Number(loadedData.offers[0]),
          Number(loadedData.offers[1]),
          Number(loadedData.offers[2]),
        ],
      },
    });
  };

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
      const metadata = await getMetadata(data?.metadataPtr);
      console.log(metadata);
      setServiceMetadata(metadata);
    }

    loadMetadata();
  }, [data?.metadataPtr]);

  const signTypedData = useSignTypedData({
    onSettled(data, error) {},
    onError(error) {},
  });

  const [resolveServiceSuccessful, setResolveServiceSuccessful] =
    useState<boolean>(false);
  const [resolveServiceLoading, setResolveServiceLoading] =
    useState<boolean>(false);
  const [resolveServiceDialogIsOpen, setResolveServiceDialogIsOpen] =
    useState<boolean>(false);

  const getDomain = () => {
    return {
      name: "Lens Protocol Profiles",
      version: "1",
      chainId: CHAIN_ID,
      verifyingContract: LENS_HUB_PROXY,
    };
  };

  const getValues = async () => {
    const nonce =
      await new ethers.providers.JsonRpcProvider().getTransactionCount(
        userAddress
      );
    return {
      profileId: serviceOwnerLensProfileId,
      pubId: servicePubId,
      data: [],
      nonce,
      deadline: 0,
    };
  };

  const getTypes = () => {
    return {
      CollectWithSig: [
        { name: "profileId", type: "uint256" },
        { name: "pubId", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };
  };

  const onSign = async () => {
    const domain = getDomain();
    const types = getTypes();
    const value = await getValues();
    await signTypedData.signTypedData({ domain, types, value });
  };

  const onResolveService = async () => {
    if (signTypedData.isSuccess) {
      const splitSignature: ethers.Signature =
        await ethers.utils.splitSignature(signTypedData.data);

      await networkManager_resolveService.writeAsync({
        recklesslySetUnpreparedArgs: [
          Number(loadedData?.id),
          Number(purchaseData?.purchaseId),
          { v: splitSignature.v, r: splitSignature.r, s: splitSignature.s },
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
                  onClick={() => networkManager_resolveService.write()}
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
    <>
      <TableRow
        onClick={
          userAddress
            ? () => router.push(`/view/service/${data?.id}`)
            : () => {}
        }
        component={Paper}
        variant="outlined"
        sx={{
          width: "100%",
          minWidth: "100% !important",
          display: "flex",
          height: 130,
          cursor: userAddress ? "pointer" : "auto",
        }}
      >
        <TableBodyCell sx={{ width: 150, fontWeight: "bold" }}>
          Service
        </TableBodyCell>
        <TableBodyCell sx={{ width: "100% !important" }}>
          <Box display="flex">
            {errors?.metadataError ? (
              <img src="" style={{ height: 60, width: 110 }} />
            ) : (
              <img
                src={URL.createObjectURL(new Blob([displayImg]))}
                style={{
                  marginRight: 15,
                  borderRadius: 6,
                  width: 110,
                  height: 60,
                }}
              />
            )}

            <Box>
              <Typography fontWeight="medium" fontSize={14}>
                {serviceMetadata?.service_title
                  ? serviceMetadata?.service_title
                  : "Unable to load service title"}
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            {serviceMetadata?.tags &&
            serviceMetadata?.service_tags?.length > 0 ? (
              serviceMetadata?.service_tags?.map((tag) => {
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
        primaryAction={onResolveService}
        primaryActionTitle="Confirm"
      />
    </>
  );
};

export { type IServiceCardProps };
export default ServiceCard;
