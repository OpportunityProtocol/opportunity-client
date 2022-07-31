import {
  Box,
  Grid,
  Tab,
  Tabs,
  InputAdornment,
  Paper,
  InputBase,
  Divider,
  IconButton,
  Chip,
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
  const router: NextRouter = useRouter()
  const fileRef = createRef();

  const accountData = useAccount();

  const networkManager_createService = useContractWrite(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "createService",
    {
      onError(error, variables, context) {
        console.log(error);
      },
      onSuccess(data, variables, context) {},
      args: [
        1,
        serviceMetadataKey,
        [
          Number(createServiceForm.offers.beginner.price),
          Number(createServiceForm.offers.business.price),
          Number(createServiceForm.offers.enterprise.price),
        ],
        0,
        SERVICE_COLLECT_MODULE,
      ],
      overrides: {
        gasLimit: BigNumber.from("11643163"),
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


        retVal = await (await ipfs.add(JSON.stringify(createServiceForm))).path
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
          0,
          SERVICE_COLLECT_MODULE,
        ],
        overrides: {
          gasLimit: BigNumber.from("11643163"),
        },
      });

      router.push('/')
    } catch (error) {

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
  };

  const handleOnChangeCreateServiceForm = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
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
    let reader = new FileReader()
    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result)
      setSelectedImage(e.target.files[0]);
      setCreateServiceForm({
        ...createServiceForm,
        serviceThumbnail: buffer,
      });
    }
    reader.readAsArrayBuffer(e.target.files[0])
  };

  return (
    <Container
      component={Stack}
      spacing={5}
      maxWidth="lg"
      sx={{
        border: "1px solid #eee",
        bgcolor: "#fff",
        padding: "2% 4% !important",
      }}
    >
      <StepperComponent steps={steps} activeStep={activeStep} />
      <Box pt={3}>
        <Typography fontWeight="bold" fontSize={25}>
          Create a service
        </Typography>
        <Typography color="text.secondary">
          Create a service to share across lens social networks.{" "}
          <Typography variant="button" color="primary">
            Learn more
          </Typography>
        </Typography>
      </Box>

      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            width={600}
            fontWeight="700"
            fontSize={18}
            color="text.primary"
          >
            Select a market
          </Typography>

          <SearchBarV2 />
        </Stack>

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
      </Box>

      <Box>
        <Box mt={6}>
          <Typography fontWeight="700" fontSize={18} color="text.primary">
            Basic Information
          </Typography>
          <Typography fontSize={15} color="text.secondary">
            Create a service to share across lens social networks
          </Typography>
        </Box>

        <Stack spacing={2}>
          <TextField
            margin="normal"
            sx={{ width: 600 }}
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
            sx={{ width: 600 }}
            variant="outlined"
            label="Service Description"
            aria-label="Pick a title for your service"
            name="serviceDescription"
            type="text"
            onChange={handleOnChangeCreateServiceForm}
          />
        </Stack>

        <Box mt={3}>
          <Typography
            width={400}
            pb={1}
            variant="subtitle2"
            color="text.secondary"
          >
            Become more recognizable with tags (max 5). Begin typing and add a
            tab using the space button
          </Typography>
          <Paper
            component="form"
            sx={{
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
        </Box>
      </Box>

      <Box>
        <Typography fontWeight="700" fontSize={18} py={1} color="text.primary">
          Add a thumbnail
        </Typography>
        <Box
          sx={{
            width: "100%",
            border: "dashed 1px #B3B3B3",
            padding: 10,
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
                style={{ width: 200, height: 200 }}
                src={URL.createObjectURL(selectedImage)}
              />
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Typography fontWeight="700" fontSize={18} py={1} color="text.primary">
          Offers (Max 6)
        </Typography>
        <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={handleOnChangeTabIndex}
            aria-label="basic tabs example"
          >
            <Tab label="Beginner" {...a11yProps(0)} />
            <Tab label="Business" {...a11yProps(1)} />
            <Tab label="Enterprise" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <Box sx={{ width: "100%" }}>
          <TabPanel value={tabIndex} index={0} sx={{ width: "100%" }}>
            <TextField
              onChange={handleOnChangePrice}
              id="beginner"
              placeholder="19.99"
              label="Beginner Price"
              name="service-beginner-price-input"
              margin="normal"
              value={createServiceForm.offers.beginner.price}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              sx={{ width: "auto" }}
            />
            <Grid
              justifyContent="space-between"
              container
              direction="row"
              sx={{ width: "100%" }}
              flexWrap="wrap"
            >
              {createServiceForm.offers.beginner.values.map((offer, idx) => {
                return (
                  <Grid item xs={5.8} key={idx}>
                    <TextField
                      label={`Offer ${idx + 1}`}
                      margin="dense"
                      variant="filled"
                      fullWidth
                      value={offer}
                      onChange={(e) => handleOnChangeOffer(e, idx)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <TextField
              onChange={handleOnChangePrice}
              id="business"
              placeholder="59.99"
              label="Business Price"
              name="service-business-price-input"
              margin="normal"
              value={createServiceForm.offers.business.price}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              sx={{ width: "auto" }}
            />
            <Grid
              justifyContent="space-between"
              container
              direction="row"
              sx={{ width: "100%" }}
              flexWrap="wrap"
            >
              {createServiceForm.offers.business.values.map((offer, idx) => {
                return (
                  <Grid item xs={5.8} key={idx}>
                    <TextField
                      label={`Offer ${idx + 1}`}
                      margin="dense"
                      variant="filled"
                      fullWidth
                      value={offer}
                      onChange={(e) => handleOnChangeOffer(e, idx)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <TextField
              onChange={handleOnChangePrice}
              id="enterprise"
              placeholder="99.99"
              label="Enterprise Price"
              margin="normal"
              value={createServiceForm.offers.enterprise.price}
              name="service-enterprise-price-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              sx={{ width: "auto" }}
            />
            <Grid
              justifyContent="space-between"
              container
              direction="row"
              sx={{ width: "100%" }}
              flexWrap="wrap"
            >
              {createServiceForm.offers.enterprise.values.map((offer, idx) => {
                return (
                  <Grid item xs={5.8} key={idx}>
                    <TextField
                      label={`Offer ${idx + 1}`}
                      margin="dense"
                      variant="filled"
                      fullWidth
                      value={offer}
                      onChange={(e) => handleOnChangeOffer(e, idx)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </TabPanel>
        </Box>
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button
          sx={{ mx: 1, width: 120, p: 1 }}
          variant="contained"
          onClick={handleOnPublish}
        >
          Publish
        </Button>
      </Stack>
    </Container>
  );
};

export default CreateServicePage;
