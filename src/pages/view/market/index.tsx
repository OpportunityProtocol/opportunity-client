import React, { useEffect, useState } from 'react'
import {
    Box, Stack,
    Grid,
    Divider
} from '@mui/material'
import { QueryResult, useQuery } from '@apollo/client'
import { GET_MARKETS } from '../../../modules/market/MarketGQLQueries'
import MarketDisplay from '../../../modules/market/components/MarketDisplay'
import { Container, Typography } from '@mui/material'
import { NextPage } from 'next'

const MarketHome: NextPage<any> = () => {
    const [markets, setMarkets] = useState<Array<any>>([])
    const marketsQuery: QueryResult = useQuery(GET_MARKETS)

    useEffect(() => {
        if (!marketsQuery.loading && marketsQuery.data) {
            setMarkets([...marketsQuery.data?.markets])
        }
    }, [marketsQuery.loading])

    return (
        <Container maxWidth='xl'>
            <Box mt={2} mb={1}>
                <Typography color='#aaa' fontSize={14}>
                    {markets?.length} Active Markets
                </Typography>
                <Typography py={1} variant='h5' fontWeight='bold'>
                    Markets
                </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
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