import React from 'react';
import useStyles from './FooterStyles';

import { Box, Stack, Grid, Divider, Typography, alpha, darken } from '@mui/material';
import Link from 'next/link';
import  { SiGhost , SiTwitter, SiDiscord, SiGithub } from "react-icons/si";

export default function Footer() {
  const classes = useStyles();

  return (
    <Box className={classes.footer}>
      <Grid py={5} container direction='row' alignItems="flex-start" justifyContent="space-between">
          <Grid item className={classes.contentContainer}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Box sx={{display: 'flex', alignItems: 'center' }}>
                <img src='vercel.svg' style={{width: 30, height: 30}} />
              <Typography variant='h6' color='#212121' px={1}>Lens Talent</Typography>
              </Box>
              <Typography fontWeight="medium" color='#212121'>Permissionless labor markets</Typography>
              </Box>
              <div className={classes.column}>
              <Typography fontWeight='bold' fontSize={13} color='#212121'>Protocol</Typography>
              <Link  href='/faq'>
              <Typography className={classes.link} fontSize={12} fontWeight="medium" color='text.secondary'>Frequently Asked Questions</Typography>
              </Link>
              <Link href=''>
              <Typography className={classes.link} fontSize={12} fontWeight="medium" color='text.secondary'>Docs</Typography>
              </Link>
              <Link href=''>
              <Typography className={classes.link} fontSize={12} fontWeight="medium" color='text.secondary'>Developers</Typography>
              </Link>
              </div>
              <div className={classes.column}>
              <Typography fontWeight='bold' fontSize={12} color='#212121'>Community</Typography>

              <Link href=''>
              <Typography fontSize={12} fontWeight="medium" color='text.secondary' className={classes.link} >Client</Typography>
              </Link>
              <Link href=''>
              <Typography className={classes.link} fontSize={12} fontWeight="medium" color='text.secondary'>Core</Typography>
              </Link>
              <Link href=''>
              <Typography className={classes.link} fontSize={12} fontWeight="medium" color='text.secondary'>Website</Typography>
              </Link>
              </div>
              <div className={classes.column}>
              <Typography fontWeight='bold' fontSize={13} color='#212121'>Governance</Typography>
              <Link href="https://github.com/OpportunityProtocol/opportunity-core">
              <Typography className={classes.link} fontSize={12} fontWeight="medium" color='text.secondary'>Overview</Typography>
              </Link>
              <Link   href="https://discord.gg/pBRVWTQPvS">
              <Typography className={classes.link} fontSize={12} fontWeight="medium" color='text.secondary'>Discord</Typography>
              </Link>
              <Link href="https://github.com/OpportunityProtocol/opportunity-core">
              <Typography className={classes.link} fontSize={12} fontWeight="medium" color='text.secondary'>Github</Typography>
              </Link>
              </div>
            </Grid>
          </Grid>



      <Divider sx={{borderBottomColor: '#ddd' }} />
      <Box py={2} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
        <Typography fontSize={12} fontWeight='medium'  color='#212121'>
          &copy; 2022 Lens Talent
        </Typography>

        <Stack alignItems='center'  direction='row' spacing={3}>
                <SiGhost size={20} color='#212121'  />
                <SiTwitter size={20} color='#212121' />
                <SiDiscord size={20} color='#212121' />
                <SiGithub size={20} color='#212121' />
            </Stack>
      </Box>
    </Box>
  );
}