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

const dummyMarkets = [
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Programming & Tech',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Accounting',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Writing & Translation',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Music & Audio',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Digital Marketing',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Graphic Design',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Business',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Lifestyle',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
  {
    marketAddress: '0x3EaDa08f9a574Ab84750E30Ca406Ca5E951D71a5',
    marketName: 'Real World',
    marketSize: '$23.962.600.781,66',
    interestEarned: '$50.324.595.293,23',
    totalContracts: '1,938,394,293.23',
  },
]

const Markets = () => {
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
      sx={{ width: 600, p: 1, borderRadius: 20, border: '1px solid #eee', elevation: 0, display: 'flex', alignItems: 'center',  }}
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
