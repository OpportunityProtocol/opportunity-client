import React, { useEffect, useState } from "react";
import {
  Container,
  CardContent,
  Typography,
  Alert,
  Avatar,
  AlertTitle,
  Stack,
  Toolbar,
  Grid,
  Box,
  List,
  Card,
  ListItem,
  Chip,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import { useStyles } from "../../../modules/contract/ContractStyles";
import Paper from "@mui/material/Paper";

import {
  CalendarTodayOutlined,
  KeyboardArrowLeft,
  Reviews,
} from "@mui/icons-material";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { GradientAvatarClassKey } from "@mui-treasury/styles/avatar/gradient/gradientAvatar.styles";
import { NextPage } from "next";
import { NextRouter, useRouter, withRouter } from "next/router";
import { ServiceStruct } from "../../../typechain-types/NetworkManager";
import { useContractRead } from "wagmi";
import {
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS,
  SERVICE_COLLECT_MODULE,
} from "../../../constant";
import {
  LensHubInterface,
  NetworkManagerInterface,
  ServiceCollectModuleInterface,
} from "../../../abis";
import { CHAIN_ID } from "../../../constant/provider";
import {
  ProfileStructStruct,
  PublicationStructStruct,
} from "../../../typechain-types/ILensHub";
import { Result } from "ethers/lib/utils";
import { hexToDecimal } from "../../../common/helper";
import { useDispatch } from "react-redux";
import { userLensDataStored } from "../../../modules/user/userReduxSlice";
import { create } from "ipfs-http-client";
import fleek from "../../../fleek";
import { PaymentProcessingDataStruct } from "../../../typechain-types/ServiceCollectModule";
import VerifiedAvatar from "../../../modules/user/components/VerifiedAvatar";

interface IDeliverable {
  type: string;
  deliverables: Array<string>;
  price: number;
}

const tempDeliverables: Array<IDeliverable> = [
  {
    type: "Standard",
    deliverables: [
      "Functional Website",
      "5 Pages",
      "Design Customization",
      "Content Upload",
      "Responsive Design",
    ],
    price: 59.99,
  },
  {
    type: "Premium",
    deliverables: [
      "Functional Website",
      "5 Pages",
      "Design Customization",
      "Content Upload",
      "Responsive Design",
    ],
    price: 89.99,
  },
  {
    type: "Business",
    deliverables: [
      "Functional Website",
      "5 Pages",
      "Design Customization",
      "Content Upload",
      "Responsive Design",
    ],
    price: 119.99,
  },
];

interface IViewContractPage {
  router: NextRouter;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const ViewContractPage: NextPage<IViewContractPage> = ({ router }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState<any>([]);
  const [serviceData, setServiceData] = useState<ServiceStruct>({});
  const [servicePubId, setServicePubId] = useState<number>(0);
  const [servicePublicationData, setServicePublicationData] =
    useState<PublicationStructStruct>({});
  const [paymentProcessingData, setServicePaymentProcessingData] =
    useState<PaymentProcessingDataStruct>({});
  const [serviceMetadata, setServiceMetadata] = useState({});
  const [user, setUser] = useState([]);
  const [displayImg, setDisplayImg] = useState();

  const [serviceOwnerLensProfileId, setServiceOwnerLensProfileId] =
    useState<number>(0);
  const [serviceOnwerLensProfile, setSeriviceOwnerLensProfile] =
    useState<ProfileStructStruct>({});
  const isReferral = true;
  const renderUsers = async () => {
    const a = await fetch("https://randomuser.me/api/?results=20", {});
    const users = await a.json();
    setReviews(users.results);
    setUser(users.results);
  };

  const renderPackageInformation = (idx: number) => {
   try {
    return `${hexToDecimal(paymentProcessingData.packages[idx]._hex)} DAI`
   } catch(error) {
    return '0 DAI'
   }
  }

  //get user lens profile id
  const networkManager_getLensProfileIdFromAddress = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getLensProfileIdFromAddress",
    {
      enabled: false,
      chainId: CHAIN_ID,
      args: router.query.owner,
      onSuccess: (data: Result) => {
        setServiceOwnerLensProfileId(hexToDecimal(data._hex));
      },
      onError: (error) => {
        console.log("getLensProfileIdFromAddress");
        console.log(error);
      },
    }
  );

  //get user lens profile
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
      args: [serviceOwnerLensProfileId],
      onSuccess: (data: Result) => {
        setSeriviceOwnerLensProfile(data);
      },
      onError: (error) => console.log(error),
    }
  );

  //get pub id
  const networkManager_getPubIdFromServiceId = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getPubIdFromServiceId",
    {
      enabled: true,
      watch: false,
      args: router.query.id,
      onSuccess(data: Result) {
        console.log(data);
        setServicePubId(hexToDecimal(data._hex));
      },
      onError(error) {
        console.log("getPubIdFromServiceId");
        console.log(error);
      },
    }
  );

  //get pub data
  const lensHub_getPub = useContractRead(
    {
      addressOrName: LENS_HUB_PROXY,
      contractInterface: LensHubInterface,
    },
    "getPub",
    {
      enabled: true,
      watch: false,
      args: [serviceOwnerLensProfileId, servicePubId],
      onSuccess(data: Result) {
        console.log(data);
        setServicePublicationData(data);
      },
      onError(error) {
        console.log("getPub");
        console.log(error);
      },
    }
  );

  //get collect module data
  const serviceCollectModule_getPaymentProcessingData = useContractRead(
    {
      addressOrName: SERVICE_COLLECT_MODULE,
      contractInterface: ServiceCollectModuleInterface,
    },
    "getPaymentProcessingData",
    {
      enabled: true,
      watch: false,
      args: [serviceOwnerLensProfileId, servicePubId],
      onSuccess(data: Result) {
        console.log(data);
        setServicePaymentProcessingData(data);
      },
      onError(error) {
        console.log("getPaymentProcessingData");
        console.log(error);
      },
    }
  );

  const getServiceMetadata = async (ptr) => {
    let retVal: any = {};

    if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
      const ipfs = create({
        url: "/ip4/127.0.0.1/tcp/8080",
      });

      retVal = await ipfs.get(`/ipfs/${ptr}`).next();
    } else {
      retVal = await fleek.getService(serviceData.metadataPtr);
    }

    if (!retVal) {
      throw new Error("Unable to retrieve service metadata data");
    } else {
      const jsonString = Buffer.from(retVal.value).toString("utf8");
      const parsedString = jsonString.slice(
        jsonString.indexOf("{"),
        jsonString.lastIndexOf("}") + 1
      );
      const parsedData = JSON.parse(parsedString);
      const updatedImg = Buffer.from(parsedData.serviceThumbnail.data);

      setDisplayImg(updatedImg);
      setServiceMetadata(parsedData);
    }
  };

  useEffect(() => {
    lensHub_getPub.refetch();
    serviceCollectModule_getPaymentProcessingData.refetch();
  }, [serviceOwnerLensProfileId, servicePubId]);

  //fetch lens profile among  lens profile id change
  useEffect(() => {
    if (serviceOwnerLensProfileId !== 0) {
      lensHub_getProfile.refetch({
        throwOnError: true,
      });
    }
  }, [serviceOwnerLensProfileId]);

  useEffect(() => {
    renderUsers();
  }, []);

  useEffect(() => {
    getServiceMetadata(router.query.metadataPtr);
    setServiceData(router.query);
    networkManager_getLensProfileIdFromAddress.refetch();
    networkManager_getPubIdFromServiceId.refetch();
  }, [router.query.id]);

  const styles: ClassNameMap<GradientAvatarClassKey> = useGradientAvatarStyles({
    size: 50,
    gap: 3,
    thickness: 3,
    gapColor: "#f4f7fa",
    color: "linear-gradient(to bottom right, #feac5e, #c779d0, #4bc0c8)",
  });

  return (
    <Container maxWidth="lg" sx={{ height: "calc(100vh - 70px)" }}>
      <Grid
        justifyContent="space-between"
        container
        direction="row"
        alignItems="flex-start"
      >
        {/* Start of first grid */}
        <Grid item xs={12}>
          <Button variant="text" startIcon={<KeyboardArrowLeft />}>
            {" "}
            Back to results{" "}
          </Button>

          <Card variant="outlined">
            <CardContent>
              <Box my={2}>
                <Stack py={1} direction="row" alignItems="center" spacing={1.5}>
                  <div
                    style={{
                      margin: "5px 0px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    className={styles.root}
                  >
                    <VerifiedAvatar  src={user[0]?.picture?.thumbnail} />
                  </div>
                  <Typography fontSize={16} color="primary" fontWeight="bold">
                    {serviceOnwerLensProfile.handle}
                  </Typography>
                </Stack>
              </Box>

              <Typography fontWeight="bold" fontSize={22} pb={2}>
                {serviceMetadata.serviceTitle}
              </Typography>
              <Typography
                paragraph
                fontSize={14}
                fontWeight="medium"
                color="rgb(0, 0, 0, 0.52)"
              >
                {serviceMetadata.serviceDescription}
              </Typography>

              <Stack
                direction="row"
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <Box
                  my={2}
                  component={Stack}
                  spacing={2}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <CalendarTodayOutlined
                      sx={{ color: "rgb(0, 0, 0, 0.52)" }}
                      fontSize="small"
                    />
                    <Typography
                      fontWeight="medium"
                      fontSize={13}
                      color="rgb(0, 0, 0, 0.52)"
                    >
                      Recently posted
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Reviews
                      sx={{ color: "rgb(0, 0, 0, 0.52)" }}
                      fontSize="small"
                    />
                    <Typography
                      fontWeight="medium"
                      fontSize={13}
                      color="rgb(0, 0, 0, 0.52)"
                    >
                      224 reviews
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <img
                      src="/assets/images/dai.svg"
                      style={{ width: 20, height: 25 }}
                    />
                    <Typography
                      fontWeight="medium"
                      fontSize={13}
                      color="primary"
                    >
                      $12,434 value locked{" "}
                      <span>
                        {" "}
                        <Typography
                          component="span"
                          fontSize={12}
                          color="secondary.main"
                        >
                          {" "}
                          +5.4%{" "}
                        </Typography>
                      </span>
                    </Typography>
                  </Stack>
                </Box>

                <Box display="flex">
                  <Button
                    sx={{
                      mx: 1,
                      width: 200,
                      height: 50,
                      borderRadius: 0,
                      bgcolor: "#f8f8f8",
                    }}
                    size="large"
                    disableElevation
                    disableRipple
                    variant="outlined"
                    color="primary"
                  >
                    Contact this seller
                  </Button>
                  <Button
                    sx={{ mx: 1, width: 200, height: 50, borderRadius: 0 }}
                    size="large"
                    disableElevation
                    disableRipple
                    variant="contained"
                    color="primary"
                  >
                    Invest
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Typography
            mt={6}
            pb={2}
            fontWeight="bold"
            color="rgba(33,33,33,.85)"
            fontSize={22}
          >
            Purchase service
          </Typography>
          <Grid spacing={3} container item direction="row" alignItems="center">
            <Grid item xs={4}>
              <Card
                sx={{
                  height: 400,
                  boxShadow:
                    "0px 3px 5px -1px #eee, 0px 5px 8px 0px #eee, 0px 1px 14px 0px #eee",
                }}
                elevation={5}
              >
                <CardContent>
                  <Stack
                    spacing={4}
                    sx={{ height: "100%" }}
                    alignItems="center"
                  >
                    <Typography fontWeight="medium" fontSize={25}>
                      {renderPackageInformation(0)}
                    </Typography>

                    <Chip
                      component={Paper}
                      elevation={2}
                      label="Basic"
                      variant="filled"
                      sx={{
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: "white",
                      }}
                    />

                    <Box component={Stack} spacing={1} sx={{ height: 150 }}>
                      <Typography
                        textAlign="center"
                        color="rgb(33, 33, 33)"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        25 Analytics Campaign
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="rgb(33, 33, 33)"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        1,300 keywords
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="#ccc"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        25 Social Media Reviews
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="#ccc"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        1 Free Optimization
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="#ccc"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        24/7 Support
                      </Typography>
                    </Box>

                    <Button variant="outlined" fullWidth size="large">
                      Get started
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={4}>
              <Card
                sx={{
                  height: 400,
                  boxShadow:
                    "0px 3px 5px -1px #eee, 0px 5px 8px 0px #eee, 0px 1px 14px 0px #eee",
                }}
              >
                <CardContent>
                  <Stack
                    spacing={4}
                    sx={{ height: "100%" }}
                    alignItems="center"
                  >
                    <Typography fontWeight="medium" fontSize={25}>
                    {renderPackageInformation(1)}
                    </Typography>

                    <Chip
                      component={Paper}
                      elevation={2}
                      label="Premium"
                      variant="filled"
                      sx={{
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: "white",
                      }}
                    />

                    <Box component={Stack} spacing={1} sx={{ height: 150 }}>
                      <Typography
                        textAlign="center"
                        color="rgb(33, 33, 33)"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        25 Analytics Campaign
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="rgb(33, 33, 33)"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        1,300 keywords
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="rgb(33, 33, 33)"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        25 Social Media Reviews
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="#ccc"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        1 Free Optimization
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="#ccc"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        24/7 Support
                      </Typography>
                    </Box>

                    <Button variant="outlined" fullWidth size="large">
                      Get started
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={4}>
              <Card
                sx={{
                  height: 400,
                  boxShadow:
                    "0px 3px 5px -1px #eee, 0px 5px 8px 0px #eee, 0px 1px 14px 0px #eee",
                }}
              >
                <CardContent>
                  <Stack
                    spacing={4}
                    sx={{ height: "100%" }}
                    alignItems="center"
                  >
                    <Typography fontWeight="medium" fontSize={25}>
                    {renderPackageInformation(2)}
                    </Typography>

                    <Chip
                      component={Paper}
                      elevation={2}
                      label="Enterprise"
                      variant="filled"
                      sx={{
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: "white",
                      }}
                    />

                    <Box component={Stack} spacing={1} sx={{ height: 150 }}>
                      <Typography
                        textAlign="center"
                        color="rgb(33, 33, 33)"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        25 Analytics Campaign
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="rgb(33, 33, 33)"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        1,300 keywords
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="rgb(33, 33, 33)"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        25 Social Media Reviews
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="rgb(33, 33, 33)"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        1 Free Optimization
                      </Typography>
                      <Typography
                        textAlign="center"
                        color="rgb(33, 33, 33)"
                        fontSize={13}
                        fontWeight="medium"
                      >
                        24/7 Support
                      </Typography>
                    </Box>

                    <Button variant="outlined" fullWidth size="large">
                      Get started
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box my={5}>
            <Typography fontWeight="bold">
              Other services provided by @janicecoleman007
            </Typography>
            <Typography variant="caption">
              @janicecoleman007 has not posted other services.
            </Typography>
          </Box>

          <Box my={5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="bold">0 Comments</Typography>

              <Button variant="text">Leave a comment</Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export { type IViewContractPage }
export default withRouter(ViewContractPage);
