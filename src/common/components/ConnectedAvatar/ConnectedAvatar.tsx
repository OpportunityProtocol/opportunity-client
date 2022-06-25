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
} from "@mui/material";

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
} from "wagmi";
import { hexToDecimal } from "../../helper";
import { DaiInterface } from "../../../abis";
import { CHAIN_ID } from "../../../constant/provider";
import { ExitToApp } from "@material-ui/icons";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
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

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  useContractWrite;
  const dai_mint = useContractWrite(
    {
      addressOrName: DAI_ADDRESS,
      contractInterface: JSON.stringify(DaiInterface),
    },
    "mint",
    {
      args: [userAddress, 10000],
    }
  );

  const dai_balanceOf = useContractRead(
    {
      addressOrName: DAI_ADDRESS,
      contractInterface: JSON.stringify(DaiInterface),
    },
    "balanceOf",
    {
      enabled: false,
      cacheTime: 50000,
      watch: false,
      chainId: CHAIN_ID,
      args: [userAddress],
      onError: (error: Error) => {
        console.log(error);
      },
    }
  );

  const handleOnAddFunds = async () => {
    await dai_mint.write();
    const result = await dai_balanceOf.refetch();

    dispatch(
      userERC20BalanceChanged({
        [DAI_ADDRESS]: hexToDecimal(Number(result.data._hex)),
      })
    );
  };

  const open = Boolean(anchorEl);

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      <Avatar
      onClick={handlePopoverOpen}
       
        sx={{ cursor: "pointer" }}
        alt="Remy Sharp"
        src="/assets/stock/profile_three.jpeg"
      />
      <Popover
        aria-owns={open ? "mouse-over-connected-avatar-popover" : undefined}
        aria-haspopup="true"
        style={{ position: "absolute", top: 50 }}
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
        <CardContent>
          <Box>
            <Stack direction='row' alignItems='flex-start'>
            <Typography component="div">
              <Box sx={{ fontWeight: "bold" }}>Welcome to GigEarth</Box>
              <Box
                sx={{
                  fontSize: 16,
                  fontWeight: "medium",
                  color: "rgb(94, 94, 94)",
                }}
              >
                Permissionless labor markets powered by unstoppable networks
              </Box>
            </Typography>

            <IconButton onClick={handlePopoverClose}>
              <ExitToApp />
            </IconButton>
            </Stack>

          </Box>
          <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{ width: 40, height: 40 }}
              src="/assets/stock/profile_main.jpeg"
            />
            <Typography component="div" px={2}>
              <Box
                sx={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#212121",
                }}
              >
                {!lensProfile.handle ? (
                  <Button
                    variant="text"
                    onClick={() => setVerificationDialogOpen(true)}
                  >
                    {" "}
                    Become a verified freelancer{" "}
                  </Button>
                ) : (
                  <Typography fontWeight="bold">
                    {" "}
                    {lensProfile.handle}{" "}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  fontSize: 10,
                  color: "rgb(94, 94, 94)",
                }}
              >
                {userAddress}
              </Box>
            </Typography>
          </Box>

          <Grid
            my={3}
            sx={{ border: "1px solid #ddd" }}
            flexWrap="nowrap"
            container
            direction="column"
          >
            <Grid item sx={{ p: 1, bgcolor: "#fafafa" }}>
              <Typography
                color="#212121"
                noWrap
                fontWeight="bold"
                fontSize={12}
              >
                <IoWalletSharp size={10} /> Web3/Wallet Provider:{" "}
              </Typography>
              <Typography color="#212121" fontWeight="light" fontSize={12}>
                {userConnector}
              </Typography>
            </Grid>

            <Grid item sx={{ p: 1, bgcolor: "#fafafa" }}>
              <Typography color="#212121" fontWeight="bold" fontSize={12}>
                <FaEthereum size={10} /> MATIC Balance:{" "}
              </Typography>
              <Typography color="#212121" fontWeight="light" fontSize={12}>
                {userBalance}
              </Typography>
            </Grid>

            <Grid item sx={{ p: 1, bgcolor: "#fafafa" }}>
              <Typography color="#212121" fontWeight="bold" fontSize={12}>
                <FaEthereum size={10} /> DAI Balance:{" "}
              </Typography>
              <Typography color="#212121" fontWeight="light" fontSize={12}>
                {daiBalance}
              </Typography>
            </Grid>
          </Grid>

          <Stack spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleOnAddFunds}
            >
              Add Funds
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => router.push("/profile")}
            >
              View Profile
            </Button>
          </Stack>
        </CardContent>
      </Popover>
      <VerificationDialog
        open={verificationDialogOpen}
        handleClose={() => setVerificationDialogOpen(false)}
      />
    </StyledBadge>
  );
};

export default ConnectedAvatar;
