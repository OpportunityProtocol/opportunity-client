import React, { FC } from "react";

import { Stack, Box, Toolbar, Drawer, Typography } from "@mui/material";
import SearchBarV1 from "../SearchBarV1/SearchBarV1";

const MainDrawer: FC<any> = ({}) => {
  const drawerWidth = 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          p: 2,
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <SearchBarV1 placeholder="Search..." />
      <Box component={Stack} spacing={5} sx={{ mt: 3, overflow: "auto" }}>
        <Box>
          <Typography color="text.primary" fontWeight="600" variant="subtitle2">
            Recent Markets
          </Typography>
          <Typography variant="caption">
            Try navigating to a market under "Explore Markets"
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MainDrawer;
