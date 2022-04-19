import React, { useState, useEffect } from 'react'
import { useStyles } from './DashboardStyles'

import {
  Box,
  Typography,
  Container,
  Button,
  Tabs,
  Tab,
  Grid,
  Card,
  Stack,
  Avatar,
  CardContent,
} from '@mui/material'

import { LineChart, Line, ResponsiveContainer } from 'recharts';

import { TabContext } from '@mui/lab'
import UserCard from '../../common/components/UserCard/UserCard'
import TabPanel from '../../common/components/TabPanel/TabPanel'
import { timelineButtons } from '../../modules/market/MarketConstants';

function a11yProps(index: number) {
  return {
    value: index,
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

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
  const [connections, setConnections] = useState<Array<object>>([])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderUsers = async () => {
    const a = await fetch('https://randomuser.me/api/?results=20', {});
    const users = await a.json();
    setConnections(users.results);
    console.log(users);
  };

  useEffect(() => {
    renderUsers();
  }, []);

  return (
    <Container maxWidth='lg' sx={{ height: COLUMN_HEIGHT }}>
        <Stack
            spacing={1}
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
              <Typography py={2} fontWeight="bold" color="rgba(33, 33, 33, .85)" fontSize={30}>
                 Dashboard
                </Typography>

            <Button disableElevation disableRipple variant="contained" color="secondary">
              Create Contract
            </Button>

          </Stack>

      <Grid sx={{ mt: 2, mb: 5}} container direction='row' alignItems='center' justifyContent='space-between'>
        <Grid item xs={12}>
        <Card variant='outlined' sx={{ height: 'auto', bgcolor: 'rgb(52, 62, 60)', color: 'white'}}>
          <CardContent>
               <Typography fontWeight='medium' fontSize={20}>
                 Total Skill Value <Typography px={1} color='#fff' component='span' color='rgb(98, 202, 161)' fontSize={13}> +0.38</Typography>
               </Typography>
               <ResponsiveContainer width="100%" height={350}>
                    <LineChart width='100%' height='100%' data={data}>
                      <Line
                        type="monotone"
                        dataKey="pv"
                        stroke="rgb(98, 202, 161)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Typography>
                      Price
                    </Typography>
                  <Box display='flex' alignItems='center'>
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
        

          <Grid container direction='row' alignItems='flex-start' justifyContent='space-between'>
              <Grid item xs={7.5}>
              <TabContext value={value}>
          <Tabs
            variant="standard"
            value={value}
            indicatorColor="secondary"
            textColor="secondary"
            onChange={handleChange}
            sx={{ bgcolor: '#fbfbfd', my: 2 }}
          >
            <Tab
              label={`Connections (${Math.floor(Math.random() * 30)})`}
              {...a11yProps(0)}
            />
            <Tab
              label={`My Contracts (${Math.floor(Math.random() * 30)})`}
              {...a11yProps(1)}
            />
            <Tab
              label={`My Jobs (${Math.floor(Math.random() * 30)})`}
              {...a11yProps(2)}
            />
            <Tab
              label={`My Services (${Math.floor(Math.random() * 30)})`}
              {...a11yProps(3)}
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Box component={Grid} container direction="row" alignItems="center" spacing={3}>
              {connections.slice(3, 8).map((connection) => {
                return (
                  <Grid item xs={12}>
                    <UserCard 
                    name={connection.name.first + " " + connection.name.last}
                    avatar={connection.picture.large}
                    address='0x'
                    email={connection.email}
                    />
                  </Grid>
                );
              })}
            </Box>
          </TabPanel>

          <TabPanel value={value} index={1}>
            Item One
          </TabPanel>

          <TabPanel value={value} index={2}>
            Item One
          </TabPanel>


          <TabPanel value={value} index={3}>
            Item One
          </TabPanel>
          </TabContext>
              </Grid>

              <Grid item xs={4}>
              <Card variant='outlined' className={classes.marginBottom}>
                  <CardContent>
                    <Stack alignItems='center'>
                  <Avatar src={connections[2]?.picture.large} style={{width: 80, height: 80 }} />
                  <Typography fontWeight='medium'>
                      {connections[2]?.name.first + " " + connections[2]?.name.last}
                    </Typography>
                    <Typography  variant='body2' color='rgb(94, 94, 94)' fontSize={14}>
                      {connections[2]?.email}
                    </Typography>
                    <Typography pt={2}>
                      32 connections
                    </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant='outlined' className={classes.marginBottom}>
                  <CardContent>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Typography fontWeight='medium'>
                      Description
                    </Typography>

                    <Button variant='text' color='secondary'>
                      Edit
                    </Button>
                    </Stack>
                    <Typography variant='caption'>
                      No description
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant='outlined' className={classes.marginBottom}>
                  <CardContent>
                  <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Typography fontWeight='medium'>
                      Certifications
                    </Typography>

                    <Button variant='text' color='secondary'>
                      Edit
                    </Button>
                    </Stack>
                    <Typography variant='caption'>
                      No certifications
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant='outlined' className={classes.marginBottom}>
                  <CardContent>
                  <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Typography fontWeight='medium'>
                      Skills
                    </Typography>

                    <Button variant='text' color='secondary'>
                      Edit
                    </Button>
                    </Stack>
                    <Typography variant='caption'>
                      No skills
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant='outlined' className={classes.marginBottom}>
                  <CardContent>
                  <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Typography fontWeight='medium'>
                      Languages
                    </Typography>

                    <Button variant='text' color='secondary'>
                      Edit
                    </Button>
                    </Stack>
                    <Typography variant='caption'>
                      No languages
                    </Typography>
                    </CardContent>
                </Card>
              </Grid>
          </Grid>
        
    </Container>
  );
};

export default Dashboard;
