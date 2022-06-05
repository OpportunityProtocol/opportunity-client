/**
 * @title JobDisplay
 * @author Elijah Hampton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './JobDisplayStyles';

import {
  Box,
  Avatar,
  Button,
  Chip,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  alpha,
  CardActions,
} from '@mui/material';

import { AccessTime, AttachMoney, Paid, TrendingUp } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { IJobDisplayProps } from '../../MarketInterface';

/*******  Temporary Placeholders Start *******/
const TAGS = ['Python', 'Web Development', 'Flash'];

const renderPlaceholderTitle = () => {
  if (Math.random() < 0.2) {
    return 'Customer Service Representative';
  } else if (Math.random() > 0.2 && Math.random() < 0.4) {
    return 'Looking for a web developer for long term contract';
  } else if (Math.random() > 0.4 && Math.random() < 0.6) {
    return 'Need 3 articles written for a blog';
  } else if (Math.random() > 0.8) {
    return 'Hiring short term HR manager for new startup';
  } else {
    return 'Hiring UI/UX designer for brand makeover';
  }
};
/*******  Temporary Placeholders End *******/

const JobDisplay: React.FunctionComponent<IJobDisplayProps> = ({
  avatar = '',
  suggestion = false,
}) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Card
      square
      onClick={() => router.push('/contract/view/contract')}
      key={Math.random()}
      className={classes.card}
      variant="outlined"
    >
      <CardContent>
        <Grid pb={2} container alignItems="center" flexWrap="nowrap" direction="row">
          <Grid item pr={2}>
            <Avatar src={avatar} sx={{ width: 55, height: 55 }} />
          </Grid>

          <Grid container item flexGrow={1}>
            <Grid container item alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography fontWeight="bold">Business Manager</Typography>
              </Grid>

              <Grid item fontWeight="bold">
                5,000 DAI
              </Grid>
            </Grid>

            <Grid container item alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography fontWeight="bold" color={(theme) => theme.palette.primary.main}>
                  @lensterWorker
                </Typography>
              </Grid>

              <Grid item>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccessTime fontSize="small" />
                  <Typography fontWeight="light" color="text.secondary">
                    Short Term
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          {TAGS.map((tag) => {
            return (
              <Grid item mr={1} my={1}>
                <Chip variant="filled" className={classes.tagChip} label={tag} size="small" />
              </Grid>
            );
          })}
        </Grid>

        <Typography
          paragraph
          color="rgb(94, 94, 94)"
          py={1}
          fontSize={15}
          fontWeight="medium"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
          }}
        >
          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
          across all continents except Antarctica roup of squamate reptiles, with over 6,000 Lizards
          are a widespread
        </Typography>

        <Grid container item direction="row" alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography color="text.secondary" fontSize={14}>
              August 1, 2022 - 1:59 PM
            </Typography>
          </Grid>

          <Grid item>
            <Button variant="contained" size="large">
              View Details
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

JobDisplay.propTypes = {
  avatar: PropTypes.string,
  suggestion: PropTypes.bool.isRequired,
};

export default JobDisplay;
