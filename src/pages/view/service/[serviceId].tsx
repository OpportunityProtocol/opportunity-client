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
import fleek from "../../../fleek";
import { getLensProfileById } from "../../../modules/lens/LensGQLQueries";
import { GET_VERIFIED_FREELANCER_BY_ADDRESS } from "../../../modules/user/UserGQLQueries";
import { GET_TOKEN_INFO_BY_SERVICE_ID } from "../../../modules/market/MarketGQLQueries";

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

  const [tokenInfo, setTokenInfo] = useState<any>({})

  const tokenInfoQuery: QueryResult = useQuery(GET_TOKEN_INFO_BY_SERVICE_ID, {
    skip: true,
    variables: {
      serviceId: Number(serviceData?.id),
      id: Number(serviceData?.id),
    },
  });

  const tokenAddress = tokenInfo?.address

  useEffect(() => {
    if (serviceData?.id) {
      tokenInfoQuery.refetch().then((res) => {

        if (res.data?.serviceTokens && res.data?.serviceTokens?.length > 0) {
          const tokenInfo = res.data?.serviceTokens[0]
  
          setTokenInfo(tokenInfo)
        }
        console.log('@@@@')
        console.log(serviceData)
        console.log(res.data)
      })
    }

  }, [serviceData?.id])


  const serviceCreatorQuery: QueryResult = useQuery(GET_VERIFIED_FREELANCER_BY_ADDRESS, {
    skip: true,
    variables: {
      userAddress: serviceData?.creator
    }
  })

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
          <Typography>
            Price:
            </Typography> 
          {" "}
      

          <Typography px={1} fontWeight="400" fontSize={20}>
            {Number(serviceData.offers[idx]).toFixed(2)}
          </Typography>{" "}
          <img
            style={{ width: 30, height: 30, padding: "5px 0px" }}
            src="/assets/images/dai.svg"
          />{" "}
       


        </Box>
      );
    } catch (error) {
      return "0 DAI";
    }
  };

  //load profile when profile id changes
  useEffect(() => {
    async function loadProfile() {
      if (serviceOwnerLensProfileId > 0) {
        const profile = await getLensProfileById(`0x${Math.abs(Number(serviceOwnerLensProfileId)).toString(16)}`)
        console.log({ profile })
        setServiceOwnerLensProfile(profile)
      }
    }

    loadProfile()
  
  }, [serviceOwnerLensProfileId])

  useEffect(() => {
    serviceQueryById.refetch().then((data) => setServiceData(data))
  }, [router.query.serviceId]);

  useEffect(() => {
    if (serviceData?.creator) {
      serviceCreatorQuery.refetch().then((data) => {
   
        const freelancerData = data.data?.verifiedUsers[0]

        setServiceOwnerLensProfileId(freelancerData?.id)
      })
    }
  }, [serviceData?.creator])

  useEffect(() => {
    async function loadService() {
      const serviceData = serviceQueryById.data.service
      const serviceMetadata = await fleek.getService(String(serviceData?.metadataPtr).slice(13))
      const updatedServiceData = { ...serviceData, ...serviceMetadata }

      setServiceData(updatedServiceData);
    }

    if (!serviceQueryById.loading && serviceQueryById.data) {
      loadService()
    }
  }, [serviceQueryById.loading]);

  useEffect(() => {
    if (!servicesByCreatorQuery.loading && servicesByCreatorQuery.data) {
      setAdditionalServices(servicesByCreatorQuery.data.services);
    }
  }, []);

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
    onSettled(data, error, variables, context) {
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
                <Box mb={2}>
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
      <Grid
        justifyContent="space-between"
        container
        direction="row"
        alignItems="flex-start"
      >
        {/* Start of first grid */}
        <Grid item xs={12}>
          <Stack
          spacing={2}
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Stack>
            <Card
            variant='outlined'
              elevation={0}
              sx={{
                border: '1px solid #ddd !important',
                boxShadow: 'rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px',
                width: '100%',
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
                      <Avatar sx={{ width: 90, height: 90 }} src={serviceOwnerLensProfile?.picture?.original?.url} />
                      <Typography
                        fontWeight="600"
                        color="black"
                        fontSize={23}
                        py={1}>
                        {serviceOwnerLensProfile?.handle}
                      </Typography>
                      <Chip sx={{ py: 1, height: 15, borderRadius: 1, color: '#757575', maxWidth: 100, fontSize: 10 }} size='small' variant='filled' label={serviceData?.creator} />
                    </Stack>


                  </Stack>
             {/*     <Card sx={{ pr: 2, bgcolor: 'rgb(246, 248, 250)' }} variant='outlined'>
                    <CardContent>
                      <Box />
                    </CardContent>
                        </Card>*/}
                </Stack>
              </CardContent>
            </Card>
            <Box my={1.5}>
            <Box py={2} component={Alert} severity="success">
              <Box>
                <AlertTitle>Earn as {serviceOwnerLensProfile?.handle} earns. </AlertTitle>
                Buy a stake in this service and earn as babys8 earns. Stake is
                long term confidence of this service based on quality.{" "}

              </Box>
              <Stack py={2} spacing={3} direction="row" alignItems="center">
                <Button
                  disabled={!tokenInfo?.address}
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
            </Stack>


            <Card
            variant='outlined'
            sx={{
             width: '100%',
             border: '1px solid #ddd !important',
             boxShadow: 'rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px',
            }}
          >
            <CardContent>
              <Stack
                spacing={4}
                sx={{ height: "100%" }}
              
              >
                          

                <Stack spacing={0.3}>
                      <Typography fontWeight="700" fontSize={23}>
                        {serviceData?.serviceTitle
                          ? serviceData?.serviceTitle
                          : "Unable to load title"}
                      </Typography>
                      <Typography paragraph variant='body2' color="text.secondary">
                        {serviceData?.serviceDescription
                          ? serviceData?.serviceDescription
                          : "Unable to load description"}
                      </Typography>
                      {renderPackageInformation(0)}
                    </Stack>

                <Box component={Stack} alignItems='flex-start' spacing={1} sx={{ height: 150 }}>
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
          </Stack>
     
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
                    return <ServiceCard data={service} />
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
      tokenInfo={tokenInfo}
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
