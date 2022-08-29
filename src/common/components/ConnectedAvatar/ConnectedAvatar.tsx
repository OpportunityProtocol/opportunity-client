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

import { ethers, BigNumber } from 'ethers'

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
import { hexToDecimal } from "../../helper";
import { DaiInterface } from "../../../abis";
import { CHAIN_ID } from "../../../constant/provider";
import { ExitToApp } from "@material-ui/icons";
import { NextRouter, useRouter } from "next/router";

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
  const feeData = useFeeData();
  const router: NextRouter = useRouter()
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
  const accountData = useAccount()

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const daiContractWritePrepare = usePrepareContractWrite({
    addressOrName: DAI_ADDRESS,
    contractInterface: DaiInterface,
    functionName: "mint(uint256)",
  })
  
  const dai_mint = useContractWrite(daiContractWritePrepare.config)
  

  const dai_balanceOf = useContractRead(
    {
      addressOrName: DAI_ADDRESS,
      contractInterface: DaiInterface,
      functionName: "balanceOf",
      enabled: false,
      cacheTime: 50000,
      watch: true,
      chainId: CHAIN_ID,
      args: [userAddress],
      onSuccess(data) {
       
      },
      onError: (error: Error) => {
     

      },
    }
  );

  const handleOnAddFunds = async () => {
    await dai_mint.write();
    const result = await dai_balanceOf.refetch();

    dispatch(
      userERC20BalanceChanged({
        [DAI_ADDRESS]: Number(result.data._hex),
      })
    );
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
          <Box sx={{ width: 380 }}>
            <Stack spacing={2} m={2} direction='row' alignItems='center' justifyContent='flex-end'>
              <Button size='small' variant='outlined' onClick={() => router.push(`/view/profile/${userAddress}`)}>
                Open Profile
              </Button>
              <Button  size='small' variant='contained' onClick={handleOnAddFunds}>
                Add funds
              </Button>
            </Stack>
            <Divider />
            <List disablePadding>
            <ListItem divider  sx={{ backgroundColor: '#fafafa'}}>
              <ListItemIcon>
              <FaEthereum size={18} />
</ListItemIcon>
                <ListItemText 
                primary='MATIC Balance' 
                secondary={userBalance}
                primaryTypographyProps={{
                  fontSize: 10,
                  fontWeight: 'medium'
                }}
                secondaryTypographyProps={{
                  fontSize: 12,
                  fontWeight: 'medium'
                }}  
                />
              </ListItem>

              <ListItem divider  sx={{ backgroundColor: '#fafafa'}}>
              <ListItemIcon>
              <FaEthereum size={18} />
</ListItemIcon>
                <ListItemText 
                primary='DAI Balance' 
                secondary={daiBalance}
                primaryTypographyProps={{
                  fontSize: 10,
                  fontWeight: 'medium'
                }}
                secondaryTypographyProps={{
                  fontSize: 12,
                  fontWeight: 'medium'
                }}  
                />
              </ListItem>

              <ListItem divider>
                <ListItemText 
                primary='Web3/Wallet Provider' 
                secondary={userConnector} 
                primaryTypographyProps={{
                  fontSize: 10,
                  fontWeight: 'medium'
                }}
                secondaryTypographyProps={{
                  fontSize: 12,
                  fontWeight: 'medium'
                }} 
                />
              </ListItem>

              <ListItem divider>
                <ListItemText 
                primary='Network' 
                secondary='Polygon Mumbai'
                primaryTypographyProps={{
                  fontSize: 10,
                  fontWeight: 'medium'
                }}
                secondaryTypographyProps={{
                  fontSize: 12,
                  fontWeight: 'medium'
                }} 
                />
              </ListItem>

              <ListItem divider>
                <ListItemText 
                primary='Gas Fee' 
                secondary={feeData?.data?.formatted?.gasPrice}
                primaryTypographyProps={{
                  fontSize: 10,
                  fontWeight: 'medium'
                }}
                secondaryTypographyProps={{
                  fontSize: 12,
                  fontWeight: 'medium'
                }} 
                />
              </ListItem>


            </List>
          <Stack direction='row' justifyContent='flex-end' sx={{ width: '100%' }}>
            <Button
              fullWidth
              variant="text"
              color="error"
              onClick={() => disconnect()}
              
              sx={{ fontWeight: 'normal', fontSize: 10 }}
            >
              Disconnect
            </Button>
       
         
          </Stack>
          </Box>
      </Popover>
      <VerificationDialog
        open={verificationDialogOpen}
        handleClose={() => setVerificationDialogOpen(false)}
      />
    </StyledBadge>
  );
};

export default ConnectedAvatar;
