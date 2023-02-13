import React, { Dispatch, useEffect, useState } from "react";

import { Box, Toolbar } from "@mui/material";
import { NextRouter, useRouter } from "next/router";
import { IOpportunityProps } from "./OpportunityInterfaces";
import NavigationBar from "./common/components/NavigationBar/NavigationBar";

import { GET_MARKETS } from "./modules/market/MarketGQLQueries";
import { useAccount } from "wagmi";
import { ApolloQueryResult, QueryResult, useQuery } from "@apollo/client";
import {
  selectUserAddress,
  userLensDataStored,
} from "./modules/user/userReduxSlice";
import { useDispatch, useSelector } from "react-redux";
import VerificationDialog from "./modules/user/components/VerificationDialog";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "./modules/user/UserGQLQueries";
import { getLensProfileById } from "./modules/lens/LensGQLQueries";
import { APP_BACKGROUND, DRAWER_WIDTH } from "./constant/component";
import { AnyAction } from "redux";

interface IOpportunityState {
  displayedMarkets: Array<any>
}

const Opportunity: React.FC<IOpportunityProps> = ({ children }) => {
  const router: NextRouter = useRouter();
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const userAddress: string = useSelector(selectUserAddress);
  const [state, setState] = useState<IOpportunityState>({
    displayedMarkets: [],
  });
  const [verificationDialogOpen, setVerificationDialogOpen] =
    useState<boolean>(false);

  const marketsQuery: QueryResult = useQuery(GET_MARKETS);
  const userData: QueryResult = useQuery(GET_VERIFIED_FREELANCER_BY_ADDRESS, {
    variables: {
      userAddress,
    },
  });

  const hasPaddingTop =
  router.pathname.includes("/messenger") || router.pathname.includes("/");

  useEffect(() => {
    if (!marketsQuery.loading && marketsQuery.data) {
      setState({
        ...state,
        displayedMarkets: marketsQuery.data.markets,
      });
    }
  }, [marketsQuery.loading]);

  useEffect(() => {
    userData
      .refetch()
      .then(async (updatedUserData: ApolloQueryResult<any>) => {
        const profile = await getLensProfileById(
          `0x${Math.abs(
            Number(updatedUserData.data?.verifiedUsers[0]?.id)
          ).toString(16)}`
        );

        dispatch(
          userLensDataStored({
            profileId: updatedUserData.data?.verifiedUsers[0]?.id,
            profile,
            error: null,
          })
        );
      })
      .catch((error) => {
        dispatch(
          userLensDataStored({
            profileId: 0,
            profile: null,
            error: error.message,
          })
        );
      });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        background: APP_BACKGROUND,
        flexGrow: 1,
        height: "100vh",
      }}
    >
      <NavigationBar />
      <Box component="main" sx={{ flexGrow: 1, pt: 2 }}>
        <Toolbar />
        {children}
      </Box>
      <VerificationDialog
        open={verificationDialogOpen}
        handleClose={(event, reason) => {
          if (reason && reason == "backdropClick") {
            return;
          }
          setVerificationDialogOpen(false);
        }}
      />
    </Box>
  );
};

export default Opportunity;
