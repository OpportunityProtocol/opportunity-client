import React, { Fragment, useEffect, useState } from 'react'
import { useStyles } from './JobStyles'

import {
    Box,
    Typography,
    Paper,
    IconButton,
    Pagination,
    Chip,
    Grid,
    Divider,
    Button,
    Stack,
    Tabs,
    Tab,
    InputBase,
} from '@mui/material'



import { Archive, Search } from '@mui/icons-material'
import MarketDisplay from '../../modules/market/components/MarketDisplay'
import MarketToolbar from '../../modules/market/components/MarketToolbar'

import {
    ArrowBack,
    FilterList,
    Refresh,
    Cancel,
} from '@mui/icons-material/'

import JobDisplay from "../../modules/market/components/JobDisplay";

import Link from 'next/link'
import { ArrowDropDown } from '@mui/icons-material'
import { FaChevronDown } from 'react-icons/fa'

const dummyRelationships = new Array(20).fill(1);

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index: number) {
    return {
        value: index,
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

const Jobs: React.FunctionComponent = () => {
    const classes = useStyles()

    const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

    const getRelationships = () => {
        return dummyRelationships.map(relationship => (
            <Grid item xs={4}>
                <JobDisplay />
             </Grid>
        ))
    }

    return (
        <Box className={classes.root}>
            <Grid
            container
            xs={12}
            direction='column'
            alignItems='center'
            sx={{ padding: '1% 3%', borderBottom: 1, borderColor: 'divider' }}
            bgcolor='#fff'
            >
              
              <Box sx={{ width: '100%', my: 5, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>

                        <Typography fontSize={35} fontWeight='600' color='rgba(33, 33, 33, .85)'>
                           Contracts and Services
                        </Typography>
                        <Typography fontSize={16} fontWeight='normal' color='#000'>
                           Showing 56 unique contracts in <Typography component='span' fontWeight='bold'>Writing & Translation</Typography>
                        </Typography>
              
    </Box>

    <Box sx={{ borderBottom: 1, width: '100%', borderColor: 'divider' }}>
    <Tabs
    variant='fullWidth'
        value={value}
        onChange={handleChange}
        sx={{  }}
      >
        <Tab sx={{fontSize: 15, width: 350, color: '#aaa'}} label="All Contracts" {...a11yProps(0)} />
        <Tab sx={{fontSize: 15}} label="Jobs" {...a11yProps(1)} />
        <Tab sx={{fontSize: 15}} label="Services" {...a11yProps(2)} />
      </Tabs>
      </Box>

    <TabPanel value={0} index={0}>
    <Grid container direction='row' spacing={4}>
                {getRelationships()}
            </Grid>
      </TabPanel>
      <TabPanel value={1} index={1}>
        Item One
      </TabPanel>

        {
            dummyRelationships?.length === 0 ?
                <Box>
                    <Typography>
                        No listings exist in this market.  Be the first to post one.
                    </Typography>
                </Box>
                :
                null
            }
            </Grid>

            <Box className={classes.containerCentered}>
                <Pagination count={10} variant="outlined" shape="rounded" />
            </Box>
        </Box>
    )
}

export default Jobs

