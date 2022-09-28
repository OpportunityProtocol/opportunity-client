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
} from "@mui/material";


import { NextRouter, useRouter } from "next/router";

import { IOpportunityProps } from "./OpportunityInterfaces";
import NavigationBar from "./common/components/NavigationBar/NavigationBar";
import { Dashboard, Message, Person, Public, TrendingUp } from "@mui/icons-material";
import { FaEthereum } from "react-icons/fa";
import { GET_MARKETS } from "./modules/market/MarketGQLQueries";
import {
  useAccount,
} from "wagmi";
import { QueryResult, useQuery } from "@apollo/client";
import {
  selectUserAddress,
} from "./modules/user/userReduxSlice";
import { useDispatch, useSelector } from "react-redux";
import { DAI_ADDRESS, MARKET_DESCRIPTION_MAPPING, NETWORK_MANAGER_ADDRESS, ZERO_ADDRESS } from "./constant";
import Link from "next/link";
import VerificationDialog from "./modules/user/components/VerificationDialog";

const contractDetailsPrimaryTypographyProps = {
  fontSize: 14,
  fontWeight: "medium",
  color: "rgb(33, 33, 33, .85)",
};

const contractDetailsSecondaryTypographyProps = {
  color: "#808080",
  fontSize: 12,
};

const APP_BACKGROUND: string = '#ffffff'

const Opportunity: React.FC<IOpportunityProps> = ({ children }) => {
  const router: NextRouter = useRouter();
  const accountData = useAccount()
  const userAddress = useSelector(selectUserAddress);
  const [state, setState] = useState({
    displayedMarkets: [],
  });
  const [verificationDialogOpen, setVerificationDialogOpen] =
  useState<boolean>(false);

  const marketsQuery: QueryResult = useQuery(GET_MARKETS);

  useEffect(() => {

    if (!marketsQuery.loading && marketsQuery.data) {
      setState({
        ...state,
        displayedMarkets: marketsQuery.data.markets,
      });
    }
  }, [marketsQuery.loading]);


  const drawerWidth = 320;
  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar />
      <Divider />
      <Box sx={{ px: 1.5, height: "100%", flexGrow: 1, flex: 1 }}>
        <CardContent>
          <Box mt={0} mb={4}>
            <Box pb={1}>
              <Typography fontSize={14} fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                Navigation
              </Typography>
            </Box>
            <Stack>
              <List>
                <ListItem sx={{ my: 1, '&:hover': { cursor: 'pointer' } }} disablePadding disableGutters >
                  <ListItemIcon>
                    <Public fontSize='small' sx={{ color: router.pathname === '/' ? "#49A882" : '#aaa' }} />
                  </ListItemIcon>
                  <Link href="/">
                    <ListItemText
                      primary='Markets'
                      primaryTypographyProps={
                        {
                          fontWeight: 'medium',
                          color: router.pathname === '/' ? 'primary' : '#aaa',
                          fontSize: 14

                        }
                      }
                    />
                  </Link>
                </ListItem>

                {accountData.isConnected && (
                  <ListItem sx={{ my: 1, '&:hover': { cursor: 'pointer' } }} disablePadding disableGutters >
                    <ListItemIcon>
                      <Dashboard fontSize='small' sx={{ color: router.pathname === '/dashboard' ? "#49A882" : '#aaa', }} />
                    </ListItemIcon>
                    <Link href="/dashboard">
                      <ListItemText
                        primary='Dashboard'
                        primaryTypographyProps={
                          {
                            fontWeight: 'medium',
                            color: router.pathname === '/dashboard' ? 'primary' : '#aaa',
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
                      <Message fontSize='small' sx={{ color: router.pathname === '/messenger' ? "#49A882" : '#aaa', }} />
                    </ListItemIcon>
                    <Link href="/messenger">
                      <ListItemText
                        primary='Messenger'
                        primaryTypographyProps={
                          {
                            fontWeight: 'medium',
                            color: router.pathname === '/messenger' ? 'primary' : '#aaa',
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
                      <Person fontSize='small' sx={{ color: router.pathname === `/profile` ? "#49A882" : '#aaa', }} />
                    </ListItemIcon>
                    <Link href={`/profile/${userAddress}`}>
                      <ListItemText
                        primary='Profile'
                        primaryTypographyProps={
                          {
                            fontWeight: 'medium',
                            color: router.pathname === `/profile` ? 'primary' : '#aaa',
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

          <Box my={4}>
            <Box pb={1}>
              <Typography fontSize={14} fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                Markets
              </Typography>
            </Box>
            <Stack>
              {state.displayedMarkets && state.displayedMarkets.length > 0 ? (
                state.displayedMarkets.map((marketDetails) => {
                  return (
                    <List>
                      <ListItem sx={{ '&:hover': { cursor: 'pointer' } }} disablePadding disableGutters onClick={() => router.push(`/view/markets/${marketDetails?.id}`)}>
                        <ListItemText

                          primary={marketDetails?.name}
                          secondary={MARKET_DESCRIPTION_MAPPING[marketDetails?.name]}
                          primaryTypographyProps={
                            contractDetailsPrimaryTypographyProps
                          }
                          secondaryTypographyProps={
                            contractDetailsSecondaryTypographyProps
                          }

                        />
                      </ListItem>
                    </List>

                  )
                })
              ) : (
                <Typography variant="caption">Error loading markets. Make sure you are connect to a network or refreshing the page</Typography>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          background: APP_BACKGROUND,
          flexGrow: 1,
          height: "100vh",
        }}
      >
        <NavigationBar />
        <Drawer
          variant="permanent"
          sx={{
            height: "100%",
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              bgcolor: 'rgb(246, 248, 250)',
              borderRight: '1px solid #ddd',
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
          sx={{ flexGrow: 1, mt: 2 }}
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
