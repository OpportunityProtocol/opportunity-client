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
import { DAI_ADDRESS, ZERO_ADDRESS } from "../../../constant";
import { RootState } from "../../../store";
import { IoWalletSharp } from "react-icons/io5";
import { FaEthereum } from "react-icons/fa";
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useDisconnect,
  useFeeData,
  usePrepareContractWrite,
} from "wagmi";
import { NextRouter, useRouter } from "next/router";
import { DaiInterface } from "../../../abis";
import { CHAIN_ID } from "../../../constant/provider";


const StyledBadge = styled(Badge, {
  shouldForwardProp: prop => prop !== 'connected'
})(({ theme, connected }: { theme: Theme, connected: boolean }) => ({
  "& .MuiBadge-badge": {
    display: connected === true ? 'flex' : 'none',
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [verificationDialogOpen, setVerificationDialogOpen] =
    useState<boolean>(false);
  const router: NextRouter = useRouter();
  const feeData = useFeeData({ enabled: false, watch: false });
  const accountData = useAccount()

  const { disconnect } = useDisconnect();

  const userAddress = useSelector(selectUserAddress);
  const userBalance = useSelector(selectUserBalance);
  const daiBalance = useSelector((state: RootState) =>
    selectErc20Balance(state, DAI_ADDRESS)
  );
  const userLensData = useSelector(selectLens)
  const userConnector = useSelector(selectUserConnector);
  const connected = useSelector(selectUserConnectionStatus);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const daiContractWritePrepare = usePrepareContractWrite({
    addressOrName: DAI_ADDRESS,
    contractInterface: DaiInterface,
    functionName: "mint(uint256)",
    enabled: false
  });

  const dai_mint = useContractWrite(daiContractWritePrepare.config);

  const dai_balanceOf = useContractRead({
    addressOrName: DAI_ADDRESS,
    contractInterface: DaiInterface,
    functionName: "balanceOf",
    enabled: false,
    watch: false,
    chainId: CHAIN_ID,
    args: [userAddress],
    onSuccess(data) { },
    onError: (error: Error) => { },
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

  return (
    <StyledBadge
    connected={connected}
    overlap="circular"
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    variant="dot"
    >
      <IconButton onClick={handlePopoverOpen}>

   
      <Avatar
        sx={{ cursor: "pointer", width: 35, height: 35 }}
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
            <Typography fontSize={12} fontWeight="medium">
              {userLensData && userLensData?.handle ? userLensData?.handle : `Connect a wallet`}
            </Typography>
            <Typography fontSize={15} fontWeight="bold">
              Leslie Alexander
            </Typography>
          </Box>


        </Stack>
      </Box>

            <Stack my={1} direction="row" alignItems="center">
              <Button size="small" variant="contained" onClick={handleOnAddFunds}>
                Add funds
              </Button>

              <Button size="small" variant="contained" onClick={() => setVerificationModal(true)}>
                Register
              </Button>
            </Stack>
          </CardContent>

          <List disablePadding>
            <Divider />
            <ListItem divider sx={{ backgroundColor: "#fafafa" }}>
              <ListItemIcon>
                <FaEthereum size={18} />
              </ListItemIcon>
              <ListItemText
                primary="MATIC Balance"
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

            <ListItem divider sx={{ backgroundColor: "#fafafa" }}>
              <ListItemIcon>
                <FaEthereum size={18} />
              </ListItemIcon>
              <ListItemText
                primary="DAI Balance"
                secondary={accountData.status == 'connected' ? daiBalance : 0}
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
                secondary={accountData.status == 'connected' ? userConnector?.name : '-'}
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
                secondary={accountData.status == 'connected' ? userConnector?.network : '-'}
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


    </StyledBadge>
  );
};

export default ConnectedAvatar;
