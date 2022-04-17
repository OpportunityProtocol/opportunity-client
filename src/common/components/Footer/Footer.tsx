import React from 'react';
import useStyles from './FooterStyles';

import { Box, Grid, Divider, Typography } from '@mui/material';
import Link from 'next/link';


export default function Footer() {
  const classes = useStyles();

  return (
    <Box className={classes.footer}>
      <Grid container direction='row' alignItems="flex-start" justifyContent="space-between">
          <Grid item className={classes.contentContainer}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Box sx={{display: 'flex', alignItems: 'center' }}>
                <img src='/assets/logo.svg' style={{width: 80, height: 80}} />
              <Typography variant='h6' px={1}>GigEarth</Typography>
              </Box>
              <Typography fontWeight="light" color='primary'>Permissionless labor markets</Typography>
              </Box>
              <div className={classes.column}>
              <Typography color='primary'>Explore</Typography>
              <Link href=''>
              <Typography className={classes.link} fontWeight="light">Whitepaper</Typography>
              </Link>
              <Link  href='/faq'>
              <Typography className={classes.link}  fontWeight="light" >Frequently Asked Questions</Typography>
              </Link>
              </div>
              <div className={classes.column}>
              <Typography color='primary'>Contribute</Typography>
              <Link href=''>
              <Typography className={classes.link} fontWeight="light" >Client</Typography>
              </Link>
              <Link href=''>
              <Typography className={classes.link} fontWeight="light" >Core</Typography>
              </Link>
              <Link href=''>
              <Typography className={classes.link} fontWeight="light" >Website</Typography>
              </Link>
              </div>
              <div className={classes.column}>
              <Typography color='primary'>Community</Typography>
              <Link   href="https://discord.gg/pBRVWTQPvS">
              <Typography className={classes.link} fontWeight="light" >Discord</Typography>
              </Link>
              <Link href="https://github.com/OpportunityProtocol/opportunity-core">
              <Typography className={classes.link} fontWeight="light" >Github</Typography>
              </Link>
              </div>
            </Grid>
          </Grid>
      <Divider sx={{margin: '60px 0px'}} />
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Typography fontWeight='light' color='#212121'>
          Building with love for the world.  All code is open source at <Link className={classes.link} href='www.github.com/opportunityorganization'>www.github.com/opportunityorganization</Link>
        </Typography>
      </Box>
    </Box>
  );
}
