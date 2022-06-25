import React, { Fragment, useState, FC, useEffect } from "react";
import clsx from "clsx";

import {
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
  AppBar,
  Toolbar,
  Typography,
  Divider,
  CardContent,
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

    console.log(lensProfileId);
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
      watch: false,
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

  const onFetchLensProfileId = () => {
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
        console.log(error);
      });
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
    handleOnIsConnected();
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
        position="fixed"
        variant="elevation"
        elevation={0}
        sx={{
          width: { sm: `100%` },
          ml: { sm: `100%` },
          bgcolor: "#fff",
          height: "65px",
          border: "none !important",
          borderBottom: "1px solid #ddd !important",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ display: "flex", flexDirection: "column", bgcolor: "#fff" }}
        >
          <Toolbar className={classes.toolbar}>
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
                    GigEarth
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
                      color={router.pathname == "/" ? "primary" : "#212121"}
                      fontWeight={router.pathname === "/" ? "bold" : "500"}
                    >
                      Explore
                    </Typography>
                  </Link>

                  <Link href="/work">
                    <Typography
                      component={Button}
                      mx={2}
                      fontSize={14}
                      variant="button"
                      color={router.pathname == "/work" ? "primary" : "#212121"}
                      fontWeight={router.pathname === "/work" ? "bold" : "500"}
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
                        router.pathname == "/messenger" ? "primary" : "#212121"
                      }
                      fontWeight={
                        router.pathname === "/messenger" ? "bold" : "500"
                      }
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
                          : "#212121"
                      }
                      fontWeight={
                        router.pathname.includes("/contract") ? "bold" : "500"
                      }
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
          </Toolbar>
        </Container>

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
