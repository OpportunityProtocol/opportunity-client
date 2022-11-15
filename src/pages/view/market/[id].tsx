import { useEffect, useState } from "react";

import {
  Box,
  Container,
  Tab,
  Grid,
  Tabs,
  Typography,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import { NextRouter, useRouter } from "next/router";
import JobDisplay from "../../../modules/market/components/JobDisplay";
import TabPanel from "../../../common/components/TabPanel/TabPanel";
import { ApolloQueryResult, QueryResult, useQuery } from "@apollo/client";
import {
  GET_CONTRACTS_BY_MARKET_ID,
  GET_SERVICES_BY_MARKET_ID,
} from "../../../modules/contract/ContractGQLQueries";
import ServiceCard from "../../../modules/contract/components/ServiceCard/ServiceCard";
import SearchBar from "../../../common/components/SearchBar/SearchBar";
import { Refresh } from "@mui/icons-material";
import { NextPage } from "next";
import { GET_MARKET_DETAILS_BY_ID } from "../../../modules/market/MarketGQLQueries";
import fleek from "../../../fleek";
import SearchBarV1 from "../../../common/components/SearchBarV1/SearchBarV1";
import { MARKET_DESCRIPTION_MAPPING } from "../../../constant";

const Market: NextPage = () => {
  const router: NextRouter = useRouter();
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tabValue, setTabValue] = useState<number>(0);
  const [marketDetails, setMarketDetails] = useState<any>({});
  const [cachedContracts, setCachedContracts] = useState<Array<any>>([]);
  const [cachedServices, setCachedServices] = useState<Array<any>>([]);
  const [displayedServices, setDisplayedServices] = useState<Array<any>>([]);
  const [displayedContracts, setDisplayedContracts] = useState<Array<any>>([]);
  const { id, routedSearchQuery } = router.query;

  const marketDetailsQuery: QueryResult = useQuery(GET_MARKET_DETAILS_BY_ID, {
    variables: {
      marketId: 1,
    },
    onError(error) {
      alert(error);
    },
  });

  const contractsQuery: QueryResult = useQuery(GET_CONTRACTS_BY_MARKET_ID, {
    variables: {
      id: 1,
      marketId: 1,
    },
  });

  const servicesQuery: QueryResult = useQuery(GET_SERVICES_BY_MARKET_ID, {
    variables: {
      id: 1,
    },
  });

  useEffect(() => {
    if (routedSearchQuery) {
      handleOnSearch({ target: { value: routedSearchQuery } });
    }
  }, [routedSearchQuery]);

  const handleOnSearch = (e: any) => {
    setSearchQuery(e.target.value);

    if (routedSearchQuery) {
    }

    if (e.target.value === "") {
      setDisplayedContracts(cachedContracts);
      setDisplayedServices(cachedServices);
      return;
    }

    const filteredContracts = cachedContracts.filter((contract) =>
      String(contract.contract_title).includes(e.target.value)
    );
    const filteredServices = cachedServices.filter((service) =>
      String(service.serviceTitle).includes(e.target.value)
    );

    setDisplayedContracts(filteredContracts);
    setDisplayedServices(filteredServices);
  };

  useEffect(() => {
    loadMarketData();
  }, [id]);

  const loadMarketData = async () => {
    if (id) {
      setPageLoading(true);

      await marketDetailsQuery
        .refetch()
        .then((res) => {
          setMarketDetails(res.data?.markets[0]);
        })
        .catch((err) => console.log(err));
      await contractsQuery
        .refetch()
        .then((res) => loadContracts())
        .catch((error) => console.log(error));
      await servicesQuery
        .refetch()
        .then((res) => loadServices())
        .catch((error) => console.log(error));
      setPageLoading(false);
    }
  };

  async function loadContracts() {
    if (contractsQuery.data) {
      const contracts = contractsQuery.data?.contracts;

      if (typeof contracts == "undefined") {
        setDisplayedContracts([]);
        return;
      }

      let contractMetadata = {};
      let displayedContractsData = [];

      for (const contractData of contracts) {
        contractMetadata = await fleek.getContract(
          String(contractData?.metadata).slice(13)
        );
        displayedContractsData.push({
          ...contractData,
          ...contractMetadata,
        });
      }

      setDisplayedContracts(displayedContractsData);
      setCachedContracts(displayedContractsData);
    }
  }

  async function loadServices() {
    const services = servicesQuery.data?.services;

    if (typeof services == "undefined") {
      setDisplayedServices([]);
      return;
    }

    let serviceMetadata = {};
    let displayedServicesData = [];
    let marketDetails = {}

    for (const service of services) {
      serviceMetadata = await fleek.getService(
        String(service?.metadataPtr).slice(13)
      );


      await marketDetailsQuery.refetch({ marketId: service?.marketId }).then((result: ApolloQueryResult<any>) => {
        marketDetails = result.data?.markets[0]
      })

      displayedServicesData.push({
        ...service,
        ...serviceMetadata,
        marketDetails
      });
    }

    setDisplayedServices(displayedServicesData);
    setCachedServices(displayedServicesData);
  }

  const handleOnChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: "100%" }}>
        <Box pb={4}>
          <Typography
            fontWeight="bold"
            fontSize={24}
            color="rgba(33, 33, 33, .85)"
          >
            {marketDetails?.name}
          </Typography>
          <Typography paragraph>
            {MARKET_DESCRIPTION_MAPPING[marketDetails?.name]}
          </Typography>
          <Stack spacing={3} direction="row" alignItems="center">
            <Chip
              size="small"
              label="Volume: $2923.23"
              sx={{ fontWeight: "600" }}
            />
            <Chip
              size="small"
              label="Liquidity: $2923.23"
              sx={{ fontWeight: "600" }}
            />
          </Stack>
        </Box>
        <Box sx={{ width: "100%", mt: 1, mb: 3 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Tabs
              value={tabValue}
              onChange={handleOnChangeTab}
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab value={0} label="Contracts" />
              <Tab value={1} label="Services" />
            </Tabs>
            <Stack direction="row" alignItems="center" spacing={1}>
              <SearchBarV1
                onChange={handleOnSearch}
                value={searchQuery}
                placeholder={
                  tabValue === 0 ? "Search contracts" : "Search services"
                }
              />
              <IconButton size="small" onClick={loadMarketData}>
                <Refresh fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Box>
        <TabPanel index={0} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {displayedContracts.filter((item) => item.ownership == 0)
                .length === 0 ? (
                <Box>
                  <Typography>
                    No results with the search query "{searchQuery}"
                  </Typography>
                </Box>
              ) : (
                displayedContracts
                  .filter((item) => item.ownership == 0)
                  .map((contract: any, idx: number) => {
                    return (
                      <Grid item xs={4}>
                        <JobDisplay data={contract} />
                      </Grid>
                    );
                  })
              )}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={1} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {displayedServices.filter(
                (service) =>
                  service.serviceTitle.toLowerCase().includes(searchQuery) ||
                  service.serviceTags.includes(searchQuery)
              )?.length === 0 ? (
                <Box>
                  <Typography>
                    No results with the search query "{searchQuery}"
                  </Typography>
                </Box>
              ) : (
                displayedServices
                  .filter(
                    (service) =>
                      service.serviceTitle
                        .toLowerCase()
                        .includes(searchQuery) ||
                      service.serviceTags.includes(searchQuery)
                  )
                  .map((service: any, idx: number) => (
                    <Grid item minWidth='350px'>
                      <ServiceCard
                        purchase={false}
                        id={service.id}
                        service={service}
                      />
                    </Grid>
                  ))
              )}
            </Grid>
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Market;
