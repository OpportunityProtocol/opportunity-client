import React, { Fragment, useState, FunctionComponent, useEffect } from 'react';
import clsx from 'clsx';

import {
  Paper,
  Box,
  Container,
  Popover,
  InputBase,
  Grid,
  Badge,
  Avatar,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material';

import router, { useRouter } from 'next/router';
import Link from 'next/link';

import useStyles from './NavigationBarStyle';
import { FaEthereum } from 'react-icons/fa';
import { IoWalletSharp } from 'react-icons/io5';
import ConnectedAvatar from '../ConnectedAvatar/ConnectedAvatar';
import SearchBarV1 from '../SearchBarV1/SearchBarV1';

const NavigationBar: FunctionComponent = () => {
  const classes = useStyles();
  const [view, setView] = useState<string>('Market');
  const [popoverIsOpen, setPopoverIsOpen] = useState<boolean>(false)
  const router = useRouter();

  const onMouseOverConnectedAvatar = () => setPopoverIsOpen(true)
  const onMouseLeaveConnectedAvatar = () => setPopoverIsOpen(false)

  return (
    <AppBar
      position="fixed"
      variant="elevation"
      elevation={0}
      sx={{
        width: { sm: `100%` },
        ml: { sm: `100%` },
        bgcolor: '#fff',
        height: '65px',
        border: 'none !important',
        borderBottom: '1px solid #eee !important',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar}>
          <Grid
            width="100%"
            container
            xs={12}
            direction="row"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item display="flex">
              <Link href="/">
                <img
                  className={classes.clickableBrand}
                  src="/assets/logo.svg"
                  style={{ width: 35, height: 35 }}
                />
              </Link>

              <Link href="/">
                <Typography
                  className={classes.clickableBrand}
                  fontWeight="bold"
                  fontSize={18}
                  color="#212121"
                >
                  GigEarth
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <SearchBarV1 />
            </Grid>

            <Grid item>
              <div>
                <Link href="/">
                  <Typography
                    onClick={() => setView('Dashboard')}
                    component={Button}
                    mx={2}
                    fontSize={14}
                    variant="button"
                    color={view === 'Dashboard' ? 'secondary' : '#212121'}
                    fontWeight="medium"
                  >
                    Explore
                  </Typography>
                </Link>

                <Link href="/markets">
                  <Typography
                    onClick={() => setView('Markets')}
                    component={Button}
                    mx={2}
                    fontSize={14}
                    variant="button"
                    color={
                      view === 'Markets' || router.pathname === '/markets' ? 'secondary' : '#212121'
                    }
                    fontWeight="medium"
                  >
                    Markets
                  </Typography>
                </Link>

                <Link href="/contract">
                  <Typography
                    onClick={() => setView('Messenger')}
                    component={Button}
                    mx={2}
                    fontSize={14}
                    variant="button"
                    color={view === 'Messenger' ? 'secondary' : '#212121'}
                    fontWeight="medium"
                  >
                    Messenger
                  </Typography>
                </Link>

                <Link href="/contract">
                  <Typography
                    onClick={() => setView('Contracts')}
                    component={Button}
                    mx={2}
                    fontSize={14}
                    variant="button"
                    color={view === 'Contracts' ? 'secondary' : '#212121'}
                    fontWeight="medium"
                  >
                    Contracts
                  </Typography>
                </Link>
              </div>
            </Grid>

            <Grid
              item
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <ConnectedAvatar onClick={() => router.push('/dashboard')} onMouseOver={onMouseOverConnectedAvatar} onMouseLeave={onMouseLeaveConnectedAvatar} />
              <Popover
                style={{ position: 'absolute', top: 55 }}
                id="account-popover"
                open={popoverIsOpen}
                onClose={() => {}}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ p: 1 }}>
                  <Typography component="div">
                    <Box sx={{ fontWeight: 'bold' }}>Welcome to GigEarth</Box>
                    <Box sx={{ fontSize: 16, fontWeight: 'medium', color: 'rgb(94, 94, 94)' }}>
                      Permissionless labor markets powered by unstoppable networks
                    </Box>
                  </Typography>
                </Box>
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 40, height: 40 }} src="/assets/stock/profile_main.jpeg" />
                  <Typography component="div" px={2}>
                    <Box
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#212121',
                      }}
                    >
                      @happytowork
                    </Box>

                    <Box
                      sx={{
                        fontSize: 10,
                        color: 'rgb(94, 94, 94)',
                      }}
                    >
                      0x4E3b49aDEf1487A08c73d47536f41Fe1c7c62137
                    </Box>
                  </Typography>
                </Box>
                <Divider />
                <Grid flexWrap="nowrap" container direction="column">
                  <Grid item sx={{ p: 1, bgcolor: '#fbfbfd' }}>
                    <Typography color="#212121" noWrap fontWeight="bold" fontSize={12}>
                      <IoWalletSharp size={10} /> Web3/Wallet Provider:{' '}
                    </Typography>
                    <Typography color="#212121" fontWeight="light" fontSize={12}>
                      MetaMask
                    </Typography>
                  </Grid>
                  <Divider />
                  <Grid item sx={{ p: 1, bgcolor: '#fbfbfd' }}>
                    <Typography color="#212121" fontWeight="bold" fontSize={12}>
                      <FaEthereum size={10} /> DAI Balance:{' '}
                    </Typography>
                    <Typography color="#212121" fontWeight="light" fontSize={12}>
                      $125.64
                    </Typography>
                  </Grid>
                  <Divider />
                  <Grid item sx={{ p: 1, bgcolor: '#fbfbfd' }}>
                    <Typography color="#212121" fontWeight="bold" fontSize={12}>
                      <FaEthereum size={10} /> UST Balance:{' '}
                    </Typography>
                    <Typography color="#212121" fontWeight="light" fontSize={12}>
                      $23.22
                    </Typography>
                  </Grid>
                  <Divider />
                </Grid>
                <Box m={2}>
                  <Button fullWidth variant="contained" color="secondary">
                    Add Funds
                  </Button>
                </Box>
              </Popover>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
