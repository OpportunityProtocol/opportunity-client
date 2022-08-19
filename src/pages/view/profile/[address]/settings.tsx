import React, { useEffect, useRef, useState } from "react";

import {
  Typography,
  InputBase,
  TextField,
  Button,
  Chip,
  Container,
  Box,
  Stack,
  Menu,
  OutlinedInput,
  Card,
  CardContent,
  Switch,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  FormHelperText,
  MenuItem,
  Select,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { NextPage } from "next";
import BootstrapInput from "../../../../common/components/BootstrapInput/BootstrapInput";
import { makeStyles } from "@mui/styles";
import { NextRouter, useRouter } from "next/router";
import { Cancel } from "@mui/icons-material";
import { useContractWrite } from "wagmi";
import { NETWORK_MANAGER_ADDRESS } from "../../../../constant";
import { NetworkManagerInterface } from "../../../../abis";
import { ethers } from "ethers";
import fleek from "../../../../fleek";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../../../../modules/user/userReduxSlice";
import { create } from "ipfs-http-client";

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

const useStyles = makeStyles((theme) => {
  return {
    sectionHeader: {
      padding: "10px 0px",
    },
  };
});

const Settings: NextPage<any> = () => {
  const router: NextRouter = useRouter();
  const classes = useStyles();
  const { address, metadata } = router.query;
  const [selectedLanguages, setSelectedLanguages] = useState<Array<string>>([
    "English",
    "Spanish",
  ]);

  console.log(router)
  const [tags, SetTags] = useState([]);

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

  useEffect(() => {
    downloadMetadata(metadata as string);
  }, [metadata]);

  const downloadMetadata = async (ptr: string) => {
    let retVal: any = {};

    try {
      if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
        const ipfs = create({
          url: "/ip4/127.0.0.1/tcp/8080",
        });

        retVal = await ipfs.get(`/ipfs/${ptr}`).next();
      } else {
        retVal = await fleek.getUser(ptr);
      }

      if (!retVal) {
        throw new Error("Unable to retrieve user metadata");
      } else {
        const jsonString = Buffer.from(retVal.value).toString("utf8");
        const parsedString = jsonString.slice(
          jsonString.indexOf("{"),
          jsonString.lastIndexOf("}") + 1
        );
        const parsedData = JSON.parse(parsedString);
console.log(parsedData)
        setMetadataState({
          ...parsedData,
        });
      }
    } catch (error) {
      alert("Error downloading metadata");
    }
  };

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

    setMetadataState({
      ...metadataState,
      languages: value,
    });
  };

  function getStyles(
    name: string,
    personName: readonly string[],
    theme: Theme
  ) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

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

  const networkManager_updateUser = useContractWrite(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "updateMetadata",
    {
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },
      args: [""],
    }
  );

  const userAddress = useSelector(selectUserAddress);

  const handleUpdate = async () => {
    let retVal;
    if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
      //https://ipfs.infura.io:5001/api/v0
      const ipfs = create({
        url: "/ip4/0.0.0.0/tcp/5001",
      });

      retVal = await (await ipfs.add(JSON.stringify(metadataState))).path;
    } else {
      retVal = await fleek.uploadService(
        String(userAddress),
        JSON.stringify(metadataState)
      );
    }

    await networkManager_updateUser.writeAsync({
      args: [retVal],
    });
  };

  return (
    <Container sx={{ height: "calc(100vh - 70px)" }} maxWidth="lg">
      <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
        <Grid
          container
          spacing={4}
          direction="row"
          alignItems="flex-start"
          sx={{ height: "100%" }}
        >
          <Grid item xs={6}>
            <Typography
              className={classes.sectionHeader}
              color="text.secondary"
              fontWeight="bold"
            >
              Edit Profile
            </Typography>
            <Card variant="outlined" sx={{ borderRadius: 2, width: "100%" }}>
              <CardContent sx={{ width: "100%" }}>
                <Stack spacing={5}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="settings-form-display-name">
                      Display Name
                    </InputLabel>
                    <BootstrapInput
                      onChange={handleOnChangeTextField}
                      size="small"
                      value={metadataState?.display_name}
                      id="settings-form-display-name"
                    />
                  </FormControl>

                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="settings-form-about-you">
                      About You
                    </InputLabel>
                    <BootstrapInput
                       value={metadataState?.description}
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
                      placeholder={tags.length < 5 ? "Enter tags" : ""}
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
                      placeholder={tags.length < 5 ? "Enter tags" : ""}
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
                      multiple
                      value={metadataState?.languages}
                      onChange={handleChange}
                      input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
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

                  <Button variant="contained" onClick={handleUpdate}>
                    Update Profile
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sx={{ height: "100%" }}>
            <Stack spacing={5} sx={{ height: "100%" }}>
              <Box display="flex" flexDirection="column">
                <Typography
                  className={classes.sectionHeader}
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Additional Information
                </Typography>
                <Card
                  variant="outlined"
                  sx={{ borderRadius: 2, width: "100%" }}
                >
                  <CardContent
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      color="text.secondary"
                    >
                      Storage
                    </Typography>
                    <Typography paragraph fontSize={12}>
                      Lens Talent is 100% decentralized. All of your metadata is
                      stored in IPFS. You can find your metadata here:{" "}
                      <Typography
                        fontSize={12}
                        component="span"
                        variant="button"
                        color="primary"
                      >
                        https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan
                      </Typography>
                    </Typography>

                    <Typography pb={2} variant="body2">
                      or download it here:
                    </Typography>

                    <Button variant="outlined">Download</Button>
                  </CardContent>
                </Card>
              </Box>

              <Box display="flex" flexDirection="column">
                <Typography
                  className={classes.sectionHeader}
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Additional Settings
                </Typography>
                <Card
                  variant="outlined"
                  sx={{ borderRadius: 2, width: "100%" }}
                >
                  <CardContent sx={{ width: "100%" }}>
                    <Stack spacing={1.5}>
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
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Settings;
