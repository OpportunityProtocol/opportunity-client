import React, { useState, useEffect } from "react";
import { useStyles } from "../../../common/styles/DashboardStyles";

import {
  Box,
  Typography,
  Container,
  Button,
  Divider,
  Grid,
  Card,
  Stack,
  Paper,
  Avatar,
  Alert,
  CardContent,
  Tabs,
  Tab,
  DialogContentText,
  Chip,
  alpha,
  CardActions,
} from "@mui/material";

//import { LineChart, Line, ResponsiveContainer } from "recharts";

import { timelineButtons } from "../../../modules/market/MarketConstants";
import ServiceCard from "../../../modules/contract/components/ServiceCard/ServiceCard";
import { NextRouter, useRouter } from "next/router";
import { NextPage } from "next";
import {
  useAccount,
  useContract,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
  useSignTypedData,
} from "wagmi";

import {
  LENS_HUB_PROXY,
  LENS_INTERACTION_LOGIC_ADDRESS,
  NETWORK_MANAGER_ADDRESS,
  PINATA_JWT,
  ZERO_ADDRESS,
} from "../../../constant";
import {
  FollowNFT,
  LensHubInterface,
  NetworkManagerInterface,
} from "../../../abis";
import { CHAIN_ID } from "../../../constant/provider";
import { hexToDecimal } from "../../../common/helper";
import { Result } from "ethers/lib/utils";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "../../../modules/user/UserGQLQueries";
import InvestmentTable from "../../../modules/market/components/InvestmentTable";
import { ethers, Event } from "ethers";
import {
  GET_CONTRACTS_BY_EMPLOYER,
  GET_CONTRACTS_BY_WORKER,
  GET_PURCHASED_SERVICES_BY_CLIENT,
  GET_SERVICES_BY_CREATOR,
} from "../../../modules/contract/ContractGQLQueries";
import JobDisplay from "../../../modules/market/components/JobDisplay";
import { EditOutlined, Info, InfoOutlined, InfoRounded, Settings } from "@mui/icons-material";
import { create } from "ipfs-http-client";
import fleek from "../../../fleek";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { ConfirmationDialog } from "../../../common/components/ConfirmationDialog";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../../../modules/user/userReduxSlice";
import { getJSONFromIPFSPinata } from "../../../common/ipfs-helper";
import { getLensFollowingStateByAddressQuery, lensGetFollowersStateByProfileId, LENS_GET_COMPLETE_FOLLOW_STATE_BY_ADDRESS_AND_PROFILE_ID, LENS_GET_FOLLOWERS_STATE_BY_PROFILE_ID, LENS_GET_FOLLOWING_STATE_BY_ADDRESS } from "../../../modules/lens/LensGQLQueries";
import { lens_client } from "../../../apollo";
import TabPanel from "../../../common/components/TabPanel/TabPanel";
import { a11yProps } from "../../../common/components/TabPanel/helper";

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

const connectDialogContent = [
  <DialogContentText id="alert-dialog-description">
    <Typography fontSize={20} fontWeight="bold" py={1}>
      {" "}
      You are about to follow another user which will require two actions:
    </Typography>

    <ul>
      <li>
        {" "}
        <Typography>Signing a transaction</Typography>
      </li>
      <li>
        <Typography>Executing the transaction</Typography>
      </li>
    </ul>
  </DialogContentText>,
  <DialogContentText id="alert-dialog-description">
    <Box py={2}>
      <Typography fontSize={20} fontWeight="bold" py={1}>
        Sign the transaction
      </Typography>
      <Typography variant="subtitle2">
        Your wallet will prompt you to sign the transaction.
      </Typography>
    </Box>
  </DialogContentText>,

  <DialogContentText id="alert-dialog-description">
    <Box py={2}>
      <Typography fontSize={20} fontWeight="bold" py={1}>
        Confirm Connect
      </Typography>
      <Typography variant="subtitle2">Accept the transaction</Typography>
    </Box>
  </DialogContentText>,
];

const ProfilePage: NextPage<any> = () => {
  const router: NextRouter = useRouter();
  const { address } = router.query;

  const classes = useStyles();
  const accountData = useAccount();
  const signer: ethers.Signer = useSigner();
  const userAddress = useSelector(selectUserAddress);

  const [value, setValue] = React.useState<number>(0);
  const [connectDialogIsOpen, setConnectDialogIsOpen] = useState<boolean>(false);
  const [following, setFollowing] = useState<Array<any>>([])
  const [followers, setFollowers] = useState<Array<any>>([])

  const [profileState, setProfileState] = useState<any>({
    general: {},
    lensProfileId: 0,
    lensProfile: {},
    verifiedFreelancerData: {},
  });

  const { signTypedData } =
    useSignTypedData({
      onSettled(data, error) {

      },
      onError(error) { console.log(error) },
    });

  const verifiedUserQuery: QueryResult = useQuery(
    GET_VERIFIED_FREELANCER_BY_ADDRESS,
    {
      variables: {
        userAddress: address,
      },
    }
  );

  //contracts created
  const contractsByEmployerQuery: QueryResult = useQuery(
    GET_CONTRACTS_BY_EMPLOYER,
    {
      variables: {
        employer: address,
      },
    }
  );

  //contracts worked
  const contractsByWorkerQuery: QueryResult = useQuery(
    GET_CONTRACTS_BY_WORKER,
    {
      variables: {
        worker: address,
      },
    }
  );

  //services created
  const servicesCreated: QueryResult = useQuery(GET_SERVICES_BY_CREATOR, {
    variables: {
      creator: address,
    },
  });

  const lensFollowingStateQuery: QueryResult = useQuery(getLensFollowingStateByAddressQuery(address), {
    client: lens_client,
    skip: true

  })

  const lensFollowerStateQuery: QueryResult = useQuery(lensGetFollowersStateByProfileId(String(profileState?.lensProfileId)), {
    client: lens_client,
    skip: true
  })

  const networkManager_getLensProfileIdFromAddress = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getLensProfileIdFromAddress",
    enabled: true,
    watch: false,
    chainId: CHAIN_ID,
    args: [accountData?.address],
    onSuccess: (data: Result) => {
      setProfileState({
        ...profileState,
        lensProfileId: data?._hex,
      });
    },
    onError: (error) => { },
  });

  //getProfile
  const lensHub_getProfile = useContractRead({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    functionName: "getProfile",
    enabled: false,
    watch: false,
    chainId: CHAIN_ID,
    args: [Number(profileState.lensProfileId)],
    onSuccess: (data: Result) => {
      setProfileState({
        ...profileState,
        lensProfile: data,
      });
    },
  });

  const { data: userLensSigNonce } = useContractRead({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    functionName: "sigNonces",
    args: [userAddress],
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
    args: [[Number(profileState?.lensProfileId)], [[]]],
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSettled(data, error) {
      lensFollowingStateQuery.refetch()
    },
  });
  
  useEffect(() => {
    if (!verifiedUserQuery.loading && verifiedUserQuery.data) {
      setProfileState({
        ...profileState,
        verifiedFreelancerData: verifiedUserQuery.data?.verifiedUsers[0],
      });

      //only fetch profile id and created services if the user is a verified freelancers
      if (verifiedUserQuery.data?.verifiedUsers[0]?.metadata) {
        downloadMetadata(verifiedUserQuery.data?.verifiedUsers[0]?.metadata);
      }

      networkManager_getLensProfileIdFromAddress.refetch();
      servicesCreated.refetch();
    }
  }, [verifiedUserQuery.loading]);

  useEffect(() => {
    async function fetchLensProfileState() {
      if (Number(profileState.lensProfileId) > 0) {
        lensHub_getProfile.refetch();
        await lensFollowerStateQuery.refetch()
          .then((queryResult) => {
            setFollowers([...queryResult?.data?.followers?.items])
          })
          .catch((error) => { })
      }

      await lensFollowingStateQuery.refetch()
        .then((queryResult) => {
          setFollowing([...queryResult?.data?.following?.items])
        })
        .catch((error) => { })
    }

    fetchLensProfileState()

  }, [address, profileState?.lensProfileId])

  useEffect(() => {
    networkManager_getLensProfileIdFromAddress.refetch();
    contractsByEmployerQuery.refetch();
    contractsByWorkerQuery.refetch();
    verifiedUserQuery.refetch();
    servicesCreated.refetch();
  }, [address]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onSign = async () => {
    const domain = getDomain();
    const types = getTypes();
    const value = getValues();
    await signTypedData({ domain, types, value });
  };

  const getValues = () => {
    return {
      profileIds: [Number(profileState?.lensProfileId)],
      datas: [[]],
      nonce: userLensSigNonce,
      deadline: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    };
  };

  const onConnect = async () => {
    follow({
      recklesslySetUnpreparedArgs: [[Number(profileState?.lensProfileId)], [[]]],
    });
  };

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

        setProfileState({
          ...profileState,
          general: {
            ...profileState.general,
            ...parsedData,
          },
        });
      } else {
        retVal = await fleek.getUser(String(ptr).slice(10));

        setProfileState({
          ...profileState,
          general: {
            ...profileState.general,
            ...retVal
          }
        })
      }

    } catch (error) { console.log(error) }
  };

  return (
    <Container maxWidth="lg" sx={{ height: 'calc(100vh - 65px)', }}>
      <Box mb={2}>
        <Stack pb={2} direction='row' alignItems='flex-start' justifyContent='space-between'>
          <Box>
            {profileState?.lensProfile?.imageURI ? (
              <img
                src={profileState?.lensProfile?.imageURI}
                style={{ width: 130, height: 130, borderRadius: 130 }}
              />
            ) : (
              <Jazzicon
              svgStyles={{ borderRadius: 130 }}
              paperStyles={{ borderRadius: 130 }}
                diameter={130}
                seed={jsNumberForAddress(String(address))}
              />
            )}
            <Box>
              <Typography
                fontWeight="600"
                color="black"
                fontSize={23}
                py={1}
              >
                {profileState.verifiedFreelancerData?.handle}

              </Typography>
              <Chip sx={{ py: 1, borderRadius: 1, color: '#747474', maxWidth: 100, fontSize: 12 }} size='small' variant='filled' label={address} />
              {/*profileState?.general?.display_name*/}
            </Box>
          </Box>
          <Box sx={{ width: 350 }}>
            <Card sx={{ width: 350, height: 150, bgcolor: 'rgb(246, 248, 250)' }} variant='outlined'>
              <CardContent>
                <Typography fontWeight='600' my={1} mb={1.5} fontSize={12}>
                  Value: 0 DAI
                </Typography>
                <Stack my={1} spacing={1} direction='row' alignItems='center'>
                  <Typography fontWeight="medium" py={1} fontSize={12}>
                    Skills:
                  </Typography>

                  {profileState?.general?.skills &&
                    profileState?.general?.skills?.length ? (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      {profileState?.general?.skills.map((cert) => {
                        return <Chip key={cert} sx={{ fontSize: 12, borderRadius: 1, border: '1px solid #ddd' }} label={cert} size="small" />;
                      })}
                    </Stack>
                  ) : (
                    <Typography>No skills</Typography>
                  )}
                </Stack>
                <Stack my={1} spacing={1} direction='row' alignItems='center'>
                  <Typography fontWeight="medium" py={1} fontSize={12}>
                    Languages:
                  </Typography>

                  {profileState?.general?.languages &&
                    profileState?.general?.languages?.length ? (
                    <Stack direction="row" alignItems="center" spacing={2}>
                     {profileState?.general?.languages.map((cert) => {
                        return <Chip key={cert} sx={{ fontSize: 12, borderRadius: 1, border: '1px solid #ddd' }} label={cert} size="small" />;
                      })}
                    </Stack>
                  ) : (
                    <Typography fontSize={12}>No languages</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
            <Stack my={1} spacing={1} direction='row' alignItems='center' justifyContent='flex-end'>
              {String(
                profileState.verifiedFreelancerData?.address
              ).toLowerCase() !== String(address).toLowerCase() ? (
                <Button
                  color="primary"
                  sx={{ borderRadius: 5 }}
                  disabled={profileState?.lensProfileId <= 0}
                  variant="contained"
                  onClick={() => setConnectDialogIsOpen(true)}
                >
                  <Typography sx={{ color: 'white' }} fontWeight='600' fontSize={12}>
                    Follow
                  </Typography>

                </Button>
              ) : null}

              <Button
                variant="outlined"
                color="secondary"
                sx={{ border: '1px solid #ddd', borderRadius: 5 }}
                onClick={() =>
                  router.push(
                    `/view/profile/${address}/settings?metadata=${verifiedUserQuery?.data?.verifiedUsers[0]?.metadata}`
                  )
                }
              >
                <Typography color='text.secondary' fontWeight='600' fontSize={12}>
                  Edit Profile
                </Typography>
              </Button>
            </Stack>
          </Box>
        </Stack>
        <Box>
          {profileState?.general?.description ? (
            <Typography paragraph variant='body2' color="text.secondary">
              {profileState?.general?.description}
            </Typography>
          ) : (
            <Typography>No description</Typography>
          )}
        </Box>
        <Box
          sx={{ width: "100%" }}
          component={Stack}
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <Box>
            <Stack spacing={0.5} direction='row' alignItems="center">
              <Typography
                textAlign="center"
                color='text.secondary'
                fontSize={12}

              >
                Followers:
              </Typography>

              <Typography fontSize={12} fontWeight='bold' color='text.secondary'>
                {followers.length}
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Stack spacing={0.5} direction='row' alignItems="center">
              <Typography
                textAlign="center"
                color='text.secondary'
                fontSize={12}

              >
                Following:
              </Typography>
              {" "}
              <Typography fontSize={12} fontWeight='bold' color='text.secondary'>
                {following.length}
              </Typography>
            </Stack>
          </Box>
        </Box>

      </Box>


      <Grid
        container
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Grid item xs={12}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{}}>
              <Tabs
                textColor="secondary"
                indicatorColor="secondary"

                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  sx={{ color: value === 0 ? '#212121' : '#9e9e9e' }}
                  label="All Activity"
                  {...a11yProps(0)}
                />
                <Tab label="Worked Contracts" sx={{ color: value === 2 ? '#212121' : '#9e9e9e' }} icon={<Chip sx={{ fontSize: 10, color: '#757575' }} label={contractsByWorkerQuery.data?.contracts.filter(
        (contract) => contract.owner === 2
      ).length} size='small' variant='filled' />} iconPosition='end' {...a11yProps(1)} />
                <Tab label="Published Services" sx={{ color: value === 3 ? '#212121' : '#9e9e9e' }} icon={<Chip sx={{ fontSize: 10, color: '#757575' }} label={servicesCreated.data?.services?.length} size='small' variant='filled' />} iconPosition='end' {...a11yProps(2)} />
                <Tab label="Published Contracts" sx={{ color: value === 4 ? '#212121' : '#9e9e9e' }} icon={<Chip sx={{ fontSize: 10, color: '#757575' }} label={contractsByEmployerQuery.data?.contracts?.length} size='small' variant='filled' />} iconPosition='end' {...a11yProps(3)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Typography>No publications</Typography>
            </TabPanel>
            <TabPanel value={value} index={1}>
            <Grid
                container
                direction="row"
                alignItems="center"

              >
                {contractsByWorkerQuery.data?.contracts.filter((contract) => contract.owner === 2) &&
                  contractsByWorkerQuery.data?.contracts.filter((contract) => contract.owner === 2)?.length > 0 ? (
                    contractsByWorkerQuery.data?.contracts.filter((contract) => contract.owner === 2)?.map((contract) => {
                    return <JobDisplay data={contract} />;
                  })
                ) : (
                  <Typography>
                    {profileState?.general?.display_name}s hasn't created any
                    contracts.
                  </Typography>
                )}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
            <Grid
                container
                direction="row"
                alignItems="center"

              >
               
                {servicesCreated.data?.services &&
                  servicesCreated.data?.services?.length > 0 ? (
                    servicesCreated.data?.services?.map((service) => {
                      return (
                        <ServiceCard
                        outlined={true}
                        id={service?.serviceId}
                        data={service}
                      />
                      )
                    })
                ) : (
                  <Typography>
                    {profileState?.general?.display_name}s hasn't created any
                    services.
                  </Typography>
                )}
              </Grid>

 
            </TabPanel>
            <TabPanel value={value} index={3}>
            <Grid
                container
                direction="row"
                alignItems="center"

              >
                {contractsByEmployerQuery.data?.contracts &&
                  contractsByEmployerQuery.data?.contracts?.length > 0 ? (
                    contractsByEmployerQuery.data?.contracts.map((contract) => {
                    return <JobDisplay data={contract} />;
                  })
                ) : (
                  <Typography>
                    {profileState?.general?.display_name}s hasn't created any
                    contracts.
                  </Typography>
                )}
              </Grid>
            </TabPanel>

          </Box>
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={connectDialogIsOpen}
        onOpen={() => { }}
        onClose={() => {
          setConnectDialogIsOpen(false);
        }}
        signAction={onSign}
        primaryAction={onConnect}
        primaryActionTitle={"Connect"}
        hasSigningStep={false}
        content={connectDialogContent}
      />
    </Container>
  );
};

export default ProfilePage;
