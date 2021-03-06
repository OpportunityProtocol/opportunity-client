import { Box, Typography, Button, Avatar } from '@mui/material'
import { NextRouter, useRouter } from 'next/router'
import { GradientAvatarClassKey } from '@mui-treasury/styles/avatar/gradient/gradientAvatar.styles';
import { useGradientAvatarStyles } from '@mui-treasury/styles/avatar/gradient';
import { ClassNameMap } from '@mui/material';
import { useState, useEffect, FC } from 'react'
import { LENS_HUB_PROXY, NETWORK_MANAGER_ADDRESS } from '../../../../constant';
import { LensHubInterface, NetworkManagerInterface } from '../../../../abis';
import { CHAIN_ID } from '../../../../constant/provider';
import { hexToDecimal } from '../../../../common/helper';
import { useContractRead } from 'wagmi';
import { Result } from 'ethers/lib/utils';

interface IVerifiedAvatarProps {
  avatarSize?: number;
  address: string;
  src: string;
}

const VerifiedAvatar: FC<IVerifiedAvatarProps> = ({ avatarSize=80, address, src }) => {
  const [lensProfileId, setLensProfileId] = useState<any>(0);
  const [lensProfile, setLensProfile] = useState<any>({});
  const router: NextRouter = useRouter()
  const styles: ClassNameMap<GradientAvatarClassKey> = useGradientAvatarStyles({
    size: avatarSize,
    gap: 3,
    thickness: 3,
    gapColor: '#f4f7fa',
    color: 'linear-gradient(to bottom right, #feac5e, #c779d0, #4bc0c8)',
  });

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
      args: [lensProfileId],
      onSuccess: (data) => {
        setLensProfile(data);
      },
      onError: (error) => console.log(error),
    }
  );

  useEffect(() => {
    if (lensProfileId !== 0) {
      lensHub_getProfile.refetch({
        throwOnError: true,
      });
    }
  }, [lensProfileId]);

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
        setLensProfileId(hexToDecimal(data._hex));
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  useEffect(() => {
    networkManager_getLensProfileIdFromAddress.refetch()
  }, [address])

    return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          component={Button}
          mx={4}
          onClick={() => router.push('/profile')}
        >
          <div
            style={{
              margin: '5px 0px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            className={styles.root}
          >
            <Avatar
              src={src}
            />
          </div>
          <Box textAlign="center">
            <Typography
              fontWeight="medium"
              variant="body2"
              color="#616161"
              width="auto"
              noWrap
            >
              {lensProfile?.handle}
            </Typography>
            <Typography variant="caption" color="text.primary" width="auto" noWrap>
              ${Math.floor(Math.random() * 101).toFixed(2)} Value
            </Typography>
          </Box>
        </Box>
    )
}

export { type IVerifiedAvatarProps }
export default VerifiedAvatar