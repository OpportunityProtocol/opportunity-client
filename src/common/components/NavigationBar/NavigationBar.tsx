import React, { Fragment, useState, FC, useEffect } from "react";
import clsx from "clsx";

import {
  alpha,
  Paper,
  Box,
  Container,
  Popover,
  InputBase,
  Grid,
  Badge,
  Avatar,
  Button,
  Stack,
  Menu,
  ListItemIcon,
  MenuItem,
  MenuList,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  CardContent,
  darken,
} from "@mui/material";

import router, { useRouter } from "next/router";
import Link from "next/link";

import useStyles from "./NavigationBarStyle";
import ConnectedAvatar from "../ConnectedAvatar/ConnectedAvatar";
import SearchBarV1 from "../SearchBarV1/SearchBarV1";
import { CHAIN_ID } from "../../../constant/provider";
import {
  useAccount,
  useBalance,
  useConnect,
  useContractRead,
  useDisconnect,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  DAI_ADDRESS,
  ZERO_ADDRESS,
  NETWORK_MANAGER_ADDRESS,
  LENS_HUB_PROXY,
} from "../../../constant";
import {
  DaiInterface,
  LensHubInterface,
  NetworkManagerInterface,
} from "../../../abis";

import { hexToDecimal } from "../../helper";
import { Result } from "ethers/lib/utils";
import VerificationDialog from "../../../modules/user/components/VerificationDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserConnectionStatus,
  userWalletDataStored,
  userLensDataStored,
  selectUserAddress,
} from "../../../modules/user/userReduxSlice";
import { BigNumber } from "ethers";
import { RootState } from "../../../store";
import { LocalGasStation } from "@mui/icons-material";
import { Work, GroupWork } from "@material-ui/icons";

const NavigationBar: FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();

  const [verificationDialogOpen, setVerificationDialogOpen] =
    useState<boolean>(false);
  const [lensProfileId, setLensProfileId] = useState<Result | any>(0);
  const userAddress = useSelector(selectUserAddress);
  const connected = useSelector(selectUserConnectionStatus);
  const {
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
    isConnected,
  } = useConnect();
  const accountData = useAccount();

  //getProfile
  const lensHub_getProfile = useContractRead(
    {
      addressOrName: LENS_HUB_PROXY,
      contractInterface: LensHubInterface,
    },
    "getProfile",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      args: [lensProfileId],
      onSuccess: (data) => {
        const {
          followModule,
          followNFT,
          followNFTURI,
          handle,
          imageURI,
          pubCount,
        } = data;
        dispatch(
          userLensDataStored({
            followModule,
            followNFT,
            followNFTURI,
            handle,
            imageURI,
            pubCount: hexToDecimal(Number(pubCount._hex)),
            profileId: Number(lensProfileId),
          })
        );
      },
      onError: (error) => console.log(error),
    }
  );

  useEffect(() => {
    if (lensProfileId !== 0) {
      lensHub_getProfile.refetch({
        throwOnError: true,
      });
    }

  }, [lensProfileId]);

  const networkManager_getLensProfileIdFromAddress = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getLensProfileIdFromAddress",
    {
      enabled: false,
      chainId: CHAIN_ID,
      args: [accountData?.data?.address],
      onSuccess: (data: Result) => {
        setLensProfileId(hexToDecimal(data._hex));
      },
      onError: (error) => {
        console.log(error);
      },
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
      watch: true,
      chainId: CHAIN_ID,
      args: [userAddress],
      onError: (error: Error) => {
        console.log(error);
      },
    }
  );

  const ethBalanceData = useBalance({
    addressOrName: accountData ? accountData?.data?.address : String(0),
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onFetchLensProfileId = () => {
    if (accountData.data.address && accountData.data.address != ZERO_ADDRESS) {
    networkManager_getLensProfileIdFromAddress
      .refetch({
        throwOnError: true,
      })
      .then((updatedResults) => {
        if (updatedResults.isSuccess) {
          setLensProfileId(updatedResults.data._hex);
        } else {
          setLensProfileId(0);
        }
      })
      .catch((error) => {
     
      });
    }
  };

  useEffect(() => {
    async function handleOnIsConnected() {
      let address: string = "Please connect a wallet",
        connector: any = "",
        ethBalance: string | number = 0,
        daiBalance: Result | number = 0;

      accountData.refetch();

      if (accountData.isSuccess && accountData.data) {
        address = accountData.data.address;
        connector = accountData.data.connector;
        onFetchLensProfileId();
      }

      if (ethBalanceData.isSuccess) {
        ethBalance = ethBalanceData.data.formatted;
      }

      const result = await dai_balanceOf.refetch();
      if (result.isSuccess) {
        daiBalance = dai_balanceOf.data;
      } else {
        daiBalance = 0;
      }

      dispatch(
        userWalletDataStored({
          balance: ethBalance,
          erc20Balance: {
            [DAI_ADDRESS]: hexToDecimal(BigNumber.from(daiBalance)._hex),
          },
          connector: String(connector?.name),
          address,
          connected: accountData.isSuccess && !accountData.isError,
        })
      );
    }

    if (isConnected) {
      handleOnIsConnected();
    } else {
      dispatch(
        userWalletDataStored({
          balance: 0,
          erc20Balance: {},
          connector: null,
          address: ZERO_ADDRESS,
          connected: false,
        })
      );
    }
  }, [isConnected]);

  return (
    <React.Fragment>
      <AppBar
        variant="elevation"
        elevation={0}
        sx={{
          width: { sm: `100%` },
          ml: { sm: `100%` },
          bgcolor: "#fff",
          height: "95px",
          border: "none !important",
          borderBottom: "1px solid #eee !important",
        }}
      >
        <Box>
          <Container
            maxWidth="lg"
            sx={{ padding: '5px 0px', display: "flex", flexDirection: "column", bgcolor: "#fff" }}
          >
            <Stack spacing={5} direction="row" alignItems="center">
              <Typography color='text.secondary' fontSize={10.5} fontWeight='medium'>
                Labor Markets: <Typography fontSize={11.5} fontWeight='medium' component='span' color='primary'>1</Typography>
              </Typography>

              <Typography color='text.secondary' fontSize={10.5} fontWeight='medium'>
                Total Services Available: <Typography fontSize={11.5} fontWeight='medium' component='span' color='primary'>20</Typography>
              </Typography>

              <Typography color='text.secondary' fontSize={10.5} fontWeight='medium'>
                Total Contracts Available: <Typography fontSize={11.5} fontWeight='medium' component='span' color='primary'>55</Typography>
              </Typography>

              <Typography color='text.secondary' fontSize={10.5} fontWeight='medium'>
                <span>
                  <Stack spacing={0.2} direction='row' alignItems='center'>
                  <LocalGasStation fontSize='small' sx={{ mr: 0.5 }} />
                   Polygon Gas: 
                  <Typography fontSize={11.5} fontWeight='medium' component='span' color='primary'>55</Typography>
                  </Stack>
                  </span>
              </Typography>
            </Stack>
          </Container>
        </Box>
        <Divider />
        <Toolbar className={classes.toolbar}>
          <Container
            maxWidth="lg"
            sx={{ display: "flex", flexDirection: "column", bgcolor: "#fff" }}
          >
            <Grid
              width="100%"
              container
              xs={12}
              direction="row"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item display="flex">
                <Link href="/">
                  <img
                    className={classes.clickableBrand}
                    src="/assets/logo.svg"
                    style={{ width: 35, height: 35 }}
                  />
                </Link>

                <Link href="/">
                  <Typography
                    className={classes.clickableBrand}
                    fontWeight="bold"
                    fontSize={18}
                    color="#212121"
                  >
                    Lens Talent
                  </Typography>
                </Link>
              </Grid>
              <Grid item>
                <SearchBarV1 />
              </Grid>

              <Grid item>
                <div>
                  <Link href="/">
                    <Typography
                      component={Button}
                      mx={2}
                      fontSize={14}
                      variant="button"
                      color={
                        router.pathname == "/" ? "primary" : "text.secondary"
                      }
                      fontWeight="bold"
                    >
                      Explore
                    </Typography>
                  </Link>

                  <Link href="/">
                    <Typography
                      component={Button}
                      mx={2}
                      fontSize={14}
                      variant="button"
                      color={
                        router.pathname.includes("/explore") ? "primary" : "text.secondary"
                      }
                      fontWeight="bold"
                    >
                      Community
                    </Typography>
                  </Link>

                  <Link href="/work">
                    <Typography
                      component={Button}
                      mx={2}
                      fontSize={14}
                      variant="button"
                      color={
                        router.pathname == "/work"
                          ? "primary"
                          : "text.secondary"
                      }
                      fontWeight="bold"
                      disableFocusRipple
                      disableElevation
                      disableRipple
                      disableTouchRipple
                      aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
                    >
                      Work
                    </Typography>
                  </Link>

                  <Link href="/messenger">
                    <Typography
                      component={Button}
                      mx={2}
                      fontSize={14}
                      variant="button"
                      color={
                        router.pathname == "/messenger"
                          ? "primary"
                          : "text.secondary"
                      }
                      fontWeight="bold"
                    >
                      Messenger
                    </Typography>
                  </Link>

                  <Link href="/contract">
                    <Typography
                      component={Button}
                      mx={2}
                      fontSize={14}
                      variant="button"
                      color={
                        router.pathname.includes("/contract")
                          ? "primary"
                          : "text.secondary"
                      }
                      fontWeight="bold"
                    >
                      Contracts
                    </Typography>
                  </Link>
                </div>
              </Grid>

              <Grid
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {connected === true ? (
                  <ConnectedAvatar />
                ) : (
                  <Button variant="contained" onClick={() => connect()}>
                    Connect Wallet
                  </Button>
                )}
              </Grid>
            </Grid>
          </Container>
        </Toolbar>

        <div>
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect(connector)}
            >
              {connector.name}
              {!connector.ready && " (unsupported)"}
              {isConnecting &&
                connector.id === pendingConnector?.id &&
                " (connecting)"}
            </button>
              ))}

          {error && <div>{error.message}</div>}
        </div>
      </AppBar>
      <VerificationDialog
        open={verificationDialogOpen}
        handleClose={() => setVerificationDialogOpen(false)}
      />
    </React.Fragment>
  );
};

export default NavigationBar;
