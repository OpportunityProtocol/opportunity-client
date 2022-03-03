import React, { Fragment, useState, useEffect } from 'react'
import clsx from 'clsx'

import {
  Chip,
  Paper,
  Box,
  Drawer,
  Grid,
  CssBaseline,
  FormLabel,
  FormControl,
  RadioGroup,
  IconButton,
  Radio,
  CardActionArea,
  FormControlLabel,
  AppBar,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material'

import router, { useRouter } from 'next/router'

import Blockies from 'react-blockies'
import useStyles from './OpportunityStyles'
import MarketToolbar from './modules/market/components/MarketToolbar'

const drawerWidth = 280

const MARKETS = [
  {
    market: 'Development & IT',
    related: [
      'Computer Support',
      'Software Developer',
      'Cybersecurity',
      'Computer Research Scientist',
    ],
  },
  {
    market: 'Sales & Marketing',
    related: ['Social Media Marketer'],
  },
  {
    market: 'Writing & Translation',
    related: ['Content Translator', 'Cross Language Translator'],
  },
  {
    market: 'Admin & Customer Support',
    related: ['Human Resource Manager', 'Customer Support Caller'],
  },
  {
    market: 'Finance & Accounting',
    related: ['Accountant', 'Auditor'],
  },
  {
    market: 'Design & Creative',
    related: [
      'Graphic Designer',
      'UI/UX Designer',
      'Photographer',
      'Film & Video Editor',
    ],
  },
  {
    market: 'Engineering & Architecture',
    related: ['Architect', 'AutoCAD Drafter'],
  },
  {
    market: 'Deploy your own',
    related: ['Ride Sharing', 'Food Delivery'],
  },
]

const CONTINENTS = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Antartica'
]

const MARKET_TYPES = [
  {
    label: 'Opportunity Markets',
    type: 'default'
  },
  {
    label: 'Custom',
    type: 'custom'
  }
]

import FilterListIcon from '@mui/icons-material/FilterList';
import { ArrowDropDown } from '@mui/icons-material'

export default function Opportunity({ children }) {
  const classes = useStyles()
  const router = useRouter()

  const isDrawerShowing = router.pathname.includes('create') ? false : true

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        variant="outlined"
        position="fixed"
        sx={{
          bgcolor: 'rgb(245, 245, 245)',
          borderBottom: '0.5px solid #ddd',
          height: 65,
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar className={classes.toolbar}
        >
          <Grid
            width='100%'
            container
            xs={12}
            direction="row"
            flexDirection="row"

            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs={4}>
              <Typography fontWeight='bold' color="black">
                Opportunity
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <div className={classes.flexRow}>
                <Typography mx={2} variant="button" color="secondary" fontWeight='bold'>
                  Markets
                </Typography>

                <Typography mx={2} variant="button" color="black" fontWeight='medium'>
                  My Jobs
                </Typography>

                <Typography mx={2} variant="button" color="black" fontWeight='medium'>
                  My Contracts
                </Typography>

                <Typography mx={2} variant="button" color="black" fontWeight='medium'>
                  Messenger
                </Typography>
              </div>
            </Grid>

            <Grid
              item
              xs={4}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <CardActionArea className={classes.identityBox}>
                <Blockies
                  seed="Max"
                  size={10}
                  scale={3}
                  color="#212121"
                  bgColor="#aaa"
                  spotColor="#eee"
                  className={classes.blockie}
                />

                <div className={classes.row}>
                  <div className={classes.column}>
                    <Typography component='div'>
                      <Box sx={{
                        fontSize: 12,
                        fontWeight: 'medium',
                        color: 'black'
                      }}>
                        Address
                      </Box>

                      <Box
                        className={classes.address}
                        sx={{
                          fontSize: 10,
                          color: 'black'
                        }}>
                        0x4E3b49aDEf1487A08c73d47536f41Fe1c7c62137
                      </Box>
                    </Typography>

                  </div>
                  <IconButton fontSize='small'>
                    <ArrowDropDown sx={{ color: 'black' }} />
                  </IconButton>
                </div>
              </CardActionArea>

            </Grid>
          </Grid>
        </Toolbar>
        <MarketToolbar />
      </AppBar>
      {
        isDrawerShowing ?
          <Drawer
            component={Paper}
            elevation={3}

            sx={{
              width: drawerWidth,
              flexShrink: 0,
            
              [`& .MuiDrawer-paper`]: {
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#fbfbfd',
                borderRight: '1px solid #eee',
                p: 2,
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="permanent"
          >
            <Toolbar />
            <Toolbar />

            <Box sx={{ width: '100%', p: 2 }} >
              <div className={classes.row}>
                <FilterListIcon fontSize='small' />
                <Typography px={1} fontWeight='bold' fontSize={13}>
                  Filters
                </Typography>
              </div>

              <FormControl sx={{ my: 1 }}>
                <FormLabel
                  id="market-type-form-label"
                  sx={{ fontSize: 13, fontWeight: 'bold' }}
                >
                  Market Type
                </FormLabel>
                <RadioGroup
                  aria-labelledby="market-type-form-label"
                  defaultValue="female"
                  name="market-type-radio-button-group"
                >
                  {
                    MARKET_TYPES.map(marketType => {
                      return (
                        <FormControlLabel
                          componentsProps={{
                            typography: {
                              fontSize: 12,
                            },
                          }}
                          className={classes.formControlLabel}
                          value={String(marketType.type).toLowerCase()}
                          control={
                            <Radio
                              color='secondary'
                              className={classes.radio}
                              size="small"
                            />
                          }
                          label={marketType.label}
                        />
                      )
                    })
                  }
                </RadioGroup>
              </FormControl>

              <FormControl sx={{ my: 1 }}>
                <FormLabel
                  id="region-form-label"
                  sx={{ fontSize: 13, fontWeight: 'bold' }}
                >
                  Region
                </FormLabel>
                <RadioGroup
                  color='secondary'
                  aria-labelledby="region-form-label"
                  defaultValue="worldwide"
                  name="region-radio-button-group"
                >
                  {
                    CONTINENTS.map(continent => {
                      return (
                        <FormControlLabel
                          componentsProps={{
                            typography: {
                              fontSize: 12,
                            },
                          }}
                          className={classes.formControlLabel}
                          value={String(continent).toLowerCase()}
                          control={
                            <Radio
                              color='secondary'
                              size="small"
                              className={classes.radio}
                            />
                          }
                          label={continent}
                        />
                      )
                    })
                  }
                </RadioGroup>
              </FormControl>
            </Box>
            <Divider sx={{ width: '100%' }} />
            <Box sx={{ width: '100%' }} p={2}>
              <FormControl sx={{ my: 1 }}>
                <FormLabel
                  id="region-form-label"
                  sx={{ py: 1, fontSize: 13, fontWeight: 'bold' }}
                >
                  Frequent Markets
                </FormLabel>
                <Typography variant="caption" color="#aaa">
                  You have not participated in any markets on Opportunity
                </Typography>
              </FormControl>

            </Box>


            <Box sx={{ width: '100%' }} p={2}>
              <FormControl sx={{ my: 1 }}>
                <FormLabel
                  id="region-form-label"
                  sx={{ py: 1, fontSize: 13, fontWeight: 'bold' }}
                >
                  Default Opportunity Markets
                </FormLabel>
                {MARKETS.map((market) => {
                  return (
                    <Box
                      component={Typography}
                      sx={{ display: 'block', mt: 1, cursor: 'pointer' }}
                      variant="button"
                      color="rgba(33, 33, 33, .85)"
                    >
                      {market.market}
                    </Box>
                  )
                })}
              </FormControl>
            </Box>
          </Drawer>
          :
          null
      }

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: '120px',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
