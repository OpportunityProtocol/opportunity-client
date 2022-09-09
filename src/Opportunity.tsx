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
  useQuery,
} from "wagmi";
import { QueryResult } from "@apollo/client";
import {
  selectErc20Balance,
  selectUserAddress,
  selectUserBalance,
  selectUserConnectionStatus,
  selectUserConnector,
  userERC20BalanceChanged,
} from "./modules/user/userReduxSlice";
import { useDispatch, useSelector } from "react-redux";
import { DAI_ADDRESS, ZERO_ADDRESS } from "./constant";
import { RootState } from "./store";
import { DaiInterface } from "./abis";
import { CHAIN_ID } from "./constant/provider";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Opportunity: React.FC<IOpportunityProps> = ({ children }) => {
  const router: NextRouter = useRouter();
  const feeData = useFeeData();
  const accountData = useAccount();
  const userAddress = useSelector(selectUserAddress);
  const userBalance = useSelector(selectUserBalance);
  const daiBalance = useSelector((state: RootState) =>
    selectErc20Balance(state, DAI_ADDRESS)
  );
  const userConnector = useSelector(selectUserConnector);
  const connected = useSelector(selectUserConnectionStatus);

  const [state, setState] = useState({
    displayedMarkets: [],
  });

  const APP_BACKGROUND: string =
    "linear-gradient(180deg, rgba(250,250,250,1) 35%, rgba(236,247,243,1) 75%, rgba(236,246,242,1) 100%)";

  const isPadded: boolean =
    router.pathname === "/" ||
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

  const daiContractWritePrepare = usePrepareContractWrite({
    addressOrName: DAI_ADDRESS,
    contractInterface: DaiInterface,
    functionName: "mint(uint256)",
  });

  const dai_mint = useContractWrite(daiContractWritePrepare.config);

  const dai_balanceOf = useContractRead({
    addressOrName: DAI_ADDRESS,
    contractInterface: DaiInterface,
    functionName: "balanceOf",
    enabled: false,
    cacheTime: 50000,
    watch: true,
    chainId: CHAIN_ID,
    args: [userAddress],
    onSuccess(data) {},
    onError: (error: Error) => {},
  });

  const dispatch = useDispatch();

  const handleOnAddFunds = async () => {
    await dai_mint.write();
    const result = await dai_balanceOf.refetch();

    dispatch(
      userERC20BalanceChanged({
        [DAI_ADDRESS]: Number(result.data._hex),
      })
    );
  };


  const drawerWidth = 320;
  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box component={CardContent}>
        <Stack
          sx={{ display: "flex" }}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box sx={{ flex: 1, flexGrow: 1 }}>
            <Typography fontSize={12} fontWeight="medium">
              blockchainworker {userAddress && userAddress != ZERO_ADDRESS ? `(${userAddress})` : null }
            </Typography>
            <Typography fontSize={15} fontWeight="bold">
              Leslie Alexander
            </Typography>
          </Box>

          <Chip variant="outlined" label="7.5%" icon={<TrendingUp sx={{ color: (theme) => theme.palette.primary.main }} />} />
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ height: "100%", flexGrow: 1, flex: 1 }}>
        <CardContent>
          <Typography fontSize={18} fontWeight="bold">
            Markets
          </Typography>
          {state.displayedMarkets && state.displayedMarkets.length > 0 ? (
            state.displayedMarkets.map((marketDeatils) => {
              return <Typography>Market Details</Typography>;
            })
          ) : (
            <Typography variant="caption">Error loading markets. Make sure you are connect to a network or refreshing the page</Typography>
          )}
        </CardContent>
      </Box>
      <Divider />
      <Box>
        <Stack my={1} direction="row" alignItems="center">
          <CardContent>
            <Button size="small" variant="contained" onClick={handleOnAddFunds}>
              Add funds
            </Button>
          </CardContent>
        </Stack>
        <List disablePadding>
          <Divider />
          <ListItem divider sx={{ backgroundColor: "#fafafa" }}>
            <ListItemIcon>
              <FaEthereum size={18} />
            </ListItemIcon>
            <ListItemText
              primary="MATIC Balance"
              secondary={userBalance && userAddress != ZERO_ADDRESS ? userBalance : 'Connect a wallet'}
              primaryTypographyProps={{
                fontSize: 10,
                fontWeight: "medium",
              }}
              secondaryTypographyProps={{
                fontSize: 12,
                fontWeight: "medium",
              }}
            />
          </ListItem>

          <ListItem divider sx={{ backgroundColor: "#fafafa" }}>
            <ListItemIcon>
              <FaEthereum size={18} />
            </ListItemIcon>
            <ListItemText
              primary="DAI Balance"
              secondary={daiBalance && userAddress != ZERO_ADDRESS ? daiBalance : 'Connect a wallet'}
              primaryTypographyProps={{
                fontSize: 10,
                fontWeight: "medium",
              }}
              secondaryTypographyProps={{
                fontSize: 12,
                fontWeight: "medium",
              }}
            />
          </ListItem>

          <ListItem divider>
            <ListItemText
              primary="Web3/Wallet Provider"
              secondary={userConnector && userAddress != ZERO_ADDRESS ? userConnector : 'Connect a wallet'}
              primaryTypographyProps={{
                fontSize: 10,
                fontWeight: "medium",
              }}
              secondaryTypographyProps={{
                fontSize: 12,
                fontWeight: "medium",
              }}
            />
          </ListItem>

          <ListItem divider>
            <ListItemText
              primary="Network"
              secondary={userConnector && userAddress != ZERO_ADDRESS ? userConnector : 'Connect a wallet'}
              primaryTypographyProps={{
                fontSize: 10,
                fontWeight: "medium",
              }}
              secondaryTypographyProps={{
                fontSize: 12,
                fontWeight: "medium",
              }}
            />
          </ListItem>

          <ListItem divider>
            <ListItemText
              primary="Gas Fee"
              secondary={feeData.data?.formatted?.gasPrice && userAddress != ZERO_ADDRESS ? feeData.data?.formatted?.gasPrice : 'Connect a wallet'}
              primaryTypographyProps={{
                fontSize: 10,
                fontWeight: "medium",
              }}
              secondaryTypographyProps={{
                fontSize: 12,
                fontWeight: "medium",
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          background: APP_BACKGROUND,
          //   flexGrow: 1,
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
          sx={{ paddingTop: isPadded ? "90px" : "0px", flexGrow: 1 }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Opportunity;
