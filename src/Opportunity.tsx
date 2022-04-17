import React, { Fragment, useState, useEffect } from 'react'
import clsx from 'clsx'

import {
  Chip,
  Paper,
  Box,
  Drawer,
  Popover,
  InputBase,
  Grid,
  CssBaseline,
  Stack,
  Avatar,
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


import { Search, Add } from '@mui/icons-material'

import router, { useRouter } from 'next/router'
import Link from 'next/link'

import Blockies from 'react-blockies'
import useStyles from './OpportunityStyles'
import MarketToolbar from './modules/market/components/MarketToolbar'

import { FaEthereum } from 'react-icons/fa'
import { IoWalletSharp } from 'react-icons/io5'

const drawerWidth = 300

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 100,
    label: '100+',
  },
  {
    value: 500,
    label: '500+',
  },
  {
    value: 1000,
    label: '1000+',
  },
];

function valuetext(value: number) {
  return `${value}°C`;
}

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
import AccountPopover from './modules/user/components/AccountPopover/AccountPopover'
import NavigationBreadcrumbs from './common/components/Breadcrumbs/Breadcrumbs'

const Opportunity: React.FunctionComponent<IOpportunityProps> = ({ children }) => {
  const router = useRouter()
  const classes = useStyles()
  const [view, setView] = useState('Market')

  const isDrawerShowing = router.pathname.includes('create') || router.pathname.includes('dashboard') || router.pathname.includes('portfolio') || router.pathname == '/contract/view' ? false : true

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const isPadded = router.pathname === '/jobs' || router.pathname === '/dashboard' || router.pathname === '/contract/view'

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
        position="fixed"
        variant='elevation'
        elevation={0}
        
        sx={{ 
          width: { sm: `100%` },
          ml: { sm: `100%` },
          //boxShadow: '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)',
          bgcolor: "#fff", 
          height: '65px', 
          border: 'none !important',
          borderBottom: '1px solid #eee !important',
          //zIndex: (theme) => theme.zIndex.drawer 
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

<Grid item display='flex'>
            <Link href='/markets'>
              <img className={classes.clickableBrand} src='/assets/logo.svg' style={{  width: 35, height: 35}} />
              </Link>

              <Link href='/markets'>
              <Typography className={classes.clickableBrand} fontWeight='bold' fontSize={18} color="#212121">
                GigEarth
              </Typography>
              </Link>
              </Grid> 
            <Grid item >
            <Paper 
            elevation={0} 
              component="form"
              sx={{ display: 'flex', height: 40, alignItems: 'center', width: 500, border: '1px solid #eee', borderRadius: 0}}>
<InputBase

            startAdornment={<Search sx={{color: '#aaa'}} />}
        sx={{  borderRadius: '0px !important', ml: 1, flex: 1, flexGrow: 1, height: 30, fontSize: 14 }}
        placeholder="Find gigs, anytime"
        inputProps={{ 'aria-label': 'search google maps', style: { padding: '0px 10px'} }}
      />
       <Button sx={{ borderRadius: '0px !important', color: '#fff', height: 40 }} disableElevation color='secondary' variant='contained'>
        Search
      </Button>
    </Paper>
            </Grid>

            <Grid item >
              <div>
              <Link href='/dashboard'>
              <Typography onClick={() => setView('Dashboard')} component={Button} mx={2} fontSize={14} variant="button" color={view === 'Dashboard' ? 'secondary' : "#212121"} fontWeight='bold'>
                  My Network
                </Typography>
                </Link>

                <Link href='/markets'>
                <Typography onClick={() => setView('Markets')} component={Button} mx={2} fontSize={14} variant="button" color={view === 'Markets' || router.pathname === '/' ? 'secondary' : "#212121"} fontWeight='bold'>
                  Markets
                </Typography>
                </Link>

                <Link href='/contract'>
                <Typography onClick={() => setView('Messenger')} component={Button} mx={2} fontSize={14} variant="button" color={view === 'Messenger' ? 'secondary' :"#212121"} fontWeight='bold'>
                  Messenger
                </Typography>
                </Link>
              </div>
            </Grid>

            <Grid
              item
         
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
            {/*  <Divider orientation='vertical' sx={{height: 65}} />
              <Stack width='auto' flexDirection='column' alignItems='center' p={2} component={CardActionArea}>
                <Typography color="#212121" fontWeight='medium' fontSize={15}>
                  Network
                </Typography>
                <Typography color='secondary' fontSize={12}>
                {Math.floor(Math.random() * 80)} Connections
                </Typography>
               </Stack>
            */}
             <Divider orientation='vertical' sx={{height: 65}} />
              <CardActionArea onClick={handleClick} className={classes.identityBox} aria-describedby='account-popover' aria-owns='account-popover'>
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
                        color: "#212121"
                      }}>
                        @happytowork
                      </Box>

                      <Box
                        className={classes.address}
                        sx={{
                          fontSize: 10,
                          color: "#212121"
                        }}>
                        0x4E3b49aDEf1487A08c73d47536f41Fe1c7c62137
                      </Box>
                    </Typography>

                  </div>
                  <IconButton size='small'>
                    <ArrowDropDown sx={{ color: "#212121" }} />
                  </IconButton>
                </div>
              </CardActionArea>
              <Popover 
style={{ position: 'absolute', top: 55}}
        id='account-popover'
        open={open}
      
        onClose={handleClose}
        anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
        }}
        > 
          <Box sx={{ p: 1 }}>
            <Typography component='div'>
              <Box sx={{ fontWeight: 'bold' }}>
                Welcome to GigEarth
              </Box>
              <Box sx={{ fontSize: 16, fontWeight: 'medium', color: 'rgb(94, 94, 94)' }}>
                Permissionless labor markets powered by unstoppable networks
              </Box>
            </Typography>
          </Box>
          <Box sx={{ p: 1, display: 'flex', alignItems: 'center'}}>
          <Avatar sx={{ width: 40, height: 40 }} src='/assets/stock/profile_main.jpeg' />
          <Typography component='div' px={2}>
                      <Box sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: "#212121"
                      }}>
                        @happytowork
                      </Box>

                      <Box
                        sx={{
                          fontSize: 10,
                          color: 'rgb(94, 94, 94)'
                        }}>
                        0x4E3b49aDEf1487A08c73d47536f41Fe1c7c62137
                      </Box>
                    </Typography>
          </Box>
          <Divider />
          <Grid
          flexWrap="nowrap"
          container
          direction="column">
              <Grid item sx={{p: 1, bgcolor: '#fbfbfd'}}>
                <Typography color='#212121' noWrap fontWeight='bold' fontSize={12}>
                  <IoWalletSharp size={10} />  Web3/Wallet Provider:{' '}
                </Typography>
                <Typography color='#212121' fontWeight="light" fontSize={12}>
                  MetaMask
                </Typography>
              </Grid>
<Divider />
<Grid item sx={{p: 1, bgcolor: '#fbfbfd'}}>
                <Typography color='#212121' fontWeight='bold' fontSize={12}>
                  <FaEthereum size={10} /> DAI Balance:{' '}
                </Typography>
                <Typography color='#212121' fontWeight="light" fontSize={12}>
                  $125.64
                </Typography>
              </Grid>
              <Divider />
              <Grid item sx={{p: 1, bgcolor: '#fbfbfd'}}>
                <Typography color='#212121' fontWeight='bold' fontSize={12}>
                  <FaEthereum size={10} /> UST Balance:{' '}
                </Typography>
                <Typography color='#212121' fontWeight="light" fontSize={12}>
                  $23.22
                </Typography>
              </Grid>
<Divider />
        </Grid>
           <Box m={2}>
           <Button fullWidth variant='contained' color='secondary'>
                      Add Funds
                    </Button>
           </Box>

        </Popover>

            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          bgcolor: '#fbfbfd',
          flexGrow: 1,
          paddingTop: isPadded ? '60px' : '0px',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

const MarketDrawerContent = ({ classes }: IMarketDrawerContentProps) => (
    <Box py={2}>
              
              <div>
                <FilterListIcon fontSize='small' />
                <Typography py={1} fontWeight='bold' fontSize={13}>
                  Filters
                </Typography>
              </div>

              <FormControl sx={{ my: 2 }}>
    <FormLabel
      id="content-type-form-label"
      sx={{ fontSize: 13, fontWeight: 'bold' }}
    >
      Market Filters
    </FormLabel>
    <RadioGroup
      aria-labelledby="content-type-form-label"
      defaultValue="female"
      name="content-type-radio-button-group"
    >
            <FormControlLabel
              componentsProps={{
                typography: {
                  fontSize: 12,
                },
              }}
              value={'Markets'}
              control={
                <Radio
                  color='secondary'
                  size="small"
                />
              }
              label="Only show markets I've participatd in"
            />
    </RadioGroup>
    <Box pt={1}>
    <Typography id="input-slider" gutterBottom variant='caption'>
        Contracts
      </Typography>
      <Slider
        aria-label="Custom marks"
        defaultValue={100}
        step={100}
        valueLabelDisplay="auto"
        marks={marks}
        sx={{ width: '90%' }}
      />
          </Box>

          <Box pt={1}>
          <Typography id="input-slider" gutterBottom variant='caption'>
        Services
      </Typography>
      <Slider
        aria-label="Custom marks"
        defaultValue={20}
        step={10}
        valueLabelDisplay="auto"
        marks={marks}
        sx={{ width: '90%' }}
      />
                </Box>
  </FormControl>

  
            </Box>
  )

const ContractChatsContent = ({ classes, currentContracts }: IContractChatsContentProps ) =>  (
  <Box sx={{ my: 2, width: '100%', height: 500, overflow: 'scroll', }} >
      <List>
        {
          new Array(100).fill(100).map(chat => {
            return (
              <Link href='/contract'>
              <ListItemButton component={ListItem}>
              <ListItemAvatar>
              <Blockies
                      seed={Math.random().toString()}
                      size={10}
                      scale={3}
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
  <Box>
              
  <div>
    <FilterListIcon fontSize='small' />
    <Typography py={1} fontWeight='bold' fontSize={13}>
      Filters
    </Typography>
  </div>
<Box>
<FormControl sx={{ my: 2 }}>
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
              value={String(marketType.type).toLowerCase()}
              control={
                <Radio
                  color='secondary'
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
  <FormControl sx={{ my: 2, width: '100%' }}>
    <FormLabel
      id="content-type-form-label"
      sx={{ fontSize: 13, fontWeight: 'bold' }}
    >
      Number of times sold
    </FormLabel>
    <Box sx={{width: '90%'}}>
    <Slider
        aria-label="Always visible"
        defaultValue={80}
        //getAriaValueText={valuetext}
        step={10}
        marks={TIMES_SOLD_MARKS}
        valueLabelDisplay="off"
      />
          </Box>
  </FormControl>
</Box>

<Box sx={{display: 'flex', flexDirection: 'column'}}>
<FormControl sx={{ my: 2 }}>
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
              value={String(marketType.type).toLowerCase()}
              control={
                <Radio
                  color='secondary'
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

<FormControl sx={{ my: 2 }}>
    <FormLabel
      id="content-type-form-label"
      sx={{ fontSize: 13, fontWeight: 'bold' }}
    >
      Connected sin
    </FormLabel>
    <Box sx={{width: '90%'}}>
    <Slider
        aria-label="Always visible"
        defaultValue={80}
        //getAriaValueText={valuetext}
        step={10}
        marks={CONNECTED_SINCE_MARKS}
        valueLabelDisplay="off"
      />
      </Box>
  </FormControl>
  <FormControl sx={{ my: 2 }}>
    <FormLabel
      id="content-type-form-label"
      sx={{ fontSize: 13, fontWeight: 'bold' }}
    >
      Number of mutual followers
    </FormLabel>
    <Box sx={{width: '90%'}}>
    <Slider
        aria-label="Always visible"
        defaultValue={80}
        //getAriaValueText={valuetext}
        step={10}
        marks={MUTUAL_CONNECTIONS_MARKS}
        valueLabelDisplay="off"
      />
      </Box>
  </FormControl>

</Box>
</Box>
)

export default Opportunity