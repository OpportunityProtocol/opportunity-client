import React, { useEffect, useState } from 'react'
import useStyles from './MarketStyles'

import { alpha } from '@mui/material/styles'

import {
  Grid,
  Button,
  Switch,
  Chip,
  Badge,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  Typography,
  FormGroup,
  FormControlLabel,
  CardContent,
  Card,
  Pagination,
  TextField,
  Tab,
  Paper,
  Tabs,
  Box,
  useTheme,
  InputBase,
  ListItemText
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

const Home = () => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <Grid
        container
        direction="row"
        xs={12}
        justifyContent="space-between"
        style={{ padding: '1% 4%' }}
      >
        <Grid
          xs={12}
          container
          item
          flexDirection="column"
          direction="column"
          alignItems="cetnter"
        >
          <Grid item>
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
                </Grid>

                <Grid item>
                  <Paper
                    component="form"
                    sx={{
                      p: '2px 20px',
                      borderRadius: 2,
                      border: '1px solid #eee',
                      backgroundColor: 'transparent',
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      width: 500,
                    }}
                  >
                    <InputBase
                      sx={{
                        fontWeight: 'regular',
                        color: '#212121',
                        flex: 1,
                        fontSize: 14,
                      }}
                      placeholder="Search contracts, employers or workers across any network"
                    />

                    <IconButton sx={{ p: '10px' }} aria-label="menu">
                      <Search />
                    </IconButton>
                  </Paper>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                flexDirection="row"
                alignItems="center"
                spacing={2}
              >
                {dummyMarkets.map((market) => (
                  <Grid item sm={4}>
                    <MarketDisplay />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Pagination count={10} variant="outlined" shape="rounded" />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home
