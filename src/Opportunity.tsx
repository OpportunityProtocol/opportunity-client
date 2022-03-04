import React, { Fragment, useState, useEffect } from 'react'
import clsx from 'clsx'

import {
  Chip,
  Paper,
  Box,
  Drawer,
  InputBase,
  Grid,
  CssBaseline,
  FormLabel,
  List,
  Button,
  ListItem,
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
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material'

import { Search } from '@mui/icons-material'

import router, { useRouter } from 'next/router'
import Link from 'next/link'

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
    label: 'Traditional',
    type: 'default'
  },
  {
    label: 'Bounty',
    type: 'default'
  }
]

import FilterListIcon from '@mui/icons-material/FilterList';
import { ArrowDropDown } from '@mui/icons-material'

interface IOpportunityProps {
  children: any
}

const Opportunity: React.FunctionComponent<IOpportunityProps> = ({ children }) => {
  const router = useRouter()
  const classes = useStyles()

  const isDrawerShowing = router.pathname.includes('create') ? false : true

  const renderDrawerContent = () => {
    return <ContractChatsContent classes={classes} />
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{ 
          bgcolor: '#fff', 
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
            <Grid item xs={4} style={{ display: 'flex' }}>
              <img src='/assets/logo.svg' style={{ margin: '0px 5px', width: 35, height: 35}} />
              <Typography fontWeight='bold' fontSize={18} color="#212121">
                Opportunity
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <div className={classes.flexRow}>
                <Link href='/markets'>
                <Typography component={Button} mx={2} variant="button" color="secondary" fontWeight='bold'>
                  Markets
                </Typography>
                </Link>

                <Link href='/jobs/myjobs'>
                <Typography component={Button} mx={2} variant="button" color="#212121" fontWeight='bold'>
                  My Jobs
                </Typography>
                </Link>

              <Link href='/jobs/mycontracts'>
                <Typography component={Button} mx={2} variant="button" color="#212121" fontWeight='bold'>
                  My Contracts
                </Typography>
                </Link>

                <Link href='/contract'>
                <Typography component={Button} mx={2} variant="button" color="#212121" fontWeight='bold'>
                  Messenger
                </Typography>
                </Link>
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
        <Divider />
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
            <Paper elevation={0} 
              component="form"
              sx={{ width: '100%', p: 1, border: '1px solid #eee', borderRadius: 2}}>
            <InputBase
      startAdornment={<Search fontSize='small' sx={{ color: '#aaa' }} />}
        sx={{ ml: 1, flex: 2, fontSize: 14 }}
        placeholder="Search jobs"
        inputProps={{ 'aria-label': 'search google maps' }}
      />
    </Paper>


            {
              renderDrawerContent()
            }
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


const MarketDrawerContent = ({ classes }) => (
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
  )

const ContractChatsContent = ({ classes, currentContracts }) =>  (
  <Box sx={{ width: '100%', height: 500, overflow: 'scroll', }} >
      <List>
        {
          new Array(100).fill(100).map(chat => {
            return (
              <ListItemButton component={ListItem} divider>
              <ListItemAvatar>
              <Blockies
                      seed={Math.random().toString()}
                      size={10}
                      scale={3}
                      className={classes.blockie}
                    />
    
              </ListItemAvatar>
              <ListItemText primary='Elijah Hampton' secondary={
                <React.Fragment>
                  <Typography noWrap sx={{ 
                    fontSize: 12,
                    fontWeight: 'medium',
                    color: '#212121'}}>
                      UI/UX designer needed for web development
                  </Typography>
                  <Typography sx={{
                     fontSize: 12,
                     fontWeight: 'medium',
                     color: '#aaa'
                  }}>
                  'Last thing said' 
                  </Typography>
                </React.Fragment>
              }
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 'bold',
              }} />
            </ListItemButton>
            )
          })
        }
      </List>
  </Box>
)

export default Opportunity