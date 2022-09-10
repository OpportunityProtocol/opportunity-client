import React, {
  FC,
  FunctionComponent,
  MouseEventHandler,
  useState,
} from "react";

import {
  Paper,
  Box,
  Popover,
  InputBase,
  IconButton,
  Grid,
  Badge,
  CardContent,
  Avatar,
  Button,
  AppBar,
  Stack,
  Toolbar,
  Typography,
  Divider,
  Theme,
  ListItem,
  ListItemText,
  List,
  ListItemIcon,
} from "@mui/material";

import { ethers, BigNumber } from "ethers";

import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  selectErc20Balance,
  selectLens,
  selectUserAddress,
  selectUserBalance,
  selectUserConnectionStatus,
  selectUserConnector,
  userERC20BalanceChanged,
} from "../../../modules/user/userReduxSlice";
import VerificationDialog from "../../../modules/user/components/VerificationDialog";
import { DAI_ADDRESS } from "../../../constant";
import { RootState } from "../../../store";
import { IoWalletSharp } from "react-icons/io5";
import { FaEthereum } from "react-icons/fa";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useDisconnect,
  useContractRead,
  useFeeData,
  usePrepareContractWrite,
} from "wagmi";
import { NextRouter, useRouter } from "next/router";

const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== "connected",
})(({ theme, connected }: { theme: Theme; connected: boolean }) => ({
  "& .MuiBadge-badge": {
    display: connected === true ? "flex" : "none",
    backgroundColor: "#44b700",
    color: "#44b700",
    bottom: 13,
    right: 12,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const ConnectedAvatar: FC = () => {
  const router: NextRouter = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [verificationDialogOpen, setVerificationDialogOpen] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const { disconnect } = useDisconnect();
  const lensProfile = useSelector(selectLens);
  const userAddress = useSelector(selectUserAddress);
  const userBalance = useSelector(selectUserBalance);
  const daiBalance = useSelector((state: RootState) =>
    selectErc20Balance(state, DAI_ADDRESS)
  );
  const userConnector = useSelector(selectUserConnector);
  const connected = useSelector(selectUserConnectionStatus);
  const accountData = useAccount();

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <StyledBadge
      connected={accountData.isConnected}
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      <Avatar
        sx={{ cursor: "pointer", width: 35, height: 35 }}
        alt="Remy Sharp"
        src="/assets/stock/profile_three.jpeg"
      />

      <VerificationDialog
        open={verificationDialogOpen}
        handleClose={() => setVerificationDialogOpen(false)}
      />
    </StyledBadge>
  );
};

export default ConnectedAvatar;
