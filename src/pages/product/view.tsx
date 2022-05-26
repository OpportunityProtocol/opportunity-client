import React from 'react';
import { Typography, Grid, Tooltip, Box, Paper, Button } from '@mui/material';
import { useStyles } from '../../common/styles/ContractStyles';
import Link from 'next/link';
import { ContentCopy } from '@mui/icons-material';

const ViewProduct: React.FunctionComponent<any> = () => {
  const classes = useStyles();
  return (
    <Box sx={{ width: '100%', padding: '3% 3%', bgcolor: '#fafafa' }}>
      <Box
        component={Paper}
        elevation={20}
        sx={{
          padding: '2% 5%',
          bgcolor: '#fafafa',
          border: '1px solid #eee',
          boxShadow:
            '0px 5px 5px -3px rgba(240, 239, 241, 0.8), 0px 8px 10px 1px rgba(240, 239, 241, 0.5),0px 3px 14px 2px rgba(240, 239, 241, 0.2)',
        }}
      >
        <Box sx={{ width: '100% ' }}>
          <>
            <Box sx={{ py: 2 }}>
              <Typography fontWeight="bold" fontSize={25}>
                Web Development Mockup Kit
              </Typography>
              <Link href="">
                <Typography
                  className={classes.link}
                  fontSize={12}
                  component="span"
                  variant="button"
                  color="secondary"
                >
                  /ipfs/QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4
                </Typography>
              </Link>
            </Box>

            <Typography
              paragraph
              py={2}
              width={600}
              fontSize={15}
              fontWeight="medium"
              color="#5e5e5e"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed hendrerit sem.
              Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque pellentesque
              tortor tortor, at convallis metus ornare ac. Aenean quis pellentesque nisl. Ut
              suscipit a nisi sed porttitor. Donec cursus velit diam, non accumsan urna aliquet
              hendrerit.
            </Typography>
          </>

          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography fontWeight="bold" fontSize={14}>
                Creator
              </Typography>
              <Tooltip title="0x88463F785e256C04eC584559627806d909BaC0FE">
                <Typography fontSize={13} color="#5e5e5e">
                  0x88463F785e256C04eC584559627806d909BaC0FE{' '}
                  <span>
                    <ContentCopy fontSize="small" />
                  </span>
                </Typography>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ py: 2 }}>
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item>
              <Button sx={{ color: '#fff' }} variant="contained" color="secondary" disableElevation>
                Purchase
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewProduct;
