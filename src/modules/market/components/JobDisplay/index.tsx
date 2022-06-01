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

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <Card
      square
      onClick={() => router.push('/contract/view/contract')}
      key={Math.random()}
      className={classes.card}
      variant="outlined"
    >
      <CardContent>
        <Grid
          container
          direction="column"
          flexWrap="nowrap"
          alignItems="flex-start"
          justifyContent="space-between">
          <Grid container item direction='row' flexWrap='nowrap' alignItems="center">
            <Grid item>
              <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
            </Grid>

            <Grid container item direction="column" alignItems='flex-start'>
              <Grid item px={2}>
                <Typography>
                {renderPlaceholderTitle()}
                </Typography>
                </Grid>

              <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} ml={0.5} spacing={1} container item>
                <Grid item>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AttachMoney fontSize="small" sx={{ color: 'rgb(30, 71, 98)' }} />
                  <Typography fontSize={12} fontWeight="medium" color="#424242">
                    $23.29
                  </Typography>
                </Stack>
                </Grid>

                <Grid item>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccessTime fontSize="small" sx={{ color: 'rgb(30, 71, 98)' }} />
                  <Typography fontSize={12} fontWeight="medium" color="#424242">
                    3- 6 months
                  </Typography>
                </Stack>
                </Grid>

                <Grid item>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Paid fontSize="small" sx={{ color: 'rgb(30, 71, 98)' }} />
                  <Typography fontSize={12} fontWeight="medium" color="#424242">
                    Fixed Rate Payout
                  </Typography>
                </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container direction="row">
            <Typography component="div" pb={1}></Typography>

            <Typography
              paragraph
              color="rgb(94, 94, 94)"
              py={1}
              mt={2}
              fontSize={15}
              fontWeight="medium"
            >
              Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
              across all continents except Antarctica roup of squamate reptiles, with over 6,000
              Lizards are a widespread
            </Typography>
            <Box my={1} display="flex" alignItems="center" justifyContent="flex-start">
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
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions>
        <Button variant="text">View More</Button>
      </CardActions>
          {/*
            TODO: If claimed the display will show general contract 
            information here and button will change to open contract details
         */}
    </Card>
  );
};

JobDisplay.propTypes = {
  avatar: PropTypes.string,
  suggestion: PropTypes.bool.isRequired,
};

export default JobDisplay;
