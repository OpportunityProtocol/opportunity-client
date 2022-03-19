import React, { useState } from 'react'
import { useStyles } from './MarketDisplayStyles'


import {
  Typography,
  CardContent,
  Box,
  Avatar,
  Grid,
  AvatarGroup,
  Stack
} from '@mui/material'
import ClickableCard from '../../../../common/components/ClickableCard/ClickableCard'
import { useRouter } from 'next/router'

const MarketDisplay: React.FunctionComponent = ({ market }) => {
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
          <Box component={Grid} container alignItems='center' justifyContent='space-between'>
            <Grid item sx={{display: 'flex', alignItems: 'center'}}>
              <Stack direction='column' pr={1} alignItems='center'>
                  <Typography fontSize={12} color='#bbb'>
                    Unclaimed
                  </Typography>
                  <Typography fontSize={12} fontWeight='medium'>
                    2500
                  </Typography>
              </Stack>

              <Stack direction='column' pr={1} >
              <Typography fontSize={12} color='#bbb'>
                    Total Contracts
                  </Typography>
                  <Typography fontSize={12} fontWeight='medium'>
                    2500
                  </Typography>
              </Stack>

              <Stack direction='column' pr={1}>
              <Typography fontSize={12} color='#bbb'>
                    Value Settled
                  </Typography>
                  <Typography fontSize={12} fontWeight='medium'>
                    2500
                  </Typography>
              </Stack>
            </Grid>

            <Grid item>
            <AvatarGroup max={3} sx={{ margin: '0px !important', justifyContent: 'flex-start'}}>
                          {
                            new Array(3).fill(<Avatar sx={{ width: 15, height: 15 }} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />).map(item => (item))
                          }
                    </AvatarGroup>
            </Grid>
          </Box>
        </CardContent>
       {/*} <Divider />
        <CardContent>
          <Typography variant='caption'>
                This market has an average trust score of: {" "}
          </Typography>
          <Typography color='rgb(54, 119, 74)' variant='caption' component='span'>
          .78 (0 - 1)
          </Typography>
              </CardContent>*/}
      </ClickableCard>
  )
}

export default MarketDisplay