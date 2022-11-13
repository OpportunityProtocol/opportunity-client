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
    <Card onClick={onViewProfile} variant='elevation' sx={{ border: '1px solid #ddd', boxShadow: 'rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;', cursor: 'pointer', width: '100%' }}>
      <CardContent>
        <Stack mb={2} direction='row' alignItems='flex-start' sx={{ width: '100%' }}>
          <Stack spacing={1} direction='row' alignItems='center' sx={{ width: '100%' }}>
            <Avatar src={freelancer?.imageURI} />
            <Box>
              <Typography fontWeight='500' fontSize={14} variant='subtitle1'>
                Elijah Hampton
              </Typography>
              <Typography color='primary' variant='subtitle2'>
                @{freelancer?.handle}
              </Typography>
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
                {metadata?.description ? metadata?.description : 'Unable to load user about me'}
              </Typography>
          }
        </Box>
      </CardContent>
    </Card >
  );
};

export default UserCard
