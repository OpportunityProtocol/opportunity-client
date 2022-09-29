import React, { useEffect, useState } from 'react'
import {
    Box, Stack,
    Grid,
    Container,
    Typography,
    Divider,
    Avatar
} from '@mui/material'
import { QueryResult, useQuery } from '@apollo/client'
import { GET_MARKETS } from '../../../modules/market/MarketGQLQueries'
import MarketDisplay from '../../../modules/market/components/MarketDisplay'
import { NextPage } from 'next'
import { GET_VERIFIED_FREELANCERS } from '../../../modules/user/UserGQLQueries'
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { NextRouter, useRouter } from 'next/router'

const MarketHome: NextPage<any> = () => {
    const router: NextRouter = useRouter()
    const [markets, setMarkets] = useState<Array<any>>([])
    const [activeFreelancers, setActiveFreelancers] = useState<Array<any>>([])
    const marketsQuery: QueryResult = useQuery(GET_MARKETS)
    const usersQuery: QueryResult = useQuery(GET_VERIFIED_FREELANCERS)

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
            <Box mt={2} mb={1}>
                <Typography pb={2} fontWeight='bold' variant='h5'>
                    Active Freelancers
                </Typography>

                <Stack direction='row' alignItems='center' spacing={5}>
                    {
                        activeFreelancers.map((freelancer) => 
                        <Stack onClick={() => router.push(`/view/profile/${freelancer.address}`)} sx={{ mr: 1, cursor: 'pointer' }} spacing={0.5} alignItems='center'>

                        <Jazzicon
                        key={freelancer.address}
                        diameter={60}
                        seed={jsNumberForAddress(String(freelancer.address))}
                      />
                      <Typography fontWeight='300' fontSize={10}>
                        {freelancer.address.slice(0,8)} {/*freelancer.handle*/}
                      </Typography>
                      </Stack>
                        
                        )}
                </Stack>
            </Box>  


            <Divider  sx={{ my: 3 }} />

            <Box mt={2} mb={1}>
                <Typography color='#aaa' fontSize={14}>
                    {markets?.length} Active Markets
                </Typography>
                <Typography py={1} variant='h5' fontWeight='bold'>
                    Markets
                </Typography>
            </Box>
       
            <Grid container direction='row' alignItems='center' spacing={3}>
                {
                    markets.map((marketDetails) => {
                        return <MarketDisplay marketDetails={marketDetails} />
                    })
                }

            </Grid>
        </Container>
    )
}

export default MarketHome