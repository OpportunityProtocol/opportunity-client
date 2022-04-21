import React, { useState, useEffect } from 'react';
import { useStyles } from '../../common/DashboardStyles';

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

import UserCard from '../../common/components/UserCard/UserCard';
import { timelineButtons } from '../../modules/market/MarketConstants';
import ServiceCard from '../../common/components/ServiceCard/ServiceCard';
import { useRouter } from 'next/router';

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

const Dashboard: React.FunctionComponent = () => {
  const classes = useStyles();
  const [value, setValue] = useState<any>(0);
  const [connections, setConnections] = useState<any>([]);
  const [featuredServices, setFeaturedServices] = useState<any>([]);
  const [reviews, setReviews] = useState<any>([]);
  const router = useRouter();
  

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

  useEffect(() => {
    renderUsers();
    renderServices();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ height: COLUMN_HEIGHT }}>

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
                <Typography color="#fff">Price</Typography>
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
              <Typography py={2} fontSize={20} fontWeight="medium">
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
          <Typography py={2} fontSize={20} fontWeight="medium">
            About
          </Typography>
          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <Stack alignItems="center">
                <Avatar src={connections[2]?.picture.large} style={{ width: 80, height: 80 }} />
                <Typography fontWeight="medium">
                  {connections[2]?.name.first + ' ' + connections[2]?.name.last}
                </Typography>
                <Typography variant="body2" color="rgb(94, 94, 94)" fontSize={14}>
                  {connections[2]?.email}
                </Typography>
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
          {featuredServices.map((element, idx, arr) => {
            return (
              <Grid item xs={3} key={idx}>
                <ServiceCard
                  name={element.name.first + ' ' + arr[0].name.last}
                  headerSrc="https://picsum.photos/200"
                  avatarSrc={element.picture.large}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box my={3}>
        <Typography py={2} fontSize={20} fontWeight="medium">
          Reviews
        </Typography>
        <Card variant="outlined">
          <CardContent>
            {reviews.length === 0 ? (
              <Typography variant="caption">
                No reviews has been written for this employer
              </Typography>
            ) : (
              reviews
                .slice(4, 9)
                .map(
                  (
                    review: {
                      picture: { large: string | undefined };
                      name: { first: string; last: string };
                      login: {
                        username:
                          | boolean
                          | React.ReactChild
                          | React.ReactFragment
                          | React.ReactPortal
                          | null
                          | undefined;
                      };
                    },
                    idx: React.Key | null | undefined
                  ) => {
                    return (
                      <Box key={idx} component={Stack} spacing={2} direction="row" my={1}>
                        <Avatar src={review?.picture.large} />
                        <Stack>
                          <Typography fontSize={13}>
                            {review?.name.first + ' ' + review.name.last}
                          </Typography>
                          <Typography fontSize={14} fontWeight="medium">
                            {review?.login.username}
                          </Typography>
                          <Typography paragraph fontSize={14}>
                            No hassle and no extra work apart from the contract description. I will
                            definitiely be looking to work with him again!
                          </Typography>
                        </Stack>
                      </Box>
                    );
                  }
                )
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard;
