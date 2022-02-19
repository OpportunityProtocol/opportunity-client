import React, { useState } from 'react'
import useStyles from './MarketDisplayStyles'


import {
  Paper,
  Box,
  Grid,
  Divider,
  Typography,
  TableRow,
  Tooltip,
  Icon,
  TableCell,
  Button,
  IconButton,
  Card,
  CardActions,
  Chip,
  CardContent,
  CardMedia,
  useTheme
} from '@mui/material'

import { green } from '@mui/material/colors';

const MarketDisplay = () => {
  const classes = useStyles()

  return (
    <>
      <Card
        variant='outlined'
        classes={{ root: classes.cardRoot }}
        className={classes.card}
      >
        <CardContent>
          <Grid container direction='row' alignItems='center' justifyContent='space-between'>
            <Grid item>
              <Typography className={classes.marketTitle}>
                Market Name
              </Typography>
            </Grid>

            <Grid item>
            <Chip variant='outlined' icon={<Icon fontSize='small' color='secondary' >language</Icon>} label="Worldwide" sx={{border: '1px solid #eee'}} />
            </Grid>
          </Grid>

          <Typography py={1} style={{ fontSize: 15 }} color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default MarketDisplay