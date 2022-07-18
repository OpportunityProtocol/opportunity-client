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
} from "@mui/material";
import { useStyles } from "./ServiceCardStyle";
import DAIIcon from "../../../../node_modules/cryptocurrency-icons/svg/color/dai.svg";
import { NextRouter, useRouter } from "next/router";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
import {
  PurchasedServiceMetadataStruct,
  ServiceStruct,
} from "../../../../typechain-types/NetworkManager";
import { useContractRead, useContractWrite, useQuery } from "wagmi";
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
import { GET_PURCHASED_SERVICE } from "../../ContractGQLQueries";

interface IServiceCardProps {
  id: string;
  purchaseData?: PurchasedServiceMetadataStruct;
  data?: ServiceStruct;
  purchase?: boolean;
}

const ServiceCard = ({ id, data, purchaseData, purchase = false }: IServiceCardProps) => {
  const cardStyles = useStyles();
  const router: NextRouter = useRouter();
  const [loadedData, setLoadedData] = useState<
    ServiceStruct
  >(data);

  const [serviceOwnerLensData, setServiceOwnerLensData] =
    useState<ProfileStructStruct>({});
  const [serviceOwnerLensProfileId, setServiceOwnerLensProfileId] =
    useState<number>(0);
  const [serviceMetadata, setServiceMetadata] = useState<any>({});
  const [displayImg, setDisplayImg] = useState<Buffer>();
  const [errors, setErrors] = useState<any>({
    metadataError: false,
  });
  const dispatch = useDispatch();

  const userAddress = useSelector(selectUserAddress);

  const networkManager_resolveService = useContractWrite(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "resolveService",
    {
      args: [loadedData?.id, purchaseData?.purchaseId],
      onSuccess: async (data) => {
        if (userAddress === loadedData?.owner) {
          dispatch(
            activePublishedServiceDataAdded({
              ...loadedData,
              status: 2,
            })
          );
        }

        if (userAddress == purchaseData.client) {
          dispatch(
            purchasedServiceDataAdded({
              ...loadedData,
              status: 2,
            })
          );
        }
      },
      onError: (error) => {
        console.log("networkManager_resolveService");
        console.log(error);
      },
    }
  );

  const lensHub_getProfile = useContractRead(
    {
      addressOrName: LENS_HUB_PROXY,
      contractInterface: LensHubInterface,
    },
    "getProfile",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      args: [serviceOwnerLensProfileId],
      onSuccess: (data) => {
        setServiceOwnerLensData(data);
      },
      onError: (error) => console.log(error),
    }
  );

  const networkManager_getLensProfileIdFromAddress = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getLensProfileIdFromAddress",
    {
      enabled: false,
      chainId: CHAIN_ID,
      args: [loadedData?.owner ? loadedData?.owner : ZERO_ADDRESS],
      onSuccess: (data: Result) => {
        setServiceOwnerLensProfileId(hexToDecimal(data._hex));
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const getServiceMetadata = async (ptr) => {
    let retVal: any = {};

    try {
      if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
        const ipfs = create({
          url: "/ip4/127.0.0.1/tcp/8080",
        });

        retVal = await ipfs.get(`/ipfs/${ptr}`).next();
      } else {
        retVal = await fleek.getService(loadedData?.metadataPtr);
      }

      if (!retVal) {
        throw new Error("Unable to retrieve service metadata data");
      } else {
        const jsonString = Buffer.from(retVal.value).toString("utf8");
        const parsedString = jsonString.slice(
          jsonString.indexOf("{"),
          jsonString.lastIndexOf("}") + 1
        );
        const parsedData = JSON.parse(parsedString);
        const updatedImg = Buffer.from(parsedData.serviceThumbnail.data);

        setDisplayImg(updatedImg);
        setServiceMetadata(parsedData);
      }
      setErrors({
        metadataErrors: false,
      });
    } catch (error) {
      setErrors({
        ...errors,
        metadataError: true,
      });
    }
  };

  const handleOnNavigateToServicePage = () => {
    router.push({
      pathname: "/contract/view/service",
      query: {
        ...loadedData,
        id: Number(id),
        wad: [
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
  }, [loadedData?.owner]);

  useEffect(() => {
    //if data doesnt exist get it from contract
    if (!data) {
      //TODOD: get serivce gql call
      setLoadedData({});
    } else {
      if (loadedData.metadataPtr) {
        getServiceMetadata(loadedData.metadataPtr);
      }
    }
  }, [id, loadedData.id]);


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
    if (loadedData?.owner === userAddress) {
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
    <Card variant="outlined" className={cx(cardStyles.root)}>
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
            <VerifiedAvatar
              lensProfile={serviceOwnerLensData}
              lensProfileId={serviceOwnerLensProfileId}
              address={loadedData?.owner}
              showValue={false}
              avatarSize={30}
            />
          </Stack>
        </Box>

        <Typography
          paragraph
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
          I will manage your social media account on any platform. I have over
          10 years of exp
        </Typography>

        <Typography variant="caption">
          Collected by 20 people in your network
        </Typography>

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
    </Card>
  );
};

export { type IServiceCardProps };
export default ServiceCard;
