/**
 * @title JobDisplay
 * @author Elijah Hampton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStyles } from './JobDisplayStyles';

import {
  Divider,
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
} from '@mui/material';

import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import { AccessTime, AttachMoney, Bolt, Paid, TrendingUp } from '@mui/icons-material';
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
  showReferralButton=false
}) => {
  const classes = useStyles();
  const router = useRouter();
  const isService = Math.random() > 0.5; //temp

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <Card
      square
      onClick={() => router.push('/contract/view')}
      key={Math.random()}
      className={classes.card}
      variant="outlined"
    >
      {suggestion ? (
        <Stack direction="row" alignItems="center" className={classes.suggestedContainer}>
          <Bolt fontSize="small" sx={{ color: '#FDD835' }} />
          <Typography variant="body2" color="rgb(98, 202, 161)">
            Suggested through your network
          </Typography>
        </Stack>
      ) : null}

      <Avatar
        src={avatar}
        sx={{ width: 60, height: 60, position: 'absolute', top: suggestion ? 30 : 13, right: 100 }}
      />
      <Divider className={classes.divider} />
      <CardContent>
        <Grid
          container
          direction="row"
          flexWrap="nowrap"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Grid item>
            <Typography component="div" pb={1}>
              <Box fontWeight="600" fontSize={22} color="black" pb={2} width='70%'>
                {renderPlaceholderTitle()}
              </Box>

              <Grid container direction='row' alignItems='center' spacing={3}>
                        <Grid item>
                          <Stack direction='row' alignItems='center' spacing={0.5}>
                            <AttachMoney fontSize='small' sx={{ color:'rgb(30, 71, 98)'  }} />
                          <Typography fontSize={13} fontWeight='medium' color='#424242'>
                              Budget: $23.29 
                            </Typography>
                          </Stack>
                        </Grid>

                        <Grid item>
                        <Stack direction='row' alignItems='center' spacing={0.5}>
                          <AccessTime fontSize='small' sx={{ color:'rgb(30, 71, 98)'  }} />
                        <Typography fontSize={13} fontWeight='medium' color='#424242'>
                              Average Term (3 months - 6 months)
                            </Typography>
                          </Stack>
                        </Grid>

                        <Grid item>
                        <Stack direction='row' alignItems='center' spacing={0.5}>
                            <Paid fontSize='small' sx={{ color:'rgb(30, 71, 98)'  }} />
                            <Typography fontSize={13} fontWeight='medium' color='#424242'>
                              Fixed Rate Payout
                            </Typography>
                          </Stack>
                        </Grid>

                        <Grid item>
                        <Stack direction='row' alignItems='center'>
                            <Typography>
                              
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
            </Typography>

            <Typography
              paragraph
              color="rgb(94, 94, 94)"
              py={1}
              fontSize={15}
              fontWeight="semibold"
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
                {isService ? (
                  <Chip
                    label="Contract"
                    size="small"
                    variant="filled"
                    className={classes.tagChip}
                    sx={{
                      bgcolor: alpha('#2196F3', 0.3),
                    }}
                  />
                ) : (
                  <Chip
                    label="Service"
                    size="small"
                    variant="filled"
                    className={classes.tagChip}
                    sx={{
                      bgcolor: alpha('#4CAF50', 0.3),
                    }}
                  />
                )}
              </Grid>
              {showReferralButton === true ? (
                <Chip
                  classes={{
                    iconSmall: classes.purchaseIconSmall,
                  }}
                  sx={{ bgcolor: alpha('#4CAF50', 0.8) }}
                  variant="filled"
                  color="primary"
                  label="Refer this service (+0.50)"
                  onClick={handleClick}
                  onDelete={handleDelete}
                  deleteIcon={<TrendingUp fontSize="small" />}
                />
              ) : null}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
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



{/*

<Grid
                width="100%"
                container
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <FormControl variant="standard">
                      <NativeSelect
                        id="desired-markets-selet"
                        value={desiredMarkets}
                        className={classes.selectFilter}
                        onChange={handleOnChangeDesiredMarkets}
                        input={<BootstrapInput />}
                      >
                        <option aria-label="None" value="Filter desired markets">
                          Filter desired markets
                        </option>
                      </NativeSelect>
                    </FormControl>
                    <FormControl variant="standard">
                      <NativeSelect
                        id="sort-by-select"
                        value={sortBy}
                        className={classes.selectFilter}
                        onChange={handleOnChangeSortBy}
                        input={<BootstrapInput />}
                      >
                        <option aria-label="None" value="Filter desired markets">
                          Sort by
                        </option>
                        <option value={0}>Value Settled</option>
                        <option value={1}>Number of Contracts</option>
                        <option value={2}>Number of Services</option>
                      </NativeSelect>
                    </FormControl>
                  </Stack>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    sx={{
                      color: '#a3a3a3',
                      fontWeight: (theme) => theme.typography.fontWeightMedium,
                    }}
                    control={<Switch value="" size="small" color="secondary" />}
                    label="Only markets I've participated in"
                  />
                </Grid>
              </Grid>
            
                  */}