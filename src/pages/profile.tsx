import React, { useState, useEffect } from 'react';
import { useStyles } from '../common/styles/DashboardStyles';

import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  Stack,
  Avatar,
  CardContent,
} from '@mui/material';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

import { timelineButtons } from '../modules/market/MarketConstants';
import ServiceCard from '../modules/contract/components/ServiceCard/ServiceCard';
import { useRouter } from 'next/router';
import UserCard from '../modules/user/components/UserCard/UserCard';
import { NextPage } from 'next';
import { useAccount, useContractRead } from 'wagmi';
import { LENS_HUB_PROXY, NETWORK_MANAGER_ADDRESS, ZERO_ADDRESS } from '../constant';
import { LensHubInterface, NetworkManagerInterface } from '../abis';
import { CHAIN_ID } from '../constant/provider';
import { hexToDecimal } from '../common/helper';
import { Result } from 'ethers/lib/utils';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const COLUMN_HEIGHT = 'calc(100vh - 70px)';

const ProfilePage: NextPage = () => {
  const classes = useStyles();
  const [value, setValue] = useState<any>(0);
  const [connections, setConnections] = useState<any>([]);
  const [featuredServices, setFeaturedServices] = useState<any>([]);
  const [reviews, setReviews] = useState<any>([]);
  const router = useRouter();
  const accountData = useAccount()
  const [lensProfileId, setLensProfileId] = useState<any>(0)
  const [lensProfile, setLensProfile] = useState<any>({});
  const [publications, setPublications] = useState<any>([])
  

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
        setLensProfileId(hexToDecimal(data._hex));

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
        args: [lensProfileId],
        onSuccess: (data) => {
          setLensProfile(data);
        },
        onError: (error) => console.log(error),
      }
    );

  const renderUsers = async () => {
    const a = await fetch('https://randomuser.me/api/?results=20', {});
    const users = await a.json();
    setConnections(users.results);
    setReviews(users.results);
  };

  const renderServices = async () => {
    const a = await fetch('https://randomuser.me/api/?results=4', {});
    const users = await a.json();
    setFeaturedServices(users.results);
  };

  const getAllPublications = (): void => {
    let updatedPubArr = []
    if (lensProfile.pubCount > 0) {
      for (let i = 0; i < lensProfile.pubCount; i++) {
          updatedPubArr.push(i)
      }
    }

    setPublications(updatedPubArr)
  }

  useEffect(() => {
      getAllPublications()
  }, [lensProfile])

  useEffect(() => {
    if (lensProfileId !== 0) {
      lensHub_getProfile.refetch({
        throwOnError: true,
      });
    }
  }, [lensProfileId]);

  const onFetchLensProfileId = () => {
    networkManager_getLensProfileIdFromAddress
      .refetch({
        throwOnError: true,
      })
      .then((updatedResults) => {
        if (updatedResults.isSuccess) {
          setLensProfile(updatedResults.data._hex);
        } else {
          setLensProfileId(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (accountData.isSuccess && accountData.data.address !== ZERO_ADDRESS && accountData.data.address != '0') {
      onFetchLensProfileId();
    }
  }, [accountData.data.address]);

  useEffect(() => {
    renderUsers();
    renderServices();
  }, []);

  return (
    <Container maxWidth="lg" sx={{  }}>
      <Typography py={2} fontWeight="bold" color="rgba(33, 33, 33, .85)" fontSize={30}>
        Dashboard
      </Typography>

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
                Total Skill Value{' '}
                <Typography px={1} color="#fff" component="span" fontSize={13}>
                  {' '}
                  +0.38
                </Typography>
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart width={350} height={350} data={data}>
                  <Line type="monotone" dataKey="pv" stroke="rgb(98, 202, 161)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
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

      

      <Grid container direction="row" alignItems="flex-start" justifyContent="space-between">
        <Grid item xs={7.5}>
          <Stack direction="column">
            <Box>
              <Typography pb={2} fontSize={20} fontWeight="medium">
                Endorsements
              </Typography>
              <Box component={Grid} container direction="row" alignItems="center" spacing={3}>
                {connections
                  .slice(1, 4)
                  .map(
                    (connection: {
                      name: { first: string; last: string };
                      picture: { large: string };
                      email: string;
                    }) => {
                      return (
                        <Grid item xs={12}>
                          <UserCard
                            name={connection.name.first + ' ' + connection.name.last}
                            avatar={connection.picture.large}
                            address="0x"
                            email={connection.email}
                          />
                        </Grid>
                      );
                    }
                  )}
              </Box>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Typography  fontSize={20} fontWeight="medium">
            About
          </Typography>
          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <Stack alignItems="center">
                <Avatar src={connections[2]?.picture.large} style={{ width: 80, height: 80 }} />
                <Box py={0.5}>
                  <Typography fontWeight="medium">
                    {connections[2]?.name.first + ' ' + connections[2]?.name.last}
                  </Typography>
                  <Typography variant="body2" color="rgb(94, 94, 94)" fontSize={14}>
                    {lensProfile.handle}
                  </Typography>
                </Box>
                <Typography pt={2}>32 connections</Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
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
              <Stack direction="row" alignItems="center" justifyContent="space-between">
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
              <Stack direction="row" alignItems="center" justifyContent="space-between">
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
              <Stack direction="row" alignItems="center" justifyContent="space-between">
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

      <Box my={3}>
        <Typography py={2} fontSize={20} fontWeight="medium">
          Services
        </Typography>
        <Grid container direction="row" spacing={2} alignItems="center">
          {publications.map((element, idx, arr) => {
            return (
              <Grid item xs={3} key={idx}>
                <ServiceCard
                  name={'Elton John'}
                  headerSrc="https://picsum.photos/200"
                  avatarSrc=''
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>

    </Container>
  );
};

export default ProfilePage;
