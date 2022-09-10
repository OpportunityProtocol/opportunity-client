import React, {
  FC,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  MutableRefObject,
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
  LinearProgress,
} from "@mui/material";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  FREE_FOLLOW_MODULE,
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS,
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

interface IVerificationDialogProps {
  open: boolean;
  handleClose: () => void;
}

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

const selectedLanguages = ["English", "Spanish"];

const VerificationDialog: FC<IVerificationDialogProps> = ({
  open = true,
  handleClose,
}) => {
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
  const [metadataState, setMetadataState] = useState<object>({
    display_name: "",
    description: "",
    certifications: [],
    skills: [],
    languages: [],
    toggles: {
      show_freelancer_stats: false,
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
   /*   lensHub_getProfile.refetch({
        throwOnError: true,
      });*/
    }
  }, [lensProfileId]);

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

  const networkManager_registerWorkerPrepare = usePrepareContractWrite({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: JSON.stringify(NetworkManagerInterface),
    functionName: "register",
    args: [
      {
        to: NETWORK_MANAGER_ADDRESS,
        handle: chosenLensHandle,
        imageURI:
          "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
        followModule: FREE_FOLLOW_MODULE,
        followModuleInitData: [],
        followNFTURI: "",
      },
      updatedPtr,
    ],
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSuccess: (data) => {},
    onError(error: Error) {
      if (String(error).includes("Taken")) {
        setChosenHandleErrorText(
          "This handle has already been taken. Try another."
        );
      } else {
        setChosenHandleErrorText(error.message);
      }
    },
    onSettled(data, error) {
     // networkManager_getLensProfileIdFromAddress.refetch();
      setRegistrationLoading(false);
      handleClose();
    },
  });

  const networkManager_registerWorker = useContractWrite(
    networkManager_registerWorkerPrepare.config
  );

  const handleOnVerify = async () => {
    setRegistrationLoading(true);

    let retVal = "";
    try {
      if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
        //https://ipfs.infura.io:5001/api/v0
        const ipfs = create({
          url: "/ip4/0.0.0.0/tcp/5001",
        });

        retVal = await (await ipfs.add(JSON.stringify(metadataState))).path;
      } else {
        retVal = await fleek.uploadService(
          "metadata_" + String(userAddress),
          JSON.stringify(metadataState)
        );
      }
    } catch (error) {
      alert("Error uploading metadata");
    }

    if (!retVal) {
      alert("Error uploading metadata");
      return;
    }

    await networkManager_registerWorker.writeAsync({
      recklesslySetUnpreparedArgs: [
        {
          to: NETWORK_MANAGER_ADDRESS,
          handle: chosenLensHandle,
          imageURI:
            "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
          followModule: ZERO_ADDRESS,
          followModuleInitData: [],
          followNFTURI: "",
        },
        retVal,
      ],
      recklesslySetUnpreparedOverrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },
    });
  };

  const handleOnChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.id) {
      case "register-lens-handle-text-field":
        setChosenLensHandle(e.target.value);
        break;
      case "settings-form-display-name":
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
  const certificationsRef: MutableRefObject<any> = useRef();

  //HandleSubmit
  const handleOnSubmitCertification = (e) => {
    e.preventDefault();
    setMetadataState({
      ...metadataState,
      certifications: [
        ...metadataState?.certifications,
        certificationsRef?.current?.value,
      ],
    });

    certificationsRef.current.value = "";
  };

  const handleOnSubmitSkill = (e) => {
    e.preventDefault();
    setMetadataState({
      ...metadataState,
      skills: [...metadataState?.skills, tagRef?.current?.value],
    });

    tagRef.current.value = "";
    // tagRef?.current?.value = "";
  };

  const handleOnChangeDisplayFreelancer = (e) => {
    setMetadataState({
      ...metadataState,
      toggles: {
        display_freelancer_stats: e.target.checked,
      },
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      sx={{ height: 1000 }}
      open={open}
      onClose={handleClose}
    >
      {registrationLoading ? <LinearProgress variant="indeterminate" /> : null}
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Avatar
          src="/assets/images/writing.jpeg"
          style={{ margin: "10px 0px", width: 100, height: 100 }}
        />
        <DialogTitle
          sx={{ paddingTop: "0px !important", marginTop: "0px !important" }}
        >
          <Typography>Become a verified freelancer on Lens Talent</Typography>
        </DialogTitle>

        <DialogContentText textAlign="center" fontWeight="bold" maxWidth={400}>
          Prioritize work based on customer needs and build a tighter feedback
          loop with your customers
        </DialogContentText>
      </DialogContent>

      <>
        <DialogContent
          sx={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {page === 0 ? (
            <Box sx={{ width: "100%" }}>
              <Stack spacing={4}>
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="settings-form-display-name">
                    Display Name
                  </InputLabel>
                  <BootstrapInput
                    disabled={registrationLoading}
                    fullWidth
                    onChange={handleOnChangeTextField}
                    size="small"
                    id="settings-form-display-name"
                  />
                </FormControl>

                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="settings-form-about-you">
                    About You
                  </InputLabel>
                  <BootstrapInput
                    disabled={registrationLoading}
                    onChange={handleOnChangeTextField}
                    size="small"
                    id="settings-form-about-you"
                  />
                </FormControl>

                <FormControl
                  component="form"
                  onSubmit={handleOnSubmitCertification}
                  variant="standard"
                >
                  <InputLabel shrink htmlFor="settings-certifications">
                    Certifications
                  </InputLabel>
                  <TextField
                    disabled={registrationLoading}
                    inputRef={certificationsRef}
                    fullWidth
                    placeholder={
                      metadataState.certifications.length < 5
                        ? "Enter tags"
                        : ""
                    }
                    sx={{ margin: "1rem 0" }}
                    margin="none"
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ margin: "0 0.2rem 0 0", display: "flex" }}>
                          {metadataState.certifications.map((data, index) => {
                            return <Tag data={data} key={index} />;
                          })}
                        </Box>
                      ),
                    }}
                    size="small"
                    id="settings-certifications"
                  />
                  <FormHelperText>
                    Enter certifications separated by commas
                  </FormHelperText>
                </FormControl>

                <FormControl
                  component="form"
                  onSubmit={handleOnSubmitSkill}
                  variant="standard"
                >
                  <InputLabel shrink htmlFor="settings-skills">
                    Skills
                  </InputLabel>
                  <TextField
                    disabled={registrationLoading}
                    size="small"
                    id="settings-skills"
                    inputRef={tagRef}
                    fullWidth
                    variant="standard"
                    sx={{ margin: "1rem 0" }}
                    margin="none"
                    placeholder={
                      metadataState.skills.length < 5 ? "Enter tags" : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ margin: "0 0.2rem 0 0", display: "flex" }}>
                          {metadataState.skills.map((data, index) => {
                            return <Tag data={data} key={index} />;
                          })}
                        </Box>
                      ),
                    }}
                  />
                  <FormHelperText>
                    Enter skills separated by commas
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
              </Stack>
            </Box>
          ) : (
            <FormControl
              sx={{
                marginBottom: 3,
                marginTop: 3,

                display: "flex",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <TextField
                disabled={registrationLoading}
                value={chosenLensHandle}
                id="register-lens-handle-text-field"
                onChange={handleOnChangeTextField}
                size="small"
                fullWidth
                error={chosenHandleError}
              />
              <FormHelperText>
                {chosenHandleError
                  ? chosenHandleErrorText
                  : "Choose a unique handle to identify your profile"}
              </FormHelperText>
            </FormControl>
          )}

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
        </DialogContent>

        <DialogActions>
          {page === 0 ? (
            <Button onClick={handleClose}>Close</Button>
          ) : (
            <Button disabled={registrationLoading} onClick={() => setPage(0)}>
              Back
            </Button>
          )}
          {page === 0 ? (
            <Button onClick={() => setPage(1)}>Next</Button>
          ) : (
            <Button disabled={registrationLoading} onClick={handleOnVerify}>
              Verify on LensTalent
            </Button>
          )}
        </DialogActions>
      </>
    </Dialog>
  );
};

export default VerificationDialog;
