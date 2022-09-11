import React, { useState, FC, useEffect, useContext, ChangeEvent } from "react";
import {
  Box,
  Container,
  Grid,
  Tooltip,
  Button,
  Stack,
  AppBar,
  List,
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
} from "@mui/material";

import { useRouter } from "next/router";
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
  useFeeData,
} from "wagmi";
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
import { QueryResult, useQuery } from "@apollo/client";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "../../../modules/user/UserGQLQueries";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Metamaskconnect from "public/assets/images/coinbaseconnect.png";
import Coinbaseconnect from "../../../../public/assets/images/coinbaseconnect.png";

/**
 * Elijah Hampton
 * @returns JSX.Element The NavigationBar component
 */
const NavigationBar: FC = (): JSX.Element => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();

  const [verificationDialogOpen, setVerificationDialogOpen] =
    useState<boolean>(false);
  const [lensProfileId, setLensProfileId] = useState<Result | any>(0);
  const userAddress = useSelector(selectUserAddress);
  const connected = useSelector(selectUserConnectionStatus);

  const connectData = useConnect();
  const accountData = useAccount();

  const userData: QueryResult = useQuery(GET_VERIFIED_FREELANCER_BY_ADDRESS, {
    variables: {
      userAddress,
    },
  });

  //getProfile
  const lensHub_getProfile = useContractRead({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    functionName: "getProfile",
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
  });

  useEffect(() => {
    if (lensProfileId !== 0) {
      lensHub_getProfile.refetch({
        throwOnError: true,
      });
    }
  }, [lensProfileId]);

  const networkManager_getLensProfileIdFromAddress = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getLensProfileIdFromAddress",
    enabled: false,
    chainId: CHAIN_ID,
    args: [accountData?.address],
    onSuccess: (data: Result) => {
      setLensProfileId(hexToDecimal(data._hex));
    },
    onError: (error) => {},
  });

  const dai_balanceOf = useContractRead({
    addressOrName: DAI_ADDRESS,
    contractInterface: JSON.stringify(DaiInterface),
    functionName: "balanceOf",
    enabled: false,
    cacheTime: 50000,
    watch: true,
    chainId: CHAIN_ID,
    args: [userAddress],
    onError: (error: Error) => {},
  });

  const ethBalanceData = useBalance({
    addressOrName: accountData ? accountData.address : String(0),
  });

  const [helpMenuAnchorEl, setHelpMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const helpMenuIsOpen = Boolean(helpMenuAnchorEl);

  const handleOnClickHelpIcon = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setHelpMenuAnchorEl(event.currentTarget);
  };

  const handleOnCloseHelpMenu = () => {
    setHelpMenuAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onFetchLensProfileId = () => {
    if (accountData.address && accountData.address != ZERO_ADDRESS) {
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

      if (accountData.isConnected) {
        address = accountData.address;
        connector = accountData.connector;
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
            [DAI_ADDRESS]: hexToDecimal(
              Number(BigNumber.from(Number(daiBalance))._hex)
            ),
          },
          connector: String(connectData.data?.connector.name),
          address,
          connected: accountData.isConnected,
        })
      );
    }

    if (accountData.isConnected) {
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
  }, [accountData.isConnected]);

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

  const [modelopen, setmodelOpen] = React.useState(false);

  const handleClickOpen = () => {
    setmodelOpen(true);
  };

  const handlesClose = () => {
    setmodelOpen(false);
  };

  useEffect(() => {

    if (accountData.isConnected) {

      handlesClose();
    }
  }, [accountData.isConnected]);


  return (
    <React.Fragment>
      <AppBar
        variant="outlined"
        sx={{
          width: `calc(100% - ${320}px)`, 
          ml: `${320}px`,
          bgcolor: "#fff",
          border: 'none',
          borderBottom: "1px solid #ddd !important",
          padding: '0px 20px',
        }}
      >
        <Toolbar className={classes.toolbar}>
          <Container
            maxWidth="xl"
            sx={{  display: "flex", flexDirection: "column", bgcolor: "#fff" }}
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
                <Stack direction="row" alignItems="center" sx={{  }}>
                  <img
                    className={classes.clickableBrand}
                    src="/assets/logo.svg"
                    style={{ width: 40, height: 40 }}
                  />
                </Stack>
             

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  ml={1.7}
                >
                  <Link href="/">
                    <Typography
                      variant="button"
                      fontSize={14}
                      component={Button}
                      disableRipple
                      disableFocusRipple
                      disableTouchRipple
                      color={
                        router.pathname == "/" ? "primary" : "text.secondary"
                      }
                      sx={{ fontWeight: "bold" }}
                    >
                      Home
                    </Typography>
                  </Link>

       

                  {accountData.isConnected && (
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
                      <Chip
                        clickable
                        label="Create"
                        sx={{
                          fontWeight: "600",
                          border: "1px solid #ddd",
                          fontSize: "11px",
                          bgcolor: "rgb(245, 245, 245)",
                        }}
                        size="medium"
                        onClick={handleOnClickCreateIcon}
                        aria-controls={
                          createMenuIsOpen ? "create-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={createMenuIsOpen ? "true" : undefined}
                        icon={
                          <AddCircleOutline
                            fontSize="small"
                            sx={{ color: "rgb(158, 158, 166)" }}
                          />
                        }
                      />
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
                      <List>
                        <ListItemButton
                          disabled={userData.data?.verifiedUsers?.length > 0}
                          onClick={() => router.push("/create/contract")}
                        >
                          <ListItemText
                            primary="Create a contract"
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
                          disabled={userData.data?.verifiedUsers?.length > 0}
                        >
                          <ListItemText
                            primary="Create a service"
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

                  <>
            
                      <Chip
                        sx={{
                          fontWeight: "600",
                          border: "1px solid #ddd",
                          fontSize: "11px",
                          bgcolor: "rgb(245, 245, 245)",
                        }}
                        icon={
                          <HelpOutline
                            fontSize="small"
                            sx={{ color: "rgb(158, 158, 166)" }}
                          />
                        }
                        label="Help"
                        
                       // size="medium"
                     //   onClick={handleOnClickHelpIcon}
                      />
               

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
                      label="Connect"
                      component={Button}
                      disableRipple
                      disableFocusRipple
                      disableTouchRipple
                      sx={{
                        fontWeight: "600",
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
              border: "0.187rem solid #ddd",
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
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px",
                marginBottom: "2rem",
              }}
            >
              Login
            </DialogTitle>

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
                    {connector.name}

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
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "0.1875rem",
                  }}
                >
                  <img
                    src="/assets/images/coinbaseconnect.png"
                    alt="coinnasewalletlogo"
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
                    {connector.name}
                    {!connector.ready && " (unsupported)"}
                    {connectData.status === "loading" &&
                      connector.id === connectData.pendingConnector?.id &&

                      " (connecting)"}
                  </Typography>
                </Button>
              ))}


              {connectData.error && <div>{connectData.error.message}</div>}

            </div>
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
    </React.Fragment>
  );
};

export default NavigationBar;