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
  isShowingStats: boolean,
  showDescription: boolean;
  showStats: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (marketData: object) => void;
}

const MarketDisplay: React.FunctionComponent<IMarketDisplayProps> = ({ market, isShowingStats, showDescription=true, showStats=true, selectable, selected=false, onSelect }) => {
  const classes = useStyles()
  const router = useRouter()

  const handleOnSelect = () => {
    // do something


    onSelect(market)
  }

  return (
      <ClickableCard sx={{ border: (theme) => selected ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd' }} variant='outlined' onClick={selectable ? () => handleOnSelect() : () => router.push('/jobs')}>
        <CardContent className={classes.primaryContentContainer}>
          <Grid container direction='row' alignItems='center' justifyContent='space-between'>
            <Grid item>
              <Typography sx={{ height: 20, fontWeight: (theme) => theme.typography.fontWeightBold }}>
                {market}
              </Typography>
            </Grid>

            <Grid item />
          </Grid>
          {
            showDescription &&
            <Typography py={1} style={{ height: 120, fontSize: 15 }} color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>

          }

          {
            showStats &&
            <Typography color='#49A882' pt={2} variant='body2' sx={{ height: 60}}>
            {Math.floor(Math.random() * 3200)} contracts and services available
            </Typography>
          }

        </CardContent>

      </ClickableCard>
  )
}

export default MarketDisplay