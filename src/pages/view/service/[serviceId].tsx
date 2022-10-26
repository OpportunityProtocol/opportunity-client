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
  DialogContentText,
  IconButton,
  Dialog,
  Rating,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputBase,
  FormHelperText,
  LinearProgress,
} from "@mui/material";
import { useStyles } from "../../../modules/contract/ContractStyles";
import Paper from "@mui/material/Paper";

import { AccountCircleOutlined, ShareOutlined } from "@mui/icons-material";
import { NextPage } from "next";
import { NextRouter, withRouter } from "next/router";
import {
  useContractRead,
  useContractWrite,
} from "wagmi";
import {
  DAI_ADDRESS,
  LENS_HUB_PROXY,
  NETWORK_MANAGER_ADDRESS,
  ZERO_ADDRESS,
} from "../../../constant";
import {
  DaiInterface,
  LensHubInterface,
  NetworkManagerInterface
} from "../../../abis";
import { CHAIN_ID } from "../../../constant/provider";
import { Result } from "ethers/lib/utils";
import { hexToDecimal } from "../../../common/helper";
import { useSelector } from "react-redux";
import {
  selectLens,
  selectUserAddress,
} from "../../../modules/user/userReduxSlice";
import VerifiedAvatar from "../../../modules/user/components/VerifiedAvatar";
import { BigNumber, ethers } from "ethers";
import TransactionTokenDialog from "../../../modules/market/components/TransactionTokenDialog";
import { ConfirmationDialog } from "../../../common/components/ConfirmationDialog";
import { MailOutline } from "@mui/icons-material";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_SERVICES_BY_CREATOR, GET_SERVICE_BY_ID } from "../../../modules/contract/ContractGQLQueries";
import { getJSONFromIPFSPinata, getMetadata } from "../../../common/ipfs-helper";
import ServiceCard from "../../../modules/contract/components/ServiceCard/ServiceCard";

const confirmationDialogContent = [
  <DialogContentText id="alert-dialog-description">
    <Typography fontSize={20} fontWeight="bold" py={1}>
      {" "}
      You are about to purchase a service which will require three actions:
    </Typography>

    <ul>
      <li>
        {" "}
        <Typography>Signing a transaction</Typography>
      </li>
      <li>
        {" "}
        <Typography>Approving the funds</Typography>
      </li>
      <li>
        <Typography>Executing the transaction</Typography>
      </li>
    </ul>
  </DialogContentText>,

  <DialogContentText id="alert-dialog-description">
    <Box py={2}>
      <Typography fontSize={20} fontWeight="bold" py={1}>
        Confirm purchase
      </Typography>
      <Typography variant="subtitle2">
        Your wallet will prompt you to sign the transaction. Only accept
        transaction from addresses you trust.
      </Typography>
    </Box>
  </DialogContentText>,
];

const abiencoder = ethers.utils.defaultAbiCoder;

interface IViewContractPage {
  router: NextRouter;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const ViewContractPage: NextPage<IViewContractPage> = ({ router }) => {
  const [successfulPaymentAlertVisible, setSuccessfulPaymentAlertVisible] =
    useState<boolean>(false);
  const [purchaseIndex, setPurchaseIndex] = useState<number>(0);
  const [serviceData, setServiceData] = useState<any>({});
  const [serviceMetadata, setServiceMetadata] = useState<any>({});
  const [displayImg, setDisplayImg] = useState<string>();
  const [serviceOwnerLensProfileId, setServiceOwnerLensProfileId] =
    useState<number>(0);
  const [serviceOwnerLensProfile, setServiceOwnerLensProfile] =
    useState<any>({});
  const [purchaseDialogIsOpen, setPurchaseDialogIsOpen] =
    useState<boolean>(false);
  const [additionalServices, setAdditionalServices] = useState<Array<any>>([])

  const [tokenTransactionDialogOpen, setTokenTransactionDialogOpen] =
    useState<boolean>(false);
  const [loadingReviewTx, setLoadingReviewTx] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [reviewError, setReviewError] = useState<boolean>(false);
  const [reviewDialogVisible, setReviewDialogVisible] =
    useState<boolean>(false);
  const [buyingEnabled, setBuyingEnabled] = useState<boolean>(false);

  const userLensData = useSelector(selectLens)
  const userAddress = useSelector(selectUserAddress);

  const serviceQueryById: QueryResult = useQuery(GET_SERVICE_BY_ID, {
    variables: {
      serviceId: router.query.serviceId,
    },
  });

  const servicesByCreatorQuery: QueryResult = useQuery(GET_SERVICES_BY_CREATOR, {
    skip: true,
    variables: {
      creator: serviceData?.creator
    }
  })

  const renderPackageInformation = (idx: number) => {
    try {
      return (
        <Box display="flex" alignItems="center">
          {" "}
          (
          <img
            style={{ width: 25, height: 25, padding: "5px 0px" }}
            src="/assets/images/dai.svg"
          />{" "}
          <Typography pr={0.5}>DAI</Typography>){" "}
          <Typography px={1} fontWeight="medium" fontSize={25}>
            {Number(serviceData.offers[idx])}
          </Typography>{" "}
        </Box>
      );
    } catch (error) {
      return "0 DAI";
    }
  };

  //get user lens profile id
  const networkManager_getLensProfileIdFromAddress = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getLensProfileIdFromAddress",
    enabled: false,
    watch: false,
    chainId: CHAIN_ID,
    args: serviceData?.creator,
    onSuccess: (data: Result) => {
      setServiceOwnerLensProfileId(hexToDecimal(data._hex));
    },
    onError: (error) => { },
  });

  //get user lens profile
  const lensHub_getProfile = useContractRead({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    functionName: "getProfile",
    enabled: false,
    watch: false,
    chainId: CHAIN_ID,
    args: [serviceOwnerLensProfileId],
    onSuccess: (data: Result) => {
      setServiceOwnerLensProfile(data);
    },
    onError: (error) => { },
  });

  useEffect(() => {
    serviceQueryById.refetch();
    networkManager_getLensProfileIdFromAddress.refetch();
  }, [router.query.serviceId]);

  useEffect(() => {
    if (serviceData?.creator && String(serviceData?.creator).toLowerCase() != ZERO_ADDRESS) {
      servicesByCreatorQuery.refetch()
    }
  }, [serviceData?.creator])

  useEffect(() => {
    if (!serviceQueryById.loading && serviceQueryById.data) {
      setServiceData(serviceQueryById.data.service);
    }
  }, []);

  useEffect(() => {
    if (!servicesByCreatorQuery.loading && servicesByCreatorQuery.data) {
      setAdditionalServices(servicesByCreatorQuery.data.services);
    }
  }, []);

  //fetch lens profile among  lens profile id change
  useEffect(() => {
    lensHub_getProfile.refetch({
      throwOnError: true,
    });
  }, [serviceOwnerLensProfileId]);

  useEffect(() => {
    async function loadMetadata() {
      if (serviceData?.metadataPtr) {
        const parsedData = await getJSONFromIPFSPinata(serviceData?.metadataPtr)
        //@ts-ignore
        if (
          parsedData?.serviceThumbnail &&
          parsedData?.serviceThumbnail?.data
        ) {
          const buffer: Buffer = parsedData?.serviceThumbnail?.data;
          const updatedImg: any = Buffer.from(buffer);

          setDisplayImg(updatedImg);
          setServiceMetadata(parsedData);
        }
      }
    }

    loadMetadata()
  }, [serviceData?.metadataPtr]);

  const { write: approveDai } = useContractWrite({
    addressOrName: DAI_ADDRESS,
    contractInterface: DaiInterface,
    mode: "recklesslyUnprepared",
    functionName: "approve",
    args: [NETWORK_MANAGER_ADDRESS, typeof serviceData?.offers == 'object' ? serviceData?.offers[0] + 100 : 0],
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSettled(data, error, variables, context) {
      if (!error) {
        purchaseService({
          recklesslySetUnpreparedArgs: [serviceData.id, BigNumber.from("0")],
          recklesslySetUnpreparedOverrides: {
            gasLimit: ethers.BigNumber.from("2000000"),
            gasPrice: 90000000000,
          }
        })
      }
    },
  })

  const { write: purchaseService } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    enabled: false,
    functionName: "purchaseServiceOffering",
    args: [serviceData?.pubId, BigNumber.from("0")],
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSuccess(data) {
      setSuccessfulPaymentAlertVisible(true);
    }
  });

  const onPurchase = async () => approveDai()

  const { writeAsync: comment } = useContractWrite({
    addressOrName: LENS_HUB_PROXY,
    contractInterface: LensHubInterface,
    mode: "recklesslyUnprepared",
    functionName: "comment",
    args: [],
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSettled(data, error) {
      setLoadingReviewTx(false);
    },
  });



  const onSubmitReview = () => {
    setLoadingReviewTx(true);
    comment({
      recklesslySetUnpreparedArgs: [{
        profileId: Number(userLensData.profileId),
        contentURI: "",
        profileIdPointed: Number(serviceOwnerLensProfileId),
        pubIdPointed: Number(serviceData?.id),
        referenceModuleData: [],
        collectModule: ZERO_ADDRESS,
        collectModuleInitData: [],
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: []
      }]
    })
      .catch((error) => {
        setReviewError(true);
      })
      .finally(() => {
        setLoadingReviewTx(false);
      });
  };

  return (
    <Container maxWidth="lg">
      <Grid
        justifyContent="space-between"
        container
        direction="row"
        alignItems="flex-start"
      >
        {/* Start of first grid */}
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Card
              elevation={0}
              sx={{
                width: "100%",
                py: 2,
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Stack sx={{ width: '100%' }} direction='row' justifyContent='space-between' alignItems='flex-start'>
                  <Stack spacing={3}>
                    <Stack>
                      <Avatar sx={{ width: 90, height: 90 }} src={serviceOwnerLensProfile?.imageURI} />
                      <Typography
                        fontWeight="600"
                        color="black"
                        fontSize={23}
                        py={1}>
                        {serviceOwnerLensProfile?.handle}
                      </Typography>
                      <Chip sx={{ py: 1, height: 15, borderRadius: 1, color: '#757575', maxWidth: 100, fontSize: 10 }} size='small' variant='filled' label={serviceData?.creator} />
                    </Stack>

                    <Stack spacing={0.3}>
                      <Typography fontWeight="700" fontSize={20} maxWidth={300}>
                        {serviceMetadata?.serviceTitle
                          ? serviceMetadata?.serviceTitle
                          : "Unable to load title"}
                      </Typography>
                      <Typography paragraph variant='body2' color="text.secondary">
                        {serviceMetadata?.serviceDescription
                          ? serviceMetadata?.serviceDescription
                          : "Unable to load description"}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Card sx={{ pr: 2, bgcolor: 'rgb(246, 248, 250)' }} variant='outlined'>
                    <CardContent>
                      <Box>
                        <Stack

                          direction="row"
                          alignItems="center"
                          spacing={5}
                          sx={{ width: "100%" }}
                        >
                          <Box textAlign="start">
                            <Typography
                              pb={1}
                              color='text.primary'
                              // fontWeight="600"
                              fontSize={14}
                              variant='subtitle2'
                            >
                              Service Value
                            </Typography>

                            <Stack spacing={1} direction="row" alignItems="center">
                              <img
                                src="/assets/images/dai.svg"
                                style={{ width: 20, height: 25 }}
                              />

                              <Typography

                                fontSize={13}
                                color="primary"
                              >
                                $12,434 {" "}
                                <Typography fontSize={13} color='text.primary' component='span'>
                                  value locked
                                </Typography>
                              </Typography>
                            </Stack>
                          </Box>

                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <Box my={1.5}>
            <Box py={2} component={Alert} severity="success">
              <Box>
                <AlertTitle>Earn as babys8 earns. </AlertTitle>
                Buy a stake in this service and earn as babys8 earns. Stake is
                long term confidence of this service based on quality.{" "}
                <Typography variant="button">How it works</Typography>
              </Box>
              <Stack py={2} spacing={3} direction="row" alignItems="center">
                <Button
                  disabled={false}
                  variant="contained"
                  onClick={() => setTokenTransactionDialogOpen(true)}
                >
                  Invest
                </Button>
                <Button variant="outlined" sx={{}}>
                  Learn more about investing
                </Button>
              </Stack>
            </Box>
          </Box>

          <Box my={5}>
            {successfulPaymentAlertVisible && (
              <Alert severity="success">
                <AlertTitle>Successful Purchase</AlertTitle>
                Your funds have been stored in an escrow until the task is
                completed. Head over to{" "}
                <Typography
                  variant="button"
                  onClick={() => router.push("/view")}
                >
                  {" "}
                  <strong>contracts</strong>{" "}
                </Typography>{" "}
                for more details.
              </Alert>
            )}
          </Box>

          <Box>
            <Typography
              fontWeight="600"
              py={2}
              fontSize={20}
            >
              Offer Details
            </Typography>
          </Box>
          <Card
            sx={{
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
                {renderPackageInformation(0)}
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


                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => {
                    setPurchaseDialogIsOpen(true);
                    setPurchaseIndex(0);
                  }}
                >
                  Purchase
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Box my={5}>
            <Typography
              fontWeight="600"
              py={2}
              fontSize={20}
            >
              Other services provided by {serviceOwnerLensProfile?.handle}
            </Typography>
            <Stack spacing={2} direction='row' alignItems='center'>
              {
                additionalServices && additionalServices.length > 0 ?
                  additionalServices.map((service) => {
                    return <ServiceCard id={service?.id} data={service} />
                  })
                  :
                  <Typography color="text.secondary" paragraph>
                    {serviceOwnerLensProfile?.handle} has not posted other services.
                  </Typography>
              }
            </Stack>

          </Box>

          <Box my={5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                fontWeight="600"
                py={2}
                fontSize={20}
              >
                Comments and Reviews
              </Typography>

              <Button
                variant="text"
                onClick={() => setReviewDialogVisible(true)}
              >
                Comment
              </Button>
            </Stack>
            <Typography color="text.secondary" paragraph>
              0 reviews for {serviceOwnerLensProfile?.handle}'s services
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <TransactionTokenDialog
        open={tokenTransactionDialogOpen}
        handleClose={() => setTokenTransactionDialogOpen(false)}
        serviceId={serviceData.id}
      />
      <ConfirmationDialog
        open={purchaseDialogIsOpen}
        onOpen={() => { }}
        onClose={() => {
          setPurchaseDialogIsOpen(false);
        }}
        primaryAction={onPurchase}
        primaryActionTitle={"Purchase"}
        hasSigningStep={false}
        content={confirmationDialogContent}
      />

      <Dialog
        fullWidth
        maxWidth="md"
        open={reviewDialogVisible}
        onClose={() => setReviewDialogVisible(false)}
      >
        <Box sx={{ bgcolor: "rgb(247, 247, 250)" }}>
          <DialogTitle>Submit a review</DialogTitle>
        </Box>
        <Divider />
        {loadingReviewTx && <LinearProgress />}

        <DialogContent>
          <DialogContentText pb={3} fontWeight="medium">
            Provide a rating for the quality of work provided by @babys8. You
            can only submit one review per rating.
          </DialogContentText>
          <Stack spacing={2}>
            <Rating
              name="review-dialog-controlled-rating"
              value={reviewRating}
              onChange={(event, newValue) => {
                setReviewRating(newValue);
              }}
            />
            <Paper elevation={0} sx={{ width: "100%" }}>
              <InputBase
                placeholder="Leave a review for @babys8"
                sx={{ width: "100%", p: 2, bgcolor: "rgb(247, 247, 250)" }}
                error={reviewError}
              />
              {reviewError && (
                <FormHelperText>
                  Something went wrong. Please check your wallet and try again.
                </FormHelperText>
              )}
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setReview("");
              setReviewError(false);
              setReviewDialogVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={onSubmitReview}>
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export { type IViewContractPage };
export default withRouter(ViewContractPage);
