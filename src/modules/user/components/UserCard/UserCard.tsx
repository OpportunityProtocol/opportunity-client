import { QueryResult, useQuery } from "@apollo/client";
import { Check, CommentOutlined, MoreHorizOutlined, MoreVert, PostAddOutlined } from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  CardActions,
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
import { getLensFollowingStateByAddressQuery, getLensProfileById, getProfileFeed } from "../../../lens/LensGQLQueries";
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


const UserCard: FC = ({ freelancer }) => {
  const router: NextRouter = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [metadata, setMetadata] = useState<any>({})
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [lensProfileData, setLensProfileData] = useState<any>({})

  const open = Boolean(anchorEl);

  const lensFollowingStateQuery: QueryResult = useQuery(getLensFollowingStateByAddressQuery(freelancer.address), {
    client: lens_client,
    skip: true

  })

  useEffect(() => {
    async function downloadMetadata() {
      if (freelancer?.metadata) {
        fleek.getUser(freelancer?.metadata?.slice(10)).then((data) => setMetadata(data))
      }
    }

    setLoading(true)
    downloadMetadata().catch(error => console.log(error)).finally(() => setLoading(false))

  }, [freelancer?.metadata])

  useEffect(() => {
    async function getProfile() {
      const profile = await getLensProfileById(`0x${Math.abs(Number(freelancer?.id)).toString(16)}`)
      setLensProfileData(profile)

      console.log(profile)
    }

    getProfile()
   
  }, [freelancer?.address])

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

  const onOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onCloseUserMenu = () => {
    setAnchorEl(null);
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
    <Card onClick={onViewProfile} variant='elevation' sx={{ border: '1px solid #eaeaea', boxShadow: '0px 6px 15px -3px rgba(0,0,0,0.1)', cursor: 'pointer', width: '100%' }}>
      <CardContent>
        <Stack mb={2} direction='row' alignItems='flex-start' sx={{ width: '100%' }}>
          <Stack spacing={1} direction='row' alignItems='center' sx={{ width: '100%' }}>
            <Avatar src={freelancer?.imageURI} />
            <Box>
              <Typography color='primary' variant='subtitle2'>
                @{freelancer?.handle}
              </Typography>
              <Box>
                <Chip label={lensProfileData?.ownedBy} variant='filled' sx={{ bgcolor: '#eee' }} />
              </Box>
            </Box>
          </Stack>

          <IconButton onClick={onOpenUserMenu} size="small">
            <MoreVert fontSize='small' />
          </IconButton>
        </Stack>
        <Box>
          {
            loading ?
              <Skeleton variant='text' component='h4' sx={{ height: 30, width: '100%' }} />
              :
              <Typography color='text.secondary' variant='body2' paragraph sx={{ height: 40 }}>
                {metadata?.description ? metadata?.description : ''}
              </Typography>
          }
        </Box>
      </CardContent>
    </Card >
  );
};

export default UserCard
