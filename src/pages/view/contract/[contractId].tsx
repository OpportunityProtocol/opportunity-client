import React, { useEffect, useState } from "react";
import {
  Container,
  CardContent,
  Card,
  Typography,
  Alert,
  Grid,
  Stack,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  FormControl,
  TextField
} from "@mui/material";
import { useStyles } from "../../../modules/contract/ContractStyles";
import { FavoriteBorderOutlined } from "@mui/icons-material";

import JobDisplay from "../../../modules/market/components/JobDisplay";

import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_CONTRACT_BY_ID } from "../../../modules/contract/ContractGQLQueries";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { DAI_ADDRESS, NETWORK_MANAGER_ADDRESS, PINATA_JWT } from "../../../constant";
import { DaiInterface, NetworkManagerInterface } from "../../../abis";
import {
  MARKET_DESCRIPTION_MAPPING,
  MARKET_ID_MAPPING,
} from "../../../constant/messages";
import { CHAIN_ID } from "../../../constant/provider";
import { Result } from "ethers/lib/utils";
import { create } from "ipfs-http-client";
import fleek from "../../../fleek";
import { ethers } from "ethers";

import Dialog from '@mui/material/Dialog';

import InputAdornment from '@mui/material/InputAdornment';
import AppBar from '@mui/material/AppBar';
import Input from '@mui/material/Input';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import { db } from "../../../../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { isConstValueNode } from "graphql";
import { getJSONFromIPFSPinata } from "../../../common/ipfs-helper";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const contractDetailsPrimaryTypographyProps = {
  fontSize: 14,
  fontWeight: "medium",
  color: "rgb(33, 33, 33, .85)",
};

const contractDetailsSecondaryTypographyProps = {
  color: "#808080",
  fontSize: 12,
};

enum MessageType {
  ContractProposal
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/**
 *
 * @returns
 * @dev Temporarily addds increase allowance and assign worker buttons/functions here until message functionality is added
 * @dev TODO: Add modal for inputting accepted solution pointer
 */
const ViewContract: NextPage<any> = () => {


  const classes = useStyles();
  const { address, connector } = useAccount();
  const router = useRouter();

  const { contractId } = router.query;

  const [contractData, setContractData] = useState<any>({});
  const [contractMetadata, setContractMetadata] = useState<any>({});
  const [metadataString, setMetadataString] = useState("");
  const [acceptedSolutionPtr, setAcceptedSolutionPtr] = useState<string>("dsfsdfsdfsdf");
  const [reviews, setReviews] = useState<any>([]);
  const [sendMessageopen, setSendmessageOpen] = React.useState(false);
  const [data, setData] = useState({
    proposalPayout: "",
    proposalMessage: "",
    error: null,
  });
  const { proposalPayout, proposalMessage, error } = data;

  //convert to gql
  const networkManager_getContractData = useContractRead({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "getContractData",
    enabled: false,
    watch: false,
    chainId: CHAIN_ID,
    args: [contractId],
    onSuccess: (data: Result) => {
      setMetadataString(data.taskMetadataPtr);
    },
    onError: (error) => {
      setMetadataString("");
    },
  });

  const dai_approvePrepare = usePrepareContractWrite({
    addressOrName: DAI_ADDRESS,
    contractInterface: DaiInterface,
    functionName: "approve",
    enabled: true,
    args: [NETWORK_MANAGER_ADDRESS, 100000],
  });

  const dai_approve = useContractWrite(dai_approvePrepare.config);

  useEffect(() => {
    if (contractId) {
      networkManager_getContractData.refetch();
    }
  }, [contractId]);

  useEffect(() => {
    let retVal: any = {};

    async function getMetadata() {
      try {
        if (!PINATA_JWT) {
          const ipfs = create({
            url: "/ip4/127.0.0.1/tcp/8080",
          });

          retVal = await ipfs.get(`/ipfs/${metadataString}`).next();

          const jsonString = Buffer.from(retVal.value).toString("utf8");
          const parsedString = jsonString.slice(
            jsonString.indexOf("{"),
            jsonString.lastIndexOf("}") + 1
          );
          const parsedData = JSON.parse(parsedString);

          setContractMetadata(parsedData);
        } else {
          retVal = await fleek.getContract(String(metadataString.slice(13))) //getJSONFromIPFSPinata(metadataString) //await fleek.getService(metadataString);

          setContractMetadata(retVal)
        }

      } catch (error) {
        setContractMetadata({})
      }
    }

    if (metadataString) {
      getMetadata();
    }
  }, [metadataString]);

  const contractByIdQuery: QueryResult = useQuery(GET_CONTRACT_BY_ID, {
    variables: {
      contractId,
    },
  });

  useEffect(() => {
    async function syncContractData() {
      if (!contractByIdQuery.loading && contractByIdQuery.data) {
        setContractData(contractByIdQuery.data.contract);
      }
    }

    syncContractData();
  }, [contractByIdQuery.loading]);

  useContractEvent({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    eventName: "ContractOwnershipUpdate",
    listener: async (event: Event) => {
      contractByIdQuery.refetch();
    },
  });

  useContractEvent({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    eventName: "ContractOwnershipUpdate",
    listener: async (event: Event) => {
      contractByIdQuery.refetch();
    },
  });

  const networkManager_releaseContractPrepare = usePrepareContractWrite({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "releaseContract",
    enabled: true,
    args: [contractId],
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
    onSettled(data, error) {
      if (error) {
      } else {
        contractByIdQuery.refetch();
      }
    },
  });

  const networkManager_releaseContract = useContractWrite(
    networkManager_releaseContractPrepare.config
  );

  const { write: resolveContract } = useContractWrite({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    functionName: "resolveContract",
    chainId: CHAIN_ID,
    args: [contractId, acceptedSolutionPtr],
    overrides: {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    },
  });


  const handleOpen = () => setSendmessageOpen(true);
  const handleClose = () => setSendmessageOpen(false);

  const handleChanges = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null });
    if (!proposalPayout || !proposalMessage) {
      setData({ ...data, error: "* All fields are required *" });
      return
    };

    try {
      const user1 = (address.toLowerCase());
      const user2 = ((contractData.employer).toLowerCase());
      const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

      const selectedRef1 = doc(db, "users", user1, "selectedUser", user2);
      const selectedRef2 = doc(db, "users", user2, "selectedUser", user1);

      await setDoc(selectedRef1, {
        uid: user2,
        name: user2,
      });

      await setDoc(selectedRef2, {
        uid: user1,
        name: user1,
      });

      await addDoc(collection(db, "messages", id, "chat"), {
        text: proposalMessage,
        from: user1,
        to: user2,
        createdAt: Timestamp.fromDate(new Date()),
        data: { proposalPayout, proposalMessage, contractId: contractId, proposedWorker: address },
        proposalPayout,
        proposalMessage,
        type: MessageType.ContractProposal,
      });

      setData({
        proposalPayout,
        proposalMessage,
        error: null,
      });

      handleClose();
    } catch (err) {
      setData({ ...data, error: err.message });
    }
  };

  const renderPrimaryButtonState = () => {
    if (
      String(address).toLowerCase() ==
      String(contractData?.employer).toLowerCase()
    ) {

      switch (contractData?.ownership) {
        case 0: //unclaimed
          return (
              <Button
                variant="contained"
                size="large"
                sx={{ mb: 2 }}
                fullWidth
                disableElevation
                disableRipple
                disabled
              >
                Awaiting Proposals
              </Button>
          );
        case 1: //claimed
          return (
            <Button
              variant="contained"
              size="large"
              sx={{ mb: 2 }}
              fullWidth
              color="primary"
              disableElevation
              disableRipple
              onClick={resolveContract}
            >
              Accept Work
            </Button>
          );
        case 2: //resolved
          return (
            <Button
              variant="contained"
              size="large"
              sx={{ mb: 2 }}
              fullWidth
              color="error"
              disabled
              disableElevation
              disableRipple
            >
              Resolved
            </Button>
          );
        case 3: //reclaimed
          return (
            <Button
              variant="contained"
              size="large"
              sx={{ mb: 2 }}
              fullWidth
              color="error"
              disableElevation
              disableRipple
            >
              Open Dispute Center
            </Button>
          );
        case 4: //disputed
          return (
            <Button
              variant="contained"
              size="large"
              sx={{ mb: 2 }}
              fullWidth
              color="error"
              disableElevation
              disableRipple
            >
              Open Dispute Center
            </Button>
          );
        default:
      }
    }

    if (
      String(address).toLowerCase() ==
      String(contractData?.worker).toLowerCase()
    ) {
      switch (contractData?.ownership) {
        case 0: //unclaimed - not a possible case
          return;
        case 1: //claimed
          return (
            <Button
              variant="contained"
              size="large"
              sx={{ mb: 2 }}
              fullWidth
              color="error"
              disableElevation
              disableRipple
              onClick={() => networkManager_releaseContract.write()}
            >
              Release Contract
            </Button>
          );
        case 2: //resolved
          return (
            <Button
              variant="contained"
              size="large"
              sx={{ mb: 2 }}
              fullWidth
              color="error"
              disabled
              disableElevation
              disableRipple
              component={Stack}
            >
              Resolved
              <Typography variant="caption" color="primary">
                You earned: {contractData.amount}
              </Typography>
            </Button>
          );
        case 3: //reclaimed
          return (
            <Button
              variant="contained"
              size="large"
              sx={{ mb: 2 }}
              fullWidth
              color="error"
              disableElevation
              disableRipple
            >
              Open Dispute Center
            </Button>
          );
        case 4: //disputed
          return (
            <Button
              variant="contained"
              size="large"
              sx={{ mb: 2 }}
              fullWidth
              color="error"
              disableElevation
              disableRipple
            >
              Open Dispute Center
            </Button>
          );
        default:
      }
    }

    if (
      String(address).toLowerCase() !=
      String(contractData?.employer).toLowerCase() &&
      String(address).toLowerCase() !=
      String(contractData?.worker).toLowerCase() &&
      Number(contractData?.ownership) == 0

    ) {


      return (
        <>
          <Button
            variant="contained"
            size="large"
            sx={{ mb: 2 }}
            fullWidth
            color="primary"
            disableElevation
            disableRipple
            onClick={handleOpen}
          >
            Submit Proposal
          </Button>

          <Dialog
            fullScreen
            open={sendMessageopen}
            onClose={handleClose}
            TransitionComponent={Transition}

            sx={{
              '& .MuiDialog-paper': {

                backgroundColor: '#fafafa'
              },
            }}


          >
            <Grid sx={{
              maxWidth: '1300px',
              width: '100%',
              paddingRight: '15px',
              paddingLeft: '15px',
              marginRight: 'auto',
              marginLeft: 'auto',
              paddingTop: '10em',
              paddingBottom: '10em',



            }}>
              <Grid sx={{
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginRight: '-15px',
                marginLeft: '-15px',


              }}>
                <Grid sx={{
                  position: 'relative',
                  width: '100%',
                  paddingRight: '15px',
                  paddingLeft: '15px',
                  flex: '0 0 83.33333%',
                  maxWidth: '83.33333%',
                  flexDirection: 'column',

                }}>

                  <Grid sx={{
                    width: "100%",
                    boxShadow: '0px 21px 41px -13px rgba(0, 0, 0, 0.18)',

                  }}>

                    <Grid sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginRight: '0',
                      marginLeft: '0',

                    }}>


                      <Grid sx={{

                        paddingRight: '0',
                        paddingLeft: '0',
                        alignItems: 'stretch !important',
                        display: 'flex !important',
                        flex: '0 0 41.66667%',
                        maxWidth: '41.66667%',
                        position: 'relative',
                        width: '100%',
                        flexDirection: 'column',
                        height: "100%",

                      }}>




                        <Grid sx={{
                          marginTop: '-20px',
                          marginBottom: '-20px',
                          borderRadius: '5px',
                          background: 'rgb(217, 243, 232) !important',
                          width: '100% !important',
                          padding: '3rem !important',
                          height: '83%',
                          maxHeight: '83%',
                        }}>


                          <List >
                            <Grid sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '0px' }}>
                              <ListItem >
                                <ListItemText primary=" Title" secondary="Titania" primaryTypographyProps={{ fontWeight: '550' }} />
                              </ListItem>
                              <ListItem >
                                <ListItemText primary="Description" secondary="Tethys" primaryTypographyProps={{ fontWeight: '550' }} />
                              </ListItem>
                              <ListItem >
                                <ListItemText primary="Market Id" secondary="Tethys" primaryTypographyProps={{ fontWeight: '550' }} />
                              </ListItem>
                              <ListItem >
                                <ListItemText primary="Budget" secondary="Tethys" primaryTypographyProps={{ fontWeight: '550' }} />
                              </ListItem>
                            </Grid>
                          </List>

                          <List sx={{ padding: '0px' }}>
                            <ListItem >
                              <ListItemText primary="Definition of done" secondary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed hendrerit sem.
              Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque pellentesque
              tortor tortor, at convallis metus ornare ac. Aenean quis pellentesque nisl. Ut
              suscipit a nisi sed porttitor. Donec cursus velit diam, non accumsan urna aliquet.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed hendrerit sem.
              Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque pellentesque
              tortor tortor, at convallis metus ornare ac. Aenean quis pellentesque nisl. Ut
              suscipit a nisi sed porttitor. Donec cursus velit diam, non accumsan urna aliquet
              hendrerit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed hendrerit sem.
              Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque pellentesque
              tortor tortor, at convallis metus ornare ac. Aenean quis pellentesque nisl. Ut
              suscipit a nisi sed porttitor. Donec cursus velit diam, non accumsan urna aliquet
              hendrerit.Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque pellentesque
              tortor tortor, at convallis metus ornare ac. Aenean quis pellentesque nisl. Ut
              suscipit a nisi sed porttitor. Donec cursus velit diam, non accumsan urna aliquet
              hendrerit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed hendrerit sem.
              Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque pellentesque
              tortor tortor, at convallis metus ornare ac. Aenean quis pellentesque nisl. Ut
              suscipit a nisi sed porttitor. Donec cursus velit diam, non accumsan urna aliquet
              hendrerit."
                                primaryTypographyProps={{ fontWeight: '550', }}

                                secondaryTypographyProps={{ height: ' 468px', overflow: 'scroll', }} />
                            </ListItem>

                          </List>




                        </Grid>


                      </Grid>
                      <Grid sx={{

                        paddingRight: '0',
                        paddingLeft: '0',
                        alignItems: 'stretch !important',
                        display: 'flex !important',
                        flex: '0 0 58.33333%',
                        maxWidth: '58.33333%',
                        position: 'relative',
                        width: '100%',
                        flexDirection: 'column',

                      }}>

                        <Grid sx={{
                          background: '#fff',
                          paddingLeft: '3rem !important',
                          paddingRight: '3rem !important',
                          paddingTop: '3rem !important',
                          width: '100% !important',
                        }}>
                          {error ? <Typography sx={{ padding: "0px", position: "absolute", right: "100px", top: "17px", color: "red" }} className="error">{error}</Typography> : null}
                          <CloseIcon
                            fontSize="large"
                            onClick={handleClose}
                            sx={{
                              padding: "0px",
                              height: "20px",
                              position: "absolute",
                              right: "17px",
                              top: "17px",
                              width: "20px",
                              cursor: "pointer",
                            }}
                          />

                          <Typography sx={{
                            lineHeight: '1.5',
                            fontWeight: '400',
                            fontFamily: '"Poppins", Arial, sans-serif',
                            color: '#000',
                            fontSize: '1.75rem',

                          }}>Create Proposal</Typography>




                          <List >

                            <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                              <ListItemText primary="Proposal Payout" secondary="Enter a proposed payout you would like to receive for this job." primaryTypographyProps={{ fontWeight: '550' }} />
                              <FormControl >

                                <Input id="outlined-basic" type="number" name="proposalPayout" value={proposalPayout} onChange={handleChanges} startAdornment={
                                  <InputAdornment position="start">
                                    <img src="/assets/images/dai.png" style={{ width: 20, height: 20 }} />
                                  </InputAdornment>
                                } />

                              </FormControl>
                            </ListItem>
                            <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                              <ListItemText primary="Contract Proposal" secondary="Write a proposal detailing why you would be a good fit for this job." primaryTypographyProps={{ fontWeight: '550' }} />
                              <FormControl fullWidth sx={{ width: '100%' }}>

                                <TextField id="outlined-basic" label="" name="proposalMessage" variant="outlined" multiline
                                  rows={16} type="text" value={proposalMessage} onChange={handleChanges} onSubmit={handleProposalSubmit}
                                />
                              </FormControl>
                            </ListItem>



                          </List>
                          <Grid sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginBottom: '11px' }}>
                            <Button size="large" type="submit" onClick={handleProposalSubmit} >
                              Send Proposal
                            </Button>
                          </Grid>


                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Dialog>
        </>
      );
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        paddingTop="2%"
      >
        <Grid item xs={8}>
          <Box className={classes.marginBottom}>
            <JobDisplay data={contractData} />
          </Box>

          <Card elevation={0} className={classes.marginBottom}>
            <CardContent>
              <Typography
                pb={2}
                fontWeight="medium"
                fontSize={20}
                color="rgba(33, 33, 33, .85)"
              >
                Reviews
              </Typography>
              {reviews.length === 0 ? (
                <Typography variant="caption">No reviews</Typography>
              ) : (
                reviews.slice(4, 9).map(
                  (
                    review: {
                      picture: { large: string | undefined };
                      name: { first: string; last: string };
                      login: {
                        username:
                        | boolean
                        | React.ReactChild
                        | React.ReactFragment
                        | React.ReactPortal
                        | null
                        | undefined;
                      };
                    },
                    idx: React.Key | null | undefined
                  ) => {
                    return (
                      <Box
                        key={idx}
                        component={Stack}
                        spacing={2}
                        direction="row"
                        my={1}
                      >
                        <Box>

                          <Avatar />

                        </Box>

                        <Stack>
                          <Typography
                            fontWeight="bold"
                            fontSize={13}
                            className={classes.overline}
                          >
                            {review?.name.first + " " + review.name.last}
                          </Typography>
                          <Typography
                            color="primary"
                            fontSize={14}
                            fontWeight="bold"
                            className={classes.name}
                          >
                            {review?.login.username}
                          </Typography>
                          <Typography
                            fontWeight="medium"
                            paragraph
                            color="text.secondary"
                            fontSize={14}
                            className={classes.name}
                          >
                            No hassle and no extra work apart from the contract
                            description. I will definitiely be looking to work
                            with him again!
                          </Typography>
                        </Stack>
                      </Box>
                    );
                  }
                )
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={3.8}>
          {renderPrimaryButtonState()}

          <Alert
            sx={{ border: "1px solid #eee" }}
            variant="standard"
            icon={false}
            className={classes.marginBottom}
          >
            <Typography fontSize={20} fontWeight="bold">
              Requirements
            </Typography>
            <Box>
              <ListItem>
                <ListItemText
                  primary={contractMetadata.contract_definition_of_done}
                  primaryTypographyProps={contractDetailsPrimaryTypographyProps}
                />
              </ListItem>
            </Box>
          </Alert>

          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Writing and Translation"
                    secondary={MARKET_ID_MAPPING[contractData["marketId"]]}
                    primaryTypographyProps={
                      contractDetailsPrimaryTypographyProps
                    }
                    secondaryTypographyProps={
                      contractDetailsSecondaryTypographyProps
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewContract;
