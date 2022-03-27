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
              <Typography className={classes.marketTitle}>
                {market}
              </Typography>
            </Grid>

            <Grid item />
          </Grid>

          <Typography py={1} style={{ fontSize: 15 }} color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        {isShowingStats ? 
        (<React.Fragment>
                 <Divider />
        <CardContent>
        <Box component={Grid} container alignItems='center' justifyContent='space-between'>
            <Grid item sx={{display: 'flex', alignItems: 'center'}}>

              <Stack direction='column' pr={2} >
              <Typography component='div'>
                <Box sx={{ fontWeight: 'bold', fontSize: 12, color: 'rgb(54, 119, 74)' }}>
                Contracts
                </Box>
                  </Typography>
                  <Typography fontSize={12} fontWeight='medium'>
                    {Math.floor(Math.random() * 2000).toFixed()}
                  </Typography>
              </Stack>

              <Stack direction='column' pr={2} >
              <Typography component='div'>
                <Box sx={{ fontWeight: 'bold', fontSize: 12, color: 'rgb(54, 119, 74)' }}>
                Services
                </Box>
                  </Typography>
                  <Typography fontSize={12} fontWeight='medium'>
                    {Math.floor(Math.random() * 2000).toFixed()}
                  </Typography>
              </Stack>

              <Stack direction='column' pr={2}>
              <Typography component='div'>
                <Box sx={{ fontWeight: 'bold', fontSize: 12, color: 'rgb(54, 119, 74)' }}>
                Value Settled
                </Box>
                  </Typography>
                  <Typography fontSize={12} fontWeight='medium'>
                  ${Math.floor(Math.random() * 2000).toFixed(2)}
                  </Typography>
              </Stack>
            </Grid>

           {/* <Grid item>
            <AvatarGroup max={3} sx={{ display: 'flex', alignItems: 'center', margin: '0px !important', justifyContent: 'flex-start'}}>
            <Avatar sx={{ width: 20, height: 20 }} alt="Remy Sharp" src="/assets/images/dai.png" />
            <Avatar sx={{ width: 15, height: 15 }} alt="Remy Sharp" src="/assets/images/terra.png" />
                    </AvatarGroup>
        </Grid>*/}
          <Grid item />
          </Box>
              </CardContent>
        </React.Fragment>)
        :
        null}
      </ClickableCard>
  )
}

export default MarketDisplay