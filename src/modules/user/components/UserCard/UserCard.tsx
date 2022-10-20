import { QueryResult, useQuery } from "@apollo/client";
import { MoreHorizOutlined } from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  alpha,
  styled,
  Skeleton,
} from "@mui/material";
import { signTypedData } from "@wagmi/core";
import { ethers } from "ethers";
import { NextRouter, useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useContractRead, useContractWrite } from "wagmi";
import { LensHubInterface } from "../../../../abis";
import { lens_client } from "../../../../apollo";
import { LENS_HUB_PROXY } from "../../../../constant";
import fleek from "../../../../fleek";
import { getLensFollowingStateByAddressQuery } from "../../../lens/LensGQLQueries";
const getDomain = () => {
  return {
    name: "Lens Protocol Profiles",
    version: "1",
    chainId: CHAIN_ID,
    verifyingContract: LENS_HUB_PROXY,
  };
};


const getTypes = () => {
  return {
    FollowWithSig: [
      { name: "profileIds", type: "uint256[]" },
      { name: "datas", type: "bytes[]" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };
};

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: 14
}));

const UserCard: FC = ({ freelancer }) => {
  const router: NextRouter = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [metadata, setMetadata] = useState<any>({}) 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onCloseUserMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    async function downloadMetadata() {
      if (freelancer?.metadata) {
        fleek.getUser(freelancer?.metadata?.slice(10)).then((data) => setMetadata(data))
      }
    }

    setLoading(true)
    downloadMetadata().catch(error => console.log(error)).finally(() => setLoading(false))
  }, [freelancer?.metadata])

  const lensFollowingStateQuery: QueryResult = useQuery(getLensFollowingStateByAddressQuery(freelancer.address), {
    client: lens_client,
    skip: true

  })

  const { data: userLensSigNonce } = useContractRead({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    functionName: "sigNonces",
    args: [freelancer?.address],
    enabled: true,
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
  })

  const { write: follow } = useContractWrite({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    functionName: "follow",
    mode: "recklesslyUnprepared",
    args: [[Number(freelancer?.id)], [[]]],
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSettled(data, error) {
      lensFollowingStateQuery.refetch()
    },
  });

  const onSign = async () => {
    const domain = getDomain();
    const types = getTypes();
    const value = getValues();
    await signTypedData({ domain, types, value });
  };

  const getValues = () => {
    return {
      profileIds: [Number(freelancer?.id)],
      datas: [[]],
      nonce: userLensSigNonce,
      deadline: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    };
  };

  const onViewProfile = () => {
    router.push(`/view/profile/${freelancer?.address}`)

    onCloseUserMenu()
  }
  const onSendMessage = () => {
    onCloseUserMenu()
  }
  const onFollow = () => {
    follow({
      recklesslySetUnpreparedArgs: [[Number(freelancer?.id)], [[]]],
    })

    onCloseUserMenu()
  }

  return (
    <Grid item xs={4}>
      <Card onClick={onViewProfile} variant='outlined' sx={{ boxShadow: 'rgba(0, 0, 0, 0.1) -4px 9px 25px -6px', cursor: 'pointer', border: `1px solid #eee` }}>
        <CardContent>
          <Box py={1.5} display='flex' alignItems='flex-start' justifyContent='space-between'>
            <Stack spacing={2} direction='row' alignItems='center'>
              <Avatar src={freelancer?.imageURI} sx={{ width: 60, height: 60, border: `1px solid ${alpha("#b8e0d0", 0.5)}` }} />

              <Box >
                <Typography sx={{ height: 22, maxWidth: 180, textOverflow: 'ellipsis', overflow: 'hidden' }} fontWeight='bold' fontSize={12}>
                  {freelancer?.handle}
                </Typography>
                <Chip sx={{ py: 1, borderRadius: 1, color: '#757575', maxWidth: 100, fontSize: 12 }} size='small' variant='filled' label={freelancer?.address} />
              </Box>
            </Stack>

            <>
              <IconButton id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={onOpenUserMenu}>
                <MoreHorizOutlined sx={{ color: '#757575' }} />
              </IconButton>

              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={onCloseUserMenu}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <StyledMenuItem onClick={onViewProfile}>View Profile</StyledMenuItem>
                <StyledMenuItem onClick={onSendMessage}>Send a message</StyledMenuItem>
                <StyledMenuItem onClick={onFollow}>Follow</StyledMenuItem>
              </Menu>
            </>

          </Box>
          <Box>
            {
              loading ? 
<Skeleton variant='text' component='h4' sx={{ height: 30, width: '100%'}} />
:
<Typography color='text.secondary' variant='body2' paragraph sx={{ height: 40 }} fontSize={12}>
{metadata?.description ? metadata?.description : 'Unable to load user about me'}
</Typography>
            }
   
          </Box>
          

        </CardContent>
      </Card>
    </Grid>
  );
};

export default UserCard
