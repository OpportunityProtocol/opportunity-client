import React, { useEffect, useState } from 'react'
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

const tags = ['spanish', 'english', 'essay', 'french', 'arabic', 'poetry', 'russian', 'portuguese', 'mandarin', 'hindu']

const Explore: NextPage<any> = () => {
    const router: NextRouter = useRouter()
    const [markets, setMarkets] = useState<Array<any>>([])
    const [activeFreelancers, setActiveFreelancers] = useState<Array<any>>([])
    const marketsQuery: QueryResult = useQuery(GET_MARKETS)
    const usersQuery: QueryResult = useQuery(GET_VERIFIED_FREELANCERS)
    const userLensData = useSelector(selectLens)

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

    return (
        <Container maxWidth='xl' sx={{ bgcolor: 'white', height: '100%' }}>
        
                {!userLensData.handle && (
                     <Alert sx={{ mb: 2, border: '1px solid #ddd' }}>
                     Welcome to Lens Talent. The social network for <b>work</b>. Create or work contracts and servics by DAOs or users anytime from any place.
                 </Alert>
                )}
               

                <Box mb={3}>
            <Typography pb={2} fontWeight='bold' fontSize={16} color='#212121'>
                   Explore
                </Typography>
                <Stack spacing={2} direction='row' alignItems='center'>
            {
                tags.map((tag: string) => {
                    return <Chip clickable label={String(tag).charAt(0).toUpperCase() + String(tag).slice(1)} size='small' sx={{ p: 1, fontSize: 12, color: 'black', fontWeight: 'medium', width: 'fit-content', bgcolor: "#eee", height: 25, border: '1px solid #ddd' }} />
                })
            }
            </Stack>
            </Box>

                <Box mb={1}>
                <Typography pb={2} fontWeight='bold' fontSize={16} color='#212121'>
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
                <Box mt={2} mb={2}>

                    <Typography fontWeight='bold' fontSize={16} color='#212121'>
                        Labor Markets
                    </Typography>
                </Box>
                <Grid container direction='row' alignItems='center' spacing={3}>
                    {
                        markets.map((marketDetails) => {
                            return <MarketDisplay marketDetails={marketDetails} />
                        })
                    }
                </Grid>
            </Box>

            <Box mt={5}>
                <Box mt={2} mb={2}>

                    <Typography fontWeight='bold' fontSize={16} color='#212121'>
                        Highest Valued Services
                    </Typography>
                </Box>
                <Grid container direction='row' alignItems='center' spacing={3}>
                    {

                    }
                </Grid>
            </Box>
            
        </Container>
    )
}

export default Explore