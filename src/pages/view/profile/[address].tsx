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
  useContractWrite,
  useSigner,
  useSignTypedData,
} from "wagmi";

import {
  LENS_HUB_PROXY,
  LENS_INTERACTION_LOGIC_ADDRESS,
  NETWORK_MANAGER_ADDRESS,
  ZERO_ADDRESS,
} from "../../../constant";
import {
  FollowNFT,
  InteractionLogicInterface,
  LensHubInterface,
  NetworkManagerInterface,
} from "../../../abis";
import { CHAIN_ID } from "../../../constant/provider";
import { hexToDecimal } from "../../../common/helper";
import { Result, splitSignature } from "ethers/lib/utils";
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
import { EditOutlined, Settings } from "@mui/icons-material";
import { create } from "ipfs-http-client";
import fleek from "../../../fleek";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { ConfirmationDialog } from "../../../common/components/ConfirmationDialog";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../../../modules/user/userReduxSlice";

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/**
 * @author Elijah Hampton
 * ProfilePage
 * Used to display an addresses profile and any related informatin
 * TODO: Integrate LENS API for non local dev and usage for followers, following, etc.
 * TODO: Add metadata uploads and edits for profile information
 * @returns NextPage A page type by NextJS
 */
const ProfilePage: NextPage<any> = () => {
  const classes = useStyles();
  const router = useRouter();
  const accountData = useAccount();
  const signer = useSigner();
  const userAddress = useSelector(selectUserAddress);

  const [profileState, setProfileState] = useState<any>({
    general: {},
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

  console.log(router.query)

  const verifiedUserQuery: QueryResult = useQuery(
    GET_VERIFIED_FREELANCER_BY_ADDRESS,
    {
      variables: {
        userAddress: address,
      },
    }
  );

  console.log(verifiedUserQuery)

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
        servicesCreated: servicesPurchased.data.purchasedServices,
      });
    }
  }, [servicesCreated.loading]);

  useEffect(() => {
    contractsByEmployerQuery.refetch();
    contractsByWorkerQuery.refetch();
    servicesPurchased.refetch();
  }, [address]);

  useEffect(() => {
    verifiedUserQuery.refetch();
  }, []);

  useEffect(() => {
    if (!verifiedUserQuery.loading && verifiedUserQuery.data) {
      setProfileState({
        ...profileState,
        verifiedFreelancerData: verifiedUserQuery.data.verifiedUsers[0],
      });

      //only fetch profile id and created services if the user is a verified freelancers
console.log('OOOOOO')
        if (verifiedUserQuery.data?.verifiedUsers[0]?.metadata) {
          console.log('PPPPPPPPPPPPPPP')
          downloadMetadata(verifiedUserQuery.data?.verifiedUsers[0]?.metadata)
        }
        networkManager_getLensProfileIdFromAddress.refetch();
        servicesCreated.refetch();
      
    }
  }, [verifiedUserQuery.loading]);

  useEffect(() => {
    if (profileState.lensProfileId !== 0) {
      lensHub_getProfile.refetch();
    }
  }, [profileState.lensProfileId]);

  useEffect(() => {
    if (
      profileState?.lensProfile?.followNFT &&
      profileState?.lensProfile?.followNFT != ZERO_ADDRESS
    ) {
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
      if (String(follower).toLowerCase() === String(address).toLowerCase()) {
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
            contractInterface: FollowNFT,
          });

          const numFollowers = await erc721ContractFollowNFT.totalSupply();
          setProfileState({
            ...profileState,
            interactions: {
              ...profileState.interactions,
              followers: new Array(numFollowers).fill(-1),
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

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [connectDialogIsOpen, setConnectDialogIsOpen] = useState(false);

  const { data, isError, isLoading, isSuccess, error, signTypedData } =
    useSignTypedData({
      onSettled(data, error, variables, context) {},
      onError(error, variables, context) {},
    });

  const onSign = async () => {
    const domain = getDomain();
    const types = getTypes();
    const value = await getValues([address], [], 0);
    await signTypedData({ domain, types, value });
  };

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

  const getValues = async (
    profileIds: Array<any>,
    datas: Array<any>,
    deadline
  ) => {
    const nonce =
      await new ethers.providers.JsonRpcProvider().getTransactionCount(address);

    return {
      profileIds,
      datas,
      nonce,
      deadline,
    };
  };

  const lensProtocol_followWithSig = useContractWrite(
    {
      addressOrName: LENS_HUB_PROXY,
      contractInterface: LensHubInterface,
    },
    "followWithSig",
    {
      args: [
        {
          follower: address,
          profileIds: [address],
          datas: [],
          sig: { v: 0, r: 0, s: 0 },
        },
      ],
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
        value: 2000,
      },
      onSettled(data, error, variables, context) {
        fetchAddressFollowerState();
      },
      onError(error, variables, context) {

      },
    }
  );

  const onConnect = async () => {
    if (isSuccess) {
      const splitSignature: ethers.Signature =
        await ethers.utils.splitSignature(data);

      await lensProtocol_followWithSig.writeAsync({
        args: [
          {
            follower: address,
            profileIds: [profileState?.lensProfileId],
            datas: [[]],
            sig: {
              v: splitSignature.v,
              r: splitSignature.r,
              s: splitSignature.s,
              deadline: "0",
            },
          },
        ],
      });
    }
  };



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
      
     
          setProfileState({
            ...profileState,
            general: {
              ...profileState.general,
              ...parsedData
            }
          })
        }

      } catch (error) {
        console.log("Error downloading metadata from profile")
      }
  }

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

  return (
    <Container maxWidth="lg">
      <Box py={6}>
        <Typography
          fontWeight="bold"
          color="rgba(33, 33, 33, .85)"
          fontSize={30}
        >
          {profileState?.general?.display_name}
        </Typography>
      </Box>

      {profileState?.general?.display_freelancer_metrics ? (
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
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label="Posts"
                  {...a11yProps(0)}
                  icon={<EditOutlined fontSize="small" />}
                  iconPosition="start"
                />
                <Tab label="Services (0)" {...a11yProps(1)} />
                <Tab label="Contracts (0)" {...a11yProps(2)} />
                <Tab label="Endorsements (0)" {...a11yProps(3)} />
                <Tab label="Reviews (0)" {...a11yProps(4)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Typography>No publications</Typography>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box
                component={Grid}
                container
                direction="row"
                alignItems="center"
                spacing={/*3*/ 0}
              >
                {profileState?.servicesCreated &&
                profileState?.servicesCreated?.length > 0 ? (
                  profileState?.servicesCreated.map((service) => {
                    return (
                      <ServiceCard outlined={true} id={service?.serviceId} data={service} />
                    );
                  })
                ) : (
                  <Typography>
                    {profileState?.general?.display_name}s hasn't created any services.
                  </Typography>
                )}
              </Box>
            </TabPanel>
            <TabPanel value={value} index={2}>
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
                    {profileState?.general?.display_name}s hasn't created any contracts.
                  </Typography>
                )}
              </Box>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <InvestmentTable />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <InvestmentTable />
            </TabPanel>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Stack pb={2} direction='row' alignItems='center' justifyContent='space-between'>
          <Typography fontSize={20} fontWeight="medium">
            Overview
          </Typography>

          <Button startIcon={<Settings />} variant="outlined" color="primary" onClick={() => router.push(`/view/profile/${userAddress}/settings?metadata=${verifiedUserQuery?.data?.verifiedUsers[0]?.metadata}`)}>
                  Settings
                </Button>
          </Stack>

          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <Stack spacing={1.5} alignItems="center">
                {
                  profileState?.general?.imageURI ?
                  <img src={profileState?.general?.imageURI} style={{width: 70, height: 70, borderRadius: 70}} />
                  :
                  <Jazzicon
                  diameter={70}
                  seed={jsNumberForAddress(String(address))}
                />
                }
              
                <Box py={0.5} textAlign="center">
                  <Typography fontWeight="medium">{profileState?.general?.display_name}</Typography>
                  <Typography
                    variant="body2"
                    color="rgb(94, 94, 94)"
                    fontSize={14}
                  >
                    {profileState.verifiedFreelancerData?.handle}
                  </Typography>
                </Box>

                <Box
                  sx={{ width: "100%", height: 50, pt: 1 }}
                  component={Stack}
                  alignItems="center"
                  direction="row"
                  justifyContent="space-evenly"
                  spacing={5}
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
                </Box>
                {String(
                  profileState.verifiedFreelancerData?.address
                ).toLowerCase() === String(address).toLowerCase() ? (
                  <>
                    <Divider sx={{ my: 2, width: "100%" }} />
                    <Button
                      sx={{ mt: 2 }}
                      fullWidth
                      disabled={profileState.interactions.followers.includes(
                        userAddress
                      )}
                      variant="contained"
                      onClick={() => setConnectDialogIsOpen(true)}
                    >
                      Connect
                    </Button>
                    {process.env.NEXT_PUBLIC_CHAIN_ENV === "development" ? (
                      <Typography color="red" fontSize={12}>
                        Warning: No follow verification in development.
                      </Typography>
                    ) : null}
                    <Typography textAlign="start" py={1} variant="caption">
                      {" "}
                      Get suggestions on {profileState?.general?.display_name} latest services and contracts by
                      connecting.{" "}
                    </Typography>
                  </>
                ) : null}
              </Stack>
            </CardContent>
          </Card>

            <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>

                <Typography fontWeight="medium" py={1}>Description</Typography>

                  {
                    profileState?.general?.description ?
                    <Typography variant="caption" color="#9E9E9E">
                      {profileState?.general?.description}
                    </Typography>
                    :
                    <Typography>
                      No description
                    </Typography>
                  }
        
            </CardContent>
                </Card>

           <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>

                <Typography fontWeight="medium" py={1}>Certifications</Typography>

                {
                    profileState?.general?.certifications &&  profileState?.general?.certifications?.length ?
                    <Stack direction='row' alignItems='center' spacing={2}>
                      {
   profileState?.general?.certifications.map((cert) => {
    return (
      <Chip label={cert} size='small' />
    )
  })
                      }
                    </Stack>
                 
                    :
                    <Typography>
                      No certifications
                    </Typography>
                  }


            </CardContent>
                </Card>

           <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>

                <Typography fontWeight="medium" py={1}>Skills</Typography>

                {
                    profileState?.general?.skills &&  profileState?.general?.skills?.length ?
                    <Stack direction='row' alignItems='center' spacing={2}>
                      {
      profileState?.general?.skills.map((cert) => {
        return (
          <Chip label={cert} size='small' />
        )
      })
                      }
                    </Stack>
              
                    :
                    <Typography>
                      No skills
                    </Typography>
                  }

  
            </CardContent>
              </Card>

            <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>

                <Typography fontWeight="medium" py={1}>Languages</Typography>

                {
                    profileState?.general?.languages &&  profileState?.general?.languages?.length ?
                    <Stack direction='row' alignItems='center' spacing={2}>
{
   profileState?.general?.languages.map((cert) => {
    return (
      <Chip label={cert} size='small' />
    )
  })
}
                    </Stack>
                   
                    :
                    <Typography>
                      No languages
                    </Typography>
                  }


            </CardContent>
            </Card>
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={connectDialogIsOpen}
        onOpen={() => {}}
        onClose={() => {
          setConnectDialogIsOpen(false);
        }}
        signAction={onSign}
        primaryAction={onConnect}
        primaryActionTitle={"Connect"}
        hasSigningStep
        content={connectDialogContent}
      />
    </Container>
  );
};

export default ProfilePage;
