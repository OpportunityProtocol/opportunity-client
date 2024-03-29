import React, { ReactNode, SetStateAction, useEffect, useState } from "react";
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
  Alert,
  Paper,
  IconButton,
  Table,
  Stack,
  Chip,
  Divider,
  List,
  Grid,
} from "@mui/material";

import { withStyles } from "@mui/styles";
import ServiceCard from "../modules/contract/components/ServiceCard/ServiceCard";

import { NextPage } from "next";
import { ApolloQueryResult, QueryResult, useQuery } from "@apollo/client";
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
import { GET_MARKETS, GET_MARKET_DETAILS_BY_ID } from "../modules/market/MarketGQLQueries";
import { GET_VERIFIED_FREELANCERS } from "../modules/user/UserGQLQueries";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import SearchBarV1 from "../common/components/SearchBarV1/SearchBarV1";
import JobDisplay from "../modules/market/components/JobDisplay";
import { useSelector } from "react-redux";
import { selectUserAddress } from "../modules/user/userReduxSlice";
import {
  KeyboardArrowDown,
  Refresh,
  TableRows,
  ViewModule,
} from "@mui/icons-material";
import fleek from "../fleek";

enum Persona {
  CATALOG,
  WORKING,
  HIRING,
}

enum ContractsViewingPersona {
  CONTRACTS,
  SERVICES,
}

const ExplorePage: NextPage = () => {
  const [state, setState] = useState({
    persona: Persona.WORKING,
    workingJobs: [],
    hiringJobs: [],
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contractWorking, setContractsWorking] = useState<Array<any>>([]);
  const [servicesWorking, setServicesWorking] = useState<Array<any>>([]);
  const [contractsHiring, setContractsHiring] = useState<Array<any>>([]);
  const [servicesHired, setServicesHired] = useState<Array<any>>([]);
  const [createdServices, setCreatedServices] = useState<Array<any>>([]);
  const [contractViewPersona, setContractViewPersona] = useState<any>(
    ContractsViewingPersona.CONTRACTS
  );
  const userAddress = useSelector(selectUserAddress);

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

  const loadAndSetContracts = async (
    contracts: Array<any>,
    setStateFunction: SetStateAction<any>
  ): Promise<void> => {
    let contractMetadata: any = {};
    const updatedContracts = [];

    for (const contractData of contracts) {
      contractMetadata = await fleek.getContract(
        String(contractData?.metadata).slice(13)
      );

      updatedContracts.push({
        ...contractData,
        ...contractMetadata,
      });
    }

    setStateFunction(updatedContracts);
  };

  const onLoadContractsCreatedByEmployer = () =>
    contractsCreatedByEmployerQuery
      .refetch()
      .then((result: ApolloQueryResult<any>) =>
        loadAndSetContracts(result.data?.contracts, setContractsHiring)
      )
      .catch((err) => alert(err));

  const onLoadContractsWorking = () =>
    workingContractsQuery
      .refetch()
      .then((result: ApolloQueryResult<any>) =>
        loadAndSetContracts(result.data?.contracts, setContractsWorking)
      )
      .catch((err) => alert(err));

  const onRefreshContracts = () => {
      onLoadContractsCreatedByEmployer();
      onLoadContractsWorking();
  }

  const onRefreshServices = () => {
    servicesByCreatorQuery.refetch();
    serviceQuery.refetch();
    purchasedServicesByClientQuery.refetch();
    activeServicesByCreatorQuery.refetch();
  }

  const onRefresh = () => {
    if (contractViewPersona === ContractsViewingPersona.CONTRACTS) {
    onRefreshContracts()
    }

    if (contractViewPersona === ContractsViewingPersona.SERVICES) {
      onRefreshServices()
    }
  };

  const onChangePersona = () => {
    switch (state.persona) {
      case Persona.WORKING:
        if (contractViewPersona == ContractsViewingPersona.CONTRACTS) {
          workingContractsQuery.refetch();
        } else {
          activeServicesByCreatorQuery.refetch();
        }
        break;
      case Persona.HIRING:
        if (contractViewPersona == ContractsViewingPersona.CONTRACTS) {
          contractsCreatedByEmployerQuery.refetch();
        } else {
          purchasedServicesByClientQuery.refetch();
        }
        break;
      default:
    }
  };

  useEffect(() => {
    onChangePersona();
  }, [state.persona]);

  //working
  useEffect(() => {
    const syncActiveServices = async ()=> {
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
            .then(async (serviceData) => {
              let marketDetails = {}

              const serviceMetadata = await fleek.getService(
                String(serviceData.data.service?.metadataPtr).slice(13)
              );

              await marketDetailsQuery.refetch({ marketId: serviceData?.data.service.marketId }).then((result: ApolloQueryResult<any>) => {
                marketDetails = result.data?.markets[0]
              })

              activeServices[i] = {
                ...activeServices[i],
                serviceData: {
                  ...serviceData.data.service,
                  ...serviceMetadata,
                  marketDetails
                },
              };
            });
        }

        setServicesWorking([...activeServices]);
      }
    }

    syncActiveServices();
  }, [activeServicesByCreatorQuery.loading]);

  //hiring
  useEffect(() => {
    const syncPurchasedServices = async () => {
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
            .then(async (serviceData) => {
              let marketDetails = {}

              const serviceMetadata = await fleek.getService(
                String(serviceData.data.service?.metadataPtr).slice(13)
              );

              await marketDetailsQuery.refetch({ marketId: serviceData?.data.service.marketId }).then((result: ApolloQueryResult<any>) => {
                marketDetails = result.data?.markets[0]
              })

              purchasedServices[i] = {
                ...purchasedServices[i],
                serviceData: {
                  ...serviceData.data.service,
                  ...serviceMetadata,
                  marketDetails
                },
              };
            });
        }

        setServicesHired([...purchasedServices]);
      }
    }

    syncPurchasedServices();
  }, [purchasedServicesByClientQuery.loading]);

  const marketDetailsQuery: QueryResult = useQuery(GET_MARKET_DETAILS_BY_ID, {
    skip: true,
    variables: {
      marketId: -1
    }
  })

  useEffect(() => {
    if (!servicesByCreatorQuery.loading && servicesByCreatorQuery.data) {
      async function loadCreatedServices() {
        const services = servicesByCreatorQuery.data.services;
        let serviceMetadata = {};
        let displayedServicesData = [];
        let marketDetails = {}

        if (services) {
          for (const serviceData of services) {
            serviceMetadata = await fleek.getService(
              String(serviceData?.metadataPtr).slice(13)
            );

        
            await marketDetailsQuery.refetch({ marketId: serviceData?.marketId }).then((result: ApolloQueryResult<any>) => {
              marketDetails = result.data?.markets[0]
            })

            displayedServicesData.push({
              ...serviceData,
              ...serviceMetadata,
              marketDetails
            });
          }
        } else {
          displayedServicesData = []
        }

        setCreatedServices(displayedServicesData);
      }

      loadCreatedServices();
    }
  }, [servicesByCreatorQuery.loading]);

  useEffect(() => {
    onRefresh();
  }, []);

  const renderContracts = () => {
    switch (state.persona) {
      case Persona.HIRING:
        return contractsHiring?.length > 0 ? (
          searchQuery !== "" ? (
            contractsHiring
              .filter((contract) =>
                String(contract.contract_title).includes(searchQuery)
              )
              .map((item) => {
                return (
                  <Grid item xs={4}>
                    <JobDisplay data={item} />
                  </Grid>
                );
              })
          ) : (
            contractsHiring.map((item) => {
              return (
                <Grid item xs={4}>
                  <JobDisplay data={item} />
                </Grid>
              );
            })
          )
        ) : (
          <Typography p={2} color="text.secondary">
            Sorry, no results found.
          </Typography>
        );
      case Persona.WORKING:
        return contractWorking?.length > 0 ? (
          searchQuery !== "" ? (
            contractWorking
              .filter((contract) =>
                String(contract.contract_title).includes(searchQuery)
              )
              .map((item) => {
                return (
                  <Grid item xs={4}>
                    <JobDisplay data={item} />
                  </Grid>
                );
              })
          ) : (
            contractWorking.map((item) => {
              return (
                <Grid item xs={4}>
                  <JobDisplay data={item} />
                </Grid>
              );
            })
          )
        ) : (
          <Typography p={2} color="text.secondary">
            Sorry, no results found.
          </Typography>
        );
      case Persona.CATALOG: //services only but for now render hiring and change contract option to hiring
        setState({
          ...state,
          persona: Persona.HIRING,
        });

        return contractsHiring?.length > 0 ? (
          searchQuery !== "" ? (
            contractsHiring
              .filter((contract) =>
                String(contract.contract_title).includes(searchQuery)
              )
              .map((item) => {
                return (
                  <Grid item xs={4}>
                    <JobDisplay data={item} />
                  </Grid>
                );
              })
          ) : (
            contractsHiring.map((item) => {
              return (
                <Grid item xs={4}>
                  <JobDisplay data={item} />
                </Grid>
              );
            })
          )
        ) : (
          <Typography p={2} color="text.secondary">
            Sorry, no results found.
          </Typography>
        );
      default:
    }
  };

  const renderServices = () => {
    switch (state.persona) {
      case Persona.HIRING:
        return servicesHired?.length > 0 ? (
          searchQuery !== "" ? (
            servicesHired
              .filter((service) =>
                String(service.serviceTitle).includes(searchQuery)
              )
              .map((item) => {
                return (
                  <Grid item minWidth='350px'>
                    <ServiceCard
                      service={item?.serviceData}
                      purchase
                      purchaseData={item?.purchaseData}
                    />
                  </Grid>
                );
              })
          ) : (
            servicesHired.map((item) => {
              return (
                <Grid item minWidth='350px'>
                  <ServiceCard
                    service={item?.serviceData}
                    purchase
                    purchaseData={item?.purchaseData}
                  />
                </Grid>
              );
            })
          )
        ) : (
          <Typography p={2} color="text.secondary">
            Sorry, no results found.
          </Typography>
        );
      case Persona.WORKING:
        return servicesWorking?.length > 0 ? (
          searchQuery !== "" ? (
            servicesWorking
              .filter((service) =>
                String(service.serviceTitle).includes(searchQuery)
              )
              .map((item) => {
                return (
                  <Grid item xs={4}>
                    <ServiceCard
                      service={item?.serviceData}
                      purchase
                      purchaseData={item?.purchaseData}
                    />
                  </Grid>
                );
              })
          ) : (
            servicesWorking.map((item) => {
              return (
                <Grid item xs={4}>
                  <ServiceCard
                    service={item?.serviceData}
                    purchase
                    purchaseData={item?.purchaseData}
                  />
                </Grid>
              );
            })
          )
        ) : (
          <Typography p={2} color="text.secondary">
            Sorry, no results found.
          </Typography>
        );
      case Persona.CATALOG:
        return createdServices?.length > 0 ? (
          searchQuery !== "" ? (
            createdServices
              .filter((service) =>
                String(service.serviceTitle).includes(searchQuery)
              )
              .map((item) => {
                return (
                  <Grid item xs={4}>
                    <ServiceCard
                      service={item?.serviceData}
                      purchase
                      purchaseData={item?.purchaseData}
                    />
                  </Grid>
                );
              })
          ) : (
            createdServices.map((item) => {
              return (
                <Grid item xs={4}>
                  <ServiceCard service={item} />
                </Grid>
              );
            })
          )
        ) : (
          <Typography p={2} color="text.secondary">
            Sorry, no results found.
          </Typography>
        );
      default:
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        overflow: "scroll",
        paddingLeft: "0px",
        paddingRight: "0px",
        paddingBottom: "15px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 220,
          px: 2.5,
        }}
      >
        <img
          src="/assets/images/project_management.jpg"
          style={{
            textAlign: "center",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Box
        sx={{
          height: "100%",
          //  mt: 3,
          width: "100%",
        }}
      >
        <Box sx={{ py: 2 }}>
          <Container maxWidth="lg" sx={{ width: "100%", my: 2, px: 5 }}>
            <Stack
              my={2}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography fontWeight="600" fontSize={24}>
                  Work Dashboard
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  The home for asynchronous work between users and DAOs
                </Typography>
              </Box>
            </Stack>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack spacing={1} direction="row" alignItems="center">
                <Chip
                  variant="outlined"
                  onClick={() =>
                    setContractViewPersona(ContractsViewingPersona.CONTRACTS)
                  }
                  sx={{
                    fontSize: 12,
                    fontWeight: "medium",
                    border: "1px solid #ddd",
                    color:
                      contractViewPersona === ContractsViewingPersona.CONTRACTS
                        ? "white"
                        : "black",
                    bgcolor: (theme) =>
                      contractViewPersona === ContractsViewingPersona.CONTRACTS
                        ? theme.palette.primary.dark
                        : "transparent",
                  }}
                  clickable
                  label="Contracts"
                />
                <Chip
                  variant="outlined"
                  onClick={() =>
                    setContractViewPersona(ContractsViewingPersona.SERVICES)
                  }
                  sx={{
                    fontSize: 12,
                    fontWeight: "medium",
                    border: "1px solid #ddd",
                    color:
                      contractViewPersona === ContractsViewingPersona.SERVICES
                        ? "white"
                        : "black",
                    bgcolor: (theme) =>
                      contractViewPersona === ContractsViewingPersona.SERVICES
                        ? theme.palette.primary.dark
                        : "transparent",
                  }}
                  clickable
                  label="Services"
                />
              </Stack>

              <Stack spacing={1} direction="row" alignItems="center">
                <Button
                  sx={{ height: 25, borderRadius: 1 }}
                  onClick={() =>
                    setState({ ...state, persona: Persona.WORKING })
                  }
                  size="small"
                  variant={
                    state.persona === Persona.WORKING ? "contained" : "outlined"
                  }
                >
                  Working
                </Button>
                <Button
                  sx={{ height: 25, borderRadius: 1 }}
                  onClick={() =>
                    setState({ ...state, persona: Persona.HIRING })
                  }
                  size="small"
                  variant={
                    state.persona === Persona.HIRING ? "contained" : "outlined"
                  }
                >
                  Hiring
                </Button>
                {contractViewPersona == ContractsViewingPersona.SERVICES && (
                  <Button
                    sx={{ height: 25, borderRadius: 1 }}
                    onClick={() =>
                      setState({ ...state, persona: Persona.CATALOG })
                    }
                    size="small"
                    variant={
                      state.persona === Persona.CATALOG
                        ? "contained"
                        : "outlined"
                    }
                  >
                    My Catalog
                  </Button>
                )}
              </Stack>
            </Box>
          </Container>
        </Box>
        <Divider />
        <Container maxWidth="lg" sx={{ height: "100%", width: "100%" }}>
          <Box
            my={2}
            mb={5}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontWeight="bold">Your incoming gigs</Typography>

            <Stack spacing={2} direction="row" alignItems="flex-start">
              <SearchBarV1
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <IconButton size="medium" onClick={onRefresh}>
                <Refresh fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          <Grid container wrap="nowrap" direction="row" spacing={2}>
            {contractViewPersona === ContractsViewingPersona.CONTRACTS
              ? renderContracts()
              : renderServices()}
          </Grid>
        </Container>
      </Box>
    </Container>
  );
};

export default ExplorePage;
