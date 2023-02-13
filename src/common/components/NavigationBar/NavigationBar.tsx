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
  Drawer,
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
  IWalletData,
  ILensProfile,
  userUpdateDaiBalance,
} from "../../../modules/user/userReduxSlice";
import { ethers } from "ethers";
import {
  Book,
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
import { login } from "../../../modules/lens/LensAPIAuthentication";
import { getLensProfileById } from "../../../modules/lens/LensGQLQueries";
import { AnyAction } from "redux";
import VerificationDialog from "../../../modules/user/components/VerificationDialog";
import { lens_client } from "../../../apollo";
import { QueryObserverResult } from "@tanstack/react-query";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AuthenticationDialog from "../AuthenticationDialog";
import MainDrawer from "../Drawer";

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

  const userAddress: string = useSelector(selectUserAddress);
  const userLensProfile: ILensProfile = useSelector(selectLens);

  const userData: QueryResult = useQuery(GET_VERIFIED_FREELANCER_BY_ADDRESS, {
    variables: {
      userAddress: accountData.address,
    },
  });

  const helpMenuIsOpen = Boolean(helpMenuAnchorEl);
  const createMenuIsOpen = Boolean(createMenuAnchorEl);

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

      signer.refetch().then(async (signer) => {
        login(signer.data)
          .then(() => handleOnIsConnected())
          .catch((error) => {
            alert("You must authenticate... try again");
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

  const handleOnAddFunds = async () => {
    await daiWrite
      .writeAsync()
      .then((response: ethers.providers.TransactionResponse) => {
        response.wait().then((receipt: ethers.providers.TransactionReceipt) => {
          if (receipt.status > 0) {
            dai_balanceOf
              .refetch()
              .then((result: QueryObserverResult<Result, Error>) => {
                dispatch(userUpdateDaiBalance(Number(result.data?._hex)));
              });
          }
        });
      });
  };

  async function handleOnIsConnected() {
    let daiBalance: number = 0;

    await dai_balanceOf.refetch().then((result) => {
      if (result.isSuccess) {
        daiBalance = Number(result.data?._hex);
      } else {
        daiBalance = 0;
      }
    });

    if (accountData.isConnected) {
      userData
        .refetch()
        .then(async (updatedUserData) => {
          const profile = await getLensProfileById(
            `0x${Math.abs(
              Number(updatedUserData.data?.verifiedUsers[0]?.id)
            ).toString(16)}`
          );

          const walletPayload: IWalletData = {
            balance: daiBalance,
            connector: accountData.connector.name,
            address: accountData.address,
            chain: await accountData.connector.getChainId(),
          };

          const lensPayload: ILensProfile = {
            user: {
              handle: profile.handle,
              imageURI: updatedUserData.data[0]?.imageURI,
              metadataPtr: updatedUserData.data[0]?.metadata,
            },
            profileId: profile.id,
            profile,
            error: null,
          };

          dispatch(userLensDataStored({ ...lensPayload }));
          dispatch(userWalletDataStored({ ...walletPayload }));
        })
        .catch((error) => {
          dispatch(
            userWalletDataStored({
              balance: 0,
              connector: "",
              address: ZERO_ADDRESS,
              chain: -1,
            })
          );

          dispatch(
            userLensDataStored({
              user: null,
              profileId: 0,
              profile: null,
              error: error.message,
            })
          );
        });
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            width: { sm: `calc(100%)` },
            boxShadow: "0px 6px 15px -3px rgba(0,0,0,0.1)",
            bgcolor: "#fff",
            //  border: "none",
            borderBottom: `1px solid #eee !important`,
            height: "65px !important",
          }}
        >
          <Toolbar disableGutters>
            <Box sx={{ px: 2, width: "100%" }}>
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
                  </Stack>
                </Grid>
                <Grid item>
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
                </Grid>
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
                      userLensProfile?.profile?.handle && (
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
                              <ListItemButton disabled={true}>
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
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom",
                        }}
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
                      clickable
                      variant='outlined'
                      //  color="primary"
                       // size="medium"
                        label={`🌎 Connect a wallet`}
                        //component={Button}
                       // disableRipple
                       // disableFocusRipple
                        //disableTouchRipple
                        sx={{
                          fontWeight: "600",
                          borderRadius: "2px",
                          border: '1px solid #ddd',
                          borderRadius: 6,
                          fontSize: 12
                          //p: 1,
                        //  color: "#ffffff",
                         // bgcolor: (theme) => theme.palette.primary.main,
                        }}
                        onClick={handleClickOpen}
                      />
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Toolbar>
          <AuthenticationDialog
            modelopen={modelopen}
            handlesClose={handlesClose}
            userLensProfile={userLensProfile}
            connectData={connectData}
          />
        </AppBar>
      </Box>

      <MainDrawer />

      <VerificationDialog
        open={verificationDialogOpen}
        handleClose={() => {
          userData.refetch();
          setVerificationDialogOpen(false);
        }}
      />

      <CheckRequiredDispatcherDialog
        isConnected={accountData.isConnected}
        profileId={userLensProfile?.profileId}
      />
    </Box>
  );
};

export default NavigationBar;
