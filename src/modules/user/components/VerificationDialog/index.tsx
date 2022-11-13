import React, {
  FC,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  MutableRefObject,
  KeyboardEventHandler,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  Typography,
  Avatar,
  Box,
  TextField,
  FormHelperText,
  Stack,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  OutlinedInput,
  Select,
  Chip,
  FormControlLabel,
  Checkbox,
  Divider,
  LinearProgress,
  InputBase,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useContractRead, useContractWrite } from "wagmi";
import {
  FREE_FOLLOW_MODULE,
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS,
  PINATA_JWT,
  ZERO_ADDRESS,
} from "../../../../constant";
import { LensHubInterface, NetworkManagerInterface } from "../../../../abis";
import { ethers } from "ethers";
import { Result } from "ethers/lib/utils";
import { hexToDecimal } from "../../../../common/helper";
import { useDispatch, useSelector } from "react-redux";
import { selectUserAddress, userLensDataStored } from "../../userReduxSlice";
import { CHAIN_ID } from "../../../../constant/provider";
import { AnyAction, Dispatch } from "redux";
import BootstrapInput from "../../../../common/components/BootstrapInput/BootstrapInput";
import { create } from "ipfs-http-client";
import fleek from "../../../../fleek";
import Tag from "../../../../common/components/Tag";
import { getLensProfileById } from "../../../lens/LensGQLQueries";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "../../UserGQLQueries";
import { useInterval } from "usehooks-ts";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

//temporary
const selectedLanguages = ["English", "Spanish"];

interface IVerificationDialogProps {
  open: boolean;
  handleClose: (event?: any, reason?: any) => void;
}

const VerificationDialog: FC<IVerificationDialogProps> = ({
  open,
  handleClose,
}) => {
  const [waitingForTx, setWaitingForTx] = useState<boolean>(false);
  const [lensProfileId, setLensProfileId] = useState<number>(0);
  const [chosenHandleError, setChosenHandleError] = useState<boolean>(false);
  const [chosenHandleErrorText, setChosenHandleErrorText] =
    useState<string>("");
  const [registrationLoading, setRegistrationLoading] =
    useState<boolean>(false);
  const [chosenLensHandle, setChosenLensHandle] = useState<string>("");
  const userAddress: string = useSelector(selectUserAddress);
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const [page, setPage] = useState<number>(0);
  const [updatedPtr, setUpdatedPtr] = useState<string>("");
  const [registrationButtonEnabled, setRegistrationButtonEnabled] =
    useState<boolean>(false);
  const [currentSkill, setCurrentSKill] = useState<string>("");
  const [metadataState, setMetadataState] = useState<object>({
    display_name: "",
    description: "",
    skills: [],
    languages: [],
    show_freelancer_stats: 0,
  });

  const networkManager_getLensProfileIdFromAddress = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getLensProfileIdFromAddress",
    enabled: false,
    watch: false,
    chainId: CHAIN_ID,
    args: [userAddress],
    onSuccess: (data: Result) => {
      setLensProfileId(hexToDecimal(data._hex));
    },
    onError: (error) => {},
  });

  useInterval(
    () => {
      checkProfileRegistration();
    },
    waitingForTx ? 5000 : null
  );

  const checkProfileRegistration = () => {
    networkManager_getLensProfileIdFromAddress
      .refetch()
      .then(async (value) => {
        if (value.data?._hex) {
          const profile = await getLensProfileById(
            `0x${Math.abs(Number(value.data?._hex)).toString(16)}`
          );

          dispatch(
            userLensDataStored({
              profileId: value?.data?._hex,
              profile,
              error: null,
            })
          );
        }
      })
      .catch((error: Error) => {
        dispatch(
          userLensDataStored({
            profileId: 0,
            profile: null,
            error: error.message,
          })
        );
      })
      .finally(() => {
        handleClose();
        setWaitingForTx(false);
      });
  };

  const {
    write,
    isError,
    error,
    data: registerData,
    isSuccess,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: NETWORK_MANAGER_ADDRESS,
    enabled: false,
    contractInterface: NetworkManagerInterface,
    functionName: "register",
    args: [
      {
        to: userAddress,
        handle: chosenLensHandle,
        imageURI:
          "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
        followModule: ZERO_ADDRESS,
        followModuleInitData: [],
        followNFTURI:
          "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
      },
      updatedPtr,
    ],
    overrides: {
      gasLimit: ethers.BigNumber.from("9000000"),
      gasPrice: 90000000000,
    },
    onSuccess: (data) => {
      data
        .wait()
        .then((data: ethers.providers.TransactionReceipt) => {
          if (data?.status > 0) {
            setWaitingForTx(true);
          } else {
            setChosenHandleErrorText("Sorry. Something went wrong");
          }

          setRegistrationLoading(false);
        })
        .catch((error) => {
          setChosenHandleErrorText(error.message);
        });
    },
    onError(error: Error) {
      if (String(error).includes("Taken")) {
        setChosenHandleErrorText(
          "This handle has already been taken. Try another."
        );
      } else if (String(error).toLowerCase().includes("rejected")) {
        setChosenHandleErrorText("You rejected this action.");
      } else {
        setChosenHandleErrorText(error.message);
      }

      setRegistrationLoading(false);
    },
  });

  const handleOnVerify = async () => {
    setRegistrationLoading(true);

    let retVal = "";
    try {
      if (!PINATA_JWT) {
        const ipfs = create({
          url: "/ip4/0.0.0.0/tcp/5001",
        });

        retVal = await (await ipfs.add(JSON.stringify(metadataState))).path;
      } else {
        const deepCopyMetadataState = JSON.parse(JSON.stringify(metadataState));

        retVal = await fleek.uploadUser(
          "metadata_" + String(userAddress),
          JSON.stringify(deepCopyMetadataState)
        );
      }

      if (!retVal) throw new Error("Error saving metadata.");
    } catch (error) {}
    setUpdatedPtr(retVal);

    write({
      recklesslySetUnpreparedOverrides: {
        gasLimit: ethers.BigNumber.from("9000000"),
        gasPrice: 90000000000,
      },
      recklesslySetUnpreparedArgs: [
        {
          to: userAddress,
          handle: chosenLensHandle,
          imageURI:
            "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
          followModule: ZERO_ADDRESS,
          followModuleInitData: [],
          followNFTURI:
            "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
        },
        retVal,
      ],
    });
  };

  const handleOnChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.id) {
      case "register-lens-handle-text-field":
        setChosenLensHandle(e.target.value);
        break;
      case "register-display-name-text-field":
        setMetadataState({
          ...metadataState,
          display_name: e.target.value,
        });
        break;
      case "settings-form-about-you":
        setMetadataState({
          ...metadataState,
          description: e.target.value,
        });
        break;
      default:
    }
  };

  const handleChange = (event: SelectChangeEvent<typeof selectedLanguages>) => {
    const {
      target: { value },
    } = event;
    setMetadataState({
      ...metadataState,
      languages: value,
    });
  };

  const tagRef: MutableRefObject<any> = useRef();

  const handleOnSubmitSkill = (e) => {
    e.preventDefault();
    setMetadataState({
      ...metadataState,
      skills: [...metadataState?.skills, tagRef?.current?.value],
    });

    tagRef.current.value = "";
  };

  const handleOnChangeDisplayFreelancer = (e) => {
    setMetadataState({
      ...metadataState,
      display_freelancer_stats: e.target.checked == true ? 1 : 0,
    });
  };

  const handleOnDeleteTag = (idx: number) => {
    const updatedTags = metadataState?.skills;
    updatedTags.splice(idx, 1);

    setMetadataState({
      ...metadataState,
      skills: updatedTags,
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      sx={{ height: "100vh" }}
      open={open}
      onClose={(event, reason) => handleClose(event, reason)}
    >
      {registrationLoading || waitingForTx ? (
        <LinearProgress variant="indeterminate" />
      ) : null}

      {waitingForTx ? (
        <Stack
          spacing={2}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="subtitle2" fontSize={16}>
            Your registration will be complete in a few moments. 🎉
          </Typography>
        </Stack>
      ) : (
        <Box>
          <Box p={2}>
            <Typography textAlign="flex-start" fontSize={24} fontWeight="bold">
              Access all the world work from one platform
            </Typography>

            <DialogContentText
              paragraph
              fontWeight="400"
              color="text.secondary"
            >
              Takes less than 5 minutes to fill out the information below for
              immediate access.
            </DialogContentText>
          </Box>

          <Divider />

          <DialogContent
            sx={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Stack spacing={4} sx={{ width: "100%" }}>
                <FormControl>
                  <TextField
                    disabled={registrationLoading}
                    value={metadataState.display_name}
                    placeholder="Select a display name"
                    id="register-display-name-text-field"
                    onChange={handleOnChangeTextField}
                    size="small"
                    variant="outlined"
                    fullWidth
                  />
                  <FormHelperText>
                    {"Share your name with the world"}
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <TextField
                    disabled={registrationLoading}
                    value={chosenLensHandle}
                    placeholder="Select a Lens handle"
                    id="register-lens-handle-text-field"
                    onChange={handleOnChangeTextField}
                    size="small"
                    fullWidth
                    error={chosenHandleErrorText}
                  />
                  <FormHelperText>
                    {chosenHandleErrorText
                      ? chosenHandleErrorText
                      : "Choose a unique handle to identify your profile"}
                  </FormHelperText>
                </FormControl>

                <FormControl variant="standard">
                  <TextField
                    multiline
                    rows={5}
                    placeholder="About you"
                    disabled={registrationLoading}
                    onChange={handleOnChangeTextField}
                    size="small"
                    id="settings-form-about-you"
                  />
                </FormControl>

                <FormControl variant="outlined">
                  <TextField
                    disabled={registrationLoading}
                    size="small"
                    label="Skills"
                    id="settings-skills"
                    inputRef={tagRef}
                    fullWidth
                    variant="outlined"
                    onKeyPress={(e) =>
                      e.code == "Space" ? handleOnSubmitSkill(e) : null
                    }
                    margin="none"
                    placeholder={
                      metadataState.skills.length < 5 ? "Enter tags" : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ margin: "0 0.2rem 0 0", display: "flex" }}
                        >
                          {metadataState.skills.map((data, idx) => {
                            return (
                              <Chip
                                key={data}
                                label={data}
                                size="small"
                                onDelete={() => handleOnDeleteTag(idx)}
                              />
                            );
                          })}
                        </Stack>
                      ),
                    }}
                  />
                  <FormHelperText>
                    Enter skills separated by a space
                  </FormHelperText>
                </FormControl>

                <FormControl variant="outlined">
                  <InputLabel size="small" htmlFor="settings-languagest">
                    Languages
                  </InputLabel>
                  <Select
                    disabled={registrationLoading}
                    size="small"
                    label="Langauges"
                    id="settings-languages"
                    multiple
                    variant="outlined"
                    value={metadataState.languages}
                    onChange={handleChange}
                    input={
                      <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {selectedLanguages.map((language) => {
                      return (
                        <MenuItem value={language} key={language}>
                          {language}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={registrationLoading}
                      defaultChecked
                      onChange={handleOnChangeDisplayFreelancer}
                    />
                  }
                  label="Show freelancer stats on profile"
                  sx={{ fontWeight: "medium", fontSize: "14px" }}
                />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={registrationLoading}
              onClick={() => handleClose({}, "")}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={registrationLoading}
              onClick={handleOnVerify}
            >
              Verify on LensTalent
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default VerificationDialog;
