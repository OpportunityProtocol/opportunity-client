import React, { ReactNode, useEffect, useState } from "react";
import { useStyles } from "../modules/market/MarketStyles";
import {
  Container,
  Typography,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Button,
  Box,
  Stack,
  Alert,
  Paper,
  IconButton,
  Table,
  Chip,
} from "@mui/material";

import { withStyles } from '@mui/styles'
import ServiceCard from "../modules/contract/components/ServiceCard/ServiceCard";

import { NextPage } from "next";
import { QueryResult, useQuery } from "@apollo/client";
import {
  GET_ACTIVE_SERVICES_BY_CREATOR,
  GET_CONTRACTS,
  GET_CONTRACTS_BY_EMPLOYER,
  GET_CONTRACTS_BY_WORKER,
  GET_PURCHASED_SERVICES_BY_CLIENT,
  GET_SERVICES,
  GET_SERVICES_BY_CREATOR,
  GET_SERVICE_BY_ID,
} from "../modules/contract/ContractGQLQueries";
import { GET_MARKETS } from "../modules/market/MarketGQLQueries";
import { GET_VERIFIED_FREELANCERS } from "../modules/user/UserGQLQueries";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import SearchBarV1 from "../common/components/SearchBarV1/SearchBarV1";
import JobDisplay from "../modules/market/components/JobDisplay";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../modules/user/userReduxSlice";
import { KeyboardArrowDown, Refresh } from "@mui/icons-material";

const MuiTableHead = withStyles((theme) => ({
  root: {
    width: "100% !important",
    minWidth: "100% !important",
    backgroundColor: "#fff",
  },
}))(TableHead);

const TableHeaderCell = withStyles((theme) => ({
  root: {
    color: "black",
    fontSize: "12px !important",
    padding: "10px !important",
    fontWeight: "bold",
  },
}))(TableCell);

enum Persona {
  WORKING,
  HIRING
}

enum ContractsViewingPersona {
  ALL,
  CONTRACTS,
  SERVICES
}

const ExplorePage: NextPage = () => {
  const classes = useStyles();
  const [state, setState] = useState({
    persona: Persona.WORKING,
    workingJobs: [],
    hiringJobs: []
  });

  const [contractViewPersona, setContractViewPersona] = useState<any>(ContractsViewingPersona.ALL)

  const [verifiedFreelancers, setVerifiedFreelancers] = useState<Array<any>>(
    []
  );

  const userAddress = useSelector(selectUserAddress)

  const [services, setServices] = useState([]);
  const [featuredContracts, setFeaturedContracts] = useState<Array<any>>([]);

  const getServices: QueryResult = useQuery(GET_SERVICES);
  const contractsQuery: QueryResult = useQuery(GET_CONTRACTS);

  const verifiedFreelancersQuery: QueryResult = useQuery(
    GET_VERIFIED_FREELANCERS
  );

  const servicesByCreatorQuery: QueryResult = useQuery(
    GET_SERVICES_BY_CREATOR,
    {
      variables: {
        creator: userAddress,
      },
    }
  );

  const serviceQuery: QueryResult = useQuery(GET_SERVICE_BY_ID, {
    variables: {
      serviceId: -1,
    },
  });

  const purchasedServicesByClientQuery: QueryResult = useQuery(
    GET_PURCHASED_SERVICES_BY_CLIENT,
    {
      variables: {
        client: userAddress,
      },
    }
  );

  const contractsCreatedByEmployerQuery: QueryResult = useQuery(
    GET_CONTRACTS_BY_EMPLOYER,
    {
      variables: {
        employer: userAddress,
      },
    }
  );

  const activeServicesByCreatorQuery: QueryResult = useQuery(
    GET_ACTIVE_SERVICES_BY_CREATOR,
    {
      variables: {
        creator: userAddress,
      },
    }
  );

  const workingContractsQuery: QueryResult = useQuery(GET_CONTRACTS_BY_WORKER, {
    variables: {
      worker: userAddress,
    },
  });

  const onRefresh = (): void => {
    servicesByCreatorQuery.refetch();
    serviceQuery.refetch();
    purchasedServicesByClientQuery.refetch();
    activeServicesByCreatorQuery.refetch();
    contractsCreatedByEmployerQuery.refetch();
    workingContractsQuery.refetch();
  };

  const onChangePersona = (): void => {
    switch (state.persona) {
      case Persona.WORKING:
        activeServicesByCreatorQuery.refetch()
        workingContractsQuery.refetch()
        break;
      case Persona.HIRING:
        purchasedServicesByClientQuery.refetch()
        contractsCreatedByEmployerQuery.refetch()
        break;
      default:
    }
  }

  useEffect(() => {
    if (!contractsQuery.loading && contractsQuery.data) {
      setFeaturedContracts(contractsQuery.data.contracts);
    }
  }, [contractsQuery.loading]);

  useEffect(() => {
    if (!verifiedFreelancersQuery.loading && verifiedFreelancersQuery.data) {
      setVerifiedFreelancers(verifiedFreelancersQuery.data.verifiedUsers);
    }
  }, [verifiedFreelancersQuery.loading]);

  useEffect(() => {
    if (!getServices.loading && getServices.data) {
      setServices(getServices.data.services);
    }
  }, [getServices.loading]);

  //prepare explore page
  useEffect(() => {
    contractsQuery.refetch();
    verifiedFreelancersQuery.refetch();
    getServices.refetch();
  }, []);

  useEffect(() => {
    onChangePersona()
  }, [state.persona])

  //working
  useEffect(() => {
    async function syncActiveServices() {
      const activeServices = [];
      if (
        !activeServicesByCreatorQuery.loading &&
        activeServicesByCreatorQuery.data
      ) {
        for (
          let i = 0;
          i < activeServicesByCreatorQuery.data.purchasedServices.length;
          i++
        ) {
          activeServices[i] = {
            ...activeServices[i],
            purchaseData:
              activeServicesByCreatorQuery.data.purchasedServices[i],
          };

          await serviceQuery
            .refetch({
              serviceId:
                activeServicesByCreatorQuery.data.purchasedServices[i]
                  .serviceId,
            })
            .then((serviceData) => {
              activeServices[i] = {
                ...activeServices[i],
                serviceData: serviceData.data.service,
              };
            });
        }

        workingContractsData.push(...activeServices);
      }
    }

    const workingContractsData = []
    syncActiveServices();
    if (!workingContractsQuery.loading && workingContractsQuery.data) {
      workingContractsData.push(...workingContractsQuery.data.contracts);
    }

    console.log(workingContractsData)

    setState({
      ...state,
      workingJobs: workingContractsData
    })
  }, [activeServicesByCreatorQuery.loading, workingContractsQuery.loading]);

  //hiring
  useEffect(() => {
    async function syncPurchasedServices() {
      const purchasedServices = [];

      if (
        !purchasedServicesByClientQuery.loading &&
        purchasedServicesByClientQuery.data
      ) {
        for (
          let i = 0;
          i < purchasedServicesByClientQuery.data.purchasedServices.length;
          i++
        ) {
          purchasedServices[i] = {
            ...purchasedServices[i],
            purchaseData:
              purchasedServicesByClientQuery.data.purchasedServices[i],
          };

          await serviceQuery
            .refetch({
              serviceId:
                purchasedServicesByClientQuery.data.purchasedServices[i]
                  .serviceId,
            })
            .then((serviceData) => {
              purchasedServices[i] = {
                ...purchasedServices[i],
                serviceData: serviceData.data.service,
              };
            });
        }

        hiringJobsData.push(...purchasedServices);
      }
    }

    const hiringJobsData = []
    syncPurchasedServices();
    if (
      !contractsCreatedByEmployerQuery.loading &&
      contractsCreatedByEmployerQuery.data
    ) {
      hiringJobsData.push(...contractsCreatedByEmployerQuery.data.contracts);
    }

    setState({
      ...state,
      hiringJobs: hiringJobsData
    })

  }, [purchasedServicesByClientQuery.loading, contractsCreatedByEmployerQuery.loading]);

  const renderJobs = () => {
    let jobs: Array<any> = []
    switch (state.persona) {
      case Persona.HIRING:
        jobs = state.hiringJobs
        break;
      case Persona.WORKING:
        jobs = state.workingJobs
        break;
      default:
    }

    switch (contractViewPersona) {
      case ContractsViewingPersona.ALL:
        return jobs.map((item) => {
          return item?.__typename === 'Service' ? <ServiceCard id={item?.id} /> : <JobDisplay data={item} />
        })
      case ContractsViewingPersona.CONTRACTS:
        return jobs.filter((item) => item?.__typename == 'Contract').map((item) => {
          return <JobDisplay data={item} />
        })
      case ContractsViewingPersona.SERVICES:
        return jobs.filter((item) => item?.__typename == 'Service').map((item) => {
          return <ServiceCard id={item?.id} data={item?.serviceData} purchaseData={item?.purchaseData} />
        })
    }
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "100%",
        overflow: "scroll",
        padding: "0px 20px !important",
      }}
    >
     {/* <Box
        sx={{
          //mt: 12,
          width: "100%",
          height: 120,

          position: "relative",
        }}
      >
        <img
          src="/assets/images/project_management.jpg"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>*/}

      <Box
        sx={{

        //  mt: 3,
          width: "100%",
        }}
      >
        <Stack
        my={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
             <Typography
            fontWeight="bold"
            fontSize={24}
            color="rgba(33, 33, 33, .85)"
          >
            Work For You
          </Typography>


            <SearchBarV1 placeholder="Try website designer..." />
       
      


        </Stack>


        <Box my={2} mb={5} display='flex' alignItems='center' justifyContent='space-between'>
        <Stack spacing={1} direction="row" alignItems="center">
            <Chip
              variant='outlined'
              onClick={() => setContractViewPersona(ContractsViewingPersona.ALL)}
              sx={{
                fontSize: 12,
                fontWeight: "medium",
                border: '1px solid #ddd',
                color: contractViewPersona === ContractsViewingPersona.ALL ? "white" : "black",
                bgcolor: (theme) =>
                  contractViewPersona === ContractsViewingPersona.ALL
                    ? theme.palette.primary.dark
                    : "transparent",
              }}
              clickable
              label="All"
            />
            <Chip
              variant='outlined'
              onClick={() => setContractViewPersona(ContractsViewingPersona.CONTRACTS)}
              sx={{
                fontSize: 12,
                fontWeight: "medium",
                border: '1px solid #ddd',
                color:
                  contractViewPersona === ContractsViewingPersona.CONTRACTS ? "white" : "black",
                bgcolor: (theme) =>
                  contractViewPersona === ContractsViewingPersona.CONTRACTS
                    ? theme.palette.primary.dark
                    : "transparent",
              }}
              clickable
              label="Contracts"
            />
            <Chip
              variant='outlined'
              onClick={() => setContractViewPersona(ContractsViewingPersona.SERVICES)}
              sx={{
                fontSize: 12,
                fontWeight: "medium",
                border: '1px solid #ddd',
                color:
                  contractViewPersona === ContractsViewingPersona.SERVICES ? "white" : "black",
                bgcolor: (theme) =>
                  contractViewPersona === ContractsViewingPersona.SERVICES
                    ? theme.palette.primary.dark
                    : "transparent",
              }}
              clickable
              label="Services"
            />
          </Stack>


        <Stack  spacing={1} direction="row" alignItems="center">
            <Button sx={{ height: 25, borderRadius: 1 }} onClick={() => setState({ ...state, persona: Persona.WORKING })} size='small' variant={state.persona === Persona.WORKING ? 'contained' : 'outlined'}>
              Working
            </Button>
            <Button sx={{ height: 25, borderRadius: 1 }} onClick={() => setState({ ...state, persona: Persona.HIRING })}  size='small' variant={state.persona === Persona.HIRING ? 'contained' : 'outlined'}>
              Hiring For
            </Button>
            <IconButton size='small'>
              <Refresh fontSize='small' />
            </IconButton>
          </Stack>
        
         
        </Box>


        <Box sx={{ width: "100%", mb: 2 }}>
          <Table sx={{ width: "100%" }}>
            <MuiTableHead
              sx={{
                width: "100% !important",
                ".MuiTableHead-root": {
                  width: "100% !important",
                },
              }}
            >
              <TableRow
                component={Paper}
                variant="outlined"
                sx={{
                  width: "100%",
                  minWidth: "100% !important",
                  display: "flex",
                }}
              >
                <TableHeaderCell sx={{ width: 150, fontWeight: "bold" }}>
                  Type
                </TableHeaderCell>
                <TableHeaderCell
                  sx={{ width: "100% !important", fontWeight: "bold" }}
                >
                  Information
                </TableHeaderCell>
                <TableHeaderCell sx={{ width: 150, fontWeight: "bold" }}>
                  Payout
                </TableHeaderCell>
                <TableHeaderCell sx={{ width: 150, fontWeight: "bold" }}>
                  Status
                </TableHeaderCell>
                <TableHeaderCell sx={{ width: 150, fontWeight: "bold" }}>
                  Deadline
                </TableHeaderCell>
              </TableRow>
            </MuiTableHead>
          </Table>
        </Box>

    

        <Box sx={{}}>
          <Stack spacing={2}>
            {
              renderJobs()
            }
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default ExplorePage;
