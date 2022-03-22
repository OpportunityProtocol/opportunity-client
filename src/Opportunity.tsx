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
  Stack,
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
  Slider,
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
]

const USER_TYPE = [
  {
    label: 'Employer',
    type: 'default'
  },
  {
    label: 'Worker',
    type: 'default'
  },
]

const MARKET_TYPES = [
  {
    label: 'Traditional',
    type: 'default'
  },
]

const CONTENT_TYPES = [
  {
    label: 'Saleable',
    type: 'default'
  },
  {
    label: 'Service',
    type: 'default'
  }
]

const CONNECTED_SINCE_MARKS = [
  {
    value: 0,
    label: '1m',
  },
  {
    value: 20,
    label: '6m',
  },
  {
    value: 37,
    label: '1y',
  },
  {
    value: 100,
    label: '5y+',
  },
]

const MUTUAL_CONNECTIONS_MARKS = [
  {
    value: 0,
    label: '1+',
  },
  {
    value: 20,
    label: '10+',
  },
  {
    value: 37,
    label: '50+',
  },
  {
    value: 100,
    label: '100+',
  },
]

const TIMES_SOLD_MARKS = [
  {
    value: 0,
    label: '10+',
  },
  {
    value: 20,
    label: '50+',
  },
  {
    value: 37,
    label: '80+',
  },
  {
    value: 100,
    label: '100+',
  },
]

import FilterListIcon from '@mui/icons-material/FilterList';
import { ArrowDropDown } from '@mui/icons-material'

import { IOpportunityProps, IContractChatsContentProps, IMarketDrawerContentProps  } from './OpportunityInterfaces'

const Opportunity: React.FunctionComponent<IOpportunityProps> = ({ children }) => {
  const router = useRouter()
  const classes = useStyles()
  const [view, setView] = useState('Market')

  const isDrawerShowing = router.pathname.includes('create') || router.pathname.includes('dashboard') || router.pathname.includes('portfolio') ? false : true

  const renderDrawerContent = () => {
    switch(router.pathname) {
      case '/contract':
        return <ContractChatsContent classes={classes} currentContracts={[]} />
      case '/network':
        return <NetworkFilterContent classes={classes} />
      case '/market':
      default:
        return <MarketDrawerContent classes={classes} />
    }
    
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{ 
          bgcolor: '#fff', 
          height: '65px', 
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
            <Link href='/markets'>
              <img className={classes.clickableBrand} src='/assets/logo.svg' style={{  width: 35, height: 35}} />
              </Link>

              <Link href='/markets'>
              <Typography className={classes.clickableBrand} fontWeight='bold' fontSize={18} color="#212121">
                GigEarth
              </Typography>
              </Link>
            </Grid>

            <Grid item xs={4}>
              <div className={classes.flexRow}>
              <Link href='/dashboard'>
              <Typography onClick={() => setView('Dashboard')} component={Button} mx={2} variant="button" color={view === 'Dashboard' ? 'secondary' : '#212121'} fontWeight={view === 'Dashboard' ? 'bold' : 'medium'}>
                  Dashboard
                </Typography>
                </Link>

                <Link href='/markets'>
                <Typography onClick={() => setView('Markets')} component={Button} mx={2} variant="button" color={view === 'Markets' ? 'secondary' : '#212121'} fontWeight={view === 'Markets' ? 'bold' : 'medium'}>
                  Markets
                </Typography>
                </Link>

                <Link href='/contract'>
                <Typography onClick={() => setView('Messenger')} component={Button} mx={2} variant="button" color={view === 'Messenger' ? 'secondary' : '#212121'} fontWeight={view === 'Messenger' ? 'bold' : 'medium'}>
                  Messenger
                </Typography>
                </Link>

                <Link href='/network'>
                <Typography onClick={() => setView('Portfolio')} component={Button} mx={2} variant="button" color={view === 'Portfolio' ? 'secondary' : '#212121'} fontWeight={view === 'Portfolio' ? 'bold' : 'medium'}>
                  Network
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
              <Divider orientation='vertical' sx={{height: 65}} />
              <Stack width='auto' flexDirection='column' alignItems='center' p={2} component={CardActionArea}>
                <Typography color='#212121' fontWeight='medium' fontSize={15}>
                  Network
                </Typography>
                <Typography color='secondary' fontSize={12}>
                {Math.floor(Math.random() * 80)} Connections
                </Typography>
               </Stack>
              <Divider orientation='vertical' sx={{height: 65}} />
              <CardActionArea className={classes.identityBox}>
                <Blockies
                  seed="Max"
                  size={10}
                  scale={3}
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
                        @happytowork
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
                borderRight: '1px solid #ddd',
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
                  Default Markets
                </FormLabel>
                {MARKETS.map((market) => {
                  return (
                    <Link href='/jobs'>
                    <Box
                    className={classes.defaultMarketLink}
                      component={Typography}
                      sx={{ display: 'block', mt: 1, cursor: 'pointer' }}
                      variant="button"
                      color="rgba(33, 33, 33, .85)"
                    >
                      {market.market}
                    </Box>
                    </Link>
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

const MarketDrawerContent = ({ classes }: IMarketDrawerContentProps) => (
    <Box p={2} className={classes.marketContentContainer}>
              
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
            </Box>
  )

const ContractChatsContent = ({ classes, currentContracts }: IContractChatsContentProps ) =>  (
  <Box sx={{ width: '100%', height: 500, overflow: 'scroll', }} >
      <List>
        {
          new Array(100).fill(100).map(chat => {
            return (
              <Link href='/contract'>
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
            </Link>
            )
          })
        }
      </List>
  </Box>
)

const NetworkFilterContent = ({ classes }: IContractChatsContentProps ) =>  (
  <Box p={2} className={classes.marketContentContainer}>
              
  <div className={classes.row}>
    <FilterListIcon fontSize='small' />
    <Typography px={1} fontWeight='bold' fontSize={13}>
      Filters
    </Typography>
  </div>
<Box>
<FormControl sx={{ my: 1 }}>
    <FormLabel
      id="content-type-form-label"
      sx={{ fontSize: 13, fontWeight: 'bold' }}
    >
      Content Type
    </FormLabel>
    <RadioGroup
      aria-labelledby="content-type-form-label"
      defaultValue="female"
      name="content-type-radio-button-group"
    >
      {
        CONTENT_TYPES.map(marketType => {
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
  <FormControl sx={{ my: 1, width: '100%' }}>
    <FormLabel
      id="content-type-form-label"
      sx={{ fontSize: 13, fontWeight: 'bold' }}
    >
      Number of times sold
    </FormLabel>
    <Slider
        aria-label="Always visible"
        defaultValue={80}
        //getAriaValueText={valuetext}
        step={10}
        marks={TIMES_SOLD_MARKS}
        valueLabelDisplay="off"
      />
  </FormControl>
</Box>
<Divider />
<Box sx={{display: 'flex', flexDirection: 'column'}}>
<FormControl sx={{ my: 1 }}>
    <FormLabel
      id="content-type-form-label"
      sx={{ fontSize: 13, fontWeight: 'bold' }}
    >
      Content Type
    </FormLabel>
    <RadioGroup
      aria-labelledby="content-type-form-label"
      defaultValue="female"
      name="content-type-radio-button-group"
    >
      {
        USER_TYPE.map(marketType => {
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
      id="content-type-form-label"
      sx={{ fontSize: 13, fontWeight: 'bold' }}
    >
      Connected since
    </FormLabel>
    <Slider
        aria-label="Always visible"
        defaultValue={80}
        //getAriaValueText={valuetext}
        step={10}
        marks={CONNECTED_SINCE_MARKS}
        valueLabelDisplay="off"
      />
  </FormControl>
  <FormControl sx={{ my: 1 }}>
    <FormLabel
      id="content-type-form-label"
      sx={{ fontSize: 13, fontWeight: 'bold' }}
    >
      Number of mutual followers
    </FormLabel>
    <Slider
        aria-label="Always visible"
        defaultValue={80}
        //getAriaValueText={valuetext}
        step={10}
        marks={MUTUAL_CONNECTIONS_MARKS}
        valueLabelDisplay="off"
      />
  </FormControl>

</Box>

</Box>
)

export default Opportunity