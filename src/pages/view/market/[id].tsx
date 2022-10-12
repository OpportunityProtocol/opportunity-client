import { useEffect, useState } from 'react'

import {
  Box,
  Container,
  Tab,
  Grid,
  Tabs,
  Typography,
  IconButton,
  Stack
} from '@mui/material'
import { NextRouter, useRouter } from 'next/router';
import JobDisplay from '../../../modules/market/components/JobDisplay';
import TabPanel from '../../../common/components/TabPanel/TabPanel';
import { QueryResult, useQuery } from '@apollo/client';
import { GET_CONTRACTS_BY_MARKET_ID, GET_SERVICES_BY_MARKET_ID } from '../../../modules/contract/ContractGQLQueries';
import ServiceCard from '../../../modules/contract/components/ServiceCard/ServiceCard';
import SearchBar from '../../../common/components/SearchBar/SearchBar';
import { Refresh } from '@mui/icons-material';
import { NextPage } from 'next';
import { GET_MARKET_DETAILS_BY_ID } from '../../../modules/market/MarketGQLQueries';

const Market: NextPage = () => {
  const router: NextRouter = useRouter()
  const [tabValue, setTabValue] = useState<number>(0);
  const [marketDetails, setMarketDetails] = useState<any>({})
  const [displayedServices, setDisplayedServices] = useState<Array<any>>([])
  const [displayedContracts, setDisplayedContracts] = useState<Array<any>>([])
  const { id } = router.query;

  const marketDetailsQuery: QueryResult = useQuery(GET_MARKET_DETAILS_BY_ID, {
    skip: true,
    variables: {
      id: Number(id)
    }
  })

  const contractsQuery: QueryResult = useQuery(GET_CONTRACTS_BY_MARKET_ID, {
    variables: {
      id
    }
  })

  const servicesQuery: QueryResult = useQuery(GET_SERVICES_BY_MARKET_ID, {
    variables: {
      id
    }
  })

  useEffect(() => {
    marketDetailsQuery.refetch()
    contractsQuery.refetch()
    servicesQuery.refetch()
  }, [id])

  useEffect(() => {
    if (!marketDetailsQuery.loading && marketDetailsQuery.data) {
     // setMarketDetails(marketDetailsQuery.data?.markets[0])
    }
  }, [marketDetailsQuery.loading])

  useEffect(() => {
    if (!contractsQuery.loading && contractsQuery.data) {
      setDisplayedContracts([...contractsQuery.data?.contracts])
    }
  }, [contractsQuery.loading])

  useEffect(() => {
    if (!servicesQuery.loading && servicesQuery.data) {
      setDisplayedServices([...servicesQuery.data?.services])
    }
  }, [servicesQuery.loading])

  const handleOnChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onRefresh = () => {
    servicesQuery.refetch()
    contractsQuery.refetch()
  }

  return (
    <Container maxWidth='xl'>
      <Box sx={{ width: "100%" }}>
        <Stack mb={5} direction='row' sx={{ width: '100%' }} display='flex' alignItems='center' justifyContent='space-between'>
          <Typography
            fontWeight="bold"
            fontSize={24}
            color="rgba(33, 33, 33, .85)"
          >
            Writing and Translation
          </Typography>
        </Stack>

        <Box sx={{ width: "100%", mt: 1, mb: 3 }}>
          <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Tabs
            value={tabValue}
            onChange={handleOnChangeTab}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab value={0} label="Contracts" />
            <Tab value={1} label="Services" />
          </Tabs>
          <Stack direction='row' alignItems='center' spacing={1}>
            <IconButton size='small' onClick={onRefresh}>
              <Refresh fontSize='small' />
            </IconButton>
            {/*
              tabValue === 0 ? (<SearchBar placeholder='Search...' onChange={e => setDisplayedContracts(contractsQuery.data?.contracts?.filter(contract => contract?.))} />) : (<SearchBar placeholder='Search...' onChange={e => alert('hji')} />)
  */}
          </Stack>
          </Box>
        </Box>
        <TabPanel index={0} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {displayedContracts.filter((item) => item.ownership == 0).map((contract: any, idx: number) => {
                return ( <JobDisplay id={Number(contract.id)} data={contract} /> )
              })}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={1} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {displayedServices.map((service: any, idx: number) => (
                <ServiceCard
                  purchase={false}
                  table={false}
                  id={service.id}
                  data={service}
                />
              ))}
            </Grid>
          </Box>
        </TabPanel>
      </Box>
    </Container>
  )
}

export default Market