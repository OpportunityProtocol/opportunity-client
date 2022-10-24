import React, { useEffect, useState } from "react";

import {
  alpha,
  Box,
  Drawer,
  Typography,
  AppBar,
  Divider,
  Toolbar,
  Chip,
  Stack,
  Avatar,
  List,
  ListItemIcon,
  CardContent,
  ListItem,
  ListItemText,
  Button,
  CardActionArea,
  ListItemButton,
} from "@mui/material";


import { NextRouter, useRouter } from "next/router";

import { IOpportunityProps } from "./OpportunityInterfaces";
import NavigationBar from "./common/components/NavigationBar/NavigationBar";
import { ArrowOutward, ArrowRight, Dashboard, Message, Person, Public, TravelExplore, TrendingUp } from "@mui/icons-material";
import { FaEthereum } from "react-icons/fa";
import { GET_MARKETS } from "./modules/market/MarketGQLQueries";
import {
  useAccount,
} from "wagmi";
import { QueryResult, useQuery } from "@apollo/client";
import {
  selectUserAddress, userLensDataStored,
} from "./modules/user/userReduxSlice";
import { useDispatch, useSelector } from "react-redux";
import { DAI_ADDRESS, MARKET_DESCRIPTION_MAPPING, NETWORK_MANAGER_ADDRESS, ZERO_ADDRESS } from "./constant";
import Link from "next/link";
import VerificationDialog from "./modules/user/components/VerificationDialog";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "./modules/user/UserGQLQueries";
import { getLensProfileById } from "./modules/lens/LensGQLQueries";

const APP_BACKGROUND: string = '#ffffff'

const Opportunity: React.FC<IOpportunityProps> = ({ children }) => {
  const router: NextRouter = useRouter();
  const dispatch = useDispatch()
  const accountData = useAccount()
  const userAddress = useSelector(selectUserAddress);
  const [state, setState] = useState({
    displayedMarkets: [],
  });
  const [verificationDialogOpen, setVerificationDialogOpen] =
    useState<boolean>(false);

  const marketsQuery: QueryResult = useQuery(GET_MARKETS);

  const userData: QueryResult = useQuery(GET_VERIFIED_FREELANCER_BY_ADDRESS, {
    variables: {
      userAddress,
    }
  });

  useEffect(() => {

    if (!marketsQuery.loading && marketsQuery.data) {
      setState({
        ...state,
        displayedMarkets: marketsQuery.data.markets,
      });
    }
  }, [marketsQuery.loading]);




  const drawerWidth = 250;
  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar disableGutters sx={{ height: "64px" }}>
        {
          accountData.isConnected && (
            <CardActionArea sx={{ p: 2, mb: 2, height: '100%', width: '100%' }}>
              <Stack mb={2} spacing={1} direction='row' alignItems='center'>
                <Avatar src='/assets/images/woman_work.jpg' />

                <Box>
                  <Typography py={0.4} fontSize={14} color='black' fontWeight='600'>
                    {userData?.data?.verifiedUsers[0]?.handle ? userData?.data?.verifiedUsers[0]?.handle : 'Register to get a handle'}
                  </Typography>
                  <Chip sx={{ py: 1, height: 15, borderRadius: 1, color: '#757575', maxWidth: 100, fontSize: 10 }} size='small' variant='filled' label={userAddress} />
                </Box>
              </Stack>
            </CardActionArea>
          )
        }

      </Toolbar>
      <Divider sx={{ borderBottomColor: alpha("#b8e0d0", 0.3) }} />
      <Box sx={{ px: 1.5, height: "100%", flexGrow: 1, flex: 1 }}>
        <CardContent>
          <Box>

            <Stack>
              <List>
                <ListItem sx={{ my: 1, '&:hover': { cursor: 'pointer' } }} disablePadding disableGutters >
                  <ListItemIcon>
                    <TravelExplore fontSize='small' sx={{ color: router.pathname === '/' ? "#49A882" : '#757575' }} />
                  </ListItemIcon>
                  <Link href="/">
                    <ListItemText
                      primary='Explore'
                      primaryTypographyProps={
                        {
                          fontWeight: 'medium',
                          color: (router.pathname === '/') ? 'primary' : '#757575',
                          fontSize: 14

                        }
                      }
                    />
                  </Link>
                </ListItem>


                <ListItem sx={{ my: 1, '&:hover': { cursor: 'pointer' } }} disablePadding disableGutters >
                  <ListItemIcon>
                    <Public fontSize='small' sx={{ color: (router.pathname.includes('/market')) ? "#49A882" : '#757575' }} />
                  </ListItemIcon>
                  <Link href="/view/market">
                    <ListItemText
                      primary='Markets'
                      primaryTypographyProps={
                        {
                          fontWeight: 'medium',
                          color: router.pathname.includes('/market') ? 'primary' : '#757575',
                          fontSize: 14

                        }
                      }
                    />
                  </Link>
                </ListItem>

                {accountData.isConnected && (
                  <ListItem sx={{ my: 1, '&:hover': { cursor: 'pointer' } }} disablePadding disableGutters >
                    <ListItemIcon>
                      <Dashboard fontSize='small' sx={{ color: router.pathname.includes('/dashboard') ? "#49A882" : '#757575', }} />
                    </ListItemIcon>
                    <Link href="/dashboard">
                      <ListItemText
                        primary='Dashboard'
                        primaryTypographyProps={
                          {
                            fontWeight: 'medium',
                            color: router.pathname.includes('/dashboard') ? 'primary' : '#757575',
                            fontSize: 14

                          }
                        }
                      />
                    </Link>
                  </ListItem>
                )}

                {accountData.isConnected && (
                  <ListItem sx={{ my: 1, '&:hover': { cursor: 'pointer' } }} disablePadding disableGutters>
                    <ListItemIcon>
                      <Message fontSize='small' sx={{ color: router.pathname === '/messenger' ? "#49A882" : '#757575', }} />
                    </ListItemIcon>
                    <Link href="/messenger">
                      <ListItemText
                        primary='Messenger'
                        primaryTypographyProps={
                          {
                            fontWeight: 'medium',
                            color: router.pathname === '/messenger' ? 'primary' : '#757575',
                            fontSize: 14

                          }
                        }
                      />
                    </Link>
                  </ListItem>
                )}

                {accountData.isConnected && (
                  <ListItem sx={{ my: 1, '&:hover': { cursor: 'pointer' } }} disablePadding disableGutters >
                    <ListItemIcon>
                      <Person fontSize='small' sx={{ color: router.pathname === `/profile` ? "#49A882" : '#757575', }} />
                    </ListItemIcon>
                    <Link href={`/view/profile/${userAddress}`}>
                      <ListItemText
                        primary='Profile'
                        primaryTypographyProps={
                          {
                            fontWeight: 'medium',
                            color: router.pathname === `/profile` ? 'primary' : '#757575',
                            fontSize: 14

                          }
                        }
                      />
                    </Link>
                  </ListItem>
                )}
              </List>
            </Stack>
          </Box>
        </CardContent>
      </Box>
    </Box>
  );

  useEffect(() => {

    userData.refetch().then(async (updatedUserData) => {
      const profile = await getLensProfileById(`0x${Math.abs(Number(updatedUserData.data?.verifiedUsers[0]?.id)).toString(16)}`)

      dispatch(userLensDataStored({
        profileId: updatedUserData.data?.verifiedUsers[0]?.id,
        profile,
        error: null
      }))

    }).catch(error => {
      dispatch(userLensDataStored({
        profileId: 0,
        profile: null,
        error: error.message
      }))
    })

  }, [])

  return (
    <>
      <Box
        sx={{
          display: "flex",
          background: APP_BACKGROUND,
          flexGrow: 1,
          height: "100%",
        }}
      >
        <NavigationBar />
        <Drawer
          elevation={3}
          variant="permanent"
          sx={{
            height: "100%",
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              bgcolor: '#fff',
              borderRight: '1px solid #eee',
              width: drawerWidth,
              boxSizing: "border-box",
              height: "100%",
            },
          }}
          open={true}
        >
          {drawer}
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, mt: router.pathname.includes('/messenger') || router.pathname.includes('/') ? 0 : 2 }}
        >
          <Toolbar />
          {children}
        </Box>

        <VerificationDialog handleClose={(event, reason) => {
          if (reason && reason == "backdropClick") {
            return;
          }
          setVerificationDialogOpen(false)
        }} />
      </Box>
    </>
  );
};

export default Opportunity;
