import { Box, Typography, Button, Avatar } from "@mui/material";
import { NextRouter, useRouter } from "next/router";
import { GradientAvatarClassKey } from "@mui-treasury/styles/avatar/gradient/gradientAvatar.styles";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
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
import { ProfileStructStruct } from "../../../../typechain-types/ILensHub";

interface IVerifiedAvatarProps {
  avatarSize?: number;
  address: string;
  lensProfileId: number;
  lensProfile: ProfileStructStruct;
  showValue?: boolean;
  showHandle?: boolean;
}

const VerifiedAvatar: FC<IVerifiedAvatarProps> = ({
  avatarSize = 80,
  address = ZERO_ADDRESS,
  lensProfileId = 0,
  lensProfile,
  showValue = true,
  showHandle = true
}) => {
  const [displayImg, setDisplayImg] = useState<Buffer | string>("");
  const router: NextRouter = useRouter();
  const styles: ClassNameMap<GradientAvatarClassKey> = useGradientAvatarStyles({
    size: avatarSize,
    gap: 3,
    thickness: 3,
    gapColor: "#f4f7fa",
    color: "linear-gradient(to bottom right, #feac5e, #c779d0, #4bc0c8)",
  });

  const [fallbackLensProfileId, setFallbackLensProfileId] = useState<number>(0)
  const [fallbackLensProfile, setFallbackLensProfile] = useState<ProfileStructStruct>({})

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
      args: [fallbackLensProfileId],
      onSuccess: (data) => {
        setFallbackLensProfile(data);
      },
      onError: (error) => console.log(error),
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
    },
    "getLensProfileIdFromAddress",
    {
      enabled: false,
      chainId: CHAIN_ID,
      args: [address],
      onSuccess: (data: Result) => {
        setFallbackLensProfileId(hexToDecimal(data._hex));
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  useEffect(() => {
    if (address) {
      networkManager_getLensProfileIdFromAddress.refetch()
    }
  }, [address])

  const renderHandle = (): string => {
    if (lensProfile && lensProfile.handle) {
      return lensProfile.handle
    } else if (fallbackLensProfile && fallbackLensProfile.handle) {
      return fallbackLensProfile.handle
    } else {
      return "Unknown Handle"
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      component={Button}
      disableElevation
      disableRipple
      disableFocusRipple
      disableTouchRipple
      onClick={() => router.push("/profile")}
    >
      <div
        style={{
          margin: "5px 0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className={styles.root}
      >
        {!displayImg ? (
          <Jazzicon
            diameter={avatarSize}
            seed={jsNumberForAddress(String(address))}
          />
        ) : (
          <Avatar src={src} />
        )}
      </div>

      <Box textAlign="center">
        {
          showHandle && (
            <Typography
            fontWeight="medium"
            variant="body2"
            color="#616161"
            width="auto"
            noWrap
          >
            {renderHandle()}
          </Typography>
          )
        }
       
        {showValue ? (
          <Typography
            variant="caption"
            color="text.primary"
            width="auto"
            noWrap
          >
            ${Math.floor(Math.random() * 101).toFixed(2)} Value
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export { type IVerifiedAvatarProps };
export default VerifiedAvatar;
