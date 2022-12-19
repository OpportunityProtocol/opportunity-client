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
  selectLens,
  selectUserAddress,
  selectUserBalance,
  selectUserConnector,
} from "../../../modules/user/userReduxSlice";
import VerificationDialog from "../../../modules/user/components/VerificationDialog";
import { DAI_ADDRESS, ZERO_ADDRESS } from "../../../constant";
import { RootState } from "../../../store";
import { IoWalletSharp } from "react-icons/io5";
import { FaEthereum } from "react-icons/fa";
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useDeprecatedContractWrite,
  useDisconnect,
  useFeeData,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { NextRouter, useRouter } from "next/router";
import { DaiInterface } from "../../../abis";
import { CHAIN_ID } from "../../../constant/provider";
import { FormatTypes } from "ethers/lib/utils";
import { UseDisconnectConfig } from "wagmi/dist/declarations/src/hooks/accounts/useDisconnect";


const StyledBadge = styled(Badge, {
  shouldForwardProp: prop => prop !== 'connected'
})(({ theme, connected }: { theme: Theme, connected: boolean }) => ({
  "& .MuiBadge-badge": {
    display: connected === true ? 'flex' : 'none',
    backgroundColor: "#44b700",
    color: "#44b700",
    bottom: 13,
    right: 12,
    boxShadow: '0px 6px 15px -3px rgba(0,0,0,0.1)',
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [verificationDialogOpen, setVerificationDialogOpen] =
    useState<boolean>(false);

  const userAddress: string = useSelector(selectUserAddress);
  const userBalance = useSelector(selectUserBalance);

  const userLensData: any = useSelector(selectLens)
  const userConnector: any = useSelector(selectUserConnector);

  const feeData = useFeeData({ enabled: false, watch: false });
  const accountData = useAccount()

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
      <IconButton onClick={handlePopoverOpen}>
        <Avatar
          sx={{ cursor: "pointer", width: 25, height: 25 }}
          alt="Remy Sharp"
          src="/assets/stock/profile_three.jpeg"
        />
      </IconButton>

      <Popover
        aria-owns={open ? "mouse-over-connected-avatar-popover" : undefined}
        aria-haspopup="true"

        style={{ position: "absolute" }}
        id="mouse-over-connected-avatar-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box sx={{ width: 360, border: '1px solid #bdbdbd' }}>

          <CardContent>
            <Box>
              <Stack
                sx={{ display: "flex" }}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box sx={{ flex: 1, flexGrow: 1 }}>
                  <Typography fontSize={16} fontWeight="600">
                    {userLensData && userLensData.profile?.handle ? userLensData.profile?.handle : `Register a lens handle`}
                  </Typography>
                </Box>
              </Stack>
            </Box>

          </CardContent>

          <List disablePadding>
            <Divider />
            <ListItem divider sx={{ backgroundColor: "#fafafa" }}>
              <ListItemIcon>
                <FaEthereum size={18} />
              </ListItemIcon>
              <ListItemText
                primary="MATIC Balance"
                secondary={0}
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
                secondary={accountData.status == 'connected' ? userBalance : 0}
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
                secondary={accountData.status == 'connected' ? userConnector : '-'}
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
                secondary={accountData.status == 'connected' ? 'Polygon' : '-'}
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
                secondary={feeData.data?.formatted?.gasPrice && userAddress != ZERO_ADDRESS ? feeData.data?.formatted?.gasPrice : '-'}
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
      </Popover>

      <VerificationDialog open={verificationDialogOpen} handleClose={(event, reason) => {
        setVerificationDialogOpen(false)
      }} />
    </StyledBadge>
  );
};

export default ConnectedAvatar;
