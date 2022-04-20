import React, { useEffect, useState, FunctionComponent } from 'react';
import { useStyles } from '../../modules/market/MarketStyles';
import {
  Grid,
  Container,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  NativeSelect,
  Button,
  Box,
  Avatar,
  Paper,
} from '@mui/material';

import { ClassNameMap } from '@material-ui/styles';
import MarketDisplay from '../../modules/market/components/MarketDisplay';

import { useGradientAvatarStyles } from '@mui-treasury/styles/avatar/gradient';
import Carousel from 'react-material-ui-carousel';
import { GradientAvatarClassKey } from '@mui-treasury/styles/avatar/gradient/gradientAvatar.styles';
import BootstrapInput from '../../common/components/BootstrapInput/BootstrapInput';
import { ICarouselItemProps } from '../../modules/market/MarketInterface';
import { loggedOutHeroCarouselItems } from '../../modules/market/MarketConstants';
import JobDisplay from '../../modules/market/components/JobDisplay';
import ServiceCard from '../../common/components/ServiceCard/ServiceCard';
import { useRouter } from 'next/router';

const HEIGHT = '500px';

const Markets: FunctionComponent = () => {
  const classes = useStyles();
  const [suggestedConnections, setSuggestedConnections] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [desiredMarkets, setDesiredMarkets] = useState<string>('Filter desired markets');
  const [sortBy, setSortBy] = useState<string>('Sort by');
  const [participatedChecked, setParticipatedChecked] = useState<any>('');

  const fetchNetworkSuggestions = async () => {
    const a = await fetch('https://randomuser.me/api/?results=20');
    const b = await a.json();
    setSuggestedConnections(b.results);
  };

  const handleOnChangeParticipatedChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParticipatedChecked(event.target.checked);
  };

  const handleOnChangeDesiredMarkets = () => {};
  const handleOnChangeSortBy = () => {};

  useEffect(() => {
    fetchNetworkSuggestions();
    let updatedMarkets = [];
    updatedMarkets.push('Writing and Translation');
    updatedMarkets.push('Development & IT');
    updatedMarkets.push('Accounting and Finance');
    updatedMarkets.push('Design and Creative');
    updatedMarkets.push('Engineering and Architecture');
    updatedMarkets.push('Sales and Marketing');
    setMarkets(updatedMarkets);
  }, []);

  const AVATAR_SIZE = 70;
  return (
    <Container maxWidth="lg" sx={{ height: '100vh' }}>
      <Typography fontSize={25} fontWeight="bold" color="black">
        Markets
      </Typography>

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
            className={classes.switchFormControlLabel}
            control={<Switch value="" size="small" color="secondary" />}
            label="Only markets I've participated in"
          />
        </Grid>
      </Grid>

      <Grid container direction="row" flexDirection="row" alignItems="center" spacing={2}>
        {markets.map((market) => (
          <Grid item sm={4}>
            <MarketDisplay market={market} isShowingStats />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

Markets.propTypes = {};

export default Markets;
