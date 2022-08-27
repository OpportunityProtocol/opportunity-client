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
} from "@mui/material";
import { useStyles } from "./ServiceCardStyle";
import DAIIcon from "../../../../node_modules/cryptocurrency-icons/svg/color/dai.svg";
import { NextRouter, useRouter } from "next/router";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
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

import { Check } from "@material-ui/icons";

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

interface IServiceCardProps {
  id: string;
  purchaseData?: PurchasedServiceMetadataStruct;
  data?: ServiceStruct;
  purchase?: boolean;
  outlined: string;
  text?: boolean;
}

const ServiceCard = ({
  id,
  data,
  purchaseData,
  purchase = false,
  text = false,
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

  const signTypedData =
    useSignTypedData({
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

  return text ? (
    <Box>
      {serviceMetadata?.service_title ? (
        <Typography
          fontWeight="normal"
          fontSize={12}
          color={(theme) => theme.palette.primary.main}
        >
          {serviceMetadata?.service_title}
        </Typography>
      ) : (
        <Typography
          fontWeight="medium"
          fontSize={13}
          color={(theme) => theme.palette.primary.main}
        >
          Unable to load service title
        </Typography>
      )}
    </Box>
  ) : (
    <Card
      square
      variant="elevation"
      elevation={10}
      sx={{
        boxShadow: "0 19px 38px #eee, 0 15px 12px #eee",
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: 100,
        cursor: userAddress ? "pointer" : "auto",
      }}
      onClick={
        userAddress ? () => router.push(`/view/service/${data?.id}`) : () => {}
      }
    >
      <Box
        sx={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent
          sx={{
            flex: "1 0 auto",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <Typography fontWeight="600" fontSize={12}>
            {serviceMetadata?.service_title
              ? serviceMetadata?.service_title
              : "Unable to load service title"}
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <img
                src="/assets/images/dai.svg"
                style={{ width: 15, height: 20 }}
              />
              <Typography
                fontSize={13}
                fontWeight="medium"
                color="text.secondary"
              >
                {Math.random().toPrecision(2)}{" "}
              </Typography>
            </Stack>
          </Box>

          {/*   <Stack direction="row" alignItems="center">
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
            <Typography color='text.secondary' variant="caption">Unable to load tags</Typography>
          )}
          </Stack> */}
        </CardContent>
      </Box>
      {errors?.metadataError ? (
        <img src="" style={{ height: "100%", width: 110 }} />
      ) : (
        <CardMedia
          image={URL.createObjectURL(new Blob([displayImg]))}
          sx={{ height: "100%", width: 80 }}
        />
      )}
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
    </Card>
  );
};

export { type IServiceCardProps };
export default ServiceCard;
