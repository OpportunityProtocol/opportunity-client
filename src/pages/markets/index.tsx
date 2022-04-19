import React, { useEffect, useState, FunctionComponent } from 'react';
import { useStyles } from '../../modules/market/MarketStyles';
import Dots from 'material-ui-dots';
import {
  Grid,
  Container,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  FormControl,
  NativeSelect,
  Button,
  Box,
  Avatar,
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

const HEIGHT = '500px'
function CarouselItem({ item, itemLength, index }: ICarouselItemProps) {
  return (
    <Box sx={{ position: 'relative', width: '100%', backgroundColor: '#fff' }}>
      <img src={item.source} style={{ width: '100%', height: HEIGHT }} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: HEIGHT,
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      />
      <Box sx={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Dots index={index} count={itemLength} onDotClick={(index) => {}} />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        p={5}
        sx={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
      >
        <Container maxWidth="lg" sx={{ bgcolor: 'transparent' }}>
          <Typography color="#fff" fontWeight="bold" fontSize={45} width="60%">
            {item.title}
          </Typography>
          <Typography color="#fff" fontSize={25}>
            {item.subtitle}
          </Typography>
          <Button
            onClick={item.onClick}
            size="large"
            variant="contained"
            color="secondary"
            sx={{ my: 2, width: 150, color: 'white', borderColor: '#fff' }}
          >
            {item.buttonTitle}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

const Markets: FunctionComponent = () => {
  const classes = useStyles();
  const [suggestedConnections, setSuggestedConnections] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [desiredMarkets, setDesiredMarkets] = useState<string>('Filter desired markets');
  const [sortBy, setSortBy] = useState<string>('Sort by');
  const [participatedChecked, setParticipatedChecked] = useState<any>('');

  const styles: ClassNameMap<GradientAvatarClassKey> = useGradientAvatarStyles({
    size: 50,
    gap: 3,
    thickness: 3,
    gapColor: '#f4f7fa',
    color: 'linear-gradient(to bottom right, #feac5e, #c779d0, #4bc0c8)',
  });

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
    <Box bgcolor="#fbfbfd">
      <Container maxWidth="lg" className={classes.root}>
      <Carousel fullHeightHover={true} indicators={false} autoPlay interval={3000}>
        {loggedOutHeroCarouselItems.map((item, i, arr) => (
          <CarouselItem key={i} item={item} itemLength={arr.length} index={i} />
        ))}
      </Carousel>
        <Box sx={{ width: '100%', margin: '0px' }}>
          <Box my={2}>
            <Box>
              <Typography py={2} fontWeight="bold" color="rgba(33, 33, 33, .85)" fontSize={30}>
                Expand your network
              </Typography>
            </Box>
            <Grid
              container
              alignItems="center"
              direction="row"
              overflow="scroll"
              flexWrap="nowrap"
            >
              {suggestedConnections.map((human) => {
                return (
                  <Box
                    sx={{ cursor: 'pointer' }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    mr={5}
                  >
                    <div
                      style={{
                        margin: '5px 0px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                      className={styles.root}
                    >
                      <Avatar
                        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                        src={human.picture.thumbnail}
                      />
                    </div>
                    <Box textAlign="center">
                      <Typography variant="body2" color="#757575" width="auto" noWrap>
                        {human.name.first + ' ' + human.name.last}
                      </Typography>
                      <Typography variant="caption" color='rgb(98, 202, 161)' width="auto" noWrap>
                      ${Math.floor(Math.random() * 101).toFixed(2)} Skill Value
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Grid>
          </Box>

          <Box mb={2}>
            <Box>
              <Typography py={5} fontWeight="bold" color="rgba(33, 33, 33, .85)" fontSize={30}>
                Buy confidence in top rated services
              </Typography>
            </Box>
            <Grid container alignItems="center" direction="row" flexWrap="nowrap" spacing={1}>
              {suggestedConnections.slice(3, 7).map((human) => {
                return (
                  <Grid item xs={3}>
                    <ServiceCard name={human.name.first + " " + human.name.last} avatarSrc={human.picture.large} headerSrc='https://picsum.photos/200' />
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Grid container direction="column" alignItems="center" justifyContent="space-between">
            <Grid item sx={{ py: 2 }} width="100%">
              <Box>
                <Typography py={2} fontWeight="bold" color="rgba(33, 33, 33, .85)" fontSize={30}>
                  Participate in markets
                </Typography>
              </Box>
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
            </Grid>
            <Grid item />
          </Grid>
          <Grid container direction="row" flexDirection="row" alignItems="center" spacing={2}>
            {markets.map((market) => (
              <Grid item sm={4}>
                <MarketDisplay market={market} isShowingStats />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box my={6}>
          <Box>
            <Typography py={2} fontWeight="bold" color="rgba(33, 33, 33, .85)" fontSize={30}>
              Work within your network
            </Typography>
          </Box>
          <Grid container direction="column" overflow="scroll" flexWrap="nowrap">
            {suggestedConnections.slice(3, 6).map((human) => {
              return (
                <Grid item>
                  <JobDisplay avatar={human.picture.large} suggestion={true} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

Markets.propTypes = {};

export default Markets;
