import React, { Fragment, useState, useEffect } from 'react'
import clsx from 'clsx'

import {
  Chip,
  Paper,
  Box,
  Drawer,
  Grid,
  IconButton,
  Fab,
  CssBaseline,
  Popover,
  FormLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  AppBar,
  Toolbar,
  Avatar,
  List,
  InputBase,
  Typography,
  Divider,
  TextField,
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Tooltip,
  ListItemAvatar,
  Checkbox,
  Badge,
  Stack,
} from '@mui/material'

import {
  Work,
  AttachMoney,
  Search,
  Add,
  AccountBalance,
  Email,
  Menu,
  ExpandLess,
  ExpandMore,
  Notifications,
  Inbox as InboxIcon,
  StarBorder,
  Mail as MailIcon,
  Home as HomeIcon,
  Help,
  CallMade,
} from '@mui/icons-material'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import {
  useTheme,
  withStyles,
  styled,
  emphasize,
  alpha,
} from '@mui/material/styles'

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




export default function Opportunity() {
  const classes = useStyles()
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        variant="outlined"
        position="fixed"
        sx={{ bgcolor: 'rgba(33, 33, 33, .85)', height: 65, zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          style={{
              width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
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
              <div style={{ display: 'flex', alignItems: 'center'}}>
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
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}
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
              id="demo-radio-buttons-group-label"
              sx={{ fontSize: 15, fontWeight: 'medium' }}
            >
              Market Type
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel
                componentsProps={{
                  typography: {
                    fontSize: 12,
                  },
                }}
                sx={{ padding: '0px !important', margin: '5px 0px !important' }}
                value="female"
                control={
                  <Radio
                  color='secondary'
                    sx={{
                      paddingBottom: '0px !important',
                      marginBottom: '0px !important',
                      paddingTop: '0px !important',
                      marginTop: '0px !important',
                    }}
                    size="small"
                  />
                }
                label="Opportunity Markets"
              />
              <FormControlLabel
                componentsProps={{
                  typography: {
                    fontSize: 12,
                  },
                }}
                sx={{ padding: '0px !important', margin: '5px 0px !important' }}
                value="male"
                control={
                  <Radio
                  color='secondary'
                    size="small"
                    sx={{
                      paddingBottom: '0px !important',
                      marginBottom: '0px !important',
                      paddingTop: '0px !important',
                      marginTop: '0px !important',
                    }}
                  />
                }
                label="Custom"
              />
            </RadioGroup>
          </FormControl>
          <FormControl sx={{ my: 1 }}>
            <FormLabel
              id="demo-radio-buttons-group-label"
              sx={{ fontSize: 15, fontWeight: 'medium' }}
            >
              Region
            </FormLabel>
            <RadioGroup
                              color='secondary'
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="worldwide"
              name="radio-buttons-group"
            >
              <FormControlLabel
                componentsProps={{
                  typography: {
                    fontSize: 12,
                  },
                }}
                sx={{ padding: '0px !important', margin: '5px 0px !important' }}
                value="worldwide"
                control={
                  <Radio
                  color='secondary'
                    size="small"
                    sx={{
                      paddingBottom: '0px !important',
                      marginBottom: '0px !important',
                      paddingTop: '0px !important',
                      marginTop: '0px !important',
                    }}
                  />
                }
                label="Worldwide"
              />

              <FormControlLabel
                componentsProps={{
                  typography: {
                    fontSize: 12,
                  },
                }}
                sx={{ padding: '0px !important', margin: '5px 0px !important' }}
                value="male"
                control={
                  <Radio
                  color='secondary'
                    size="small"
                    sx={{
                      paddingBottom: '0px !important',
                      marginBottom: '0px !important',
                      paddingTop: '0px !important',
                      marginTop: '0px !important',
                    }}
                  />
                }
                label="North America"
              />
              <FormControlLabel
                componentsProps={{
                  typography: {
                    fontSize: 12,
                  },
                }}
                sx={{ padding: '0px !important', margin: '5px 0px !important' }}
                value="female"
                control={
                  <Radio
                  color='secondary'
                    size="small"
                    sx={{
                      paddingBottom: '0px !important',
                      marginBottom: '0px !important',
                      paddingTop: '0px !important',
                      marginTop: '0px !important',
                    }}
                  />
                }
                label="South America"
              />
              <FormControlLabel
                componentsProps={{
                  typography: {
                    fontSize: 12,
                  },
                }}
                sx={{ padding: '0px !important', margin: '5px 0px !important' }}
                value="male"
                control={
                  <Radio
                  color='secondary'
                    size="small"
                    sx={{
                      paddingBottom: '0px !important',
                      marginBottom: '0px !important',
                      paddingTop: '0px !important',
                      marginTop: '0px !important',
                    }}
                  />
                }
                label="Europe"
              />
              <FormControlLabel
                componentsProps={{
                  typography: {
                    fontSize: 12,
                  },
                }}
                sx={{ padding: '0px !important', margin: '5px 0px !important' }}
                value="female"
                control={
                  <Radio
                  color='secondary'
                    size="small"
                    sx={{
                      paddingBottom: '0px !important',
                      marginBottom: '0px !important',
                      paddingTop: '0px !important',
                      marginTop: '0px !important',
                    }}
                  />
                }
                label="Asia"
              />
              <FormControlLabel
                componentsProps={{
                  typography: {
                    fontSize: 12,
                  },
                }}
                sx={{ padding: '0px !important', margin: '5px 0px !important' }}
                value="male"
                control={
                  <Radio
                  color='secondary'
                    size="small"
                    sx={{
                      paddingBottom: '0px !important',
                      marginBottom: '0px !important',
                      paddingTop: '0px !important',
                      marginTop: '0px !important',
                    }}
                  />
                }
                label="Africa"
              />
              <FormControlLabel
                componentsProps={{
                  typography: {
                    fontSize: 12,
                  },
                }}
                sx={{ padding: '0px !important', margin: '5px 0px !important' }}
                value="female"
                control={
                  <Radio
                  color='secondary'
                    size="small"
                    sx={{
                      paddingBottom: '0px !important',
                      marginBottom: '0px !important',
                      paddingTop: '0px !important',
                      marginTop: '0px !important',
                    }}
                  />
                }
                label="Antartica"
              />
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
          flexGrow: 1,
          bgcolor: 'background.default',
          position: 'relative',
          paddingTop: 8,
          bgcolor: '#fff',
        }}
      >
          <MarketToolbar />
          <Markets />
      </Box>
    </Box>
  )
}
