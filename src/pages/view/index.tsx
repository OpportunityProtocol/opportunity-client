import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  Divider,
  Container,
  ListItemText,
  Grid,
  Tabs,
  Tab,
  Pagination,
  Button,
  ListItemIcon,
  Typography,
} from "@mui/material";

import { useStyles } from "../../modules/contract/ContractStyles";

import JobDisplay from "../../modules/market/components/JobDisplay";
import BountySubmission from "../../modules/market/components/BountySubmission/BountySubmission";
import { FileUploader } from "react-drag-drop-files";
import TabPanel from "../../common/components/TabPanel/TabPanel";

import SearchBarV2 from "../../common/components/SearchBarV2/SearchBarV2";
import ServiceCard from "../../modules/contract/components/ServiceCard/ServiceCard";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLens,
  selectUserAddress,
  selectVerificationStatus,
} from "../../modules/user/userReduxSlice";
import {
  useContract,
  useContractEvent,
  useContractRead,
  useSigner,
} from "wagmi";
import { NETWORK_MANAGER_ADDRESS, ZERO_ADDRESS } from "../../constant";
import { NetworkManagerInterface } from "../../abis";
import { ethers, Event } from "ethers";

import {
  RelationshipStruct,
  ServiceStruct,
} from "../../typechain-types/NetworkManager";
import { hexToDecimal } from "../../common/helper";
import { QueryResult, useQuery } from "@apollo/client";
import {
  GET_CONTRACTS_BY_EMPLOYER,
  GET_PURCHASED_SERVICES_BY_CLIENT,
  GET_SERVICE_BY_ID,
  GET_SERVICES,
  GET_SERVICES_BY_CREATOR,
  GET_ACTIVE_SERVICES_BY_CREATOR,
  GET_CONTRACTS_BY_WORKER,
} from "../../modules/contract/ContractGQLQueries";
import { NextPage } from "next";

/**
 * Contracts
 * View all contracts and services
 * @returns
 */
const Contracts: NextPage<any> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data: signer, isError, isLoading } = useSigner();

  const [tabValue, setTabValue] = React.useState<number>(0);
  const userAddress = useSelector(selectUserAddress);
  const userLensProfileInformation = useSelector(selectLens);
  const userVerificationStatus = useSelector(selectVerificationStatus);

  // published services
  const [publishedServices, setPublishedServices] = useState<any>([]);
  const [purchasedServices, setPurchasedServices] = useState<any>([]);
  const [userActiveServices, setUserActiveServices] = useState<any>([]);
  const [publishedContracts, setPublishedContracts] = useState<
    Array<RelationshipStruct>
  >([]);
  const [workingContracts, setWorkingContracts] = useState<Array<any>>([]);

  const servicesByCreatorQuery: QueryResult = useQuery(GET_SERVICES_BY_CREATOR, {
    variables: {
      creator: userAddress
    }
  });

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

  const activeServicesByCreatorQuery: QueryResult = useQuery(
    GET_ACTIVE_SERVICES_BY_CREATOR,
    {
      variables: {
        creator: userAddress,
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

  const workingContractsQuery: QueryResult = useQuery(GET_CONTRACTS_BY_WORKER, {
    variables: {
      worker: userAddress,
    },
  });

  useEffect(() => {
    if (!servicesByCreatorQuery.loading && servicesByCreatorQuery.data) {
      setPublishedServices(servicesByCreatorQuery.data.services);
    }
  }, [userAddress, servicesByCreatorQuery.loading]);

  useEffect(() => {
    let purchasedServices = [];

    async function syncPurchasedServices() {
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

        setPurchasedServices(purchasedServices);
      }
    }

    syncPurchasedServices();
  }, [purchasedServicesByClientQuery.loading]);

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
            purchaseData: activeServicesByCreatorQuery.data.purchasedServices[i],
          };

          await serviceQuery
            .refetch({
              serviceId:
                activeServicesByCreatorQuery.data.purchasedServices[i].serviceId,
            })
            .then((serviceData) => {
              activeServices[i] = {
                ...activeServices[i],
                serviceData: serviceData.data.service,
              };
            });
        }

        setUserActiveServices(activeServices);
      }
    }

    syncActiveServices();
  }, [activeServicesByCreatorQuery.loading]);

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface
    },
    "ServicePurchased",
    async (event: Event) => {
       //TODO: Only refresh if the id of the services coincides with the id of one by the client or creator
      purchasedServicesByClientQuery.refetch()
      activeServicesByCreatorQuery.refetch()
    }
  )

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ServiceResolved",
    async (event: Event) => {
      //TODO: Only refresh if the id of the services coincides with the id of one by the client or creator
      purchasedServicesByClientQuery.refetch();
      activeServicesByCreatorQuery.refetch();
    }
  );

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ServiceCreated",
    async (event: Event) => {
      //TODO: Only refresh if the id of the services coincides with the id of one by the client or creator
      servicesByCreatorQuery.refetch()
    }
  );

  useEffect(() => {
    if (
      !contractsCreatedByEmployerQuery.loading &&
      contractsCreatedByEmployerQuery.data
    ) {
      setPublishedContracts(contractsCreatedByEmployerQuery.data.contracts);
    }
  }, [contractsCreatedByEmployerQuery.loading]);

  useEffect(() => {
    if (!workingContractsQuery.loading && workingContractsQuery.data) {
      setWorkingContracts(workingContractsQuery.data.contracts);
    }
  }, [workingContractsQuery.loading]);

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ContractOwnershipUpdate",
    async (event: Event) => {
      const contractId = event[0];
      const marketId = event[1];
      const ownership = event[2];
      const employer = event[3];
      const worker = event[4];

      if (userAddress === employer) {
        //update contract in redux for user under contracts created
        contractsCreatedByEmployerQuery.refetch();
      }

      if (userAddress === worker) {
        //update contracts in redux for user under contracts working
        workingContractsQuery.refetch();
      }
    }
  );

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ContractCreated",
    async (event: Event) => {
      const creator = event[0];
      const marketId = event[1];
      const metadataPtr = event[2];

      if (userAddress === creator) {
        contractsCreatedByEmployerQuery.refetch();
      }
    }
  );

  const handleOnChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }

  return (
    <Container maxWidth="lg" sx={{ height: "100vh" }}>
      <Typography pl={1} fontSize={25} fontWeight="medium">
        Contracts
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ width: "100%", mt: 1, mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleOnChangeTab}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              value={0}
              label="Published Services"/>
            <Tab value={1} label="Services Purchased" />
            <Tab value={2} label="Services Working" />
            <Tab value={3} label="Published Contracts" />
            <Tab value={4} label="Contract Working" />
          </Tabs>
          <Divider sx={{ borderBottom: "1px solid #ddd" }} />
        </Box>
        <TabPanel index={0} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {publishedServices.map((service: ServiceStruct, idx: number) => {
                return (
                     <Grid item xs={4} key={service.id}>
                  <ServiceCard id={Number(service.id)} data={service} />
                </Grid>
                )
              })}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={1} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {purchasedServices.map((service: any, idx: number) => (
                <Grid item xs={4} key={service.id}>
                  <ServiceCard
                    id={service.serviceData.id}
                    purchase
                    data={service?.serviceData}
                    purchaseData={service?.purchaseData}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={2} value={tabValue}>
          <Box>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {userActiveServices.map((service: any, idx: number) => (
                <Grid item xs={4} key={service.id}>
                  <ServiceCard
                    purchase
                    id={Number(service["serviceData"].id)}
                    data={service["serviceData"]}
                    purchaseData={service["purchaseData"]}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={3} value={tabValue}>
          <Box>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {publishedContracts.map((contract: any, idx: number) => (
                <Grid item xs={4} key={contract.id}>
                  <JobDisplay data={contract} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={4} value={tabValue}>
          <Box>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {workingContracts.map((contract: any, idx: number) => (
                <Grid item xs={4} key={contract.id}>
                  <JobDisplay data={contract} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>
        <Divider />
      </Box>
    </Container>
  );
};

export default Contracts;
