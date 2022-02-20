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
  Radio,
  FormControlLabel,
  AppBar,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material'

import Markets from './pages/markets/'

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


export default function Opportunity() {
  const classes = useStyles()

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        variant="outlined"
        position="fixed"
        sx={{ 
          bgcolor: '#424242', 
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
              <Typography variant="h6" color="#fff">
                Opportunity
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <div className={classes.flexRow}>
                <Typography mx={2} variant="button" color="secondary">
                  Markets
                </Typography>

                <Typography mx={2} variant="button" color="#eee">
                  My Jobs
                </Typography>

                <Typography mx={2} variant="button" color="#eee">
                  My Contracts
                </Typography>

                <Typography mx={2} variant="button" color="#eee">
                  Messenger
                </Typography>
              </div>
            </Grid>

            <Grid
              item
              xs={4}
              className={classes.flexRowEnd}
            >
              <Blockies
                seed="Max"
                size={10}
                scale={3}
                color="#212121"
                bgColor="#aaa"
                spotColor="#eee"
              />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

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
            border: 'none',
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
      >
        <Toolbar />

        <Box sx={{ width: '100%', p: 2 }} >
          <Typography variant="h6" fontSize={15}>
            Filters
          </Typography>
          
          <FormControl sx={{ my: 1 }}>
          <FormLabel
              id="market-type-form-label"
              sx={{ fontSize: 15, fontWeight: 'medium' }}
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
              sx={{ fontSize: 15, fontWeight: 'medium' }}
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
          <Typography variant="h6" fontSize={15}>
            Frequent Markets
          </Typography>
          <Typography variant="caption" color="#aaa">
            You have not participated in any markets on Opportunity
          </Typography>
        </Box>

        <Divider sx={{ width: '100%' }} />

        <Box sx={{ width: '100%' }} p={2}>
          <Typography variant="h6" fontSize={15}>
            Default Opportunity Markets
          </Typography>
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
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          backgroundColor: 'inherit',
          position: 'relative',
          paddingTop: 8,
        }}
      >
          <MarketToolbar />
          <Markets />
      </Box>
    </Box>
  )
}
