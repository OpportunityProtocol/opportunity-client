import React, { useContext, useEffect, useState } from 'react'
import {
    Box, Stack,
    Grid,
    Container,
    Typography,
    Divider,
    Avatar,
    Card,
    CardContent,
    List,
    ListItem,
    Button,
    alpha,
    Chip,
    ListItemText,
    Alert,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material'
import { QueryResult, useQuery } from '@apollo/client'

import { NextPage } from 'next'
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { NextRouter, useRouter } from 'next/router'
import { MoreHoriz, MoreHorizOutlined } from '@mui/icons-material'
import { GET_MARKETS } from '../modules/market/MarketGQLQueries'
import MarketDisplay from '../modules/market/components/MarketDisplay'
import { GET_VERIFIED_FREELANCERS } from '../modules/user/UserGQLQueries';
import { useSelector } from 'react-redux';
import { selectLens } from '../modules/user/userReduxSlice';
import UserCard from '../modules/user/components/UserCard/UserCard';
import { GET_SERVICES } from '../modules/contract/ContractGQLQueries';
import ServiceCard from '../modules/contract/components/ServiceCard/ServiceCard';
import SearchBar from '../common/components/SearchBar/SearchBar';

//temporary
const tags = ['spanish', 'english', 'essay', 'french', 'arabic', 'poetry', 'russian', 'portuguese', 'mandarin', 'hindu']

const Explore: NextPage<any> = () => {
    const [markets, setMarkets] = useState<Array<any>>([])
    const [activeFreelancers, setActiveFreelancers] = useState<Array<any>>([])
    const [highestValuedServices, setHighestValuedServices] = useState<Array<any>>([])

    const marketsQuery: QueryResult = useQuery(GET_MARKETS)
    const usersQuery: QueryResult = useQuery(GET_VERIFIED_FREELANCERS)
    const userLensData = useSelector(selectLens)
    const servicesQuery: QueryResult = useQuery(GET_SERVICES)

    const processHighestValuedServices = () => {
        servicesQuery.refetch().then((data) => {
            let services = [...data?.data?.services]

            //this is temporary due to the "offers" field being returned as an array
            for (let i = 0; i < services.length; i++) {
                services[i] = { ...services[i], offer: Number(services[i]?.offers[0]) }
            }

            setHighestValuedServices(services)
        })
    }

    useEffect(() => {
        if (!marketsQuery.loading && marketsQuery.data) {
            setMarkets([...marketsQuery.data?.markets])
        }
    }, [marketsQuery.loading])

    useEffect(() => {
        if (!usersQuery.loading && usersQuery.data) {
            setActiveFreelancers([...usersQuery.data?.verifiedUsers])
        }
    }, [usersQuery.loading])

    useEffect(() => {
        processHighestValuedServices()
    }, [])

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 2, p: 3, backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.3), width: '100%' }}>
                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ width: '100%' }}>
                    <Box />
                    <Box direction='row' component={Stack} spacing={2}>
                        <Button variant='outlined' sx={{ borderRadius: 1 }}>
                            See all markets
                        </Button>
                    </Box>
                </Stack>
            </Box>

            <Container maxWidth='xl' sx={{ bgcolor: 'white', height: '100%' }}>
                <Box mb={3}>
                    <Typography pb={2} fontWeight='600' fontSize={16} color='#212121'>
                        Explore
                    </Typography>
                    <Stack spacing={2} direction='row' alignItems='center'>
                        {
                            tags.map((tag: string) => {
                                return <Chip clickable label={String(tag).charAt(0).toUpperCase() + String(tag).slice(1)} size='small' sx={{ p: 1.5, py: 1.8, fontSize: 13, color: 'black', fontWeight: '400', width: 'fit-content', bgcolor: "#eee", height: 25, border: 'none', borderRadius: 0 }} />
                            })
                        }
                    </Stack>
                </Box>

                <Box mb={1}>
                    <Typography pb={2} fontWeight='600' fontSize={16} color='#212121'>
                        Labor Markets
                    </Typography>
                    <Grid container direction='row' alignItems='center' spacing={3}>
                        {
                            markets.map((marketDetails) => {
                                return (
                                    <Grid xs={12} md={6} lg={4} item>
                                        <MarketDisplay marketDetails={marketDetails} />
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Box>

                <Box my={5}>
                    <Typography pb={2} fontWeight='600' fontSize={16} color='#212121'>
                        Top Freelancers
                    </Typography>
                    <Grid container direction='row' alignItems='center' spacing={2}>
                        {
                            activeFreelancers.map((freelancer) =>
                                <UserCard freelancer={freelancer} />
                            )}
                    </Grid>
                </Box>

                <Box mt={5}>
                    <Typography pb={2} fontWeight='600' fontSize={16} color='#212121'>
                        Highest Valued Services
                    </Typography>
                    <Grid container direction='row' alignItems='center' spacing={3}>
                        <Grid xs={12} md={6} lg={4} item>
                            {
                                highestValuedServices.map((serviceData: any) => {
                                    return <ServiceCard service={serviceData} />
                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    )
}

export default Explore