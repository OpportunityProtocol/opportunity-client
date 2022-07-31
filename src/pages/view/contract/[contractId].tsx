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
  ContentCopy,
  Email,
  EmailOutlined,
  Favorite,
  FavoriteBorderOutlined,
} from "@mui/icons-material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import clsx from "clsx";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import { timelineButtons } from "../../../modules/market/MarketConstants";
import JobDisplay from "../../../modules/market/components/JobDisplay";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
import moment from "moment";
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
const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function createData(action: string, user: string, timestamp: string) {
  return { action, user, timestamp };
}

const rows = [
  /* createData('Created', '@janicecoleman007', moment().format('LL').toString()),
  createData(
    'Assigned',
    '@janicecoleman007',
    moment().add(2, 'days').add(4, 'hours').format('LL').toString()
  ),
  createData(
    'Accepted',
    '@iwriteforfun12',
    moment().add(2, 'days').add(6, 'hours').format('LL').toString()
  ),*/
];

const TableToolbar = () => {
  return (
    <Toolbar>
      <Typography
        color="rgb(33, 33, 33, .85)"
        fontWeight="medium"
        variant="h6"
        id="contract-history-table-title"
        component="div"
      >
        Contract History
      </Typography>
    </Toolbar>
  );
};

const contractDetailsPrimaryTypographyProps = {
  fontSize: 14,
  fontWeight: "medium",
  color: "rgb(33, 33, 33, .85)",
};

const contractDetailsSecondaryTypographyProps = {
  color: "#808080",
  fontSize: 12,
};

const isService = false;

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
            <TableToolbar />
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography
                        fontWeight="bold"
                        fontSize={15}
                        color="rgba(33, 33, 33, .85)"
                      >
                        Status
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontWeight="bold"
                        fontSize={15}
                        color="rgba(33, 33, 33, .85)"
                      >
                        User
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        fontWeight="bold"
                        fontSize={15}
                        color="rgba(33, 33, 33, .85)"
                      >
                        Timestamp
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.action}>
                      <TableCell component="th" scope="row">
                        <Typography fontWeight="medium" fontSize={14}>
                          {row.action}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          color="primary"
                          fontWeight="medium"
                          variant="body2"
                        >
                          {row.user}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="text.secondary" variant="body2">
                          {row.timestamp}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>

          <Card variant="outlined" className={classes.marginBottom}>
            <CardContent>
              <Typography
                pb={2}
                fontWeight="medium"
                fontSize={20}
                color="rgba(33, 33, 33, .85)"
              >
                Reviews for this user
              </Typography>
              {reviews.length === 0 ? (
                <Typography variant="caption">
                  No reviews has been written for this employer
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

            <Button
              variant="outlined"
              size="large"
              fullWidth
              endIcon={<EmailOutlined />}
            >
              Refer a friend
            </Button>
          </Stack>

          <Alert
            sx={{ border: "1px solid #eee" }}
            variant="standard"
            icon={false}
            className={classes.marginBottom}
          >
            <Typography fontSize={20} fontWeight="bold">
              Completion Details
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
              <Typography
                fontSize={20}
                fontWeight="medium"
                color="rgba(33, 33, 33, .85)"
              >
                Metadata
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Market Name"
                    secondary={MARKET_ID_MAPPING[contractData["marketId"]]}
                    primaryTypographyProps={
                      contractDetailsPrimaryTypographyProps
                    }
                    secondaryTypographyProps={
                      contractDetailsSecondaryTypographyProps
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Metadata"
                    secondary={String(metadataString)}
                    primaryTypographyProps={
                      contractDetailsPrimaryTypographyProps
                    }
                    secondaryTypographyProps={{
                      color: "#808080",
                      fontSize: 12,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  />
                  <ListItemIcon>
                    <IconButton>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </ListItemIcon>
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
