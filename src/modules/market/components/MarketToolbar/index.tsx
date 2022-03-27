import * as React from 'react'

import {
    Grid,
    Typography,
    Box, 
    Paper,
    Divider,
    Button
} from '@mui/material'

import Link from 'next/link'

import { useStyles } from './MarketToolbarStyles'
import { FaEthereum } from 'react-icons/fa'
import { IoWalletSharp } from 'react-icons/io5'
import { useRouter } from 'next/router'

const MarketToolbar: React.FunctionComponent = () => {
  const classes = useStyles()
  const router = useRouter()
  
    return (
      null
    )
}

export default MarketToolbar

/*
<Box component={Paper}  elevation={0} 
      classes={{
        root: classes.container
      }}
      >
          <Grid
          flexWrap="nowrap"
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between">
            <Box
            component={Grid}
            item
            container
            xs={8}
            direction="row"
            alignItems="center"
            spacing={5}
            >
              <Grid item >
                <Typography color='#212121' noWrap fontWeight='bold' fontSize={12}>
                  <IoWalletSharp size={10} />  Web3/Wallet Provider:{' '}
                </Typography>
                <Typography color='#212121' fontWeight="light" fontSize={12}>
                  MetaMask
                </Typography>
              </Grid>

              <Grid item>
                <Typography color='#212121' fontWeight='bold' fontSize={12}>
                  <FaEthereum size={10} /> DAI Balance:{' '}
                </Typography>
                <Typography color='#212121' fontWeight="light" fontSize={12}>
                  $125.64
                </Typography>
              </Grid>

              <Grid item>
                <Typography color='#212121' fontWeight='bold' fontSize={12}>
                  <FaEthereum size={10} /> UST Balance:{' '}
                </Typography>
                <Typography color='#212121' fontWeight="light" fontSize={12}>
                  $23.22
                </Typography>
              </Grid>
            </Box>

            <Box
            component={Grid}
            container
            item
            xs={4}
            direction="row"
            alignItems="center"
            height={60}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
           }}
           >

            <Grid item mx={1}>
              <Link href='/contract/create'>
                <Button
                color="secondary"
                variant="outlined"
                size='small'
                >
                  Create Contract
                </Button>
              </Link>
            </Grid>
            <Grid item mx={1}>
              <Link href='/contract/create'>
                <Button
                color="secondary"
                variant="outlined"
                size='small'
                >
                  Create Post
                </Button>
              </Link>
            </Grid>
          </Box>
        </Grid>
        <Divider />
      </Box>
      */