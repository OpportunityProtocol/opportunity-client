import React from "react";

import { alpha, Box } from "@mui/material";

import { NextRouter, useRouter } from "next/router";

import { IOpportunityProps } from "./OpportunityInterfaces";
import Footer from "./common/components/Footer";

const Opportunity: React.FC<IOpportunityProps> = ({ children }) => {
  const router: NextRouter = useRouter();

  const APP_BACKGROUND: string = 'rgb(247, 247, 250)' //"#fafafa";

  const isPadded: boolean =
    router.pathname === "/work" ||
    router.pathname.includes("/view/profile") ||
    router.pathname === "/contract/view/contract" ||
    router.pathname === "/contract/view/service" ||
    router.pathname === "/" ||
    router.pathname === "/markets" ||
    router.pathname === "/contract" ||
    router.pathname.includes("/view/contract") ||
    router.pathname.includes("/view/service");

  return (
    <Box
      component="main"
      sx={{
background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 41%, rgba(247,247,250,1) 100%)',
        flexGrow: 1,
        paddingTop: isPadded ? "90px" : "0px",
      }}
    >
      {children}
      <Footer />
    </Box>
  );
};

export default Opportunity;
