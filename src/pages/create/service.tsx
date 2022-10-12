import {
  Box,
  Grid,
  Paper,
  InputBase,
  Card,
  CardContent,
  Divider,
  IconButton,
  Chip,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  DialogContentText,
  DialogContent,
  FormHelperText,
  Tabs,
  Tab,
  TextFieldProps,
  OutlinedInputProps,
  alpha,
  Theme,
  CardActions,
} from "@mui/material";
import { NextPage } from "next";
import { Fragment, ChangeEvent, createRef, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { Button, Container, TextField, Typography } from "@mui/material";
import MarketDisplay from "../../modules/market/components/MarketDisplay";
import ImageIcon from "@mui/icons-material/Image";
import fleek from "../../fleek";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  NETWORK_MANAGER_ADDRESS, PINATA_API_KEY, PINATA_JWT,
} from "../../constant";
import { NetworkManagerInterface, TokenFactoryInterface } from "../../abis";
import { BigNumber } from "ethers";
import { create } from "ipfs-http-client";
import { NextRouter, useRouter } from "next/router";
import BootstrapInput from "../../common/components/BootstrapInput/BootstrapInput";
import { FEE_COLLECT_MODULE, FOLLOWER_ONLY_REFERENCE_MODULE, FREE_COLLECT_MODULE } from "../../constant/contracts";
import { ConfirmationDialog } from "../../common/components/ConfirmationDialog";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_MARKETS } from "../../modules/market/MarketGQLQueries";
import { generatePinataData, pinJSONToIPFSPinata } from "../../common/ipfs-helper";
import { a11yProps } from "../../common/components/TabPanel/helper";
import TabPanel from "../../common/components/TabPanel/TabPanel";
import { styled } from "@mui/styles";
const Buffer = require("buffer").Buffer;

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#212121',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'none',
    border: 'none'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'none',
      border: '1px solid #ddd',
      // backgroundColor: 'rgb(239, 247, 238)'
    },
    '&:hover fieldset': {
      //  borderColor: 'none',
      border: '1px solid #ddd',
    },
    '&.Mui-focused fieldset': {
      // borderColor: 'none',
      border: '1px solid #ddd',
    },
  },
});

const SummaryKey = styled(Typography)(
  ({ theme }: { theme?: Theme }) => ({
    fontSize: 14,
    fontWeight: '600',
    color: theme.palette.text.secondary
  })
)

const SummaryValue = styled(Typography)(
  ({ theme }: { theme?: Theme }) => ({
    fontSize: 14,
  })
)

const SummarySectionTitle = styled(Typography)(
  ({ theme }: { theme?: Theme }) => ({
    fontWeight: '600',
  })
)

/**
 * Elijah Hampton
 * @returns NextPage The CreateServicePage component
 */
const CreateServicePage: NextPage<any, any> = (): JSX.Element => {
  const marketsQuery: QueryResult = useQuery(GET_MARKETS);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [serviceMetadataKey, setServiceMetadataKey] = useState<string>("");
  const [marketDetails, setMarketDetails] = useState<any>([]);
  const [selectedMarketId, setSelectedMarketId] = useState<number>(-1);
  const [createServiceForm, setCreateServiceForm] = useState<any>({
    serviceTitle: "",
    serviceDescription: "",
    serviceTags: "",
    tags: [],
    serviceThumbnail: "",
    thumbnail: "",
    beginner_offer: 0,
    business_offer: 0,
    enterprise_offer: 0
  });

  const [createServiceDialogState, setCreateServiceDialogState] = useState({
    loading: false,
    open: false,
    success: false,
    error: false,
    errorMessage: "",
  });

  const [createServiceFormErrorState, setCreateContractFormErrorState] =
    useState({
      serviceTitleError: false,
      serviceTitleErrorMessage: "",
      serviceDescriptionError: false,
      serviceDescriptionErrorMessage: "",
      beginnerPriceError: false,
      beginnerPriceErrorMessage: "",
      businessPriceError: false,
      businessPriceErrorMessage: "",
      enterprisePriceError: false,
      enterprisePriceErrorMessage: "",
    });

  const [offers, setOffers] = useState<Array<string>>(new Array(6));
  const [checkboxes, setCheckboxes] = useState<Array<boolean>>([]);
  const [publishDialogIsOpen, setPublishDialogIsOpen] =
    useState<boolean>(false);
  const onOpenPublishDialog = () => { };
  const [publishDialogIsLoading, setPublishDialogIsLoading] =
    useState<boolean>(false);
  const [publishServiceSuccessful, setPublishServiceSuccessful] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  const onCloseCreateServiceDialog = () => {
    if (createServiceDialogState.success == true) {
      router.push("/view");
    }

    setCreateServiceDialogState({
      open: false,
      loading: false,
      error: false,
      errorMessage: "",
      success: false,
    });

    setServiceMetadataKey("");
  };

  const router: NextRouter = useRouter();
  const fileRef = createRef();

  const accountData = useAccount();

  const networkManager_createServicePrepare = usePrepareContractWrite({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "createService",
    args: [
      1,
      serviceMetadataKey,
      [
        Number(createServiceForm.beginner_offer),
        Number(createServiceForm.business_offer),
        Number(createServiceForm.enterprise_offer),
      ],
      FEE_COLLECT_MODULE,
      FOLLOWER_ONLY_REFERENCE_MODULE,
    ],
    overrides: {
      gasLimit: BigNumber.from("11643163"),
    }
  });

  const networkManager_createService = useContractWrite({
    ...networkManager_createServicePrepare.config,
    onError(error, variables, context) {


      setCreateServiceDialogState({
        ...createServiceDialogState,
        loading: false,
        success: false,
        error: true,
        errorMessage: error.message,
      });
    },
    onSuccess(data, variables, context) {
      setCreateServiceDialogState({
        ...createServiceDialogState,
        loading: false,
        success: true,
        error: false,
        errorMessage: "",
      });

      setServiceMetadataKey("");
    },
    onSettled(data, error, variables, context) {

    }
  });


  useEffect(() => {
    if (!marketsQuery.loading && marketsQuery.data) {
      setMarketDetails(marketsQuery.data?.markets);
    }
  }, [marketsQuery.loading]);

  useEffect(() => {
    marketsQuery.refetch();
  }, []);

  const handleOnPublish = async () => {
    let retVal: string = "";

    setCreateServiceDialogState({
      ...createServiceDialogState,
      loading: true,
    });

    try {
      if (!PINATA_JWT) {
        const ipfs = create({
          url: "/ip4/0.0.0.0/tcp/5001",
        });

        retVal = await (await ipfs.add(JSON.stringify(createServiceForm))).path;
      } else {
        const deepCopyCreateServiceForm = JSON.parse(JSON.stringify(createServiceForm))
        console.log(deepCopyCreateServiceForm)
        //TEMP - TODO:
        deepCopyCreateServiceForm.serviceThumbnail = ""
        deepCopyCreateServiceForm.thumbnail = ""
        ///

        retVal = await fleek.uploadService(String(accountData.address) + ":" + createServiceForm.serviceTitle, JSON.stringify(deepCopyCreateServiceForm)) //await pinJSONToIPFSPinata(data)
      }

      setServiceMetadataKey(retVal);
    } catch (error) {
      console.log(error)

      setCreateServiceDialogState({
        ...createServiceDialogState,
        loading: false,
        error: true,
        success: false,
        errorMessage: "Error uploading metadata to IPFS",
      });

      alert("Error uploading metadata to IPFS");
    }

    if (String(retVal)) {
      const confirm = await networkManager_createService.writeAsync({
        recklesslySetUnpreparedArgs: [
          1,
          retVal,
          [
            Number(createServiceForm.beginner_offer),
            Number(createServiceForm.business_offer),
            Number(createServiceForm.enterprise_offer),
          ],
          FEE_COLLECT_MODULE,
          FOLLOWER_ONLY_REFERENCE_MODULE,
        ],
      });
    } else {
      setCreateServiceDialogState({
        ...createServiceDialogState,
        loading: false,
        error: true,
        success: false,
        errorMessage: "Error retrieving IPFS metadata hash",
      });

      alert("Error retrieving ipfs metadata hash");
    }
  };

  const handleOnChangePrice = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = +Number(e.target.value);
    if (value > 0) {
      setCreateServiceForm({
        ...createServiceForm,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleOnChangeCreateServiceForm = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    if (e.target.name === "" && String(e.target.value).length >= 55) {
      return;
    }

    setCreateServiceForm({
      ...createServiceForm,
      [e.target.name]: e.target.value,
    });
  };

  const onTagInputKeyPress = (e) => {
    if (e.code === "Space") {
      if (createServiceForm.tags.length >= 5) {
        alert("No more tags");
        return;
      }

      if (String(e.target.value).trim() == "") {
        return;
      }

      const tag = createServiceForm.serviceTags;
      const updatedTags = createServiceForm.tags;
      updatedTags.push(tag);
      setCreateServiceForm({
        ...createServiceForm,
        tags: updatedTags,
        serviceTags: "",
      });
    }
  };

  const handleOnDeleteTag = (idx) => {
    const updatedTags = createServiceForm.tags;
    updatedTags.splice(idx, 1);

    setCreateServiceForm({
      ...createServiceForm,
      tags: updatedTags,
    });
  };

  const handleOnChangeFile = (e) => {
    let reader = new FileReader();

    reader.onloadend = () => {
      const buffer: Buffer = Buffer.from(reader.result)

      setSelectedImage(e.target.files[0]);
      setCreateServiceForm({
        ...createServiceForm,
        serviceThumbnail: buffer.toString(),
      });
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  };


  const handleOnChangeOffers = (e, idx: number) => {
    const updatedArr = [...offers];
    updatedArr[idx] = e.target.value;
    setOffers(updatedArr);
  };

  const handleOnChangeCheckbox = (e, idx: number) => { };

  const publishDialogContent = [
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        <Typography fontSize={20} fontWeight="bold" py={1}>
          {" "}
          You are about to post a service to Lens Talent. This will require
          signing a transaction with your wallet.
        </Typography>
      </DialogContentText>
      <Typography variant="caption">
        Note: This transaction will cost MATIC.
      </Typography>
    </DialogContent>,
    <DialogContent>
      <DialogContentText>
        {createServiceDialogState?.loading
          ? "Waiting for confirmation..."
          : "After pressing publish your wallet provider will prompt you to accept the transaction."}
      </DialogContentText>
    </DialogContent>,
  ];

  const [tabValue, setTabValue] = useState<number>(0);

  return (
    <Container component={Stack} spacing={2} maxWidth="xl">
      <Box>
        <Typography fontWeight="600" fontSize={25}>
          Create a service
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Create a service to share across lens social networks.{" "}
          <Typography variant="button" color="primary">
            Learn more
          </Typography>
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab {...a11yProps(0)} label="Select a market" />
          <Tab {...a11yProps(1)} label="Basic Information" />

          <Tab {...a11yProps(1)} label="Summary" />
        </Tabs>
        <Divider sx={{ borderBottom: "1px solid #eee" }} />
      </Box>

      <TabPanel index={0} value={tabValue}>
        <Box width={600} maxWidth={600}>

          <Typography color="text.secondary" fontWeight="500" fontSize={14}>
            Select or search for the appropriate market to deploy your
            contract.
          </Typography>
          <Typography variant="caption">
            Can't find a market?{" "}
            <Typography component="span" color="primary" variant="button">
              Learn about market proposals.
            </Typography>
          </Typography>
        </Box>

        <Grid item xs={6}>
          <Card variant='outlined' sx={{ width: "100%", border: 'none' }}>
            <CardContent>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                {marketDetails.map((details) => {
                  return (

                    <MarketDisplay
                      small
                      marketDetails={details}
                      isShowingStats={false}
                      selected={details?.id === selectedMarketId}
                      selectable
                      onSelect={() => setSelectedMarketId(details?.id)}
                    />

                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </TabPanel>

      <TabPanel index={1} value={tabValue}>
        <Box sx={{ width: '75%' }}>

          <Typography color="text.secondary" fontWeight="500" fontSize={14} pb={2}>
            Fill out basic information that will help readers better understand
            the contract.
          </Typography>

          <Card variant="outlined" sx={{ border: 'none', backgroundColor: '#eee', width: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                  //border: "dashed 1px #B3B3B3",

                  height: 400,
                }}
              >
                {selectedImage === null ? (
                  <Fragment>
                    <input
                      ref={fileRef}
                      type="file"
                      onChange={handleOnChangeFile}
                      style={{ display: "none" }}
                    />
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      sx={{ width: "100%", height: "100%" }}
                    >
                      <ImageIcon
                        fontSize="large"
                        sx={{ color: "#aaa", width: 80, height: 80 }}
                      />

                      <Typography
                        py={1}
                        fontSize={25}
                        variant="button"
                        color="primary"
                        onClick={() => fileRef.current.click()}
                      >
                        Select a cover image
                      </Typography>
                    </Stack>
                  </Fragment>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{ width: "100%", height: "100%" }}
                      src={URL.createObjectURL(selectedImage)}
                    />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>



          <Card elevation={0} sx={{ mb: 3, width: "100%" }}>

            <Stack spacing={2}>
              <StyledTextField
                margin="normal"
                sx={{ width: "100%" }}
                variant="outlined"
                label="Service Title"
                aria-label="Pick a title for your service"
                name="serviceTitle"
                type="text"
                onChange={handleOnChangeCreateServiceForm}
              />

              <StyledTextField
                margin="normal"
                rows={6}
                multiline
                sx={{ width: "100%" }}
                variant="outlined"
                label="Service Description"
                aria-label="Pick a title for your service"
                name="serviceDescription"
                type="text"
                onChange={handleOnChangeCreateServiceForm}
              />
            </Stack>

          </Card>

          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography fontWeight="700" fontSize={18} color="text.primary">
                  Add tags
                </Typography>
                <Typography color="text.secondary" fontWeight="500" fontSize={14}>
                  Increase the relevancy of your contract with tags. Try (budget:low,
                  quick-job)
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight="500"
                  color="#757575"
                  width={350}
                >
                  Tags are separated by spaces
                </Typography>

                <Paper
                  component="form"
                  variant="outlined"
                  sx={{
                    mt: 2,
                    p: "10px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 600,
                  }}
                >
                  <InputBase
                    placeholder="Try shorttermjob..."
                    name="serviceTags"
                    aria-label="serviceTags"
                    type="text"
                    value={createServiceForm.serviceTags}
                    sx={{ ml: 1, flex: 1 }}
                    onKeyPress={onTagInputKeyPress}
                    onChange={handleOnChangeCreateServiceForm}
                    startAdornment={
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ margin: "0 0.2rem 0 0", display: "flex" }}
                      >
                        {createServiceForm.tags.map((tag, idx) => {
                          return (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              onDelete={() => handleOnDeleteTag(idx)}
                            />
                          );
                        })}
                      </Stack>
                    }
                  />
                </Paper>
              </CardContent>
            </Card>

            <Box>
              <Typography pb={2} color="text.secondary" fontWeight="500" fontSize={14}>
                Fill out basic information that will help readers better understand
                the contract.
              </Typography>
              <FormControl>
                <InputLabel>Beginner Price</InputLabel>
                <Paper
                  elevation={0}
                  sx={{
                    p: "7px 8px",
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #eee",
                  }}
                >
                  <img
                    src="/assets/images/dai.svg"
                    style={{ width: 15, height: 20 }}
                  />
                  <InputBase
                    sx={{
                      marginLeft: 1,
                      border: "0px solid #eee",
                      width: "100%",
                    }}
                    id="beginner_offer"
                    name="beginner_offer"
                    type="number"
                    onChange={handleOnChangePrice}
                    value={`${createServiceForm.beginner_offer}`}
                    error={createServiceFormErrorState.beginnerPriceError}
                  />
                </Paper>
                <FormHelperText>
                  {createServiceFormErrorState.beginnerPriceErrorMessage}
                </FormHelperText>
              </FormControl>
            </Box>
          </Stack>
        </Box>
      </TabPanel>

      <TabPanel index={2} value={tabValue}>
        <Box sx={{ width: '70%' }}>
          <Card variant='outlined'>
            <CardContent>
              <Box>

                <SummarySectionTitle>
                  Service Sumary
                </SummarySectionTitle>
                <Stack sx={{ my: 2 }} spacing={2}>


                  <Stack direction='row' spacing={1}>
                    <SummaryKey>
                      Title:
                    </SummaryKey>
                    <SummaryValue>
                      {createServiceForm.serviceTitle}
                    </SummaryValue>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <SummaryKey>
                      Description:
                    </SummaryKey>
                    <SummaryValue>
                      {createServiceForm.serviceDescription}
                    </SummaryValue>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <SummaryKey>
                      Price:
                    </SummaryKey>
                    <SummaryValue>
                      {createServiceForm.beginner_offer}
                    </SummaryValue>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <SummaryKey>
                      Market:
                    </SummaryKey>
                    <SummaryValue>
                      {selectedMarketId}
                    </SummaryValue>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <SummaryKey>
                      CollectModule:
                    </SummaryKey>
                    <SummaryValue>
                      {FREE_COLLECT_MODULE}
                    </SummaryValue>
                  </Stack>


                </Stack>
              </Box>


              <Box>
                <SummarySectionTitle>
                  Fees
                </SummarySectionTitle>
                <Stack spacing={2} sx={{ my: 2 }}>

                  <Stack direction='row' spacing={1}>
                    <SummaryKey>
                      Protocol Fee:
                    </SummaryKey>
                    <SummaryValue>
                      0
                    </SummaryValue>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <SummaryKey>
                      Estimated Profit:
                    </SummaryKey>
                    <SummaryValue>
                      0
                    </SummaryValue>
                  </Stack>


                </Stack>
              </Box>
              <Divider />
              <Typography variant='caption'>
                Here is a cool caption
              </Typography>

            </CardContent>
            <CardActions>
              <Stack sx={{ width: '100%' }} direction="row" alignItems="center" justifyContent="flex-end">
                <Button
                  sx={{ mx: 1, width: 120, p: 1 }}
                  variant="contained"
                  /*disabled={
                    createServiceForm.beginner_offer === 0 ||
                    createServiceForm.business_offer === 0 ||
                    createServiceForm.enterprise_offer === 0 ||
                    createServiceForm.service_title >= 81 ||
                    createServiceForm.service_description >= 730
                  }*/
                  onClick={() => {
                    setCreateServiceDialogState({
                      ...createServiceDialogState,
                      open: true,
                    });
                  }}
                >
                  Publish
                </Button>
              </Stack>
            </CardActions>
          </Card>





        </Box>
      </TabPanel>

      <ConfirmationDialog
        open={createServiceDialogState.open}
        onOpen={() => { }}
        onClose={onCloseCreateServiceDialog}
        primaryAction={handleOnPublish}
        primaryActionTitle="Publish"
        hasSigningStep={false}
        success={createServiceDialogState.success}
        content={publishDialogContent}
        loading={createServiceDialogState.loading}
      />
    </Container>
  );
};

export default CreateServicePage;
