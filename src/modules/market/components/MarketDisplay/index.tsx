import React, { useState } from 'react'
import { useStyles } from './MarketDisplayStyles'


import {
  Grid,
  Typography,
  Icon,
  Card,
  Chip,
  Divider,
  CardContent,
} from '@mui/material'
import ClickableCard from '../../../../common/components/ClickableCard/ClickableCard'
import { useRouter } from 'next/router'

const MarketDisplay: React.FunctionComponent = () => {
  const classes = useStyles()
  const router = useRouter()

  return (
      <ClickableCard variant='outlined' onClick={() => router.push('/jobs')}>
        <CardContent>
          <Grid container direction='row' alignItems='center' justifyContent='space-between'>
            <Grid item>
              <Typography className={classes.marketTitle}>
                Ride Sharing (Los Angeles, CA)
              </Typography>
            </Grid>

            <Grid item>
              <Chip 
              size='small'
              variant='outlined' 
              icon={
                <Icon 
                fontSize='small' 
                color='secondary'>
                  location_on
                </Icon>} 
                label="Worldwide" 
              />
            </Grid>
          </Grid>

          <Typography py={1} style={{ fontSize: 15 }} color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <Divider />
        <CardContent>
          <Typography variant='caption'>
                This market has an average trust score of: {" "}
          </Typography>
          <Typography color='rgb(54, 119, 74)' variant='caption' component='span'>
          .78 (0 - 1)
          </Typography>
        </CardContent>
      </ClickableCard>
  )
}

export default MarketDisplay