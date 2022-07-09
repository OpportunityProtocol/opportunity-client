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
import { NETWORK_MANAGER_ADDRESS } from "../../constant";
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
  selectActivePublishedServiceIds,
  selectActivePublishedServices,
  selectPublishedServiceIds,
  selectPublishedServices,
  selectPublishedServicesIdMapping,
  selectPurchasedService,
  selectPurchasedServiceIds,
  selectPurchasedServices,
  selectPurchasedServicesIdMapping,
} from "../../modules/contract/contractReduxSlice";
import { ServiceStruct } from "../../typechain-types/NetworkManager";
import { hexToDecimal } from "../../common/helper";

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
  const [relationships, setRelationships] = useState<any>([]);
  const [tabValue, setTabValue] = React.useState<number>(0);

  const userAddress = useSelector(selectUserAddress);
  const userLensProfileInformation = useSelector(selectLens);
  const userVerificationStatus = useSelector(selectVerificationStatus);
  const userPublishedServices = useSelector(selectPublishedServices);
  const userPurchasedServices = useSelector(selectPurchasedServices);
  const userActivePublishedServices = useSelector(selectActivePublishedServices)

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
  )

  const userPurchasedServicesMapping  = useSelector(selectPurchasedServicesIdMapping)
  const userActivePublishedServicesMapping = useSelector(selectPurchasedServicesIdMapping)
  const userPublishedServicesMapping = useSelector(selectPublishedServicesIdMapping)
  
  const { data: signer, isError, isLoading } = useSigner();

  const networkManagerContract = useContract({
    addressOrName: NETWORK_MANAGER_ADDRESS,
    contractInterface: NetworkManagerInterface,
    signerOrProvider: signer,
  });

  const renderUsers = async () => {
    const a = await fetch("https://randomuser.me/api/?results=20");
    const b = await a.json();
    setRelationships(b.results);
  };

  useEffect(() => {
    renderUsers();
  }, []);

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ServiceCreated",
    async (event: Event) => {
      const iface = [
        "event ServiceCreated(uint256 indexed serviceId, uint256 indexed marketId, address indexed creator)",
      ];
      const serviceId = event[0];
      const marketId = event[1];
      const serviceOwnerAddress = event[2];
      const eventInterface: Interface = new ethers.utils.Interface(iface);

      if (
        serviceOwnerAddress === userAddress &&
        !publishedServiceIds.includes(serviceId)
      ) {
        const payload: ServiceStruct =
        await networkManagerContract.getServiceData(serviceId);

        dispatch(contractServiceIdAdded(Number(hexToDecimal(serviceId._hex))));

        dispatch(
          contractServiceDataAdded({
            ...payload,
            id: hexToDecimal(Number(payload.id._hex)),
          })
        );
      }
    }
  );

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ServicePurchased",
    async (event: Event) => {
      const iface = [
        "event ServicePurchased(uint256 indexed serviceId, uint256 purchaseId, uint256 pubId,  address indexed owner, address indexed purchaser, address referral)",
      ];
      const serviceId = event[0];
      const servicePurchaseId = event[1];
      const servicePubId = event[2];
      const serviceOwnerAddress = event[3];
      const servicePurchaser = event[4];
      const serviceReferral = event[5];

      if (
        userAddress === servicePurchaser &&
        !purchasedServiceIds.includes(serviceId)
      ) {
        const servicePayload: ServiceStruct =
          await networkManagerContract.getServiceData(serviceId);

        const purchaseMetadataPayload: any = await networkManagerContract.getServicePurchaseMetadata(servicePurchaseId);

        dispatch(purchasedServiceIdAdded(Number(hexToDecimal(serviceId._hex))));

        dispatch(
          purchasedServiceDataAdded({
            ...servicePayload,
            id: hexToDecimal(Number(servicePayload.id._hex)),
            servicePurchaser,
            servicePubId,
            serviceReferral,
            servicePurchaseId,
            ...purchaseMetadataPayload
          })
        );
      }

      if (userAddress === serviceOwnerAddress && !activePublishedServiceIds.includes(serviceId)) {
        const servicePayload: ServiceStruct =
        await networkManagerContract.getServiceData(serviceId);

        const purchaseMetadataPayload: any = await networkManagerContract.getServicePurchaseMetadata(servicePurchaseId);

        dispatch(activePublishedServiceIdAdded(Number(hexToDecimal(serviceId._hex))))

        dispatch(
          activePublishedServiceDataAdded({
            ...servicePayload,
            id: hexToDecimal(Number(servicePayload.id._hex)),
            servicePurchaser,
            servicePubId,
            serviceReferral,
            servicePurchaseId,
            ...purchaseMetadataPayload
          })
        )
      }

    }
  );

  useContractEvent(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "ServiceResolved",
    async (event: Event) => {
      const serviceOwner = event[0]
      const serviceClient = event[1]
      const purchaseId = event[2]
      const serviceId = event[3]
      const amount = event[4]

      if (userAddress === serviceClient) {
        dispatch(
          purchasedServiceDataAdded({
            ...userPurchasedServicesMapping[serviceId],
            status: 2
          })
        );
      }

      if (userAddress === serviceOwner) {
        dispatch(
          activePublishedServiceDataAdded({
            ...userActivePublishedServicesMapping[serviceId],
            status: 2
          })
        )
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
              {userPublishedServices.map(
                (service: ServiceStruct, idx: number) => (
                  <Grid item xs={3} key={service.id}>
                    <ServiceCard id={Number(service.id)} data={service} />
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={1} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {
                userPurchasedServices.map(
                  (service: ServiceStruct, idx: number) => (
                    <Grid item xs={3} key={service.id}>
                      <ServiceCard purchase id={Number(service.id)} data={service} />
                    </Grid>
                  )
                )
              }
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
              {
                userActivePublishedServices.map(
                  (service: ServiceStruct, idx: number) => (
                    <Grid item xs={3} key={service.id}>
                      <ServiceCard purchase id={Number(service.id)} data={service} />
                    </Grid>
                  )
                )
              }
            </Grid>
          </Box>
        </TabPanel>
        <Divider />
      </Box>
    </Container>
  );
};

export default Contracts;
