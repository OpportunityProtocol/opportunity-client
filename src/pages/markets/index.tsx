import React from 'react'
import { useStyles }  from './MarketStyles'

import {
  Grid,
  IconButton,
  Typography,
  Pagination,
  Paper,
  Button,
  Box,
  InputBase
} from '@mui/material'

import { Search } from '@mui/icons-material'
import MarketDisplay from '../../modules/market/components/MarketDisplay'
import MarketToolbar from '../../modules/market/components/MarketToolbar'

const dummyMarkets = new Array(25).fill(1)

const Markets : React.FunctionComponent = () => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Box sx={{ width: '100%', margin: '30px 0px' }}>
        <Grid
        pb={5}
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        >
          <Grid item>
            <Typography variant="h5" className={classes.heading}>
              Explore markets
            </Typography>
            <Typography variant='caption' color='rgba(33, 33, 33, .85)'>
              Showing 23 Opportunity markets
            </Typography>
          </Grid>

          <Grid item>
            <Paper
            elevation={0}
            component="form"
            className={classes.searchContainer}
            >
              <InputBase
              startAdornment={<Search fontSize='small' sx={{ color: '#aaa' }} />}
              sx={{ ml: 1, flex: 2, fontSize: 14, }}
              placeholder="Search jobs"
              inputProps={{ 'aria-label': 'search google maps' }}
              />
            </Paper>
          </Grid>
        </Grid>
        <Grid
        container
        direction="row"
        flexDirection="row"
        alignItems="center"
        spacing={2}>
          {dummyMarkets.map((market) => (
            <Grid item sm={4}>
              <MarketDisplay />
            </Grid>
          ))}
        </Grid>
       </Box>
      
      <Box className={classes.containerCentered}>
        <Pagination count={10} variant="outlined" shape="rounded" />
      </Box>
    </Box>
  )
}

export default Markets
