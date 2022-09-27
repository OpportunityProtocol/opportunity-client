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
import Footer from "./common/components/Footer";
import NavigationBar from "./common/components/NavigationBar/NavigationBar";
import { TrendingUp } from "@mui/icons-material";
import { FaEthereum } from "react-icons/fa";
import { GET_MARKETS } from "./modules/market/MarketGQLQueries";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useFeeData,
  usePrepareContractWrite,
} from "wagmi";
import { QueryResult, useQuery } from "@apollo/client";
import {
  selectErc20Balance,
  selectLens,
  selectUserAddress,
  selectUserBalance,
  selectUserConnectionStatus,
  selectUserConnector,
  userERC20BalanceChanged,
} from "./modules/user/userReduxSlice";
import { useDispatch, useSelector } from "react-redux";
import { DAI_ADDRESS, MARKET_DESCRIPTION_MAPPING, NETWORK_MANAGER_ADDRESS, ZERO_ADDRESS } from "./constant";
import { RootState } from "./store";
import { DaiInterface, NetworkManagerInterface } from "./abis";
import { CHAIN_ID } from "./constant/provider";
import VerificationDialog from "./modules/user/components/VerificationDialog";
import Link from "next/link";

const contractDetailsPrimaryTypographyProps = {
  fontSize: 14,
  fontWeight: "medium",
  color: "rgb(33, 33, 33, .85)",
};

const contractDetailsSecondaryTypographyProps = {
  color: "#808080",
  fontSize: 12,
};

const Opportunity: React.FC<IOpportunityProps> = ({ children }) => {
  const router: NextRouter = useRouter();
  const feeData = useFeeData({ enabled: false, watch: false });
  const accountData = useAccount()
  const userAddress = useSelector(selectUserAddress);
  const userLensData = useSelector(selectLens)
  const userBalance = useSelector(selectUserBalance);
  const daiBalance = useSelector((state: RootState) =>
    selectErc20Balance(state, DAI_ADDRESS)
  );
  const userConnector = useSelector(selectUserConnector);
  const connected = useSelector(selectUserConnectionStatus);

  const [verificationModal, setVerificationModal] = useState<boolean>(false)
  const [state, setState] = useState({
    displayedMarkets: [],
  });

  const APP_BACKGROUND: string = 'rgba(255, 255, 255, 0.1)' //'rgb(246, 247, 249)'
  // "linear-gradient(180deg, rgba(250,250,250,1) 35%, rgba(236,247,243,1) 75%, rgba(236,246,242,1) 100%)";

  const isPadded: boolean =
    router.pathname === "/" ||
    router.pathname === "/dashboard" ||
    router.pathname === "/work" ||
    router.pathname.includes("/view/profile") ||
    router.pathname === "/contract/view/contract" ||
    router.pathname === "/contract/view/service" ||
    // router.pathname === "/" ||
    router.pathname === "/markets" ||
    router.pathname === "/contract" ||
    router.pathname.includes("/create/contract") ||
    router.pathname.includes("/create/service") ||
    router.pathname.includes("/view/contract") ||
    router.pathname.includes("/view/service") ||
    router.pathname.includes("/view");

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
      <Divider />
      <Box sx={{ height: "100%", flexGrow: 1, flex: 1 }}>
        <CardContent>
          <Box pb={1}>
            <Typography  fontSize={16} fontWeight="bold" sx={{ color: '#212121', textTransform: 'capitalize' }}>
              Markets
            </Typography>
          </Box>
          <Stack>

            {state.displayedMarkets && state.displayedMarkets.length > 0 ? (
              state.displayedMarkets.map((marketDetails) => {
                return (
                  <List>
                    <ListItem sx={{ '&:hover': { cursor: 'pointer' }}} disablePadding disableGutters onClick={() => router.push(`/view/markets/${marketDetails?.id}`)} secondaryAction={<Typography fontSize={12} fontWeight='bold'>0</Typography>}>
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
        {
          (router.asPath.includes('/view/market') || router.pathname == '/') && (
            <Drawer
            variant="permanent"
            sx={{
              height: "100%",
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
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
          )
        }
     
        <Box
          component="main"
          sx={{ flexGrow: 1 }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>

   
    </>
  );
};

export default Opportunity;
