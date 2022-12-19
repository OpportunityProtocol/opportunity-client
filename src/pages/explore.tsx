import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Stack,
  Grid,
  Container,
  Typography,
  Divider,
  Avatar,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  Button,
  alpha,
  Chip,
  ListItemText,
  Alert,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Select,
  AlertTitle,
} from "@mui/material";
import { QueryResult, useQuery } from "@apollo/client";

import { NextPage } from "next";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { NextRouter, useRouter } from "next/router";
import {
  ArrowRight,
  Create,
  KeyboardArrowRight,
  MoreHoriz,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  GET_MARKETS,
  GET_MARKET_DETAILS_BY_ID,
} from "../modules/market/MarketGQLQueries";
import MarketDisplay from "../modules/market/components/MarketDisplay";
import { GET_VERIFIED_FREELANCERS } from "../modules/user/UserGQLQueries";
import { useSelector } from "react-redux";
import {
  ILensProfile,
  selectLens, selectUserAddress
} from "../modules/user/userReduxSlice";
import UserCard from "../modules/user/components/UserCard/UserCard";
import { GET_SERVICES } from "../modules/contract/ContractGQLQueries";
import ServiceCard from "../modules/contract/components/ServiceCard/ServiceCard";
import SearchBar from "../common/components/SearchBar/SearchBar";
import Image from "next/image";
import Post from "../common/components/Post/Post";
import fleek from "../fleek";
import CreatePostDialog from "../modules/lens/components/CreatePostDialog";
import {
  createPost,
  getProfileFeed
} from "../modules/lens/LensGQLQueries";
import { useSigner, useSignTypedData } from "wagmi";
import { login } from "../modules/lens/LensAPIAuthentication";
import { ZERO_ADDRESS } from "../constant";

//temporary
const tags = [
  "spanish",
  "english",
  "essay",
  "french",
  "arabic",
  "poetry",
  "russian",
  "portuguese",
  "mandarin",
  "hindu",
];

enum FeedPreference {
  Global,
  Network,
}

const Explore: NextPage<any> = () => {
  const router: NextRouter = useRouter();
  const [markets, setMarkets] = useState<Array<any>>([]);
  const [activeFreelancers, setActiveFreelancers] = useState<Array<any>>([]);
  const [highestValuedServices, setHighestValuedServices] = useState<
    Array<any>
  >([]);
  const [profileFeed, setProfileFeed] = useState<Array<any>>([]);

  const marketsQuery: QueryResult = useQuery(GET_MARKETS);
  const usersQuery: QueryResult = useQuery(GET_VERIFIED_FREELANCERS);
  const userLensData: ILensProfile = useSelector(selectLens);
  const servicesQuery: QueryResult = useQuery(GET_SERVICES);

  const userAddress: string = useSelector(selectUserAddress)

  const { data: signer } = useSigner();

  const [feedPreference, setFeedPreference] = useState<FeedPreference>(
    FeedPreference.Network
  );

  const {
    data: signTypedDataResult,
    isError: isErrorSignTypedData,
    isLoading: isLoadingSignTypedData,
    isSuccess: isSuccessSignTypedData,
    signTypedData,
  } = useSignTypedData({
    domain: {},
    types: {},
    value: {},
  });

  const { data: ethersSigner } = useSigner();

  const marketDetailsByIdQuery: QueryResult = useQuery(
    GET_MARKET_DETAILS_BY_ID,
    {
      skip: true,
      variables: {
        marketId: 0,
      },
    }
  );

  useEffect(() => {
    if (!servicesQuery.loading && servicesQuery.data) {
      async function loadServices() {
        const services = servicesQuery.data?.services;
        let serviceMetadata = {};
        let displayedServicesData = [];

        let marketDetails = {};

        for (const service of services) {
          if (service?.metadataPtr) {
            await marketDetailsByIdQuery
            .refetch({ marketId: service.marketId })
            .then((result) => {
              marketDetails = result.data.markets[0];
            });
            console.log(service?.metadataPtr)
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
        }

        setHighestValuedServices(displayedServicesData);
      }

      loadServices();
    }
  }, [servicesQuery.loading]);

  useEffect(() => {
    if (!marketsQuery.loading && marketsQuery.data) {
      setMarkets([...marketsQuery.data?.markets]);
    }
  }, [marketsQuery.loading]);

  useEffect(() => {
    if (!usersQuery.loading && usersQuery.data) {
      setActiveFreelancers([...usersQuery.data?.verifiedUsers]);
    }
  }, [usersQuery.loading]);

  useEffect(() => {
    servicesQuery.refetch();
    usersQuery.refetch();
    marketsQuery.refetch();
  }, []);

  useEffect(() => {
    if (userAddress != ZERO_ADDRESS && userAddress && userLensData?.profileId != -1) {
    getProfileFeed(
      userAddress,
      `0x${Math.abs(Number(userLensData?.profileId)).toString(16)}`
    ).then((result: any) => {
      console.log({ result });
      setProfileFeed(result.items);
    });
  }
  }, [userAddress, userLensData?.profileId]);

  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="xl" sx={{ height: "100%" }}>
        <Box>
            <Typography
              py={1}
              variant="subtitle2"
              fontWeight="bold"
              color="#fff"
              fontSize={18}
            >
              Try out one of these tags:
            </Typography>

            <Stack spacing={2} direction="row" alignItems="center">
              {tags.map((tag: string) => {
                return (
                  <Chip
                    variant="filled"
                    onClick={() =>
                      router.push({
                        pathname: "/view/market/1",
                        query: {
                          routedSearchQuery: tag,
                        },
                      })
                    }
                    clickable
                    label={
                      String(tag).charAt(0).toUpperCase() + String(tag).slice(1)
                    }
                    size="small"
                    sx={{
                      p: 1.5,
                      py: 1.8,
                      fontSize: 13,
                      //color: "black",
                      fontWeight: "400",
                      width: "fit-content",
                      bgcolor: "#eee",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                      },
                      height: 25,
                      border: "none",
                      borderRadius: 0.8,
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        <Box>
          <Box
            my={2}
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              style={{ width: "100%", height: 400, objectFit: "fill" }}
              src="/assets/images/project_management.jpg"
            />
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0,0,0,0.6)",
              }}
            >
              <CardContent>
                <Box mt={1} mb={2}>
                  <Box sx={{ py: 2 }}>
                    <Typography
                      py={2}
                      fontWeight="bold"
                      fontSize={35}
                      color="#fff"
                    >
                      Work from anywhere, with anyone
                    </Typography>
                    <Typography fontSize={18} color="#fff">
                      Don't waste time with high fees and temporary platforms.
                      Create once and earn forever.
                    </Typography>
                  </Box>

                  <Button size='large' variant='contained'>
                    Explore markets
                  </Button>
                </Box>
              </CardContent>
            </Box>
          </Box>

          <Grid
            container
            direction="row"
            alignItems="flex-start"
            wrap="nowrap"
            spacing={4}
          >
            <Grid item xs={7}>
              <Box my={1}>
                <Stack
                  pb={2}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    fontWeight="600"
                    fontSize={22}
                    color="rgba(33, 33, 33, .85)"
                  >
                    Markets
                  </Typography>

                  <Button
                    onClick={() => router.push("/view/market")}
                    variant="text"
                    endIcon={<KeyboardArrowRight />}
                  >
                    All Markets
                  </Button>
                </Stack>

                <Grid container direction="row" alignItems="center" spacing={2}>
                  {markets.slice(0, 4).map((marketDetails) => {
                    return (
                      <Grid xs={12} md={6} lg={6} item>
                        <MarketDisplay marketDetails={marketDetails} />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              <Box my={3}>
                <Stack
                  pb={2}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    fontWeight="600"
                    fontSize={22}
                    color="rgba(33, 33, 33, .85)"
                  >
                    Users
                  </Typography>

                  <Button
                    onClick={() => router.push("/view/community")}
                    variant="text"
                    endIcon={<KeyboardArrowRight />}
                  >
                    All Users
                  </Button>
                </Stack>

                <Grid container direction="row" alignItems="center" spacing={2}>
                  {activeFreelancers.slice(0, 4).map((freelancer) => (
                    <Grid item xs={12} md={6} lg={6}>
                      <UserCard freelancer={freelancer} />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box my={3}>
                <Stack
                  pb={2}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    pb={2}
                    fontWeight="600"
                    fontSize={22}
                    color="rgba(33, 33, 33, .85)"
                  >
                    Discover Services
                  </Typography>

                  <Button
                    onClick={() => router.push("/view/market")}
                    variant="text"
                    endIcon={<KeyboardArrowRight />}
                  >
                    All Services
                  </Button>
                </Stack>

                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  wrap="nowrap"
                  spacing={-18}
                >
                  {highestValuedServices.map((serviceData: any) => {
                    return (
                      <Grid xs={12} md={6} lg={6} item>
                        <ServiceCard service={serviceData} />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={5}>
              <Card
                variant="outlined"
                sx={{
                  border: "1px solid #eaeaea",
                  boxShadow: '0px 6px 15px -3px rgba(0,0,0,0.1)',
                  bgcolor: "#fff",
                  mb: 2,
                }}
              >
                <CardContent>
                  <Stack spacing={3}>
                    {userLensData?.profileId === 0 ? (
                      <Typography variant="body2">
                        Sign up and find work or start working instantly 🎉
                      </Typography>
                    ) : (
                      <Box
                        component={Stack}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Avatar src={userLensData?.user?.imageURI} />
                        <Box>
                          <Typography fontSize={14}>
                            @{userLensData?.user?.handle}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <TextField
                      disabled={userLensData?.profileId < 1}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      variant="standard"
                      placeholder="What do you want to say?"
                    />
                    <Button
                      disabled={userLensData?.profileId < 1}
                      onClick={() => {
                        login(signer).then((val) => {
                          createPost(
                            "",
                            String(
                              userAddress +
                                "-" +
                                userLensData?.profileId +
                                "-" +
                                Math.random()
                            ),
                            Number(userLensData?.profileId),
                            ethersSigner
                          );
                        });
                      }}
                      startIcon={<Create fontSize="small" />}
                      sx={{ width: "max-content", alignSelf: "flex-end" }}
                      variant="contained"
                    >
                      Post
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
              <Stack
                mb={1}
                sx={{ display: "flex" }}
                spacing={2}
                direction="row"
                alignItems="center"
              >
                <Typography
                  noWrap
                  sx={{ minWidth: "max-content" }}
                  fontWeight="600"
                  fontSize={22}
                  color="rgba(33, 33, 33, .85)"
                >
                  Advertisements and Publications
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={feedPreference}
                  defaultValue={feedPreference}
                >
                  <MenuItem
                    disabled
                    value={FeedPreference.Global}
                    key={FeedPreference.Global}
                  >
                    Global (Coming Soon)
                  </MenuItem>
                  <MenuItem
                    key={FeedPreference.Network}
                    value={FeedPreference.Network}
                  >
                    My Network
                  </MenuItem>
                </Select>
              </Stack>

              <Stack>
                <Paper
                  elevation={0}
                  sx={{
                    border: "1px solid #eaeaea",
                    boxShadow: '0px 6px 15px -3px rgba(0,0,0,0.1)',
                  }}
                >
                  {profileFeed.length === 0 ? (
                    <CardContent>
                      <Typography variant="body2"> No post found </Typography>
                    </CardContent>
                  ) : (
                    profileFeed.map((feedItem) => {
                      return (
                        <React.Fragment>
                          <Post data={feedItem} />
                          <Divider />
                        </React.Fragment>
                      );
                    })
                  )}
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Explore;
