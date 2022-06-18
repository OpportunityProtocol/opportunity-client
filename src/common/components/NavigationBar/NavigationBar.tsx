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
import { FaEthereum } from "react-icons/fa";
import { IoWalletSharp } from "react-icons/io5";
import ConnectedAvatar from "../ConnectedAvatar/ConnectedAvatar";
import SearchBarV1 from "../SearchBarV1/SearchBarV1";
import Web3Modal from "web3modal";
import { SingleBedRounded } from "@mui/icons-material";
import { CHAIN_ID, providerOptions } from "../../../constant/provider";
import { LensTalentLocalStorageKeys } from "../../../constant/types";
import {
  useAccount,
  useBalance,
  useConnect,
  useContractRead,
  useContractWrite,
  useDisconnect,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  DAI_ADDRESS,
  ZERO_ADDRESS,
  ALCHEMY_HTTPS,
  NETWORK_MANAGER_ADDRESS,
  LENS_HUB_PROXY,
} from "../../../constant";
import {
  DaiInterface,
  LensHubInterface,
  NetworkManagerInterface,
} from "../../../abis";
import ethers from "ethers";
import { hexToDecimal } from "../../helper";
import { Result } from "ethers/lib/utils";
import VerificationDialog from "../../../modules/user/components/VerificationDialog";
import MarketDisplay from "../../../modules/market/components/MarketDisplay";
import MarketToolbar from "../../../modules/market/components/MarketToolbar";

const NavigationBar: FC = () => {
  const classes = useStyles();
  const router = useRouter();

  const [verificationDialogOpen, setVerificationDialogOpen] =
    useState<boolean>(false);
  const [lensProfileId, setLensProfileId] = useState<Result | any>(0);
  const [popoverIsOpen, setPopoverIsOpen] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [walletData, setWalletData] = useState<any>({
    address: ZERO_ADDRESS,
    connector: "Disconnected",
    ethBalance: 0,
    daiBalance: 0,
  });
  const [lensProfile, setLensProfile] = useState<any>({});

  const {
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
    isConnected,
  } = useConnect();
  const { disconnect } = useDisconnect();
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
        setLensProfile(data);
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
      watch: false,
      chainId: CHAIN_ID,
      args: [accountData ? accountData?.data?.address : 0],
      onError: (error: Error) => {
        console.log(error);
      },
    }
  );

  const ethBalanceData = useBalance({
    addressOrName: accountData ? accountData?.data?.address : String(0),
  });

  const dai_mint = useContractWrite(
    {
      addressOrName: DAI_ADDRESS,
      contractInterface: JSON.stringify(DaiInterface),
    },
    "mint",
    {
      args: [accountData ? accountData?.data?.address : 0, 10000],
    }
  );

  const handleOnAddFunds = async () => {
    await dai_mint.write();
    const result = await dai_balanceOf.refetch();

    setWalletData({
      ...walletData,
      daiBalance: result.data,
    });
  };

  const onFetchLensProfileId = () => {
    networkManager_getLensProfileIdFromAddress
      .refetch({
        throwOnError: true,
      })
      .then((updatedResults) => {
        if (updatedResults.isSuccess) {
          setLensProfile(updatedResults.data._hex);
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

      if (accountData.isSuccess) {
        address = accountData.data.address;
        connector = accountData.data.connector;

        onFetchLensProfileId();
      }

      if (ethBalanceData.isSuccess) {
        ethBalance = ethBalanceData.data.formatted;
      }

      if (dai_balanceOf.isSuccess) {
        const result = await dai_balanceOf.refetch();
        if (result.isSuccess) {
          daiBalance = dai_balanceOf.data;
        } else {
          daiBalance = 0;
        }
      }

      setWalletData({
        address,
        connector,
        daiBalance,
        ethBalance,
      });

      setShow(true);
      localStorage.setItem(
        LensTalentLocalStorageKeys.ConnectedWalletDataV1,
        "connected"
      );
    }

    if (isConnected) {
      handleOnIsConnected();
    } else {
      setWalletData({
        address: 0,
        connector: "",
        ethBalance: "-",
        daiBalance: "-",
      });
      setShow(false);
      localStorage.setItem(
        LensTalentLocalStorageKeys.ConnectedWalletDataV1,
        "disconnected"
      );
    }
  }, [isConnected]);

  const onMouseOverConnectedAvatar = () => setPopoverIsOpen(true);

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
                {show === true ? (
                  <ConnectedAvatar
                    onMouseOver={onMouseOverConnectedAvatar}
                    //  onMouseLeave={() => setPopoverIsOpen(false)}
                  />
                ) : (
                  <Button variant="contained" onClick={() => connect()}>
                    Connect Wallet
                  </Button>
                )}

                <Popover
                  style={{ position: "absolute", top: 55 }}
                  id="account-popover"
                  open={popoverIsOpen}
                  onClose={() => {}}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <CardContent>
                    <Box sx={{ p: 1 }}>
                      <Typography component="div">
                        <Box sx={{ fontWeight: "bold" }}>
                          Welcome to GigEarth
                        </Box>
                        <Box
                          sx={{
                            fontSize: 16,
                            fontWeight: "medium",
                            color: "rgb(94, 94, 94)",
                          }}
                        >
                          Permissionless labor markets powered by unstoppable
                          networks
                        </Box>
                      </Typography>
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
                            <Button variant="text">
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
                          {walletData.address}
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
                        <Typography
                          color="#212121"
                          fontWeight="light"
                          fontSize={12}
                        >
                          {walletData.connector.name}
                        </Typography>
                      </Grid>

                      <Grid item sx={{ p: 1, bgcolor: "#fafafa" }}>
                        <Typography
                          color="#212121"
                          fontWeight="bold"
                          fontSize={12}
                        >
                          <FaEthereum size={10} /> MATIC Balance:{" "}
                        </Typography>
                        <Typography
                          color="#212121"
                          fontWeight="light"
                          fontSize={12}
                        >
                          {hexToDecimal(walletData.ethBalance)}
                        </Typography>
                      </Grid>

                      <Grid item sx={{ p: 1, bgcolor: "#fafafa" }}>
                        <Typography
                          color="#212121"
                          fontWeight="bold"
                          fontSize={12}
                        >
                          <FaEthereum size={10} /> DAI Balance:{" "}
                        </Typography>
                        <Typography
                          color="#212121"
                          fontWeight="light"
                          fontSize={12}
                        >
                          {hexToDecimal(walletData?.daiBalance?._hex)}
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
                        variant="outlined"
                        color="primary"
                        onClick={() => setVerificationDialogOpen(true)}
                      >
                        Become a verified freelancer
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
              </Grid>
            </Grid>
          </Toolbar>
        </Container>

        {/*  <div>
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
            </div> */}
      </AppBar>

      <VerificationDialog
        open={verificationDialogOpen}
        handleClose={() => setVerificationDialogOpen(false)}
        address={walletData.address}
      />
    </React.Fragment>
  );
};

export default NavigationBar;
