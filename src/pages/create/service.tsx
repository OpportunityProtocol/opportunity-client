import {
  Box,
  Grid,
  Tab,
  Tabs,
  InputAdornment,
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
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
} from "wagmi";
import {
  NETWORK_MANAGER_ADDRESS,
  TOKEN_FACTORY_ADDRESS,
} from "../../constant";
import { NetworkManagerInterface, TokenFactoryInterface } from "../../abis";
import { BigNumber } from "ethers";
import { create } from "ipfs-http-client";
import { CHAIN_ID } from "../../constant/provider";
import { Result } from "ethers/lib/utils";
import { hexToDecimal } from "../../common/helper";
import { NextRouter, useRouter } from "next/router";
import BootstrapInput from "../../common/components/BootstrapInput/BootstrapInput";
import { FEE_COLLECT_MODULE, FOLLOWER_ONLY_REFERENCE_MODULE, SERVICE_REFERENCE_MODULE } from "../../constant/contracts";
import { ConfirmationDialog } from "../../common/components/ConfirmationDialog";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_MARKETS } from "../../modules/market/MarketGQLQueries";
const Buffer = require("buffer").Buffer;

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
    marketId: 1,
    tags: [],
    serviceThumbnail: "",
    thumbnail: "",
    offers: {
      beginner: {
        price: 0,
        values: new Array(6).fill(""),
      },
      business: {
        price: 0,
        values: new Array(6).fill(""),
      },
      enterprise: {
        price: 0,
        values: new Array(6).fill(""),
      },
    },
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
        Number(createServiceForm.offers.beginner.price),
        Number(createServiceForm.offers.business.price),
        Number(createServiceForm.offers.enterprise.price),
      ],
      FEE_COLLECT_MODULE,
      FOLLOWER_ONLY_REFERENCE_MODULE,
    ],
    overrides: {
      gasLimit: BigNumber.from("11643163"),
    },
    onSettled(data, error) {
      if (error) {
        setCreateServiceDialogState({
          ...createServiceDialogState,
          loading: false,
          success: false,
          error: true,
          errorMessage: error.message,
        });

        alert(error.message);
      } else {
        setCreateServiceDialogState({
          ...createServiceDialogState,
          loading: false,
          success: true,
          error: false,
          errorMessage: "",
        });

        setServiceMetadataKey("");
      }
    },
  });

  const networkManager_createService = useContractWrite(
    networkManager_createServicePrepare.config
  );

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
      if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
        //https://ipfs.infura.io:5001/api/v0
        const ipfs = create({
          url: "/ip4/0.0.0.0/tcp/5001",
        });

        retVal = await (await ipfs.add(JSON.stringify(createServiceForm))).path;
      } else {
        retVal = await fleek.uploadService(
          String(accountData.address) +
            ":" +
            createServiceForm.serviceTitle,
          JSON.stringify(createServiceForm)
        );
      }

      setServiceMetadataKey(retVal);
    } catch (error) {
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
            Number(createServiceForm.offers.beginner.price),
            Number(createServiceForm.offers.business.price),
            Number(createServiceForm.offers.enterprise.price),
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

  const handleOnChangeOffer = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number
  ) => {
    const beginnerValues = createServiceForm.offers.beginner.values.slice(0);
    const businessValues = createServiceForm.offers.business.values.slice(0);
    const enterpriseValues =
      createServiceForm.offers.enterprise.values.slice(0);

    beginnerValues[idx] = e.target.value;
    businessValues[idx] = e.target.value;
    enterpriseValues[idx] = e.target.value;

    setCreateServiceForm({
      ...createServiceForm,
      offers: {
        beginner: {
          ...createServiceForm.offers.beginner,
          values: beginnerValues,
        },
        business: {
          ...createServiceForm.offers.business,
          values: beginnerValues,
        },
        enterprise: {
          ...createServiceForm.offers.enterprise,
          values: beginnerValues,
        },
      },
    });
  };

  const handleOnChangePrice = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = +Number(e.target.value);
    if (value < 1) {
      setCreateServiceForm({
        ...createServiceForm,
        offers: {
          ...createServiceForm.offers,
          [e.target.id]: {
            price: createServiceForm.offers[e.target.id].price,
            values: createServiceForm.offers[e.target.id].values,
          },
        },
      });
    } else {
      setCreateServiceForm({
        ...createServiceForm,
        offers: {
          ...createServiceForm.offers,
          [e.target.id]: {
            price: e.target.value,
            values: createServiceForm.offers[e.target.id].values,
          },
        },
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
      const buffer = Buffer.from(reader.result);
      setSelectedImage(e.target.files[0]);
      setCreateServiceForm({
        ...createServiceForm,
        serviceThumbnail: buffer,
      });
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  };

  const [offers, setOffers] = useState<Array<string>>(new Array(6));

  const handleOnChangeOffers = (e, idx: number) => {
    const updatedArr = [...offers];
    updatedArr[idx] = e.target.value;
    setOffers(updatedArr);
  };

  const [checkboxes, setCheckboxes] = useState<Array<boolean>>([]);

  const handleOnChangeCheckbox = (e, idx: number) => {};

  const [publishDialogIsOpen, setPublishDialogIsOpen] =
    useState<boolean>(false);
  const onOpenPublishDialog = () => {};
  const [publishDialogIsLoading, setPublishDialogIsLoading] =
    useState<boolean>(false);
  const [publishServiceSuccessful, setPublishServiceSuccessful] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <Container component={Stack} spacing={5} maxWidth="xl">
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

      <Grid
        container
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Grid item xs={4}>
          <Box width={600} maxWidth={600}>
            <Typography fontWeight="700" fontSize={18} color="text.primary">
              Select a market
            </Typography>
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
        </Grid>

        <Grid item xs={6}>
          <Card sx={{ width: "100%" }} variant="outlined">
            <CardContent>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                {marketDetails.slice(0, 6).map((details) => {
                  return (
                    <Grid item xs={2.9}>
                      <MarketDisplay
                        small
                        marketDetails={details}
                        isShowingStats={false}
                        selected={details?.id === selectedMarketId}
                        selectable
                        onSelect={() => setSelectedMarketId(details?.id)}
                        showDescription={false}
                        showStats={false}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider />

      <Grid
        container
        justifyContent="space-between"
        display="flex"
        alignItems="flex-start"
      >
        <Grid item xs={4}>
          <Typography fontWeight="700" color="text.primary" fontSize={18}>
            Basic Information
          </Typography>
          <Typography color="text.secondary" fontWeight="500" fontSize={14}>
            Fill out basic information that will help readers better understand
            the contract.
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  margin="normal"
                  sx={{ width: "100%" }}
                  variant="outlined"
                  label="Service Title"
                  aria-label="Pick a title for your service"
                  name="serviceTitle"
                  type="text"
                  onChange={handleOnChangeCreateServiceForm}
                />

                <TextField
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider />

      <Grid
        container
        justifyContent="space-between"
        display="flex"
        alignItems="flex-start"
      >
        <Grid item xs={4}>
          <Typography
            fontWeight="700"
            fontSize={18}
            py={1}
            color="text.primary"
          >
            Add a thumbnail
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                  border: "dashed 1px #B3B3B3",

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
        </Grid>
      </Grid>

      <Divider />

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

      <Card sx={{ width: "100%" }} variant="outlined">
        <CardContent>
          <Typography
            fontWeight="700"
            fontSize={18}
            py={1}
            color="text.primary"
          >
            Offers (Max 6)
          </Typography>
          <Typography
            color="text.secondary"
            fontWeight="500"
            maxWidth={600}
            fontSize={14}
          >
            Fill out your offers and the associated packages they will be
            included in. If a package (i.e. enterprise) has no checkboxes
            checked it will not be included.
          </Typography>
          <Box pt={2}>
            {new Array(6).fill(1).map((value, idx, arr) => {
              return (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <TextField
                    sx={{ width: 600 }}
                    label={`Offer ${idx + 1}`}
                    name="service-beginner-price-input"
                    margin="normal"
                    value={offers[idx]}
                    onChange={(e) => handleOnChangeOffers(e, idx)}
                  />

                  <Stack spacing={2} direction="row" alignItems="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked
                          onChange={(e) => handleOnChangeCheckbox(e, idx)}
                        />
                      }
                      label="Beginner"
                    />
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="Business"
                    />
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="Enterprise"
                    />
                  </Stack>
                </Stack>
              );
            })}
          </Box>
        </CardContent>
        <Divider />
        <CardContent>
          <Stack
            sx={{ display: "flex" }}
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="space-evenly"
          >
            <FormControl sx={{ flexGrow: 1 }}>
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
                  id="beginner"
                  type="number"
                  onChange={handleOnChangePrice}
                  value={`${createServiceForm.offers.beginner.price}`}
                  error={createServiceFormErrorState.beginnerPriceError}
                />
              </Paper>
              <FormHelperText>
                {createServiceFormErrorState.beginnerPriceErrorMessage}
              </FormHelperText>
            </FormControl>

            <FormControl sx={{ flexGrow: 1 }}>
              <InputLabel>Business Price</InputLabel>
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
                  id="business"
                  type="number"
                  onChange={handleOnChangePrice}
                  value={`${createServiceForm.offers.business.price}`}
                  error={createServiceFormErrorState.businessPriceError}
                />
              </Paper>
              <FormHelperText>
                {createServiceFormErrorState.businessPriceErrorMessage}
              </FormHelperText>
            </FormControl>

            <FormControl sx={{ flexGrow: 1 }}>
              <InputLabel>Enterprise Price</InputLabel>
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
                  id="enterprise"
                  type="number"
                  onChange={handleOnChangePrice}
                  value={`${createServiceForm.offers.enterprise.price}`}
                  error={createServiceFormErrorState.enterprisePriceError}
                />
              </Paper>
              <FormHelperText>
                {createServiceFormErrorState.enterprisePriceErrorMessage}
              </FormHelperText>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button
          sx={{ mx: 1, width: 120, p: 1 }}
          variant="contained"
          /*disabled={
            createServiceForm.offers.beginner.price === 0 ||
            createServiceForm.offers.business.price === 0 ||
            createServiceForm.offers.enterprise.price === 0 ||
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

      <ConfirmationDialog
        open={createServiceDialogState.open}
        onOpen={() => {}}
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
