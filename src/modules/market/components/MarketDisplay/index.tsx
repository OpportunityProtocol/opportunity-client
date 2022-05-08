import React, { useState } from 'react'
import { useStyles } from './MarketDisplayStyles'


import {
  Typography,
  CardContent,
  Divider,
  Box,
  Avatar,
  Grid,
  AvatarGroup,
  Stack
} from '@mui/material'
import ClickableCard from '../../../../common/components/ClickableCard/ClickableCard'
import { useRouter } from 'next/router'

interface IMarketDisplayProps {
  market: string,
  isShowingStats: boolean
}

const MarketDisplay: React.FunctionComponent<IMarketDisplayProps> = ({ market, isShowingStats }) => {
  const classes = useStyles()
  const router = useRouter()

  return (
      <ClickableCard variant='outlined' onClick={() => router.push('/jobs')}>
        <CardContent className={classes.primaryContentContainer}>
          <Grid container direction='row' alignItems='center' justifyContent='space-between'>
            <Grid item>
              <Typography sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}>
                {market}
              </Typography>
            </Grid>

            <Grid item />
          </Grid>

          <Typography py={1} style={{ fontSize: 15 }} color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
          <Typography color='secondary' pt={2} variant='body2'>
          {Math.floor(Math.random() * 3200)} contracts and services available
          </Typography>
        </CardContent>

      </ClickableCard>
  )
}

export default MarketDisplay