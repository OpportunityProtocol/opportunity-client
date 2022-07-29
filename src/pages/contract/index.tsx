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

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";

import { useStyles } from "../../modules/contract/ContractStyles";
import {
  Attachment,
  ContentCopy,
  FilterList,
  MoreVert,
  Send,
} from "@mui/icons-material";
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
import { Interface } from "ethers/lib/utils";
import { CHAIN_ID } from "../../constant/provider";
import {
  activePublishedServiceDataAdded,
  activePublishedServiceIdAdded,
  contractServiceDataAdded,
  contractServiceIdAdded,
  purchasedServiceDataAdded,
  purchasedServiceIdAdded,
  selectActiveContractIds,
  selectActiveContracts,
  selectActivePublishedServiceIds,
  selectActivePublishedServices,
  selectPublishedContracts,
  selectPublishedServiceIds,
  selectPublishedServices,
  selectPublishedServicesIdMapping,
  selectPurchasedService,
  selectPurchasedServiceIds,
  selectPurchasedServices,
  selectPurchasedServicesIdMapping,
} from "../../modules/contract/contractReduxSlice";
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
} from "../../modules/contract/ContractGQLQueries";

const fileTypes = ["PDF", "PNG", "DOC"];

const resources = [1, 2, 3, 4, 5, 6, 4];

/**
 * For now this is the all out page for viewing contracts
 * All users who message anyone or submit a proposal will happen here.  The only way you won't be able to access is if the job i claimed.. because you won't be able to click job card anywat
 * @returns
 */
const Contracts: React.FunctionComponent<any> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [conversationSelected, setConversationSelected] =
    useState<boolean>(true);

  const [tabValue, setTabValue] = React.useState<number>(0);

  const userAddress = useSelector(selectUserAddress);
  const userLensProfileInformation = useSelector(selectLens);
  const userVerificationStatus = useSelector(selectVerificationStatus);
  const userPurchasedServices = useSelector(selectPurchasedServices);
  const userActivePublishedServices = useSelector(
    selectActivePublishedServices
  );

  const [servicePurchasedToggle, setServicePurchasedToggle] = useState(false);
  const [servicePublishedToggle, setServicePublishedToggle] = useState(false);
  const handleOnChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const publishedServiceIds: Array<number> = useSelector(
    selectPublishedServiceIds
  );
  const purchasedServiceIds: Array<number> = useSelector(
    selectPurchasedServiceIds
  );

  const activePublishedServiceIds: Array<number> = useSelector(
    selectActivePublishedServiceIds
  );

  const publishedContractIds: Array<number> = useSelector(
    selectPublishedServiceIds
  );

  const activeContractIds: Array<number> = useSelector(selectActiveContractIds);

  const userPurchasedServicesMapping = useSelector(
    selectPurchasedServicesIdMapping
  );
  const userActivePublishedServicesMapping = useSelector(
    selectPurchasedServicesIdMapping
  );

  const { data: signer, isError, isLoading } = useSigner();

  const networkManagerContract = useContract({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    signerOrProvider: signer,
  });

  // published services
  const [publishedServices, setPublishedServices] = useState<any>([]);
  const servicesByCreatorQuery: QueryResult = useQuery(GET_SERVICES_BY_CREATOR);
  useEffect(() => {
    if (!servicesByCreatorQuery.loading && servicesByCreatorQuery.data) {
      setPublishedServices(servicesByCreatorQuery.data.services);
    }
  }, [userAddress, servicesByCreatorQuery.loading]);

  //purchased services
  const [purchasedServices, setPurchasedServices] = useState<any>([]);
  const serviceQuery: QueryResult = useQuery(GET_SERVICE_BY_ID, {
    variables: {
      serviceId: -1
    }
  });

  const purchasedServicesByClientQuery: QueryResult = useQuery(
    GET_PURCHASED_SERVICES_BY_CLIENT,
    {
      variables: {
        client: userAddress,
      },
    }
  );

  useEffect(() => {
    let data = [];
    console.log(purchasedServicesByClientQuery)

    if (
      !purchasedServicesByClientQuery.loading &&
      purchasedServicesByClientQuery.data
    ) {
      for (
        let i = 0;
        i < purchasedServicesByClientQuery.data.purchasedServices.length;
        i++
      ) {
        data[i] = {
          ...data[i],
          purchaseData: purchasedServicesByClientQuery.data.purchasedServices[i]
        }

        serviceQuery.refetch({
          serviceId: purchasedServicesByClientQuery.data.purchasedServices[i].serviceId,
        });
        console.log(serviceQuery)
        if (serviceQuery.data) {
          data[i] = {
            ...data[i],
            serviceData: serviceQuery.data.service
          }
        }
      }
  }

    //console.log("HEEEEEEREEEE")
    console.log(data)
    setPurchasedServices(data);
  }, [purchasedServicesByClientQuery.loading]);

  //TODO: ServiceResolved

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ServiceResolved",
    async (event: Event) => {
      const serviceOwner = event[0];
      const serviceClient = event[1];
      const purchaseId = event[2];
      const serviceId = event[3];
      const amount = event[4];

      if (userAddress === serviceClient) {
        dispatch(
          purchasedServiceDataAdded({
            ...userPurchasedServicesMapping[serviceId],
            status: 2,
          })
        );
      }

      if (userAddress === serviceOwner) {
        dispatch(
          activePublishedServiceDataAdded({
            ...userActivePublishedServicesMapping[serviceId],
            status: 2,
          })
        );
      }
    }
  );

  const [publishedContracts, setPublishedContracts] = useState<
    Array<RelationshipStruct>
  >([]);
  const contractsCreatedByEmployerQuery = useQuery(GET_CONTRACTS_BY_EMPLOYER, {
    variables: {
      employer: userAddress,
    },
  });

  //TODO: Contract Updated

  useEffect(() => {
    if (
      userAddress != ZERO_ADDRESS &&
      userAddress &&
      !contractsCreatedByEmployerQuery.loading &&
      contractsCreatedByEmployerQuery.data
    ) {
      setPublishedContracts(contractsCreatedByEmployerQuery.data.contracts);
    }
  }, [userAddress, contractsCreatedByEmployerQuery.loading]);

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
      }

      if (userAddress === worker) {
        //update contracts in redux for user under contracts working
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
      const creator = event[0]
      const marketId = event[1]
      const metadataPtr = event[2]

      if (userAddress === creator) {
        //dispatch into contracts created
      }
    }
  );

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ContractOwnershipUpdate",
    async (event: Event) => {
      const contractId = event[0]
      const marketId = event[1]
      const ownership = event[2]
      const employer = event[3]
      const worker = event[4]


      if (userAddress === employer) {
        //update contract in redux for user under contracts created
      }

      if (userAddress === worker) {
        //update contracts in redux for user under contracts working
      }
    }
  );


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
              label="Published Services"
              disabled={
                (!userVerificationStatus &&
                  !userLensProfileInformation.profileId) ||
                userLensProfileInformation.profileId === 0
              }
            />
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
              {publishedServices.map((service: ServiceStruct, idx: number) => (
                <Grid item xs={3} key={service.id}>
                  <ServiceCard id={Number(service.id)} data={service} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={1} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {purchasedServices.map((service: ServiceStruct, idx: number) => (
                <Grid item xs={3} key={service.id}>
                  <ServiceCard purchase data={service} />
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
              {userActivePublishedServices.map(
                (service: ServiceStruct, idx: number) => (
                  <Grid item xs={3} key={service.id}>
                    <ServiceCard
                      purchase
                      id={Number(service.id)}
                      data={service}
                    />
                  </Grid>
                )
              )}
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
              {publishedContracts.map(
                (contract: RelationshipStruct, idx: number) => (
                  <Grid item xs={3} key={contract.id}>
                    <JobDisplay data={contract} />
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        </TabPanel>
        <Divider />
      </Box>
    </Container>
  );
};

export default Contracts;
