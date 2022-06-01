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
  Stack,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  CardContent,
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
  const [popoverIsOpen, setPopoverIsOpen] = useState<boolean>(false)
  const [popoverTimerSet, setPopOverTimerSet] = useState<boolean>(false)

  const router = useRouter();
  console.log(router.pathname)

  const onMouseOverConnectedAvatar = () => setPopoverIsOpen(true)

  useEffect(() => {
    if (popoverIsOpen && !popoverTimerSet) {
      setPopOverTimerSet(true)
      setTimeout(() => {
          setPopoverIsOpen(false)
          setPopOverTimerSet(false)
      }, 5000)
    }
  }, [popoverIsOpen])

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
        borderBottom: '1px solid #ddd !important',
      }}
    >
      <Container maxWidth="lg" sx={{ bgcolor: '#fff' }}>
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
                    component={Button}
                    mx={2}
                    fontSize={14}
                    variant='button'
                    color={router.pathname == '/' ? 'primary' : '#212121'}
                    fontWeight={router.pathname === '/' ? "bold" : '500'}
                  >
                    Explore
                  </Typography>
                </Link>

                <Link href="/work">
                  <Typography
                    component={Button}
                    mx={2}
                    fontSize={14}
                    variant="button"
                    color={router.pathname == '/work' ? 'primary' : '#212121'}
                    fontWeight={router.pathname === '/work' ? "bold" : '500'}
                  >
                    Work
                  </Typography>
                </Link>

                <Link href="/messenger">
                  <Typography
                    component={Button}
                    mx={2}
                    fontSize={14}
                    variant="button"
                    color={router.pathname == '/messenger' ? 'primary' : '#212121'}
                    fontWeight={router.pathname === '/messenger' ? "bold" : '500'}
                  >
                    Messenger
                  </Typography>
                </Link>

                <Link href="/contract">
                  <Typography
                    component={Button}
                    mx={2}
                    fontSize={14}
                    variant="button"
                    color={router.pathname.includes('/contract') ? 'primary' : '#212121'}
                    fontWeight={router.pathname.includes('/contract') ? "bold" : '500'}
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
              <ConnectedAvatar onClick={() => router.push('/profile')} onMouseOver={onMouseOverConnectedAvatar} />
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
                <CardContent>
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
          
                <Grid my={3} sx={{ border: '1px solid #ddd' }} flexWrap="nowrap" container direction="column">
                  <Grid item sx={{ p: 1, bgcolor: '#fafafa' }}>
                    <Typography color="#212121" noWrap fontWeight="bold" fontSize={12}>
                      <IoWalletSharp size={10} /> Web3/Wallet Provider:{' '}
                    </Typography>
                    <Typography color="#212121" fontWeight="light" fontSize={12}>
                      MetaMask
                    </Typography>
                  </Grid>
        
                  <Grid item sx={{ p: 1, bgcolor: '#fafafa' }}>
                    <Typography color="#212121" fontWeight="bold" fontSize={12}>
                      <FaEthereum size={10} /> DAI Balance:{' '}
                    </Typography>
                    <Typography color="#212121" fontWeight="light" fontSize={12}>
                      $125.64
                    </Typography>
                  </Grid>
    
                </Grid>
                <Stack spacing={2} m={2}>
                  <Button fullWidth variant="outlined" color="primary">
                    Add Funds
                  </Button>
                  <Button fullWidth variant="contained" color="primary" onClick={() => router.push('/profile')}>
                    View Profile
                  </Button>
                </Stack>
                </CardContent>
              </Popover>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
