import React, { useState } from 'react'
import { useStyles } from './MarketDisplayStyles'


import {
  Grid,
  Typography,
  Icon,
  Card,
  Chip,
  CardContent,
} from '@mui/material'
import ClickableCard from '../../../../common/components/ClickableCard/ClickableCard'

import router from 'next/router'

const MarketDisplay = () => {
  const classes = useStyles()

  return (
      <ClickableCard variant='outlined' onClick={() => router.push('/jobs')}>
        <CardContent>
          <Grid container direction='row' alignItems='center' justifyContent='space-between'>
            <Grid item>
              <Typography className={classes.marketTitle}>
                Market Name
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
      </ClickableCard>
  )
}

export default MarketDisplay