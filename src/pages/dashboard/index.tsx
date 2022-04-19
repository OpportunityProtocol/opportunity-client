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

import { TabContext } from '@mui/lab'
import UserCard from '../../common/components/UserCard/UserCard'
import TabPanel from '../../common/components/TabPanel/TabPanel'

function a11yProps(index: number) {
  return {
    value: index,
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

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

          <Grid container direction='row' alignItems='flex-start' justifyContent='space-between'>
              <Grid item xs={8.5}>
              <TabContext>
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
          <TabPanel value={0} index={0}>
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

          <TabPanel value={1}>
            Item One
          </TabPanel>

          <TabPanel value={2}>
            Item One
          </TabPanel>
          </TabContext>
              </Grid>

              <Grid item xs={3}>
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
