import React, { useEffect, useState, FunctionComponent } from 'react';
import { useStyles } from '../../modules/market/MarketStyles';
import {
  Grid,
  Container,
  Typography,
  Card,
  Stack,
  Switch,
  FormControlLabel,
  Paper,
  Chip
} from '@mui/material';

import MarketDisplay from '../../modules/market/components/MarketDisplay';
import MinimalSelect from '../../common/components/Select/Select';
import { FilterList } from '@mui/icons-material';
import FilterDesiredMarketsButton from '../../common/components/FilterDesiredMarketsButton/FilterDesiredMarketsButton';

const sortByOptions = [
  <option value={0}>Highest Total Skill Value</option>
]

const DesiredMarketsContent = ({ visible }) => {
  return (
    <Paper sx={{ position: 'absolute', top: 5, display: visible }}>
      Hello World
    </Paper>
  )
}

const Markets: FunctionComponent = () => {
  const classes = useStyles();
  const [markets, setMarkets] = useState<any[]>([]);

  const [desiredMarketsShowing, setDesiredMarketsShowing] = useState<any>('flex')

  useEffect(() => {
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
          <Stack my={2} direction="row" alignItems="center" spacing={2}>
            <MinimalSelect placeholder="Sort by" width={200} options={sortByOptions} />
            <FilterDesiredMarketsButton />
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
