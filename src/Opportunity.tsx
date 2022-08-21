import React from "react";

import { alpha, Box } from "@mui/material";

import { NextRouter, useRouter } from "next/router";

import { IOpportunityProps } from "./OpportunityInterfaces";
import Footer from "./common/components/Footer";

const Opportunity: React.FC<IOpportunityProps> = ({ children }) => {
  const router: NextRouter = useRouter();

  const APP_BACKGROUND: string = "linear-gradient(180deg, rgba(255,255,255,1) 35%, rgba(236,247,243,1) 75%, rgba(236,246,242,1) 100%)"

  const isPadded: boolean =
    router.pathname === "/work" ||
    router.pathname.includes("/view/profile") ||
    router.pathname === "/contract/view/contract" ||
    router.pathname === "/contract/view/service" ||
    router.pathname === "/" ||
    router.pathname === "/markets" ||
    router.pathname === "/contract" ||
    router.pathname.includes("/create/contract") ||
    router.pathname.includes("/create/service") ||
    router.pathname.includes("/view/contract") ||
    router.pathname.includes("/view/service") ||
    router.pathname.includes("/view");

  return (
    <>
      <Box
        component="main"
        sx={{
          background: APP_BACKGROUND,
          flexGrow: 1,
          paddingTop: isPadded ? "90px" : "0px",
          paddingBottom: 10,
        }}
      >
        {children}
      </Box>
      <Footer />
    </>
  );
};

export default Opportunity;
