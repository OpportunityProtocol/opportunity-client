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

interface IVerifiedAvatarProps {
  avatarSize?: number;
  address: string;
  lensProfileId: number;
  lensProfile: any;
  showValue?: boolean;
  showHandle?: boolean;
}

const VerifiedAvatar: FC<IVerifiedAvatarProps> = ({
  avatarSize = 80,
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

  const lensHub_getProfile = useContractRead({
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
  });

  useEffect(() => {
    if (fallbackLensProfileId !== 0) {
      lensHub_getProfile.refetch({
        throwOnError: true,
      });
    }
  }, [fallbackLensProfileId]);

  const networkManager_getLensProfileIdFromAddress = useContractRead({
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
  });

  const downloadMetadata = async (ptr: string) => {
    let retVal: any = {};

    try {
      if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
        const ipfs = create({
          url: "/ip4/127.0.0.1/tcp/8080",
        });

        retVal = await ipfs.get(`/ipfs/${ptr}`).next();
      } else {
        retVal = await fleek.getUser(ptr);
      }

      if (!retVal) {
        throw new Error("Unable to retrieve user metadata");
      } else {
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
      onClick={() => router.push("/profile")}
      variant="outlined"
      sx={{ cursor: "pointer", borderRadius: 2, width: "100%", maxWidth: 400 }}
    >
      <CardContent
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box mt={1} mb={1}>
          <Jazzicon
            diameter={avatarSize}
            seed={jsNumberForAddress(String(address))}
          />
        </Box>

        <Box>
          <Typography textAlign="center" pb={1}>
            {state?.display_name}
          </Typography>
          <Typography
            textAlign="center"
            pb={1}
            variant="subtitle2"
            fontWeight="bold"
          >
            {renderHandle()}
          </Typography>
        </Box>

        <Typography
          fontSize={15}
          color="rgb(90, 104,119)"
          textAlign="center"
          paragraph
          fontWeight="500"
        >
          {state?.description ? (
            <Typography>{state?.description}</Typography>
          ) : (
            <Typography> No description </Typography>
          )}
        </Typography>

        {showValue ? (
          <Typography
            position="absolute"
            top={15}
            right={15}
            variant="caption"
            color="text.primary"
            fontWeight="medium"
            width="auto"
            noWrap
          >
            ${Math.floor(Math.random() * 101).toFixed(2)} Value
          </Typography>
        ) : null}
      </CardContent>
      <Divider />
      <CardContent>
        <Stack
          textAlign="center"
          direction="row"
          alignItems="center"
          spacing={1}
        >
          {state?.skills?.map((skill) => {
            return <Chip label={skill} key={skill} size="small" />;
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export { type IVerifiedAvatarProps };
export default VerifiedAvatar;
