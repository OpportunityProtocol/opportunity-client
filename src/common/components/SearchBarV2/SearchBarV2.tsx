import React, { FunctionComponent } from 'react'

import {
    Paper,
    InputBase,
    IconButton
} from '@mui/material'

import FilterList from '@mui/icons-material/FilterList'
import { Search } from '@mui/icons-material'

const SearchBarV2 : FunctionComponent = () => {
    return (
        <Paper
        elevation={0}
        component="form"
        sx={{ mb: 2, p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
      >
        <InputBase
          startAdornment={<Search sx={{ color: '#9E9E9E'}} />}
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Google Maps"
          inputProps={{ 'aria-label': 'search google maps' }}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <FilterList />
        </IconButton>

        <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions"></IconButton>
      </Paper>
    )
}

export default SearchBarV2