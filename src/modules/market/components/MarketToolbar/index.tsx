import * as React from 'react'

import {
    Grid,
    Typography,
    Box, 
    Button
} from '@mui/material'

import { FaEthereum } from "react-icons/fa";

const MarketToolbar = () => {
    return (
        <Grid
        flexWrap="nowrap"
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ backgroundColor: '#fafafa', width: '100%' }}
      >
        <Box
          component={Grid}
          item
          container
          xs={6}
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
                <span>
                    <FaEthereum />
                </span>
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
          xs={6}
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
            <Button color="secondary" variant="contained">
              Add Funds
            </Button>
          </Grid>

          <Grid item mx={1}>
            <Button
              color="secondary"
              variant="outlined"
              sx={{
                fontSize: 12,
                backgroundColor: '#eee',
                border: '1px solid #eee',
              }}
            >
              Create Market
            </Button>
          </Grid>

          <Grid item mx={1}>
            <Button
              color="secondary"
              variant="outlined"
              sx={{
                fontSize: 12,
                backgroundColor: '#eee',
                border: '1px solid #eee',
              }}
            >
              Post Contract
            </Button>
          </Grid>
        </Box>
      </Grid>
    )
}

export default MarketToolbar