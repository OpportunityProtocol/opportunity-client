import React, { Dispatch, useEffect, useState } from "react";

import {
  alpha,
  Box,
  Drawer,
  Typography,
  Button,
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
  CardActionArea,
} from "@mui/material";
import { NextRouter, useRouter } from "next/router";
import { IOpportunityProps } from "./OpportunityInterfaces";
import NavigationBar from "./common/components/NavigationBar/NavigationBar";
import { ArrowRight, ChevronRight, Dashboard, Message, Person, Public, TravelExplore, TrendingUp } from "@mui/icons-material";
import { GET_MARKETS } from "./modules/market/MarketGQLQueries";
import {
  useAccount,
} from "wagmi";
import { QueryResult, useQuery } from "@apollo/client";
import {
  selectUserAddress, userLensDataStored,
} from "./modules/user/userReduxSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import VerificationDialog from "./modules/user/components/VerificationDialog";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "./modules/user/UserGQLQueries";
import { getLensProfileById } from "./modules/lens/LensGQLQueries";
import { APP_BACKGROUND, DRAWER_WIDTH } from "./constant/component";
import { AnyAction } from "redux";
import { FaChevronDown } from "react-icons/fa";

const Opportunity: React.FC<IOpportunityProps> = ({ children }) => {
  const router: NextRouter = useRouter();
  const dispatch: Dispatch<AnyAction> = useDispatch()
  const accountData = useAccount()
  const userAddress = useSelector(selectUserAddress);
  const [state, setState] = useState<any>({
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

  const hasPaddingTop = router.pathname.includes('/messenger') || router.pathname.includes('/')

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
        <Box
          component="main"
          sx={{ flexGrow: 1, pt: 2 }}
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
