import React, { useState, useEffect } from "react";
import { useStyles } from "../../../common/styles/DashboardStyles";

import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  Stack,
  CardContent,
  Tabs,
  Tab,
  DialogContentText,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ServiceCard from "../../../modules/contract/components/ServiceCard/ServiceCard";
import { NextRouter, useRouter } from "next/router";
import { NextPage } from "next";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSignTypedData,
} from "wagmi";

import {
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS,
  PINATA_JWT,
} from "../../../constant";
import { LensHubInterface, NetworkManagerInterface } from "../../../abis";
import { CHAIN_ID } from "../../../constant/provider";
import { Result } from "ethers/lib/utils";
import { ApolloQueryResult, QueryResult, useQuery } from "@apollo/client";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "../../../modules/user/UserGQLQueries";
import { ethers, Event } from "ethers";
import {
  GET_CONTRACTS_BY_EMPLOYER,
  GET_CONTRACTS_BY_WORKER,
  GET_PURCHASED_SERVICES_BY_CLIENT,
  GET_SERVICES_BY_CREATOR,
} from "../../../modules/contract/ContractGQLQueries";
import JobDisplay from "../../../modules/market/components/JobDisplay";
import { create } from "ipfs-http-client";
import fleek from "../../../fleek";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { ConfirmationDialog } from "../../../common/components/ConfirmationDialog";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../../../modules/user/userReduxSlice";
import {
  getLensFollowingStateByAddressQuery,
  getLensProfileById,
  lensGetFollowersStateByProfileId,
} from "../../../modules/lens/LensGQLQueries";
import { lens_client } from "../../../apollo";
import { a11yProps } from "../../../common/components/TabPanel/helper";
import { EIP712UnlimitedExpiry } from "../../../constant/util";
import TabPanel from "../../../common/components/TabPanel/TabPanel";
import { GET_MARKET_DETAILS_BY_ID } from "../../../modules/market/MarketGQLQueries";

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

const connectDialogContent: Array<JSX.Element> = [
  <DialogContentText id="alert-dialog-description">
    <Typography fontSize={20} fontWeight="bold" py={1}>
      {" "}
      You are about to follow another user which will require two actions:
    </Typography>
        <List>
        <ListItem>
          <ListItemText primary="Signing a transaction" secondary="Your wallet provider will instruct you to sign the transaction." />
        </ListItem>

        <ListItem>
          <ListItemText primary="Executing the transaction" secondary="Finally, you will confirm your transaction. A message will appear in your wallet provider to confirm." />
        </ListItem>
      </List>
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
  const userAddress = useSelector(selectUserAddress);

  const [value, setValue] = React.useState<number>(0);
  const [connectDialogIsOpen, setConnectDialogIsOpen] =
    useState<boolean>(false);
  const [following, setFollowing] = useState<Array<any>>([]);
  const [followers, setFollowers] = useState<Array<any>>([]);

  const [general, setGeneral] = useState<any>({});
  const [lensProfileId, setLensProfileId] = useState<number>(0);
  const [lensProfile, setLensProfile] = useState<any>({});
  const [verifiedFreelancerData, setVerifiedFreelancerData] = useState<any>({});
  const [contractsByEmployer, setContractsByEmployer] = useState<Array<any>>(
    []
  );
  const [contractsByWorker, setContractByWorker] = useState<Array<any>>([]);
  const [servicesCreated, setServicesCreated] = useState<Array<any>>([]);

  const { signTypedData } = useSignTypedData({
    onSettled(data, error) {},
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
  const servicesCreatedQuery: QueryResult = useQuery(GET_SERVICES_BY_CREATOR, {
    variables: {
      creator: address,
    },
  });

  //market details by id
  const marketDetailsByIdQuery: QueryResult = useQuery(
    GET_MARKET_DETAILS_BY_ID,
    {
      skip: true,
      variables: {
        marketId: 0,
      },
    }
  );

  const lensFollowingStateQuery: QueryResult = useQuery(
    getLensFollowingStateByAddressQuery(address),
    {
      client: lens_client,
      skip: true,
    }
  );

  const lensFollowerStateQuery: QueryResult = useQuery(
    lensGetFollowersStateByProfileId(String(lensProfileId)),
    {
      client: lens_client,
      skip: true,
    }
  );

  const networkManager_getLensProfileIdFromAddress = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getLensProfileIdFromAddress",
    enabled: true,
    watch: false,
    chainId: CHAIN_ID,
    args: [accountData?.address],
    onSuccess: (data: Result) => {
      setLensProfileId(data?._hex);
    },
    onError: (error) => {},
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
  });

  const { write: follow } = useContractWrite({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    functionName: "follow",
    mode: "recklesslyUnprepared",
    args: [[Number(lensProfileId)], [[]]],
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSettled(data, error) {
      lensFollowingStateQuery.refetch();
    },
  });

  useEffect(() => {
    fetchLensProfileState();
  }, [address, lensProfileId]);

  useEffect(() => {
    onRefreshProfile();
  }, [address]);

  async function loadProfileIdentityData() {
    const profile = await getLensProfileById(lensProfileId);

    setLensProfile({
      ...lensProfile,
      ...profile,
    });
  }

  async function fetchLensProfileState() {
    if (Number(lensProfileId) > 0) {
      loadProfileIdentityData();
      await lensFollowerStateQuery
        .refetch()
        .then((queryResult) => {
          setFollowers([...queryResult?.data?.followers?.items]);
        })
        .catch((error) => {});
    }

    await lensFollowingStateQuery
      .refetch()
      .then((queryResult) => {
        setFollowing([...queryResult?.data?.following?.items]);
      })
      .catch((error) => {});
  }

  const onRefreshProfile = async () => {
    networkManager_getLensProfileIdFromAddress.refetch();

    await servicesCreatedQuery
      .refetch()
      .then(async (result: ApolloQueryResult<any>) => {
        if (!result.error) {
          //load data
          const services = result.data?.services;
          let serviceMetadata = {};
          let displayedServicesData = [];

          let marketDetails = {};

          for (const service of services) {
            await marketDetailsByIdQuery
              .refetch({ marketId: service.marketId })
              .then((result) => {
                marketDetails = result.data.markets[0];
              });

            serviceMetadata = await fleek.getService(
              String(service?.metadataPtr).slice(13)
            );

            displayedServicesData.push({
              ...service,
              ...serviceMetadata,
              marketDetails: {
                ...marketDetails,
              },
            });
          }

          //set contract
          setServicesCreated(displayedServicesData);
        } else {
        }
      });

    await contractsByEmployerQuery
      .refetch()
      .then((result: ApolloQueryResult<any>) => {
        if (!result.error) {
          //load data
          const updatedContracts = result.data.contracts.map(
            async (contract) => {
              const contractMetadata = await fleek.getContract(
                String(contract?.metadata).slice(13)
              );

              return {
                ...contract,
                ...contractMetadata,
              };
            }
          );

          //set contract
          setContractsByEmployer(updatedContracts);
        } else {
        }
      });

    await contractsByWorkerQuery
      .refetch()
      .then((result: ApolloQueryResult<any>) => {
        if (!result.error) {
          //load data
          const updatedContracts = result.data.contracts.map(
            async (contract) => {
              const contractMetadata = await fleek.getContract(
                String(contract?.metadata).slice(13)
              );

              return {
                ...contract,
                ...contractMetadata,
              };
            }
          );

          //set contract
          setContractsByEmployer(updatedContracts);
        } else {
        }
      });

    await verifiedUserQuery.refetch().then((result: ApolloQueryResult<any>) => {
      if (!result.error) {
        setVerifiedFreelancerData(result.data?.verifiedUsers[0]);

        if (result.data?.verifiedUsers[0]?.metadata) {
          downloadMetadata(result.data?.verifiedUsers[0]?.metadata);
        }
      }
    });
  };

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
      profileIds: [Number(lensProfileId)],
      datas: [[]],
      nonce: userLensSigNonce,
      deadline: EIP712UnlimitedExpiry,
    };
  };

  const onConnect = async () => {
    follow({
      recklesslySetUnpreparedArgs: [[Number(lensProfileId)], [[]]],
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

        setGeneral({
          ...general,
          ...parsedData,
        });
      } else {
        retVal = await fleek.getUser(String(ptr).slice(10));
        setGeneral({
          ...general,
          ...retVal,
        });
      }
    } catch (error) {}
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, height: "calc(100vh - 65px)" }}>
      <Box mb={2}>
        <Stack
          pb={2}
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box>
            {lensProfile?.imageURI ? (
              <img
                src={lensProfile?.imageURI}
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
            <Stack spacing={1}>
              <Typography
                fontWeight="bold"
                color="black"
                fontSize={26}
                letterSpacing={1.5}
              >
                Elijah Hampton
              </Typography>
              <Typography variant="subtitle2">
                {verifiedFreelancerData?.handle
                  ? `@ ${verifiedFreelancerData?.handle}`
                  : "This user is not registered on Lens Talent"}
              </Typography>
              <Chip
                sx={{
                  py: 1,
                  borderRadius: 1,
                  color: "#747474",
                  maxWidth: 100,
                  fontSize: 12,
                }}
                size="small"
                variant="filled"
                label={address}
              />
            </Stack>
          </Box>
          <Box sx={{ width: 350 }}>
            <Card
              sx={{
                width: 350,
                height: 150,
                bgcolor: "#fafafa",
                border: "1px solid #eee",
              }}
              variant="outlined"
            >
              <CardContent>
                <Typography fontWeight="600" my={1} mb={1.5} fontSize={12}>
                  Value: 0 DAI
                </Typography>
                <Stack my={1} spacing={1} direction="row" alignItems="center">
                  <Typography fontWeight="medium" py={1} fontSize={12}>
                    Skills:
                  </Typography>

                  {general?.skills && general?.skills?.length ? (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {general?.skills.map((cert) => {
                        return (
                          <Chip
                            key={cert}
                            sx={{
                              fontSize: 12,
                              borderRadius: 1,
                              border: "1px solid #ddd",
                            }}
                            label={cert}
                            size="small"
                          />
                        );
                      })}
                    </Stack>
                  ) : (
                    <Typography>No skills</Typography>
                  )}
                </Stack>
                <Stack my={1} spacing={1} direction="row" alignItems="center">
                  <Typography fontWeight="medium" py={1} fontSize={12}>
                    Languages:
                  </Typography>

                  {general?.languages && general?.languages?.length ? (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {general?.languages.map((cert) => {
                        return (
                          <Chip
                            key={cert}
                            sx={{
                              fontSize: 12,
                              borderRadius: 1,
                              border: "1px solid #ddd",
                            }}
                            label={cert}
                            size="small"
                          />
                        );
                      })}
                    </Stack>
                  ) : (
                    <Typography fontSize={12}>No languages</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
            <Stack
              my={1}
              spacing={1}
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              {String(verifiedFreelancerData?.address).toLowerCase() !==
                String(address).toLowerCase() && accountData.isConnected ? (
                <Button
                  color="primary"
                  sx={{ borderRadius: 5 }}
                  disabled={lensProfileId <= 0}
                  variant="contained"
                  onClick={() => setConnectDialogIsOpen(true)}
                >
                  <Typography
                    sx={{ color: "white" }}
                    fontWeight="600"
                    fontSize={12}
                  >
                    Follow
                  </Typography>
                </Button>
              ) : null}

              {String(verifiedFreelancerData?.address).toLowerCase() !==
                String(address).toLowerCase() ||
              !accountData.isConnected ? null : (
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ border: "1px solid #ddd", borderRadius: 1 }}
                  onClick={() =>
                    router.push(
                      `/view/profile/${address}/settings?metadata=${verifiedUserQuery?.data?.verifiedUsers[0]?.metadata}`
                    )
                  }
                >
                  <Typography
                    color="text.secondary"
                    fontWeight="600"
                    fontSize={12}
                  >
                    Edit Profile
                  </Typography>
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
        <Box>
          {general?.description ? (
            <Typography
              fontSize={16}
              paragraph
              variant="body2"
              color="text.secondary"
            >
              {general?.description}
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
            <Stack spacing={0.5} direction="row" alignItems="center">
              <Typography
                textAlign="center"
                color="text.secondary"
                fontSize={12}
              >
                Followers:
              </Typography>

              <Typography
                fontSize={12}
                fontWeight="bold"
                color="text.secondary"
              >
                {followers.length}
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Stack spacing={0.5} direction="row" alignItems="center">
              <Typography
                textAlign="center"
                color="text.secondary"
                fontSize={12}
              >
                Following:
              </Typography>{" "}
              <Typography
                fontSize={12}
                fontWeight="bold"
                color="text.secondary"
              >
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
                  sx={{ color: value === 0 ? "#212121" : "#9e9e9e" }}
                  label="All Activity"
                  {...a11yProps(0)}
                />
                <Tab
                  label="Worked Contracts"
                  sx={{ color: value === 2 ? "#212121" : "#9e9e9e" }}
                  icon={
                    <Chip
                      sx={{ fontSize: 10, color: "#757575" }}
                      label={
                        contractsByWorkerQuery.data?.contracts.filter(
                          (contract) => contract.owner === 2
                        ).length
                      }
                      size="small"
                      variant="filled"
                    />
                  }
                  iconPosition="end"
                  {...a11yProps(1)}
                />
                <Tab
                  label="Published Services"
                  sx={{ color: value === 3 ? "#212121" : "#9e9e9e" }}
                  icon={
                    <Chip
                      sx={{ fontSize: 10, color: "#757575" }}
                      label={servicesCreated.length}
                      size="small"
                      variant="filled"
                    />
                  }
                  iconPosition="end"
                  {...a11yProps(2)}
                />
                <Tab
                  label="Published Contracts"
                  sx={{ color: value === 4 ? "#212121" : "#9e9e9e" }}
                  icon={
                    <Chip
                      sx={{ fontSize: 10, color: "#757575" }}
                      label={contractsByEmployer.length}
                      size="small"
                      variant="filled"
                    />
                  }
                  iconPosition="end"
                  {...a11yProps(3)}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Typography>No publications</Typography>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid container direction="row" alignItems="center" spacing={2}>
                {contractsByWorker.filter((contract) => contract.owner === 2) &&
                contractsByWorker.filter((contract) => contract.owner === 2)
                  ?.length > 0 ? (
                  contractsByWorker
                    .filter((contract) => contract.owner === 2)
                    ?.map((contract) => {
                      return (
                        <Grid item xs={4}>
                          <JobDisplay data={contract} />
                        </Grid>
                      );
                    })
                ) : (
                  <Typography>
                    {verifiedFreelancerData?.handle}s hasn't created any
                    contracts.
                  </Typography>
                )}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Grid container direction="row" alignItems="center">
                {servicesCreated && servicesCreated.length > 0 ? (
                  servicesCreated.map((service) => {
                    return (
                      <ServiceCard
                        outlined={true}
                        id={service?.serviceId}
                        data={service}
                      />
                    );
                  })
                ) : (
                  <Typography>
                    {verifiedFreelancerData?.handle}s hasn't created any
                    services.
                  </Typography>
                )}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Grid container direction="row" alignItems="center" spacing={2}>
                {contractsByEmployer && contractsByEmployer?.length > 0 ? (
                  contractsByEmployer.map((contract) => {
                    return (
                      <Grid item xs={4}>
                        <JobDisplay data={contract} />
                      </Grid>
                    );
                  })
                ) : (
                  <Typography>
                    {verifiedFreelancerData?.handle}s hasn't created any
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
        onOpen={() => {}}
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
