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
    InputBase,
} from '@mui/material'

import { Search } from '@mui/icons-material'
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

const dummyRelationships = [
    {
        relationshipOwner: "0x74F6ff3Ae3f5EB38354FfB05867a37B7B40E6000",
        relationshipAddress: "0x74F6ff3Ae3f5EB38354FfB05867a37B7B40E6000",
        relationshipMarketAddress: "0x0",
        relationshipStatus: 0,
        relationshipMetadata: "",
        relationshipType: 0,
    },
    {
        relationshipOwner: "0x0",
        relationshipAddress: "0x0",
        relationshipMarketAddress: "0x0",
        relationshipStatus: 0,
        relationshipMetadata: "",
        relationshipType: 0,
    },
    {
        relationshipOwner: "0x0",
        relationshipAddress: "0x0",
        relationshipMarketAddress: "0x0",
        relationshipStatus: 0,
        relationshipMetadata: "",
        relationshipType: 0,
    },
    {
        relationshipOwner: "0x0",
        relationshipAddress: "0x0",
        relationshipMarketAddress: "0x0",
        relationshipStatus: 0,
        relationshipMetadata: "",
        relationshipType: 0,
    },
    {
        relationshipOwner: "0x0",
        relationshipAddress: "0x0",
        relationshipMarketAddress: "0x0",
        relationshipStatus: 0,
        relationshipMetadata: "",
        relationshipType: 0,
    },
    {
        relationshipOwner: "0x0",
        relationshipAddress: "0x0",
        relationshipMarketAddress: "0x0",
        relationshipStatus: 0,
        relationshipMetadata: "",
        relationshipType: 0,
    },
    {
        relationshipOwner: "0x0",
        relationshipAddress: "0x0",
        relationshipMarketAddress: "0x0",
        relationshipStatus: 0,
        relationshipMetadata: "",
        relationshipType: 0,
    },
    {
        relationshipOwner: "0x0",
        relationshipAddress: "0x0",
        relationshipMarketAddress: "0x0",
        relationshipStatus: 0,
        relationshipMetadata: "",
        relationshipType: 0,
    },
    {
        relationshipOwner: "0x0",
        relationshipAddress: "0x0",
        relationshipMarketAddress: "0x0",
        relationshipStatus: 0,
        relationshipMetadata: "",
        relationshipType: 0,
    }
]

const Jobs: React.FunctionComponent = () => {
    const classes = useStyles()

    const getRelationships = () => {
        return dummyRelationships.map(relationship => (
            <Grid item xs={12}>
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
            sx={{ padding: '1% 2%' }}
            bgcolor='#fbfbfd'
            >
                <Box sx={{ width: '100%' }}>
                    <Grid
                    my={2}
                    spacing={3}
                    container
                    flexDirection='row'
                    justifyContent='space-between'
                    alignItems='flex-start'>
                        <Grid
                        item>
                        <Typography flex={1} fontWeight='600' fontSize={22}>
                            Opportunities available <span style={{ color: '#ddd' }}>56</span>
                        </Typography>
                </Grid>

                <Grid item>
                    <Paper
                    elevation={0}
                    component="form"
                    sx={{ width: 600, p: 2, border: '1px solid #eee', borderRadius: 2, elevation: 0, display: 'flex', alignItems: 'center',  }}>
                        <Box sx={{ flex: 2, overflowX: 'scroll'}}>
                            <Chip 
                            component={Paper} 
                            elevation={0} 
                            variant='outlined' 
                            label='Web Development' 
                            onDelete={() => {}}
                            deleteIcon={<Cancel fontSize='small' />}
                            color='secondary' 
                            sx={{
                            mx: 1,
                            fontWeight: 'bold', 
                            border: '1px solid #C8E6C9', 
                            backgroundColor: '#fff', 
                            fontSize: 10 
                            }} />

                            <Chip 
                            component={Paper} 
                            elevation={0} 
                            variant='outlined' 
                            label='Python' 
                            onDelete={() => {}}
                            deleteIcon={<Cancel fontSize='small' />}
                            color='secondary' 
                            sx={{
                                mx: 1,
                                fontWeight: 'bold', 
                                border: '1px solid #C8E6C9', 
                                backgroundColor: '#fff', 
                                fontSize: 10 
                            }} />
                        </Box>

                    </Paper>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                        <Typography color='#bbb' fontWeight='bold' fontSize={12}>
                            Sort by {" "}
                            <span style={{ color: '#4caf50' }}> 
                                Last posted 
                            </span>
                            <span>
                                <IconButton fontSize='small'>
                                    <ArrowDropDown sx={{ color: '#bbb' }} />
                                </IconButton> 
                            </span>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Grid container direction='row' spacing={2}>
                {getRelationships()}
            </Grid>
        </Box>

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

