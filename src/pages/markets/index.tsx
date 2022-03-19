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

const dummyMarkets = new Array()
dummyMarkets.push('Writing and Translation')
dummyMarkets.push('Development & IT')
dummyMarkets.push('Accounting and Finance')
dummyMarkets.push('Design and Creative')
dummyMarkets.push('Engineering and Architecture')
dummyMarkets.push('Sales and Marketing')

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
            <Typography fontWeight='bold' fontSize={25} className={classes.heading}>
              Explore markets
            </Typography>
            <Typography variant='caption' color='rgba(33, 33, 33, .85)'>
              Showing 23 markets
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
              <MarketDisplay market={market} />
            </Grid>
          ))}
        </Grid>
       </Box>
      
      <Box className={classes.containerCentered}>
        <Pagination count={0} variant="outlined" shape="rounded" />
      </Box>
    </Box>
  )
}

export default Markets
