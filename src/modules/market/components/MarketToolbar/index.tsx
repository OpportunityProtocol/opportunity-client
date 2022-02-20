import * as React from 'react'

import {
    Grid,
    Typography,
    Box, 
    Button
} from '@mui/material'

import Link from 'next/link'

import { useStyles } from './MarketToolbarStyles'

const MarketToolbar = () => {
  const classes = useStyles()
    return (
        <Grid
        flexWrap="nowrap"
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        className={classes.container}
      >
        <Box
          component={Grid}
          item
          container
          xs={8}
          direction="row"
          alignItems="center"
          height={60}
        >
          <Grid item mx={5}>
            <Typography noWrap fontWeight="medium" fontSize={12}>
              Web3/Wallet Provider:{' '}
            </Typography>
            <Typography fontWeight="light" fontSize={12}>
                  MetaMask
                </Typography>
          </Grid>

          <Grid item mx={5}>
            <Typography fontWeight="medium" fontSize={12}>
              DAI Balance:{' '}
            </Typography>
            <Typography fontWeight="light" fontSize={12}>
                  0.00
                </Typography>
          </Grid>

          <Grid item mx={5}>
            <Typography fontWeight="medium" fontSize={12}>
              ETH Balance:{' '}
            </Typography>
            <Typography fontWeight="light" fontSize={12}>
                  0.00
                </Typography>
          </Grid>

          <Grid item mx={5}>
            <Typography fontWeight="medium" fontSize={12}>
              TIP Balance:{' '}
            </Typography>
            <Typography fontWeight="light" fontSize={12}>
                  0.00
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
            <Button color="secondary" variant="contained" size='small'>
              Add Funds
            </Button>
          </Grid>

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
    )
}

export default MarketToolbar