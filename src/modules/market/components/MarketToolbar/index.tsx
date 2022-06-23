import * as React from "react";

import {
  Grid,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Toolbar,
  Divider,
  Button,
  AppBar,
  Container,
} from "@mui/material";

import Link from "next/link";

import { useStyles } from "./MarketToolbarStyles";
import { FaEthereum } from "react-icons/fa";
import { IoWalletSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import Explore from "../../../../pages/explore";

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const MarketToolbar: React.FunctionComponent = () => {
  const classes = useStyles();
  const router = useRouter();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <Box display='flex' >
            <Button size='small' variant='contained'>
              Create Contract
            </Button>

            <Button size='small' variant='contained' disabled>
              Create Service
            </Button>

      </Box>
  );
};

export default MarketToolbar;
