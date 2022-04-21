import React from 'react'
import {
    Chip,
    Box,
} from '@mui/material'
import { FilterList } from '@mui/icons-material'

const FilterDesiredMarketsButton: React.FunctionComponent = () => {
    return (
        <Box>
            <Chip icon={<FilterList fontSize='small' />} label='Filter desired markets' clickable sx={{ bgcolor: '#eee', borderRadius: 1, height: 45 }} />
        </Box>
    )
}

export default FilterDesiredMarketsButton