import React, { FC, useState, useEffect, ReactNode, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  Typography,
  Divider,
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
} from "@mui/material";
import { Check } from "@material-ui/icons";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
import { useContractRead, useContractWrite } from "wagmi";
import { LENS_HUB_PROXY, NETWORK_MANAGER_ADDRESS } from "../../../../constant";
import { LensHubInterface, NetworkManagerInterface } from "../../../../abis";
import { ethers } from "ethers";
import { Result } from "ethers/lib/utils";
import { hexToDecimal } from "../../../../common/helper";
import { useDispatch, useSelector } from "react-redux";
import { selectUserAddress, userLensDataStored } from "../../userReduxSlice";
import { CHAIN_ID } from "../../../../constant/provider";
import { GradientAvatarClassKey } from "@mui-treasury/styles/avatar/gradient/gradientAvatar.styles";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { AnyAction, Dispatch } from "redux";
import BootstrapInput from "../../../../common/components/BootstrapInput/BootstrapInput";
import { Cancel } from "@mui/icons-material";
import { create } from "ipfs-http-client";
import fleek from "../../../../fleek";

const Tags = ({ data }) => {
  return (
    <Box
      sx={{
        background: "#283240",
        height: "100%",
        display: "flex",
        padding: "0.4rem",
        margin: "0 0.5rem 0 0",
        justifyContent: "center",
        alignContent: "center",
        color: "#ffffff",
      }}
    >
      <Stack direction="row" gap={1}>
        <Typography>{data}</Typography>
        <Cancel sx={{ cursor: "pointer" }} />
      </Stack>
    </Box>
  );
};

interface IVerificationDialogProps {
  open: boolean;
  handleClose: () => void;
}

const VerificationDialog: FC<IVerificationDialogProps> = ({
  open = true,
  handleClose,
}) => {
  const [lensProfileId, setLensProfileId] = useState(0);
  const userAddress = useSelector(selectUserAddress);
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const [page, setPage] = useState<number>(0);
  const [updatedPtr, setUpdatedPtr] = useState<string>('')
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
      args: [userAddress],
      onSuccess: (data: Result) => {
        setLensProfileId(hexToDecimal(data._hex));
      },
      onError: (error) => {},
    }
  );

  const networkManager_registerWorker = useContractWrite(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: JSON.stringify(NetworkManagerInterface),
    },
    "register",
    {
      args: [
        {
          to: NETWORK_MANAGER_ADDRESS,
          handle: "arlinhut78",
          imageURI:
            "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
          followModule: "0x0000000000000000000000000000000000000000",
          followModuleInitData: [],
          followNFTURI:
            "https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan",
        },
        updatedPtr
      ],
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },

      onSuccess: (data) => {
        networkManager_getLensProfileIdFromAddress.refetch();
        handleClose();
      },
    }
  );

  const handleOnVerify = async () => {
    
        let retVal = ''
        try {
      if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
        //https://ipfs.infura.io:5001/api/v0
        const ipfs = create({
          url: "/ip4/0.0.0.0/tcp/5001",
        });

        retVal = await (
          await ipfs.add(JSON.stringify(metadataState))
        ).path;
      } else {
        retVal = await fleek.uploadService(
          'metadata_'+String(userAddress),
          JSON.stringify(metadataState)
        );
      }
    } catch(error) {
      console.log('Error with IPFS')
      console.log(error)
    }

    if (!retVal) {
      alert('Return value null')
      return
    }

      console.log('@@@@@@@@@@@@@')

      console.log(retVal)


    await networkManager_registerWorker.writeAsync({
      args: [
        {
          to: NETWORK_MANAGER_ADDRESS,
          handle: "lenshacker8",
          imageURI:
            "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
          followModule: "0x0000000000000000000000000000000000000000",
          followModuleInitData: [],
          followNFTURI:
            "https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan",
        },
        retVal
      ],
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },
    });
  };

  const styles: ClassNameMap<GradientAvatarClassKey> = useGradientAvatarStyles({
    size: 50,
    gap: 3,
    thickness: 3,
    gapColor: "#f4f7fa",
    color: "linear-gradient(to bottom right, #feac5e, #c779d0, #4bc0c8)",
  });

  const handleOnChangeTextField = (e) => {
    switch (e.target.id) {
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

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
console.log(value)
    setMetadataState({
      ...metadataState,
      languages: value,
    });
  };

  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];
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

  //
  const tagRef = useRef();
  const certificationsRef = useRef();

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

  const selectedLanguages = ["English", "Spanish"];

  const handleUpdate = () => {};

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      sx={{ height: 1000 }}
      open={open}
      onClose={handleClose}
    >
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
                  inputRef={certificationsRef}
                  fullWidth
                  placeholder={
                    metadataState.certifications.length < 5 ? "Enter tags" : ""
                  }
                  sx={{ margin: "1rem 0" }}
                  margin="none"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ margin: "0 0.2rem 0 0", display: "flex" }}>
                        {metadataState.certifications.map((data, index) => {
                          return <Tags data={data} key={index} />;
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
                          return <Tags data={data} key={index} />;
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
            <TextField size="small" fullWidth autoComplete={false} sx={{}} />
            <FormHelperText>
              Choose a unique handle to identify your profile
            </FormHelperText>
          </FormControl>
        )}

<FormControlLabel
                        control={
                          <Checkbox
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
          <Button onClick={() => setPage(0)}>Back</Button>
        )}
        {page === 0 ? (
          <Button onClick={() => setPage(1)}>Next</Button>
        ) : (
          <Button onClick={handleOnVerify}>Verify on LensTalent</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default VerificationDialog;

/*


          <Divider variant="fullWidth" />
          <Box p={3}>
            <Typography fontWeight="medium" fontSize={15}>
              As a verified freelancer you would able to:
            </Typography>
            <Stack pt={1} pl={1} spacing={2}>
              <Stack direction="row" spacing={1.5}>
                <Check fontSize="small" />
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Register a one time, unique and persistent identity.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Check fontSize="small" />
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Access an immutable history of your completed jobs and
                  portfolio.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Check fontSize="small" />
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Create services that can be monetized on any lens protocol
                  networking application.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Check fontSize="small" />
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color="text.secondary"
                >
                  Receive referral based work from your network.
                </Typography>
              </Stack>
            </Stack>
          </Box>

          */
