import React, { useEffect, useState } from 'react'
import {
    Box, Stack
} from '@mui/material'
import { QueryResult, useQuery } from '@apollo/client'
import { GET_MARKETS } from '../../../modules/market/MarketGQLQueries'
import MarketDisplay from '../../../modules/market/components/MarketDisplay'
import { Container } from '@mui/system'

const MarketHome = () => {
    const [markets, setMarkets] = useState<Array<any>>([])

    const marketsQuery: QueryResult = useQuery(GET_MARKETS)

    useEffect(() => {
        if (!marketsQuery.loading && marketsQuery.data) {
            setMarkets([...marketsQuery.data?.markets])
        }
    }, [marketsQuery.loading])

    return (
        <Container maxWidth='xl'>
            <Stack direction='row' alignItems='center' spacing={3}>
                {
                    markets.map((marketDetails) => {
                        return <MarketDisplay marketDetails={marketDetails} />
                    })
                }
            </Stack>

        </Container>
    )
}

export default MarketHome