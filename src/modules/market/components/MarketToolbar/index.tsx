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

const MarketToolbar = () => {
  const classes = useStyles()
    return (
      <Box component={Paper} elevation={2} sx={{ boxShadow:
        '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)', width: '100%' }}>
        <Grid
        flexWrap="nowrap"
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ backgroundColor: '#fff' }}>
        <Box
          component={Grid}
          item
          container
          xs={8}
          direction="row"
          alignItems="center"

        >
          <Grid item mx={5}>
            <Typography color='#212121' noWrap fontWeight='bold' fontSize={12}>
            <IoWalletSharp size={10} />  Web3/Wallet Provider:{' '}
            </Typography>
            <Typography color='#212121' fontWeight="light" fontSize={12}>
                  MetaMask
                </Typography>
          </Grid>

          <Grid item mx={5}>
            <Typography color='#212121' fontWeight='bold' fontSize={12}>
              <FaEthereum size={10} /> DAI Balance:{' '}
            </Typography>
            <Typography color='#212121' fontWeight="light" fontSize={12}>
                  $125.64
                </Typography>
          </Grid>

          <Grid item mx={5}>
            <Typography color='#212121' fontWeight='bold' fontSize={12}>
            <FaEthereum size={10} /> ETH Balance:{' '}
            </Typography>
            <Typography color='#212121' fontWeight="light" fontSize={12}>
                  $23.22
                </Typography>
          </Grid>

          <Grid item mx={5}>
            <Typography color='#212121' fontWeight='bold' fontSize={12}>
            <FaEthereum size={10} /> Treasury Balance (TIP):{' '}
            </Typography>
            <Typography color='#212121' fontWeight="light" fontSize={12}>
                  $2342.32
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
            <Button
              color="secondary"
              variant="outlined"
              size='small'
            >
              Create Market
            </Button>
          </Grid>

          <Grid item mx={1}>
            <Link href='/contract/create'>
            <Button
              color="secondary"
              variant="outlined"
              size='small'
            >
              Post Contract
            </Button>
            </Link>
          </Grid>
        </Box>
      </Grid>
      <Divider />
      </Box>
    )
}

export default MarketToolbar