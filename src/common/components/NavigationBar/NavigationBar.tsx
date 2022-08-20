import React, {
  Fragment,
  useState,
  FC,
  useEffect,
  useContext,
  ChangeEvent,
} from "react";
import clsx from "clsx";
import Popper from "@mui/material/Popper";
import {
  alpha,
  Paper,
  Box,
  Container,
  Grid,
  Tooltip,
  Button,
  Stack,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  CardContent,
  darken,
  IconButton,
  MenuItem,
  Menu,
  Avatar,
  ListItemIcon,
  LinearProgress,
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
  useFeeData,
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
import {
  AddCircle,
  AddCircleOutline,
  Help,
  HelpOutline,
  LocalGasStation,
  Logout,
  PersonAdd,
  QuestionMark,
  QuestionMarkOutlined,
  Search,
  Settings,
} from "@mui/icons-material";
import { Work, GroupWork } from "@material-ui/icons";
import SearchContext from "../../../context/SearchContext";

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
      onError: (error) => {},
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
      onError: (error: Error) => {},
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
        .catch((error) => {});
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

  const feeData = useFeeData();
  const [gasPrice, setGasPrice] = useState<string>("0");

  useEffect(() => {
    if (!feeData.isLoading && feeData.data) {
      setGasPrice(feeData.data.formatted.gasPrice);
    }
  }, [feeData.isLoading]);

  useEffect(() => {
    feeData.refetch();
  }, []);

  const searchContext = useContext(SearchContext);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const onChangeSearchQuery = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchQuery(e.target.value);
  };

  const onSearch = (e, query: string) => {
    if (e.key === "Enter") {
      searchContext.actionable.search(query);
    }
  };

  const [createMenuAnchorEl, setCreateMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const createMenuIsOpen = Boolean(createMenuAnchorEl);
  const handleOnClickCreateIcon = (event: React.MouseEvent<HTMLElement>) => {
    setCreateMenuAnchorEl(event.currentTarget);
  };
  const handleOnCloseCreateMenu = () => {
    setCreateMenuAnchorEl(null);
  };

  return (
    <React.Fragment>
      <AppBar
        variant="elevation"
        // elevation={0}
        sx={{
          width: { sm: `100%` },
          ml: { sm: `100%` },
          bgcolor: "#fff",
          height: "95px",
          border: "none !important",
          // borderBottom: "1px solid #eee !important",
        }}
      >
        <Box>
          <Container
            maxWidth="lg"
            sx={{
              padding: "5px 0px",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#fff",
            }}
          >
            <Stack spacing={5} direction="row" alignItems="center">
              <Typography
                color="text.secondary"
                fontSize={10.5}
                fontWeight="medium"
              >
                Labor Markets:{" "}
                <Typography
                  fontSize={11.5}
                  fontWeight="medium"
                  component="span"
                  color="primary"
                >
                  1
                </Typography>
              </Typography>

              <Typography
                color="text.secondary"
                fontSize={10.5}
                fontWeight="medium"
              >
                Total Services Available:{" "}
                <Typography
                  fontSize={11.5}
                  fontWeight="medium"
                  component="span"
                  color="primary"
                >
                  20
                </Typography>
              </Typography>

              <Typography
                color="text.secondary"
                fontSize={10.5}
                fontWeight="medium"
              >
                Total Contracts Available:{" "}
                <Typography
                  fontSize={11.5}
                  fontWeight="medium"
                  component="span"
                  color="primary"
                >
                  0
                </Typography>
              </Typography>

              <Typography
                color="text.secondary"
                fontSize={10.5}
                fontWeight="medium"
              >
                <span>
                  <Stack spacing={0.2} direction="row" alignItems="center">
                    <LocalGasStation fontSize="small" sx={{ mr: 0.5 }} />
                    Polygon Gas:
                    <Typography
                      fontSize={11.5}
                      fontWeight="medium"
                      component="span"
                      color="primary"
                    >
                      {gasPrice}
                    </Typography>
                  </Stack>
                </span>
              </Typography>
            </Stack>
          </Container>
        </Box>
        <Divider />
        <Toolbar className={classes.toolbar}>
          <Container
            maxWidth="xl"
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
              <Grid item sx={{ display: "flex", alignItems: "center" }}>
                <Stack direction="row" alignItems="center" sx={{ mr: 2 }}>
                  <img
                    className={classes.clickableBrand}
                    src="/assets/logo.svg"
                    style={{ width: 40, height: 40 }}
                  />

            
                </Stack>
                <SearchBarV1
                  width={300}
                  placeholder="Find work"
                  value={searchQuery}
                  onChange={onChangeSearchQuery}
                  onKeyDown={onSearch}
                />

                <Stack direction="row" alignItems='center' spacing={1.5} ml={1.7}>
        
                    <Typography
                      variant="button"
                      color={router.pathname == "/" ? "primary" : "text.secondary"}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Explore
                    </Typography>
              

                  <Link href="/work">
                    <Typography
                      component={Button}
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
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      Work
                    </Typography>
                  </Link>

                  {isConnected && (
                    <Link href="/messenger">
                      <Typography
                        component={Button}
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
                  )}

                  {isConnected && (
                    <Link href="/contract">
                      <Typography
                        component={Button}
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
                  )}
                </Stack>
              </Grid>

              <Grid
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <>
                    <Tooltip title="Create">
                      <IconButton
                      size='large'
                        onClick={handleOnClickCreateIcon}
                        aria-controls={
                          createMenuIsOpen ? "create-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={createMenuIsOpen ? "true" : undefined}
                      >
                        <AddCircleOutline fontSize="medium" sx={{ color: "rgb(158, 158, 166)" }} />
                      </IconButton>
                    </Tooltip>

                    <Menu
                      anchorEl={createMenuAnchorEl}
                      id="create-menu"
                      open={createMenuIsOpen}
                      onClose={handleOnCloseCreateMenu}
                      onClick={handleOnCloseCreateMenu}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <MenuItem onClick={() => router.push("/create/contract")}>
                        <Button
                          sx={{ width: 300 }}
                          variant="text"
                          
                        >
                          Create Contract
                        </Button>
                      </MenuItem>

                      <MenuItem onClick={() => router.push("/create/service")}>
                        <Button
                          sx={{ width: 300 }}
                          variant="contained"
                          
                        >
                          Post Service
                        </Button>
                      </MenuItem>
                    </Menu>
                  </>

                  <IconButton
                      size='large'
                        onClick={() => {}}
                      >
                        <HelpOutline fontSize="medium" sx={{ color: "rgb(158, 158, 166)" }} />
                      </IconButton>

                  {connected === true ? (
                    <ConnectedAvatar />
                  ) : (
                    <Button
                      variant="contained"
                      sx={{ minWidth: "150px", borderRadius: 8 }}
                      onClick={() => connect()}
                    >
                      Connect Wallet
                    </Button>
                  )}
                </Stack>
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
