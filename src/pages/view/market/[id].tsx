import React, { useEffect, useState } from 'react'

import {
    Box,
    Container,
    Tab,
    Divider,
    Grid,
    Button,
    CardActions,
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

const Market = () => {
    const router: NextRouter = useRouter()
    const [tabValue, setTabValue] = React.useState<number>(0);
    const [displayedServices, setDisplayedServices] = useState<Array<any>>([])
    const [displayedContracts, setDisplayedContracts] = useState<Array<any>>([])
    const { id } = router.query;

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

    console.log(servicesQuery)

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
                <Stack mb={5} direction='row'  sx={{ width: '100%' }} display='flex' alignItems='center' justifyContent='space-between'>
                <Typography
            fontWeight="bold"
            fontSize={24}
            color="rgba(33, 33, 33, .85)"
          >
            Writing and Translation
          </Typography>

                   
                    <Stack direction='row' spacing={1}>
                    <IconButton size='small' onClick={onRefresh}>
                    <Refresh fontSize='small' />
                </IconButton>
                {
                    tabValue === 0 ? (<SearchBar placeholder='Search for contracts' />) : (<SearchBar placeholder='Search for services' />)
                }
                    </Stack>
              
                </Stack>
     
                
        <Box sx={{ width: "100%", mt: 1, mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleOnChangeTab}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab value={0} label="Contracts" />
            <Tab value={1} label="Services" />
          </Tabs>
          <Divider sx={{ borderBottom: "1px solid #ddd" }} />
        </Box>
        <TabPanel index={0} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {displayedContracts.filter((item) => item.ownership == 0).map((contract: any, idx: number) => {
                return (
                  <Grid item xs={4} key={contract.id}>
                    <JobDisplay id={Number(contract.id)} data={contract} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel index={1} value={tabValue}>
          <Box>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {displayedServices.map((service: any, idx: number) => (
                <Grid item xs={4} key={service.id}>
                  <ServiceCard
                  purchase={false}
                  table={true}
                    id={service.id}
                    data={service}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>
      </Box>


        </Container>
    )
}

export default Market