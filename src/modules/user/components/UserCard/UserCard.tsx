import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  alpha,
} from "@mui/material";
import { NextRouter, useRouter } from "next/router";
import { ClassNameMap } from "@mui/material";
import { useState, useEffect, FC } from "react";
import {
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS,
  PINATA_JWT,
  ZERO_ADDRESS,
} from "../../../../constant";
import { LensHubInterface, NetworkManagerInterface } from "../../../../abis";
import { CHAIN_ID } from "../../../../constant/provider";
import { hexToDecimal } from "../../../../common/helper";
import { useContractRead } from "wagmi";
import { Result } from "ethers/lib/utils";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { QueryResult, useQuery } from "@apollo/client";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "../../UserGQLQueries";
import fleek from "../../../../fleek";
import { create } from "ipfs-http-client";
import { getJSONFromIPFSPinata } from "../../../../common/ipfs-helper";

interface IVerifiedAvatarProps {
  avatarSize?: number;
  address: string;
  lensProfileId: number;
  lensProfile: any;
  showValue?: boolean;
  showHandle?: boolean;
}

const VerifiedAvatar: FC<IVerifiedAvatarProps> = ({
  avatarSize = 40,
  address = ZERO_ADDRESS,
  lensProfileId = 0,
  lensProfile,
  showValue = true,
  showHandle = true,
}) => {
  const [displayImg, setDisplayImg] = useState<Buffer | string>("");
  const router: NextRouter = useRouter();
  const [state, setState] = useState<any>({});

  const [fallbackLensProfileId, setFallbackLensProfileId] = useState<number>(0);
  const [fallbackLensProfile, setFallbackLensProfile] =
    useState<any>({});

  const lensHub_getProfile = useContractRead(
    {
      addressOrName: LENS_HUB_PROXY,
      contractInterface: LensHubInterface,
    functionName: "getProfile",
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      args: [fallbackLensProfileId],
      onSuccess: (data) => {
        setFallbackLensProfile(data);
      },
    }
  );

  useEffect(() => {
    if (fallbackLensProfileId !== 0) {
      lensHub_getProfile.refetch({
        throwOnError: true,
      });
    }
  }, [fallbackLensProfileId]);

  const networkManager_getLensProfileIdFromAddress = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    functionName: "getLensProfileIdFromAddress",
      enabled: false,
      chainId: CHAIN_ID,
      args: [address],
      onSuccess: (data: Result) => {
        setFallbackLensProfileId(hexToDecimal(data._hex));
      },
      onError: (error) => {},
    }
  );

  const downloadMetadata = async (ptr: string) => {
    let retVal: any = {};

    try {
      if (!PINATA_JWT) {
        const ipfs = create({
          url: "/ip4/127.0.0.1/tcp/8080",
        });

        retVal = await ipfs.get(`/ipfs/${ptr}`).next();

        const jsonString = Buffer.from(retVal.value).toString("utf8");
        const parsedString = jsonString.slice(
          jsonString.indexOf("{"),
          jsonString.lastIndexOf("}") + 1
        );
        const parsedData = JSON.parse(parsedString);
        setState({
          ...state,
          ...parsedData,
        });
      } else {
        retVal = await getJSONFromIPFSPinata(ptr) //await fleek.getUser(ptr);
        setState({
          ...state,
          ...retVal
        })
      }

    } catch (error) {
      console.log("Error downloading metadata from profile");
    }
  };

  const verifiedUserQuery: QueryResult = useQuery(
    GET_VERIFIED_FREELANCER_BY_ADDRESS,
    {
      variables: {
        userAddress: address,
      },
    }
  );

  useEffect(() => {
    if (!verifiedUserQuery.loading && verifiedUserQuery.data) {
      downloadMetadata(verifiedUserQuery.data?.verifiedUsers[0]?.metadata);
    }
  }, [verifiedUserQuery.loading]);

  useEffect(() => {
    if (address) {
      networkManager_getLensProfileIdFromAddress.refetch();
      verifiedUserQuery.refetch();
    }
  }, [address]);

  const renderHandle = (): string => {
    if (lensProfile && lensProfile.handle) {
      return lensProfile.handle;
    } else if (fallbackLensProfile && fallbackLensProfile.handle) {
      return fallbackLensProfile.handle;
    } else {
      return "Unknown Handle";
    }
  };

  return (
    <Card
      onClick={() => router.push(`/view/profile/${address}`)}
      variant="elevation"
      elevation={0}
      sx={{
        cursor: "pointer",
        borderRadius: 2,
        height: 80,

        width: "100%",
        maxWidth: "100%",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography fontSize={12}>
              {state?.display_name ? state?.display_name : "Unknown"}
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold">
              {renderHandle()}
            </Typography>
          </Box>

          <Jazzicon
            diameter={avatarSize}
            seed={jsNumberForAddress(String(address))}
          />
        </Box>

        {state?.description ? (
          <Typography fontSize={12} paragraph color="text.secondary">
            {state?.description}
          </Typography>
        ) : (
          <Typography fontSize={12} paragraph color="text.secondary">
            {" "}
            No description{" "}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export { type IVerifiedAvatarProps };
export default VerifiedAvatar;
