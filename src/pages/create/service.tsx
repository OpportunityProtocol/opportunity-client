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
} from "@mui/material";
import { NextPage } from "next";
import { Fragment, ChangeEvent, createRef, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { Button, Container, TextField, Typography } from "@mui/material";
import MarketDisplay from "../../modules/market/components/MarketDisplay";
import ImageIcon from "@mui/icons-material/Image";
import SearchBarV2 from "../../common/components/SearchBarV2/SearchBarV2";
import { Add } from "@material-ui/icons";
import TabPanel from "../../common/components/TabPanel/TabPanel";
import { a11yProps } from "../../common/components/TabPanel/helper";
import StepperComponent from "../../common/components/Stepper";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import { Delete } from "@mui/icons-material";
import fleek from "../../fleek";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useProvider,
} from "wagmi";
import {
  NETWORK_MANAGER_ADDRESS,
  SERVICE_COLLECT_MODULE,
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
import { SERVICE_REFERENCE_MODULE } from "../../constant/contracts";
import { ConfirmationDialog } from "../../common/components/ConfirmationDialog";
const Buffer = require("buffer").Buffer;

const CreateServicePage: NextPage<any, any> = (): JSX.Element => {
  const steps: Array<string> = ["Create a service", "Deploy to the network"];
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [serviceMetadataKey, setServiceMetadataKey] = useState("");
  const [numMarkets, setNumMarkets] = useState<any>([]);
  const [selectedMarketId, setSelectedMarketId] = useState<number>(-1);
  const [marketsLoading, setMarketsLoading] = useState<boolean>(false);
  const [createServiceForm, setCreateServiceForm] = useState({
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
  const router: NextRouter = useRouter();
  const fileRef = createRef();

  const accountData = useAccount();

  console.log(NETWORK_MANAGER_ADDRESS);
  console.log(SERVICE_COLLECT_MODULE);

  const networkManager_createService = useContractWrite(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "createService",
    {
      onError(error, variables, context) {},
      onSuccess(data, variables, context) {},
      args: [
        1,
        serviceMetadataKey,
        [
          Number(createServiceForm.offers.beginner.price),
          Number(createServiceForm.offers.business.price),
          Number(createServiceForm.offers.enterprise.price),
        ],
        SERVICE_COLLECT_MODULE,
        SERVICE_REFERENCE_MODULE,
      ],
      overrides: {
        gasLimit: BigNumber.from("11643163"),
      },
      onSettled(data, error, variables, context) {
        console.log("@@@@@@@@@@@@@@@@@@@@@@");
        console.log(data);
        console.log(error);
        console.log(variables);
      },
    }
  );

  const networkManager_getMarkets = useContractRead(
    {
      addressOrName: TOKEN_FACTORY_ADDRESS,
      contractInterface: TokenFactoryInterface,
    },
    "getNumMarkets",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      onSuccess: (data: Result) => {
        const total = hexToDecimal(data._hex);
        let list = [];
        for (let i = 0; i < total; i++) {
          list.push(Number(i) + 1);
        }
        setNumMarkets(list);
        // setMarketsDetails(data)
        setMarketsLoading(false);
      },
      onError: (error) => {
        setMarketsLoading(false);
      },
    }
  );

  useEffect(() => {
    //if is first render
    networkManager_getMarkets.refetch();
  }, []);

  const handleOnChangeTabIndex = (
    event: React.SyntheticEvent,
    newValue: number
  ) => setTabIndex(newValue);

  const handleOnPublish = async () => {
    try {
      let retVal;
      if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
        //https://ipfs.infura.io:5001/api/v0
        const ipfs = create({
          url: "/ip4/0.0.0.0/tcp/5001",
        });

        retVal = await (await ipfs.add(JSON.stringify(createServiceForm))).path;
      } else {
        retVal = await fleek.uploadService(
          String(accountData.data.address) +
            ":" +
            createServiceForm.serviceTitle,
          JSON.stringify(createServiceForm)
        );
      }

      setServiceMetadataKey(retVal);
      const confirm = await networkManager_createService.write({
        args: [
          1,
          retVal,
          [
            Number(createServiceForm.offers.beginner.price),
            Number(createServiceForm.offers.business.price),
            Number(createServiceForm.offers.enterprise.price),
          ],
          SERVICE_COLLECT_MODULE,
          SERVICE_REFERENCE_MODULE,
        ],
        overrides: {
          gasLimit: BigNumber.from("11643163"),
        },
      });

      console.log(createServiceForm);

      router.push("/");
    } catch (error) {}
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

  const lastPublishDialogContent = publishServiceSuccessful ? (
    <DialogContentText id="alert-dialog-description">
      <Box py={2}>
        <Typography fontSize={20} fontWeight="bold" py={1}>
          Confirm Connect
        </Typography>
        <Typography variant="subtitle2">Send Transaction</Typography>
      </Box>
    </DialogContentText>
  ) : (
    <DialogContentText id="alert-dialog-description">
      <Box py={2}>
        <Typography fontSize={20} fontWeight="bold" py={1}>
          Transaction Complete
        </Typography>
        <Typography variant="subtitle2">Send Transaction</Typography>
      </Box>
    </DialogContentText>
  );

  const publishDialogContent = [
    <DialogContentText id="alert-dialog-description">
      <Typography fontSize={20} fontWeight="bold" py={1}>
        {" "}
        You are about to post a service to Lens Talent which will require one
        step:
      </Typography>

      <ul>
        <li>
          {" "}
          <Typography>Sending a transaction</Typography>
        </li>
      </ul>
    </DialogContentText>,
  ];

  return (
    <Container
      component={Stack}
      spacing={5}
      maxWidth="lg"
      sx={{
        width: "100%",
        padding: "2% 4%",
      }}
    >
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

      <Box display="flex" alignItems="flex-start">
        <Box width={600} maxWidth={600}>
          <Typography fontWeight="700" fontSize={18} color="text.primary">
            Select a market
          </Typography>
          <Typography color="text.secondary" fontWeight="500" fontSize={14}>
            Select or search for the appropriate market to deploy your contract.
          </Typography>
          <Typography variant="caption">
            Can't find a market?{" "}
            <Typography component="span" color="primary" variant="button">
              Learn about market proposals.
            </Typography>
          </Typography>
        </Box>

        <Card sx={{ width: "100%" }} variant="outlined">
          <CardContent>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {numMarkets.slice(0, 6).map((marketId) => {
                return (
                  <Grid item xs={2.9}>
                    <MarketDisplay
                      small
                      marketId={marketId + 1}
                      isShowingStats={false}
                      selected={marketId === selectedMarketId}
                      selectable
                      onSelect={() => setSelectedMarketId(marketId)}
                      showDescription={false}
                      showStats={false}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Divider />

      <Box display="flex" alignItems="flex-start">
        <Box py={1} width={600} maxWidth={600}>
          <Typography
            fontWeight="700"
            fontWeight="700"
            color="text.primary"
            fontSize={18}
          >
            Basic Information
          </Typography>
          <Typography color="text.secondary" fontWeight="500" fontSize={14}>
            Fill out basic information that will help readers better understand
            the contract.
          </Typography>
        </Box>

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
      </Box>

      <Divider />

      <Box display="flex" alignItems="flex-start">
        <Box py={1} width={600} maxWidth={600}>
          <Typography
            fontWeight="700"
            fontSize={18}
            py={1}
            color="text.primary"
          >
            Add a thumbnail
          </Typography>
        </Box>

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
                  <Stack alignItems="center">
                    <ImageIcon
                      fontSize="large"
                      sx={{ color: "#aaa", width: 80, height: 80 }}
                    />
                    <Box
                      py={2}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Typography
                        py={1}
                        fontSize={25}
                        variant="button"
                        color="primary"
                        onClick={() => fileRef.current.click()}
                      >
                        Select a thumbnail to represent your service
                      </Typography>
                      <Typography
                        fontSize={22}
                        fontWeight="medium"
                        color="text.secondary"
                      >
                        Max 6MB each (12mb for videos)
                      </Typography>
                    </Box>
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
      </Box>

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
              <BootstrapInput
                startAdornment={
                  <img
                    src="/assets/images/dai.svg"
                    style={{ width: 15, height: 20 }}
                  />
                }
                id="beginner"
                type="number"
                onChange={handleOnChangePrice}
                value={`${createServiceForm.offers.beginner.price}`}
              />
            </FormControl>

            <FormControl sx={{ flexGrow: 1 }}>
              <InputLabel>Business Price</InputLabel>
              <BootstrapInput
                startAdornment={
                  <img
                    src="/assets/images/dai.svg"
                    style={{ width: 15, height: 20 }}
                  />
                }
                id="business"
                type="number"
                onChange={handleOnChangePrice}
                value={`${createServiceForm.offers.business.price}`}
              />
            </FormControl>

            <FormControl sx={{ flexGrow: 1 }}>
              <InputLabel>Enterprise Price</InputLabel>
              <BootstrapInput
                startAdornment={
                  <img
                    src="/assets/images/dai.svg"
                    style={{ width: 15, height: 20 }}
                  />
                }
                id="enterprise"
                type="number"
                onChange={handleOnChangePrice}
                value={`${createServiceForm.offers.enterprise.price}`}
              />
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button
          sx={{ mx: 1, width: 120, p: 1 }}
          variant="contained"
          onClick={() => setPublishDialogIsOpen(true)}
        >
          Publish
        </Button>
      </Stack>

      <ConfirmationDialog
        open={publishDialogIsOpen}
        onOpen={onOpenPublishDialog}
        onClose={() => setPublishDialogIsOpen(false)}
        primaryAction={handleOnPublish}
        primaryActionTitle="Publish"
        content={publishDialogContent}
        loading={loading}
      />
    </Container>
  );
};

export default CreateServicePage;
