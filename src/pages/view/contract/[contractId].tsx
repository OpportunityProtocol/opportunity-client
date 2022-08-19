import React, { useEffect, useState } from "react";
import {
  Container,
  CardContent,
  Card,
  Typography,
  Alert,
  AlertTitle,
  Grid,
  Stack,
  TablePagination,
  Avatar,
  ListItemIcon,
  Toolbar,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { useStyles } from "../../../modules/contract/ContractStyles";
import {
  FavoriteBorderOutlined,
} from "@mui/icons-material";

import JobDisplay from "../../../modules/market/components/JobDisplay";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";

import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_CONTRACT_BY_ID } from "../../../modules/contract/ContractGQLQueries";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { DAI_ADDRESS, NETWORK_MANAGER_ADDRESS } from "../../../constant";
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

const contractDetailsPrimaryTypographyProps = {
  fontSize: 14,
  fontWeight: "medium",
  color: "rgb(33, 33, 33, .85)",
};

const contractDetailsSecondaryTypographyProps = {
  color: "#808080",
  fontSize: 12,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/**
 *
 * @returns
 * @dev Temporarily addds increase allowance and assign worker buttons/functions here until message functionality is added
 * @dev TODO: Add modal for inputting accepted solution pointer
 */
const ViewContract: NextPage<any> = () => {
  const {
    data: { address, connector },
  } = useAccount();
  const router = useRouter();
  const { contractId } = router.query;

  const [contractData, setContractData] = useState<any>({});
  const [contractMetadata, setContractMetadata] = useState<any>({});
  const [metadataString, setMetadataString] = useState("");
  const [acceptedSolutionPtr, setAcceptedSolutionPtr] = useState<string>("");

  const classes = useStyles();
  const [reviews, setReviews] = useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const styles: ClassNameMap<GradientAvatarClassKey> = useGradientAvatarStyles({
    size: 50,
    gap: 3,
    thickness: 3,
    gapColor: "#f4f7fa",
    color: "linear-gradient(to bottom right, #feac5e, #c779d0, #4bc0c8)",
  });

  const networkManager_getContractData = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getContractData",
    {
      enabled: false,
      chainId: CHAIN_ID,
      args: [contractId],
      onSuccess: (data: Result) => {
        setMetadataString(data.taskMetadataPtr);
      },
      onError: (error) => {
        setMetadataString("");
      },
    }
  );

  const dai_approve = useContractWrite(
    {
      addressOrName: DAI_ADDRESS,
      contractInterface: DaiInterface,
    },
    "approve",
    {
      args: [NETWORK_MANAGER_ADDRESS, 100000],
    }
  );

  useEffect(() => {
    if (contractId) {
      networkManager_getContractData.refetch();
    }
  }, [contractId]);

  useEffect(() => {
    let retVal: any = {};

    async function getMetadata() {
      try {
        if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
          const ipfs = create({
            url: "/ip4/127.0.0.1/tcp/8080",
          });

          retVal = await ipfs.get(`/ipfs/${metadataString}`).next();
        } else {
          retVal = await fleek.getService(metadataString);
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

          setContractMetadata(parsedData);
        }
      } catch (error) {}
    }

    if (metadataString) {
      getMetadata();
    }
  }, [metadataString]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ContractOwnershipUpdate",
    async (event: Event) => {
      contractByIdQuery.refetch();
    }
  );

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ContractOwnershipUpdate",
    async (event: Event) => {
      contractByIdQuery.refetch();
    }
  );

  const networkManager_grantProposalRequest = useContractWrite(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "grantProposalRequest",
    {
      args: [contractId, "0xBA77D43eE401A4C4a229C3649CCeDBfE2B517208", 100],
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },
      onSettled(data, error, variables, context) {
        if (error) {
        } else {
          contractByIdQuery.refetch();
        }
      },
    }
  );

  const networkManager_releaseContract = useContractWrite(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "releaseContract",
    {
      args: [contractId],
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },
      onSettled(data, error, variables, context) {
        if (error) {
        } else {
          contractByIdQuery.refetch();
        }
      },
    }
  );

  const networkManager_resolveContract = useContractWrite(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "resolveContract",
    {
      args: [contractId, acceptedSolutionPtr],
      overrides: {
        gasLimit: ethers.BigNumber.from("2000000"),
        gasPrice: 90000000000,
      },
      onSettled(data, error, variables, context) {
        if (error) {
        } else {
          contractByIdQuery.refetch();
        }
      },
    }
  );

  const renderPrimaryButtonState = () => {
    if (
      String(address).toLowerCase() ==
      String(contractData?.employer).toLowerCase()
    ) {
      switch (contractData?.ownership) {
        case 0: //unclaimed
          return (
            <Stack>
              {/* Temporary until proposal functionality is implemented. This interaction will take place from message screen. */}
              <Stack direction="row" alignItems="center">
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mb: 2 }}
                  fullWidth
                  disableElevation
                  disableRipple
                  onClick={() => dai_approve.write()}
                >
                  Increase Allowance
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  sx={{ mb: 2 }}
                  fullWidth
                  disableElevation
                  disableRipple
                  onClick={() => networkManager_grantProposalRequest.write()}
                >
                  Assign worker
                </Button>
              </Stack>

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
            </Stack>
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
              onClick={() => networkManager_resolveContract.write()}
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
        <Button
          variant="contained"
          size="large"
          sx={{ mb: 2 }}
          fullWidth
          color="primary"
          disableElevation
          disableRipple
          onClick={() => {
            /* Open proposal modal */
          }}
        >
          Submit Proposal
        </Button>
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh" }}>
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


          <Card variant="outlined" className={classes.marginBottom}>
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
                <Typography variant="caption">
                  No reviews
                </Typography>
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
                          <div
                            style={{
                              margin: "5px 0px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                            className={styles.root}
                          >
                            <Avatar />
                          </div>
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
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            className={classes.marginBottom}
          >
            <Button
              variant="outlined"
              size="large"
              fullWidth
              endIcon={<FavoriteBorderOutlined fontSize="small" />}
            >
              Save Contract
            </Button>

          </Stack>

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
