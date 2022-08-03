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
  CardContent,
} from "@mui/material";
import Link from "next/link";
import { LineChart, Line, ResponsiveContainer } from "recharts";

import { timelineButtons } from "../../../modules/market/MarketConstants";
import ServiceCard from "../../../modules/contract/components/ServiceCard/ServiceCard";
import { useRouter } from "next/router";
import UserCard from "../../../modules/user/components/UserCard/UserCard";
import { NextPage } from "next";
import {
  useAccount,
  useContract,
  useContractEvent,
  useContractRead,
  useSigner,
} from "wagmi";
import {
  LENS_HUB_PROXY,
  LENS_INTERACTION_LOGIC_ADDRESS,
  NETWORK_MANAGER_ADDRESS,
  ZERO_ADDRESS,
} from "../../../constant";
import {
  InteractionLogicInterface,
  LensHubInterface,
  NetworkManagerInterface,
} from "../../../abis";
import { CHAIN_ID } from "../../../constant/provider";
import { hexToDecimal } from "../../../common/helper";
import { Result } from "ethers/lib/utils";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "../../../modules/user/UserGQLQueries";
import InvestmentTable from "../../../modules/market/components/InvestmentTable";
import { Event } from "ethers";
import {
  GET_CONTRACTS_BY_EMPLOYER,
  GET_CONTRACTS_BY_WORKER,
  GET_PURCHASED_SERVICES_BY_CLIENT,
  GET_SERVICES_BY_CREATOR,
} from "../../../modules/contract/ContractGQLQueries";
import JobDisplay from "../../../modules/market/components/JobDisplay";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

/**
 * @author Elijah Hampton
 * ProfilePage
 * Used to display an addresses profile and any related informatin
 * TODO: Integrate LENS API for non local dev and usage for followers, following, etc.
 * TODO: Add metadata uploads and edits for profile information
 * @returns NextPage A page type by NextJS
 */
const ProfilePage: NextPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const accountData = useAccount();
  const signer = useSigner()

  const [profileState, setProfileState] = useState<any>({
    lensProfileId: 0,
    lensProfile: {},
    verifiedFreelancerData: {},
    interactions: {
      followers: [],
      following: [],
      interactions: 0,
    },
    servicesCreated: [],
    servicesPurchased: [],
    contractsCreated: [],
    contractsCompleted: [],
  });

  const { address } = router.query;

  const verifiedUserQuery: QueryResult = useQuery(
    GET_VERIFIED_FREELANCER_BY_ADDRESS,
    {
      variables: {
        address,
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

  //services purchased
  const servicesPurchased: QueryResult = useQuery(
    GET_PURCHASED_SERVICES_BY_CLIENT,
    {
      variables: {
        client: address,
      },
    }
  );

  //services created
  const servicesCreated: QueryResult = useQuery(GET_SERVICES_BY_CREATOR, {
    variables: {
      creator: address,
    },
  });

  const networkManager_getLensProfileIdFromAddress = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getLensProfileIdFromAddress",
    {
      enabled: false,
      chainId: CHAIN_ID,
      args: [accountData?.data?.address],
      onSuccess: (data: Result) => {
        setProfileState({
          ...profileState,
          lensProfileId: hexToDecimal(data._hex),
        });
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  //getProfile
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
      args: [profileState.lensProfileId],
      onSuccess: (data: Result) => {
        setProfileState({
          ...profileState,
          lensProfile: data,
        });
      },
      onError: (error) => console.log(error),
    }
  );

  useEffect(() => {
    if (!contractsByEmployerQuery.loading && contractsByEmployerQuery.data) {
      setProfileState({
        ...profileState,
        contractsCreated: contractsByEmployerQuery.data.contracts,
      });
    }
  }, [contractsByEmployerQuery.loading]);

  useEffect(() => {
    if (!contractsByWorkerQuery.loading && contractsByWorkerQuery.data) {
      const contractsCompleted = contractsByWorkerQuery.data.contracts.filter(
        (contract) => contract.owner === 2
      );
      setProfileState({
        ...profileState,
        contractsCompleted,
      });
    }
  }, [contractsByWorkerQuery.loading]);

  useEffect(() => {
    if (!servicesPurchased.loading && servicesPurchased.data) {
      setProfileState({
        ...profileState,
        servicesPurchased: servicesPurchased.data.purchasedServices,
      });
    }
  }, [servicesPurchased.loading]);

  useEffect(() => {
    if (!servicesCreated.loading && servicesCreated.data) {
      setProfileState({
        ...profileState,
        servicesCreated: servicesPurchased.data.services,
      });
    }
  }, [servicesCreated.loading]);

  useEffect(() => {
    verifiedUserQuery.refetch();
    contractsByEmployerQuery.refetch();
    contractsByWorkerQuery.refetch();
    servicesPurchased.refetch();
  }, [address]);

  useEffect(() => {
    if (!verifiedUserQuery.loading && verifiedUserQuery.data) {
      setProfileState({
        ...profileState,
        verifiedFreelancerData: profileState?.verifiedFreelancerData.data.verifiedUser,
      });

      //only fetch profile id and created services if the user is a verified freelancers
      if (String(profileState?.verifiedFreelancerData.data.verifiedUser?.address).toLowerCase() === String(address).toLowerCase()) {
        networkManager_getLensProfileIdFromAddress.refetch();
        servicesCreated.refetch();
      }
    }
  }, [verifiedUserQuery.loading]);

  useEffect(() => {
    if (profileState.lensProfileId !== 0) {
      lensHub_getProfile.refetch();
    }
  }, [profileState.lensProfileId]);

  useEffect(() => {
    if (profileState?.lensProfile?.followNFT && profileState?.lensProfile?.followNFT != ZERO_ADDRESS) {
      fetchAddressFollowerState();
    }

  }, [profileState?.lensProfile?.followNFT]);

  

  //get following
  useContractEvent(
    {
      addressOrName: LENS_INTERACTION_LOGIC_ADDRESS,
      contractInterface: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "follower",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "profileIds",
              type: "uint256[]",
            },
            {
              indexed: false,
              internalType: "bytes[]",
              name: "followModuleDatas",
              type: "bytes[]",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "timestamp",
              type: "256",
            },
          ],
          name: "Followed",
          type: "event",
        },
      ],
    },
    "Followed",
    (event: Event) => {
      const follower: string = event.args[0];
      const profileIds: Array<string> = event.args[1];
      const followModuleDatas: Array<string> = event.args[2];
      const timestamp: number = event.args[3];

      //set a list of all profile ids this address is following
      if (follower === address) {
        setProfileState((prevState) => {
          return {
            ...profileState,
            interactions: {
              ...profileState.interactions,
              following: prevState.interactions.following.concat(profileIds),
            },
          };
        });
      }
    }
  );

  //get followers
  const fetchAddressFollowerState = async () => {
    if (process.env.NEXT_PUBLIC_CHAIN_ENV == "production") {
      //integrate lens api
    } else if (process.env.NEXT_PUBLIC_CHAIN_ENV == "test") {
      //integrate lens api
    } else if (process.env.NEXT_PUBLIC_CHAIN_ENV == "development") {
      if (
        profileState?.lensProfile?.followNFT != ZERO_ADDRESS &&
        profileState?.lensProfile?.followNFT
      ) {
        try {
          const erc721ContractFollowNFT = useContract({
            addressOrName: profileState?.lensProfile?.followNFT,
            contractInterface: "",
          });

          const numFollowers = await erc721ContractFollowNFT.totalSupply();
          setProfileState({
            ...profileState,
            interactions: {
              ...profileState.interactions,
              followers: numFollowers,
            },
          });
        } catch (error) {
          setProfileState({
            ...profileState,
            interactions: {
              ...profileState.interactions,
              followers: [],
            },
          });
        }
      }
    }
  };

  const handleOnFollow = () => {}

  return (
    <Container maxWidth="lg" sx={{}}>
      <Typography
        py={2}
        fontWeight="bold"
        color="rgba(33, 33, 33, .85)"
        fontSize={30}
      >
        Profile
      </Typography>
      {profileState?.verifiedFreelancerData?.address == address ? (
        <Grid
          mt={2}
          mb={5}
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12}>
            <Card
              variant="outlined"
              classes={{
                root: classes.graphContainer,
              }}
            >
              <CardContent>
                <Typography color="#fff" fontWeight="medium" fontSize={20}>
                  Total Skill Value{" "}
                  <Typography
                    px={1}
                    color="#fff"
                    component="span"
                    fontSize={13}
                  >
                    {" "}
                    +0.38
                  </Typography>
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart width={350} height={350} data={data}>
                    <Line
                      type="monotone"
                      dataKey="pv"
                      stroke="rgb(98, 202, 161)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography color="#fff" fontWeight="medium">
                    Price
                  </Typography>
                  <Box display="flex" alignItems="center">
                    {timelineButtons.map((buttonTitle, idx) => (
                      <Button
                        disableElevation
                        disableRipple
                        disableFocusRipple
                        disableTouchRipple
                        variant="text"
                        size="small"
                        classes={{ text: classes.graphButton }}
                        key={idx}
                      >
                        {buttonTitle}
                      </Button>
                    ))}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      <Grid
        container
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Grid item xs={7.5}>
          <Stack direction="column" spacing={5}>
            <Box>
              <Typography pb={2} fontSize={20} fontWeight="medium">
                Services
              </Typography>
              <Box
                component={Grid}
                container
                direction="row"
                alignItems="center"
                spacing={/*3*/ 0}
              >
                {profileState?.servicesCreated &&
                profileState?.servicesCreated.length > 0 ? (
                  profileState?.servicesCreated.map((service) => {
                    return (
                      <ServiceCard id={service?.serviceId} data={service} />
                    );
                  })
                ) : (
                  <Typography>
                    John Dismukes hasn't created any services.
                  </Typography>
                )}
              </Box>
            </Box>

            <Box>
              <Typography pb={2} fontSize={20} fontWeight="medium">
                Contracts
              </Typography>
              <Box
                component={Grid}
                container
                direction="row"
                alignItems="center"
                spacing={/*3*/ 0}
              >
                {profileState.contractsCreated &&
                profileState.contractsCreated.length > 0 ? (
                  profileState?.contractsCreated.map((contract) => {
                    return <JobDisplay data={contract} />;
                  })
                ) : (
                  <Typography>
                    John Dismukes hasn't created any contracts.
                  </Typography>
                )}
              </Box>
            </Box>

            <Box>
              <Typography pb={2} fontSize={20} fontWeight="medium">
                Endorsements
              </Typography>
              <Box
                component={Grid}
                container
                direction="row"
                alignItems="center"
                spacing={/*3*/ 0}
              >
                <Typography>
                  John Dismukes hasn't received any endorsements.
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Typography pb={2} fontSize={20} fontWeight="medium">
            Overview
          </Typography>
          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <Stack alignItems="center">
                <Avatar style={{ width: 80, height: 80 }} />
                <Box py={0.5}>
                  <Typography fontWeight="medium">John Dismuke</Typography>
                  <Typography
                    variant="body2"
                    color="rgb(94, 94, 94)"
                    fontSize={14}
                  >
                    {profileState.verifiedFreelancerData?.handle}
                  </Typography>
                </Box>

                <Typography textAlign="center" py={1} variant="caption">
                  {" "}
                  Get suggestions on John's latest services and contracts by
                  connecting.{" "}
                </Typography>
                <Divider sx={{ width: "100%", mt: 2 }} />

                <Box
                  sx={{ width: "100%", height: 50, pt: 1 }}
                  component={Stack}
                  alignItems="flex-start"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Box>
                    <Stack alignItems="center">
                      <Typography
                        textAlign="center"
                        fontWeight="medium"
                        fontSize={12}
                      >
                        Followers
                      </Typography>
                      <Typography fontWeight="bold">
                        {profileState?.interactions?.followers.length}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Stack alignItems="center">
                      <Typography
                        textAlign="center"
                        fontWeight="medium"
                        fontSize={12}
                      >
                        Following
                      </Typography>
                      <Typography fontWeight="bold">
                        {profileState.interactions.following.length}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Stack alignItems="center">
                      <Typography
                        textAlign="center"
                        fontWeight="medium"
                        fontSize={12}
                      >
                        ?
                      </Typography>
                      <Typography fontWeight="bold">{0}</Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Stack alignItems="center">
                      <Typography
                        textAlign="center"
                        fontWeight="medium"
                        fontSize={12}
                      >
                        Reviews
                      </Typography>
                      <Typography fontWeight="bold">{0}</Typography>
                    </Stack>
                  </Box>
                </Box>

                <Box
                  sx={{ width: "100%", height: "auto", pt: 3 }}
                  component={Stack}
                  alignItems="flex-start"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Box>
                    <Stack alignItems="center">
                      <Typography
                        textAlign="center"
                        fontWeight="medium"
                        fontSize={12}
                      >
                        Contracts Worked
                      </Typography>
                      <Typography fontWeight="bold">
                        {profileState?.contractsCompleted.length}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Stack alignItems="center">
                      <Typography
                        textAlign="center"
                        fontWeight="medium"
                        fontSize={12}
                      >
                        Contracts Created
                      </Typography>
                      <Typography fontWeight="bold">
                        {profileState?.contractsCreated.length}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Stack alignItems="center">
                      <Typography
                        textAlign="center"
                        fontWeight="medium"
                        fontSize={12}
                      >
                        Services Created
                      </Typography>
                      <Typography fontWeight="bold">
                        {profileState?.servicesCreated.length}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box>
                    <Stack alignItems="center">
                      <Typography
                        textAlign="center"
                        fontWeight="medium"
                        fontSize={12}
                      >
                        Services Purchased
                      </Typography>
                      <Typography fontWeight="bold">
                        {profileState?.servicesPurchased.length}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>

                <Button sx={{ mt: 2 }} fullWidth variant="contained" onClick={handleOnFollow}>
                  Connect
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight="medium">Description</Typography>

                <Button variant="text" color="secondary">
                  Edit
                </Button>
              </Stack>
              <Typography variant="caption" color="#9E9E9E">
                No description
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight="medium">Certifications</Typography>

                <Button variant="text" color="secondary">
                  Edit
                </Button>
              </Stack>
              <Typography variant="caption" color="#9E9E9E">
                No certifications
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight="medium">Skills</Typography>

                <Button variant="text" color="secondary">
                  Edit
                </Button>
              </Stack>
              <Typography variant="caption" color="#9E9E9E">
                No skills
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight="medium">Languages</Typography>

                <Button variant="text" color="secondary">
                  Edit
                </Button>
              </Stack>
              <Typography variant="caption" color="#9E9E9E">
                No languages
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper
        sx={{
          overflowY: "hidden",
          p: 2,
          bgcolor: "rgb(233, 234, 238)",
          my: 3,
          width: "100%",
          height: 500,
        }}
        variant="elevation"
        elevation={0}
      >
        <Typography fontWeight="bold" fontSize={20} pb={2}>
          Highlighted Investments
        </Typography>
        <InvestmentTable />
      </Paper>
    </Container>
  );
};

export default ProfilePage;
