import React, {
  useState,
  FC,
  useEffect,
  useContext,
  ChangeEvent,
  Dispatch,
} from "react";
import {
  Box,
  Container,
  Grid,
  Tooltip,
  Button,
  Stack,
  AppBar,
  List,
  CardContent,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  MenuItem,
  Menu,
  ListItemButton,
  ListItemIcon,
  Chip,
  alpha,
  CircularProgress,
  LinearProgress,
} from "@mui/material";

import { NextRouter, useRouter } from "next/router";
import Link from "next/link";

import ConnectedAvatar from "../ConnectedAvatar/ConnectedAvatar";
import SearchBarV1 from "../SearchBarV1/SearchBarV1";
import { CHAIN_ID } from "../../../constant/provider";
import {
  useAccount,
  useBalance,
  useConnect,
  useContractRead,
  useContractWrite,
  useDeprecatedContractWrite,
  useFeeData,
  useSigner,
} from "wagmi";
import {
  DAI_ADDRESS,
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS,
  ZERO_ADDRESS,
} from "../../../constant";
import {
  DaiInterface,
  LensHubInterface,
  NetworkManagerInterface,
} from "../../../abis";

import { FormatTypes, Result, sha256 } from "ethers/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  userWalletDataStored,
  userLensDataStored,
  selectUserAddress,
  selectLens,
  userERC20BalanceChanged,
} from "../../../modules/user/userReduxSlice";
import { BigNumber, ethers } from "ethers";
import {
  AddCircleOutline,
  Book,
  Help,
  HelpOutline,
  HelpSharp,
  Language,
  LocalGasStation,
  QuestionAnswer,
  QuestionMarkOutlined,
  WebAsset,
} from "@mui/icons-material";
import SearchContext from "../../../context/SearchContext";
import { ApolloQueryResult, gql, QueryResult, useQuery } from "@apollo/client";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "../../../modules/user/UserGQLQueries";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import {
  getRefreshToken,
  login,
} from "../../../modules/lens/LensAPIAuthentication";
import SearchBar from "../SearchBar/SearchBar";
import {
  getLensProfileById,
  LENS_GET_DISPATCHER_BY_PROFILE_ID,
} from "../../../modules/lens/LensGQLQueries";
import { AnyAction } from "redux";
import VerificationDialog from "../../../modules/user/components/VerificationDialog";
import { lens_client } from "../../../apollo";

const CheckRequiredDispatcherDialog = ({ isConnected, profileId }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [stateDispatcher, setStateDispatcher] = useState<string | null>("");

  const checkDispatcherQuery: QueryResult = useQuery(
    gql`
  query Profile {
    profile(request: { profileId: "${`0x${Math.abs(Number(profileId)).toString(
      16
    )}`}"  }) {
      dispatcher { 
        address
        canUseRelay
      }
    }
  }`,
    {
      client: lens_client,
      skip: true,
      variables: {
        profileId: profileId,
      },
    }
  );

  useEffect(() => {
    if (isConnected && profileId !== 0) {
      checkDispatcherQuery.refetch().then((result: ApolloQueryResult<any>) => {
        const {
          dispatcher: { address },
        } = result.data.profile;

        if (result.data) {
          setStateDispatcher(address);
        }

        if (
          String(address).toLowerCase() !==
          String(NETWORK_MANAGER_ADDRESS).toLowerCase()
        ) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      });
    }
  }, [isConnected, profileId]);

  const {
    write: setDispatcher,
    isLoading: isLoadingSetDispatcher,
    isSuccess: isSuccessSetDispatcher,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: LENS_HUB_PROXY,
    functionName: "setDispatcher",
    args: [profileId, NETWORK_MANAGER_ADDRESS],
    contractInterface: LensHubInterface,
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSettled(data, error, variables, context) {
      data.wait().then((value: ethers.providers.TransactionReceipt) => {
        value.status > 0 ? setOpen(false) : () => {};
      });
    },
    onError(error, variables, context) {},
  });

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      {isLoadingSetDispatcher ? (
        <LinearProgress variant="indeterminate" />
      ) : null}
      <DialogTitle>Lens Protocol Dispatcher Notice</DialogTitle>
      <DialogContent>
        <Typography paragraph variant="body2">
          Lens Talent requires that you set Lens Talent as a dispatcher for your
          profile to carry out some actions internally.
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography
          component="a"
          href="https://docs.lens.xyz/docs/dispatcher"
          target="_blank"
          variant="button"
          sx={{ color: "#0000EE" }}
        >
          What is a dispatcher?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isLoadingSetDispatcher || isSuccessSetDispatcher}
          sx={{ alignSelf: "flex-start" }}
          variant="contained"
          onClick={() => setDispatcher()}
        >
          Set Lens Protocol as Dispatcher
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const NavigationBar: FC = (): JSX.Element => {
  const router: NextRouter = useRouter();
  const connectData = useConnect();
  const accountData = useAccount();
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const signer = useSigner();
  const feeData = useFeeData({
    enabled: false,
    watch: false,
  });
  const ethBalanceData = useBalance({
    addressOrName: accountData ? accountData.address : String(0),
    enabled: false,
    watch: false,
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [gasPrice, setGasPrice] = useState<string>("0");
  const [verificationDialogOpen, setVerificationDialogOpen] =
    useState<boolean>(false);
  const [modelopen, setmodelOpen] = useState<boolean>(false);
  const [createMenuAnchorEl, setCreateMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [helpMenuAnchorEl, setHelpMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const userAddress = useSelector(selectUserAddress);
  const userLensProfile = useSelector(selectLens);

  const userData: QueryResult = useQuery(GET_VERIFIED_FREELANCER_BY_ADDRESS, {
    variables: {
      userAddress: accountData.address,
    },
  });

  const helpMenuIsOpen = Boolean(helpMenuAnchorEl);
  const createMenuIsOpen = Boolean(createMenuAnchorEl);

  const dai_balanceOf = useContractRead({
    addressOrName: DAI_ADDRESS,
    contractInterface: JSON.stringify(DaiInterface),
    functionName: "balanceOf",
    enabled: false,
    watch: false,
    chainId: CHAIN_ID,
    args: [userAddress],
    onSuccess(data) {},
    onError: (error: Error) => {},
  });

  const daiWrite = useDeprecatedContractWrite({
    addressOrName: DAI_ADDRESS,
    contractInterface: new ethers.utils.Interface(DaiInterface)
      .format(FormatTypes.full)
      .splice(12, 1),
    functionName: "mint",
    chainId: CHAIN_ID,
    args: [userAddress, String(100 * 10 ** 18)],
    signerOrProvider: signer.data,
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
      from: userAddress,
    },
  });

  useEffect(() => {
    if (accountData?.status == "connected") {
      feeData.refetch();
      ethBalanceData.refetch();

      signer.refetch().then((signer) => {
        login(signer.data)
          .then(() => {})
          .finally(() => handleOnIsConnected())
          .catch((error) => {
            dispatch(
              userWalletDataStored({
                balance: 0,
                erc20Balance: {},
                connector: null,
                address: ZERO_ADDRESS,
                connected: false,
              })
            );
          });
      });
    }

    handlesClose();
  }, [
    accountData?.status,
    accountData.isReconnecting,
    accountData.isConnected,
    accountData.isConnecting,
  ]);

  useEffect(() => {
    if (!feeData.isLoading && feeData.data) {
      setGasPrice(feeData.data.formatted.gasPrice);
    }
  }, [feeData.isLoading]);

  async function handleOnIsConnected() {
    let ethBalance: string | number = 0,
      daiBalance: Result | number = 0;

    if (accountData.isConnected) {
      userData
        .refetch()
        .then(async (updatedUserData) => {
          const profile = await getLensProfileById(
            `0x${Math.abs(
              Number(updatedUserData.data?.verifiedUsers[0]?.id)
            ).toString(16)}`
          );

          console.log(updatedUserData.data.verifiedUsers[0])
            
          dispatch(
            userLensDataStored({
              user: {
                ...updatedUserData.data.verifiedUsers[0],
              },
              profileId: updatedUserData.data?.verifiedUsers[0]?.id,
              profile,
              error: null,
            })
          );
        })
        .catch((error) => {
          dispatch(
            userLensDataStored({
              profileId: 0,
              profile: null,
              error: error.message,
            })
          );
        });
    }

    if (ethBalanceData.isSuccess) {
      ethBalance = ethBalanceData.data.formatted;
    }

    const result = await dai_balanceOf.refetch();
    if (result.isSuccess) {
      daiBalance = Number(dai_balanceOf.data?._hex);
    } else {
      daiBalance = 0;
    }
    
    dispatch(
      userWalletDataStored({
        balance: ethBalance,
        erc20Balance: {
          [DAI_ADDRESS]: daiBalance,
        },
        address: accountData.address,
        connector: String(accountData.connector.name),
        connection: {
          isSuccess: connectData.isSuccess,
          isLoading: connectData.isLoading,
          isError: connectData.isError,
          isIdle: connectData.isIdle,
          account: connectData.data.account,
          chain: connectData.data.chain,
          connector: connectData.data.connector,
          provider: connectData.data.provider
        },
        account: {
          address: accountData.address,
          isConnected: accountData.isConnected
        },
      })
    );
  }

  const handleOnClickHelpIcon = (event: React.MouseEvent<HTMLButtonElement>) =>
    setHelpMenuAnchorEl(event.currentTarget);

  const handleOnCloseHelpMenu = () => setHelpMenuAnchorEl(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleOnClickCreateIcon = (event: React.MouseEvent<HTMLElement>) =>
    setCreateMenuAnchorEl(event.currentTarget);
  const handleOnCloseCreateMenu = () => setCreateMenuAnchorEl(null);
  const handleClickOpen = () => setmodelOpen(true);
  const handlesClose = () => setmodelOpen(false);

  const handleOnAddFunds = async () => {
    await daiWrite.write();

    const result = await dai_balanceOf.refetch();

    dispatch(
      userERC20BalanceChanged({
        [DAI_ADDRESS]: Number(result.data._hex),
      })
    );
  };

  return (
    <React.Fragment>
      <AppBar
        elevation={0}
        sx={{
          width: { sm: `calc(100%)` },
          boxShadow:
            "rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px",
          bgcolor: "#fff",
          border: "none",
          borderBottom: `1px solid #ddd !important`,
          height: "65px !important",
        }}
      >
        <Toolbar disableGutters>
          <Container
            maxWidth="xl"
            sx={{ display: "flex", flexDirection: "column" }}
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
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mr: 5 }}
                  >
                    <img
                      src="/assets/logo.svg"
                      style={{ width: 40, height: 50 }}
                    />
                    <Typography fontWeight="bold">Lens Talent</Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ListItem
                      sx={{ my: 1, "&:hover": { cursor: "pointer" } }}
                      disablePadding
                      disableGutters
                    >
                      <Link href="/">
                        <ListItemText
                          primary="Explore"
                          primaryTypographyProps={{
                            fontWeight: "medium",
                            color:
                              router.pathname === "/" ? "primary" : "black",
                            fontSize: 14,
                          }}
                        />
                      </Link>
                    </ListItem>

                    <ListItem
                      sx={{ my: 1, "&:hover": { cursor: "pointer" } }}
                      disablePadding
                      disableGutters
                    >
                      <Link href="/view/market">
                        <ListItemText
                          primary="Markets"
                          primaryTypographyProps={{
                            fontWeight: "medium",
                            color: router.pathname.includes("/market")
                              ? "primary"
                              : "black",
                            fontSize: 14,
                          }}
                        />
                      </Link>
                    </ListItem>

                    {accountData.isConnected && (
                      <ListItem
                        sx={{ my: 1, "&:hover": { cursor: "pointer" } }}
                        disablePadding
                        disableGutters
                      >
                        <Link href="/dashboard">
                          <ListItemText
                            primary="Dashboard"
                            primaryTypographyProps={{
                              fontWeight: "medium",
                              color: router.pathname.includes("/dashboard")
                                ? "primary"
                                : "black",
                              fontSize: 14,
                            }}
                          />
                        </Link>
                      </ListItem>
                    )}

                    {accountData.isConnected && (
                      <ListItem
                        sx={{ my: 1, "&:hover": { cursor: "pointer" } }}
                        disablePadding
                        disableGutters
                      >
                        <Link href="/messenger">
                          <ListItemText
                            primary="Messenger"
                            primaryTypographyProps={{
                              fontWeight: "medium",
                              color:
                                router.pathname === "/messenger"
                                  ? "primary"
                                  : "black",
                              fontSize: 14,
                            }}
                          />
                        </Link>
                      </ListItem>
                    )}

                    {accountData.isConnected && (
                      <ListItem
                        sx={{ my: 1, "&:hover": { cursor: "pointer" } }}
                        disablePadding
                        disableGutters
                      >
                        <Link href={`/view/profile/${userAddress}`}>
                          <ListItemText
                            primary="Profile"
                            primaryTypographyProps={{
                              fontWeight: "medium",
                              color:
                                router.pathname === `/profile`
                                  ? "primary"
                                  : "black",
                              fontSize: 14,
                            }}
                          />
                        </Link>
                      </ListItem>
                    )}
                  </Stack>
                </Stack>
              </Grid>
              <Grid item />
              <Grid
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={3}>
                  {accountData?.status === "connected" &&
                  userLensProfile?.profileId === 0 ? (
                    <Chip
                      clickable
                      onClick={() => setVerificationDialogOpen(true)}
                      sx={{ bgcolor: "#eee", fontWeight: "600" }}
                      label={`🌍 ${" "} Sign up`}
                    />
                  ) : null}

                  {accountData?.status === "connected" && (
                    <Typography
                      variant="button"
                      sx={{
                        fontWeight: "700",
                        fontSize: "12px",
                      }}
                      onClick={handleOnAddFunds}
                    >
                      Add Funds
                    </Typography>
                  )}

                  {accountData.status === "connected" &&
                    userLensProfile.profile?.handle && (
                      <>
                        <Tooltip title="Create">
                          <Typography
                            variant="button"
                            sx={{
                              fontWeight: "700",

                              fontSize: "12px",
                            }}
                            onClick={handleOnClickCreateIcon}
                          >
                            Create
                          </Typography>
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
                              filter:
                                "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
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
                          transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                          }}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                        >
                          <List>
                          <ListItemButton
                              disabled={true}
                            >
                              <ListItemText
                                primary="Bounty (Coming soon)"
                                secondary="Create a bounty that anyone can claim and complete"
                                primaryTypographyProps={{
                                  fontWeight: "bold",
                                  fontSize: 14,
                                }}
                                secondaryTypographyProps={{
                                  fontSize: 12,
                                  fontWeight: "medium",
                                  color: "#444",
                                }}
                              />
                            </ListItemButton>

                            <ListItemButton
                              disabled={userLensProfile?.handle}
                              onClick={() => router.push("/create/contract")}
                            >
                              <ListItemText
                                primary="Contract"
                                secondary="Create a contract if you're looking for a one time deal"
                                primaryTypographyProps={{
                                  fontWeight: "bold",
                                  fontSize: 14,
                                }}
                                secondaryTypographyProps={{
                                  fontSize: 12,
                                  fontWeight: "medium",
                                  color: "#444",
                                }}
                              />
                            </ListItemButton>

                            <ListItemButton
                              onClick={() => router.push("/create/service")}
                              disabled={userLensProfile?.handle}
                            >
                              <ListItemText
                                primary="Service"
                                secondary="Publish a service and allow your peers to invest in its success"
                                primaryTypographyProps={{
                                  fontWeight: "bold",
                                  fontSize: 14,
                                }}
                                secondaryTypographyProps={{
                                  fontSize: 12,
                                  fontWeight: "medium",
                                  color: "#444",
                                }}
                              />
                            </ListItemButton>
                          </List>
                        </Menu>
                      </>
                    )}
                  <>
                    <Typography
                      variant="button"
                      sx={{
                        fontWeight: "700",

                        fontSize: "12px",
                      }}
                      onClick={handleOnClickHelpIcon}
                    >
                      Help
                    </Typography>
                    <Menu
                      anchorEl={helpMenuAnchorEl}
                      id="help-menu"
                      open={helpMenuIsOpen}
                      onClose={handleOnCloseHelpMenu}
                      onClick={handleOnCloseHelpMenu}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          borderRadius: 0,
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
                      <List sx={{ width: 250 }}>
                        <ListItemButton>
                          <ListItemIcon>
                            <QuestionMarkOutlined fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Get Help (Discord)" />
                        </ListItemButton>

                        <ListItemButton>
                          <ListItemIcon>
                            <Book fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Tutorial" />
                        </ListItemButton>

                        <ListItemButton>
                          <ListItemIcon>
                            <WebAsset fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Blog" />
                        </ListItemButton>
                        <ListItemButton>
                          <ListItemIcon>
                            <QuestionAnswer fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="FAQ" />
                        </ListItemButton>
                      </List>
                    </Menu>
                  </>

                  {accountData.isConnected ? (
                    <ConnectedAvatar />
                  ) : (
                    <Chip
                      color="primary"
                      size="medium"
                      label={`🌐${" "}${" "}Connect`}
                      component={Button}
                      disableRipple
                      disableFocusRipple
                      disableTouchRipple
                      sx={{
                        fontWeight: "600",
                        borderRadius: '2px',
                        border: "1px solid #ddd",
                        fontSize: "11px",
                        bgcolor: "rgb(245, 245, 245)",
                      }}
                      onClick={handleClickOpen}
                    />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
        <Dialog
          sx={{ width: "100%", maxWidth: "425" }}
          open={modelopen}
          onClose={handlesClose}
        >
          <DialogContent
            sx={{
              border: "1px solid #eee",
              bordeRadius: "0.5rem",
              padding: "48px 56px",
            }}
          >
            <CloseIcon
              fontSize="large"
              onClick={handlesClose}
              sx={{
                padding: "0px",
                height: "20px",
                position: "absolute",
                right: "17px",
                top: "17px",
                width: "20px",
                cursor: "pointer",
              }}
            />
            <Box my={2}>
              <DialogTitle
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px",
                  fontSize: 25,
                  fontWeight: "600",
                }}
              >
                Login
              </DialogTitle>
              <Typography variant="caption">
                New to Lens Talent? Start by connecting a wallet.
              </Typography>
            </Box>

            <div>
              {connectData.connectors.slice(-2, 1).map((connector) => (
                <Button
                  variant="outlined"
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connectData.connect({ connector })}
                  sx={{
                    paddingLeft: "24px",
                    paddingRight: "163px",
                    paddingTop: "15px",
                    border: "1px solid #ddd",
                    paddingBottom: "15px",
                    borderRadius: "0.1875rem",
                  }}
                >
                  <img
                    src="/assets/images/metamaskconnect.png"
                    alt="metamaskwalletlogo"
                    style={{ width: 28, height: 28 }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "sans-serif",
                      fontStyle: "normal",

                      lineHeight: "normal",
                      fontSize: "0.875rem",
                      fontWeight: "700",
                      color: "#000000",
                      marginLeft: "1.3125rem",
                    }}
                  >
                    Login with {connector.name}
                    {connectData.status === "loading" &&
                      connector.id === connectData.pendingConnector?.id &&
                      " (connecting)"}
                  </Typography>
                </Button>
              ))}

              <Divider>
                <Typography
                  sx={{
                    fontFamily: "sans-serif",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "normal",
                    fontSize: "0.75rem",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "2rem 0;",
                  }}
                >
                  OR
                </Typography>
              </Divider>
              {connectData.connectors.slice(1).map((connector) => (
                <Button
                  variant="outlined"
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connectData.connect({ connector })}
                  sx={{
                    paddingLeft: "24px",
                    paddingRight: "122px",
                    border: "1px solid #ddd",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "0.1875rem",
                  }}
                >
                  <img
                    src="/assets/images/coinbaseconnect.png"
                    alt="coinbasewalletlogo"
                    style={{ width: 28, height: 28 }}
                  />

                  <Typography
                    sx={{
                      fontFamily: "sans-serif",
                      fontStyle: "normal",

                      lineHeight: "normal",
                      fontSize: "0.875rem",
                      fontWeight: "700",
                      color: "#000000",
                      marginLeft: "1.3125rem",
                    }}
                  >
                    Login with {connector.name}
                    {!connector.ready && " (unsupported)"}
                    {connectData.status === "loading" &&
                      connector.id === connectData.pendingConnector?.id &&
                      " (connecting)"}
                  </Typography>
                </Button>
              ))}
              {connectData.error && <div>{connectData.error.message}</div>}
            </div>
            <Box mt={2}>
              <Typography variant="caption">
                Want to learn more about Lens Talent?{" "}
                <Typography
                  component="span"
                  variant="caption"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                >
                  {" "}
                  Read our guide{" "}
                </Typography>
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </AppBar>

      <VerificationDialog
        open={verificationDialogOpen}
        handleClose={() => {
          userData.refetch();
          setVerificationDialogOpen(false);
        }}
      />

      <CheckRequiredDispatcherDialog
        isConnected={accountData.isConnected}
        profileId={userLensProfile.profileId}
      />
    </React.Fragment>
  );
};

export default NavigationBar;
