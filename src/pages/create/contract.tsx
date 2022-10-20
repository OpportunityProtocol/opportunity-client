import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import clsx from "clsx";

import {
  Box,
  Card,
  Checkbox,
  Paper,
  InputBase,
  Chip,
  FormControlLabel,
  Button,
  TextField,
  FormGroup,
  Container,
  Stack,
  Divider,
  Grid,
  Typography,
  CardContent,
  LinearProgress,
  DialogContent,
  DialogContentText,
  Tabs,
  Tab,
  Theme,
  CardActions,
} from "@mui/material";

import BoltIcon from "@mui/icons-material/Bolt";
import DateRangeIcon from "@mui/icons-material/DateRange";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { useStyles } from "../../modules/contract/ContractStyles";
import { alpha } from "@mui/material";
import Link from "next/link";
import ClickableCard from "../../common/components/ClickableCard/ClickableCard";
import { NextRouter, useRouter } from "next/router";
import { Add, CallMade } from "@mui/icons-material";
import TextInput from "../../common/components/BootstrapInput/BootstrapInput";
import { NextPage } from "next";
import StepperComponent from "../../common/components/Stepper";
import SearchBarV2 from "../../common/components/SearchBarV2/SearchBarV2";
import MarketDisplay from "../../modules/market/components/MarketDisplay";

import { create } from "ipfs-http-client";
import fleek from "../../fleek";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { NETWORK_MANAGER_ADDRESS, PINATA_JWT, TOKEN_FACTORY_ADDRESS } from "../../constant";
import { NetworkManagerInterface, TokenFactoryInterface } from "../../abis";
import { FaBoxTissue } from "react-icons/fa";
import { ConfirmationDialog } from "../../common/components/ConfirmationDialog";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_MARKETS } from "../../modules/market/MarketGQLQueries";
import { ClassNameMap, styled } from "@mui/styles";
import { generatePinataData, pinJSONToIPFSPinata } from "../../common/ipfs-helper";
import { a11yProps } from "../../common/components/TabPanel/helper";
import TabPanel from "../../common/components/TabPanel/TabPanel";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
 * @returns NextPage The CreateContractPage component
 */
const CreateContractPage: NextPage = (): JSX.Element => {
  const router: NextRouter = useRouter();
  const classes: ClassNameMap<any> = useStyles();
  const accountData: any = useAccount();
  const marketsQuery: QueryResult = useQuery(GET_MARKETS);

  const [createContractForm, setCreateContractForm] = useState({
    contract_title: "",
    contract_description: "",
    contract_tags: "",
    tags: [],
    contract_budget: 0,
    deadline: new Date(),
    contract_definition_of_done: "",
    duration: "quick",
    specific_languages: [],
    contract_market_id: 0
  });

  const [createContractFormErrorState, setCreateContractFormErrorState] =
    useState({
      contractTitleError: false,
      contractTitleErrorMessage: "",
      contractDescriptionError: false,
      contractDescriptionErrorMessage: "",
      contractDefinitionOfDoneError: false,
      contractDefinitionOfDoneErrorMessage: "",
    });

  const [createContractDialogState, setCreateContractDialogState] =
    useState<any>({
      loading: false,
      open: false,
      success: false,
      error: false,
      errorMessage: "",
    });


  const [contractMetadataURI, setContractMetadataURI] = useState<string>("");
  const [marketDetails, setMarketDetails] = useState<any>({});

  const createContractDialogOnOpen = (): void => { };

  const createContractDialogContent: Array<ReactNode> = [
    <DialogContent>
      <DialogContentText>
        You are about to publish a contract to Lens Talent. This will involve
        signing a transaction with your wallet.
      </DialogContentText>
      <Typography variant="caption">
        Note: This transaction will cost MATIC.
      </Typography>
    </DialogContent>,
    <DialogContent>
      <DialogContentText>
        {createContractDialogState?.loading
          ? "Waiting for confirmation..."
          : "After pressing create your wallet provider will prompt you to accept the transaction."}
      </DialogContentText>
    </DialogContent>,
  ];

  useEffect(() => {
    if (!marketsQuery.loading && marketsQuery.data) {
      setMarketDetails(marketsQuery.data?.markets);
    }
  }, [marketsQuery.loading]);

  useEffect(() => {
    marketsQuery.refetch();
  }, []);

  const networkManager_createContract = useContractWrite({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "createContract",
    enabled: true,
    args: [createContractForm.contract_market_id, contractMetadataURI],
    mode: "recklesslyUnprepared",
    onSuccess(data, variables, context) {


    },
    onSettled(data, error, variables, context) {
      if (!error) {

        setCreateContractDialogState({
          ...createContractDialogState,
          loading: false,
          success: true,
          error: false,
          errorMessage: "",
        })

        setContractMetadataURI("");
      }
    },
    onError(error, variables, context) {
      setCreateContractDialogState({
        ...createContractDialogState,
        loading: false,
        success: false,
        error: true,
        errorMessage: error.message,
      });


    },
  });

  const handleOnChangeDeadline = (newValue: Date | null) => {
    setCreateContractForm({
      ...createContractForm,
      deadline: newValue.toDateString(),
    });
  };

  const handleOnChangeCreateContractForm = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    switch (e.target.id) {
      case "contractTag":
        setCreateContractForm({
          ...createContractForm,
          contract_tags: e.target.value,
        });
        break;
      case "contractTitle":
        setCreateContractForm({
          ...createContractForm,
          contract_title: e.target.value,
        });
        break;
      case "contractDescription":
        setCreateContractForm({
          ...createContractForm,
          contract_description: e.target.value,
        });
        break;
      case "contractBudget":
        setCreateContractForm({
          ...createContractForm,
          contract_budget: Number(e.target.value),
        });
        break;
      case "contractDefinitionOfDone":
        setCreateContractForm({
          ...createContractForm,
          contract_definition_of_done: e.target.value,
        });
        break;
      case "contractLanguageCheckbox":
        setCreateContractForm({
          ...createContractForm,
          //@ts-ignore
          specific_languages: e.target?.checked == false ? 0 : 1,
        });
        break;
    }
  };

  const onTagInputKeyPress = (e) => {
    if (e.code === "Space") {
      if (createContractForm?.tags?.length >= 5) {
        alert("No more tags");
        return;
      }

      if (String(e.target.value).trim() == "") {
        return;
      }

      const tag = createContractForm?.contract_tags?.trim();
      const updatedTags = createContractForm?.tags;
      updatedTags.push(tag);
      setCreateContractForm({
        ...createContractForm,
        tags: updatedTags,
        contract_tags: "",
      });
    }
  };

  const handleOnDeleteTag = (idx) => {
    const updatedTags = createContractForm.tags;
    updatedTags.splice(idx, 1);

    setCreateContractForm({
      ...createContractForm,
      tags: updatedTags,
    });
  };

  const handleOnCreate = async () => {

    let retVal: string = "";

    setCreateContractDialogState({
      ...createContractDialogState,
      loading: true,
    });

    try {
      if (!PINATA_JWT) {
        const ipfs = create({
          url: "/ip4/0.0.0.0/tcp/5001",
        });

        retVal = await (
          await ipfs.add(JSON.stringify(createContractForm))
        ).path;
      } else {
        const tempFormData = JSON.parse(JSON.stringify(createContractForm))
        delete tempFormData['contract_market_id']

        retVal = await fleek.uploadContract(String(accountData.address) + ":" + createContractForm.contract_title, JSON.stringify(tempFormData)) //await pinJSONToIPFSPinata(data)
      }

      await networkManager_createContract?.write({
        recklesslySetUnpreparedArgs: [createContractForm.contract_market_id, String(retVal)],
      });

      setContractMetadataURI(retVal);
    } catch (error) {
console.log(error)
      setCreateContractDialogState({
        ...createContractDialogState,
        loading: false,
        error: true,
        success: false,
        errorMessage: "Error uploading metadata to IPFS",
      });

    }

  };

  const onCloseCreateContractDialog = () => {
    setCreateContractDialogState({
      open: false,
      loading: false,
      error: false,
      errorMessage: "",
      success: false,
    });

    setContractMetadataURI("");

    router.push("/dashboard");
  };

  console.log({ marketDetails })

  const [tabValue, setTabValue] = useState<number>(0);

  return (
    <Container
      maxWidth="xl"
      sx={{ bgcolor: '#fff', height: 'auto', width: '100%' }}
    >
        <Box>
          <Typography fontWeight="600" fontSize={25}>
            Create a contract
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Create a contract and instantly connect with thousands of freelancers.{" "}
            <Typography variant="button" color="primary">
              Learn how Lens Talent enables financial inclusion for all{" "}
              <CallMade fontSize="small" />
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
      <Box pb={2} width={600} maxWidth={600}>

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


<Grid container alignItems='center' direction='row' spacing={3}>

<Grid item xs={12} md={6} lg={4}>

                {marketDetails && marketDetails?.length ? (
                  marketDetails.map((details) => {
                    return (

                      <MarketDisplay
                        small
                        marketDetails={details}
                        isShowingStats={false}
                        selected={
                          details?.id === createContractForm.contract_market_id
                        }
                        selectable
                        onSelect={() =>
                          setCreateContractForm({
                            ...createContractForm,
                            contract_market_id: details?.id,
                          })
                        }
                      />

                    );
                  })
                ) : (
                  <Box>
                    <Typography color="error">
                      Error occurred while loading marketplaces.{" "}
                      <Typography component="span" variant="button">
                        {" "}
                        Try again
                      </Typography>
                    </Typography>
                  </Box>
                )}
                </Grid>
       </Grid>
    


      </TabPanel>


      <TabPanel index={1} value={tabValue}>
          <Box component={Stack} spacing={3} sx={{ width: '75%' }}>
          <Typography color="text.secondary" fontWeight="500" fontSize={14} pb={2}>
            Fill out basic information that will help readers better understand
            the contract.
          </Typography>

          <Grid item xs={6}>
            <Card sx={{ width: "100%", flexGrow: 1 }} variant="outlined">
              <CardContent>
                <TextField
                  margin="normal"
                  sx={{ width: "100%" }}
                  variant="outlined"
                  size="small"
                  id="contractTitle"
                  placeholder="I am looking for an ES to EN translator."
                  aria-label="Pick a title for your contract"
                  name="contractTitle"
                  type="text"
                  onChange={handleOnChangeCreateContractForm}
                  error={createContractFormErrorState.contractTitleError}
                  helperText={
                    createContractFormErrorState.contractTitleErrorMessage
                  }
                //inputProps={{ maxLength: 81 , minLength: 30 }}
                />

                <TextField
                  rows={6}
                  multiline
                  margin="normal"
                  sx={{ width: "100%" }}
                  size="small"
                  id="contractDescription"
                  variant="outlined"
                  placeholder='I need to translate an ebook to English from Spanish..."'
                  aria-label="Write a description"
                  name="contractDescription"
                  type="text"
                  onChange={handleOnChangeCreateContractForm}
                  error={createContractFormErrorState.contractDescriptionError}
                  helperText={
                    createContractFormErrorState.contractDescriptionErrorMessage
                  }
                />

                <Grid
                  sx={{ py: 2 }}
                  container
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  spacing={10}
                >
                  <Grid item>
                    <Typography fontWeight="medium" color="text.primary">
                      Budget
                    </Typography>
                    <Typography
                      variant="caption"
                      fontWeight="500"
                      color="#757575"
                      width={350}
                    >
                      Your budget will reflect to freelancers how much you are
                      willing to spend
                    </Typography>
                  </Grid>

                  <Grid item>
                    <TextField
                      size="small"
                      value={createContractForm.contract_budget}
                      placeholder="550.00"
                      type='number'
                      id="contractBudget"
                      onChange={handleOnChangeCreateContractForm}
                      sx={{ width: 100 }}
                      InputProps={{
                        startAdornment: <Typography>$</Typography>,
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid
                  sx={{ py: 2 }}
                  container
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  spacing={10}
                >
                  <Grid item>
                    <Typography fontWeight="medium" color="text.primary">
                      Deadline
                    </Typography>
                    <Typography
                      variant="caption"
                      fontWeight="500"
                      color="#757575"
                      width={350}
                    >
                      This will be the display for your contract
                    </Typography>
                  </Grid>

                  <Grid item>
                  <DatePicker selected={createContractForm.deadline} onChange={(date:Date) =>  setCreateContractForm({ ...createContractForm, deadline: date })} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          

            <Card variant="outlined" sx={{ flexGrow: 1, width: "100%" }}>
              <CardContent>
              <Box py={1}>
              <Typography
                fontWeight="700"
                fontSize={18}
                color="text.primary"
                id="contractDuration"
              >
                Contract Duration
              </Typography>
              <Typography color="text.secondary" fontWeight="500" fontSize={14}>
                Select an estimated duration of time for this contract.
              </Typography>
            </Box>
            
                <Grid
                  sx={{ width: "100%", flexGrow: 1 }}
                  container
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-evenly"
                >
                  <Grid item>
                    <ClickableCard
                      onClick={() =>
                        setCreateContractForm({
                          ...createContractForm,
                          duration: "quick",
                        })
                      }
                      variant="outlined"
                      sx={{
                        border:
                          createContractForm.duration === "quick"
                            ? `4px solid ${alpha("rgb(98, 202, 161)", 0.6)}`
                            : "none",
                      }}
                      className={clsx(
                        classes.marketTypeCard,
                        createContractForm.duration === "quick"
                          ? classes.selectedCard
                          : null
                      )}
                    >
                      <BoltIcon sx={{ color: "#FFEB3B" }} />
                      <Box py={2} className={classes.columnCenter}>
                        <Typography fontWeight="medium" color="text.primary">
                          Quick
                        </Typography>
                        <Typography variant="body2">
                          Time Range: 30min - 1 Hour
                        </Typography>
                      </Box>
                    </ClickableCard>
                  </Grid>

                  <Grid item>
                    <ClickableCard
                      onClick={() =>
                        setCreateContractForm({
                          ...createContractForm,
                          duration: "short"
                        })
                      }
                      variant="outlined"
                      sx={{
                        border:
                          createContractForm.duration === "short"
                            ? `4px solid ${alpha("rgb(98, 202, 161)", 0.6)}`
                            : "none",
                      }}
                      className={clsx(
                        classes.marketTypeCard,
                        createContractForm.duration === "short"
                          ? classes.selectedCard
                          : null
                      )}
                    >
                      <DateRangeIcon sx={{ color: "#2196F3" }} />
                      <Box py={2} className={classes.columnCenter}>
                        <Typography fontWeight="medium" color="text.primary">
                          Short
                        </Typography>
                        <Typography variant="body2">
                          A few days - 1 Month
                        </Typography>
                      </Box>
                    </ClickableCard>
                  </Grid>

                  <Grid item>
                    <ClickableCard
                      onClick={() =>
                        setCreateContractForm({
                          ...createContractForm,
                          duration: "long"
                        })
                      }
                      variant="outlined"
                      sx={{
                        border:
                          createContractForm.duration === "long"
                            ? `4px solid ${alpha("rgb(98, 202, 161)", 0.6)}`
                            : "none",
                      }}
                      className={clsx(
                        classes.marketTypeCard,
                        createContractForm.duration === "long"
                          ? classes.selectedCard
                          : null
                      )}
                    >
                      <HourglassTopIcon sx={{ color: "#4CAF50" }} />
                      <Box py={2} className={classes.columnCenter}>
                        <Typography fontWeight="medium" color="text.primary">
                          Long
                        </Typography>
                        <Typography variant="body2">A Month or Longer</Typography>
                      </Box>
                    </ClickableCard>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
     
        <Card variant='outlined'>
        <CardContent>
      <Box>

     
            <Typography fontWeight="700" fontSize={18} color="text.primary">
              Definition of Done
            </Typography>
            <Typography color="text.secondary" fontWeight="500" fontSize={14}>
              The definition of done defines all criteria and requirements for
              this contract to be considered complete.
            </Typography>
            <Typography variant="caption">
              The more specific the better
            </Typography>
            </Box>

      
            <Box sx={{ width: "100%" }}>
           
                <TextField
                  label="Definition of done"
                  id="contractDefinitionOfDone"
                  value={createContractForm.contract_definition_of_done}
                  multiline
                  size="small"
                  margin="normal"
                  rows={6}
                  onChange={handleOnChangeCreateContractForm}
                  sx={{ width: "100%" }}
                  placeholder="Let freelancers know the requirements for completing this job."
                  error={
                    createContractFormErrorState.contractDefinitionOfDoneError
                  }
                  helperText={
                    createContractFormErrorState.contractDefinitionOfDoneErrorMessage
                  }
                //inputProps={{ maxLength: 500 , minLength: 30 }}
                />
           
            </Box>
        
        </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Box>
              <Typography fontWeight="700" fontSize={18} color="text.primary">
                Add tags
              </Typography>
              <Typography color="text.secondary" fontWeight="500" fontSize={14}>
                Increase the relevancy of your contract with tags. Try
                (budget:low, quick-job)
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
                elevation={0}
                component="form"
                sx={{
                  mt: 2,
                  border: "1px solid #ddd",
                  p: "10px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 600,
                }}
              >
                <InputBase
                  placeholder="Try shorttermjob..."
                  name="contractTags"
                  aria-label="contractTags"
                  type="text"
                  value={createContractForm.contract_tags}
                  sx={{ ml: 1, flex: 1 }}
                  onKeyPress={onTagInputKeyPress}
                  id="contractTag"
                  onChange={handleOnChangeCreateContractForm}
                  startAdornment={
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ margin: "0 0.2rem 0 0", display: "flex" }}
                    >
                      {createContractForm.tags && createContractForm?.tags?.map((tag, idx) => {
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
            </Box>
          </CardContent>
        </Card>

          <Card variant="outlined">
        <CardContent>
          <Box>
            <Box pb={1}>
              <Typography fontWeight="700" fontSize={18} color="text.primary">
                Only looking for specific languages
              </Typography>
              <Typography
                color="text.secondary"
                maxWidth={600}
                fontWeight="500"
                fontSize={14}
              >
                Checking this will display you are only looking for freelancers who speak specific languages.
              </Typography>
            </Box>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    id="contractLanguageCheckbox"
                    onChange={handleOnChangeCreateContractForm}
                    defaultChecked
                    checked={false}
                  />
                }
                label="Only specific languages"
                componentsProps={{
                  typography: {
                    fontSize: 15,
                  },
                }}
              />
            </FormGroup>
          </Box>
        </CardContent>
              </Card> 

  


          </Box>
      </TabPanel>

      {/*
      
        const [createContractForm, setCreateContractForm] = useState({
    contract_title: "",
    contract_description: "",
    contract_tags: "",
    tags: [],
    contract_budget: 0,
    deadline: new Date("2014-08-18T21:11:54").toDateString(),
    contract_definition_of_done: "",
    duration: "quick",
    specific_languages: [],
    contract_market_id: 0
  });

*/}


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
                      {createContractForm.contract_title}
                    </SummaryValue>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <SummaryKey>
                      Description:
                    </SummaryKey>
                    <SummaryValue>
                      {createContractForm.contract_description}
                    </SummaryValue>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <SummaryKey>
                      Budget:
                    </SummaryKey>
                    <SummaryValue>
                      {createContractForm.contract_budget}
                    </SummaryValue>
                  </Stack>

                  <Stack direction='row' spacing={1}>
                    <SummaryKey>
                      Market:
                    </SummaryKey>
                    <SummaryValue>
                      {createContractForm.contract_market_id}
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
            <Button
            sx={{ mx: 1, width: 120, p: 1 }}
            variant="contained"
            // disabled={createContractForm.contract_definition_of_done.trim().length >= 500 || createContractForm.contract_title.trim().length >= 81 || createContractForm.contract_description.trim().length >= 730}
            onClick={() => {
              setCreateContractDialogState({
                ...createContractDialogState,
                open: true,
              });
            }}
          >
            Create
          </Button>
            </CardActions>
          </Card>





        </Box>

  
      </TabPanel>
      


        <ConfirmationDialog
          open={createContractDialogState.open}
          content={createContractDialogContent}
          onOpen={createContractDialogOnOpen}
          onClose={onCloseCreateContractDialog}
          primaryAction={handleOnCreate}
          hasSigningStep={false}
          success={createContractDialogState.success}
          primaryActionTitle="Create"
          loading={createContractDialogState?.loading}
        />
  
    </Container>
  );
};

export default CreateContractPage;
