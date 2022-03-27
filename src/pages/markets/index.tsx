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

import { Archive, Folder, Search } from '@mui/icons-material'
import MarketDisplay from '../../modules/market/components/MarketDisplay'
import MarketToolbar from '../../modules/market/components/MarketToolbar'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const dummyMarkets = new Array()
dummyMarkets.push('Writing and Translation')
dummyMarkets.push('Development & IT')
dummyMarkets.push('Accounting and Finance')
dummyMarkets.push('Design and Creative')
dummyMarkets.push('Engineering and Architecture')
dummyMarkets.push('Sales and Marketing')

const Markets : React.FunctionComponent = () => {
  const classes = useStyles()
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className={classes.root}>
    

      <Box sx={{ width: '100%', margin: '0px 0px' }}>
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
            <Typography fontSize={20} variant='caption' color='#aaa'>
              Select a market to get started
            </Typography>
          </Grid>

          <Grid item />
        </Grid>
        <Grid
        container
        direction="row"
        flexDirection="row"
        alignItems="center"
        spacing={2}>
          {dummyMarkets.map((market) => (
            <Grid item sm={4}>
              <MarketDisplay market={market} isShowingStats />
            </Grid>
          ))}
        </Grid>
       </Box>
    </Box>
  )
}

export default Markets
