import React, { useEffect, useState, FunctionComponent } from 'react';
import { useStyles } from '../modules/market/MarketStyles';
import { Grid, Container, Typography, Button, Box, Stack, Avatar, Paper } from '@mui/material';

import { ClassNameMap } from '@mui/material';
import MarketDisplay from '../modules/market/components/MarketDisplay';

import { useGradientAvatarStyles } from '@mui-treasury/styles/avatar/gradient';
import Carousel from 'react-material-ui-carousel';
import { GradientAvatarClassKey } from '@mui-treasury/styles/avatar/gradient/gradientAvatar.styles';
import { ICarouselItemProps } from '../modules/market/MarketInterface';
import { loggedOutHeroCarouselItems } from '../modules/market/MarketConstants';
import JobDisplay from '../modules/market/components/JobDisplay';
import ServiceCard from '../common/components/ServiceCard/ServiceCard';
import { useRouter } from 'next/router';
import { KeyboardArrowRight } from '@mui/icons-material';

const HEIGHT = '600px';
function CarouselItem({ item, itemLength, index }: ICarouselItemProps) {
  const classes = useStyles();
  return (
    <Box position="relative" width="100%" bgcolor="#fafafa">
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
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        p={5}
        position="absolute"
        top={0}
        left={0}
        height="100%"
        width="100%"
      >
        <Container maxWidth="lg" sx={{ bgcolor: 'transparent' }}>
          <Typography color="#fff" fontWeight="bold" py={1} fontSize={45} width="60%">
            {item.title}
          </Typography>
          <Typography color="#fff" fontSize={20} py={1} width='60%'>
            {item.subtitle}
          </Typography>
          <Button
            //onClick={item.onClick}
            size="large"
            variant="contained"
            className={classes.carouselButton}
          >
            {item.buttonTitle}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

const Explore: FunctionComponent = () => {
  const classes = useStyles();
  const [suggestedConnections, setSuggestedConnections] = useState<any[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [desiredMarkets, setDesiredMarkets] = useState<string>('Filter desired markets');
  const [sortBy, setSortBy] = useState<string>('Sort by');
  const [participatedChecked, setParticipatedChecked] = useState<any>('');
  const router = useRouter();
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
    <Box>
      <Container maxWidth="lg" sx={{ bgcolor: '#FAFAFA' }} className={classes.root}>
        <Carousel animation='slide' fullHeightHover={true} indicators={false} autoPlay interval={8000}>
          {loggedOutHeroCarouselItems.map((item, i, arr) => (
            <CarouselItem key={i} item={item} itemLength={arr.length} index={i} />
          ))}
        </Carousel>
        <Box sx={{ width: '100%', margin: '0px' }}>
          <Box my={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant='h5' py={2} fontWeight="bold" color="rgba(33, 33, 33, .85)">
                Expand your network
              </Typography>

              <Button
                endIcon={<KeyboardArrowRight />}
                variant="text"
                size="large"
              >
                Explore freelancers
              </Button>
            </Stack>
            <Grid container alignItems="center" direction="row" overflow="scroll" flexWrap="nowrap">
              {suggestedConnections.map((human) => {
                return (
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    component={Button}
                    mx={4}
                    onClick={() => router.push('/dashboard')}
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
                        src={human.picture.large}
                      />
                    </div>
                    <Box textAlign="center">
                      <Typography variant="body2" color="#616161" width="auto" noWrap>
                        {human.name.first + ' ' + human.name.last}
                      </Typography>
                      <Typography variant="caption" color='text.primary' width="auto" noWrap>
                        ${Math.floor(Math.random() * 101).toFixed(2)} Skill Value
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Grid>
          </Box>

          <Paper
          //  variant="outlined"
            elevation={0}
            sx={{ my: 6, px: 6, pb: 6, backgroundColor: '#fff' }}
          >
            <Box>
              <Typography py={3} fontWeight="bold" color="rgba(33, 33, 33, .85)" fontSize={30}>
                Buy{' '}
                <Typography sx={{ color: (theme) => theme.palette.primary.main }} fontSize={30} fontWeight="bold" component="span">
                  confidence
                </Typography>{' '}
                in top rated services
              </Typography>
            </Box>
            <Grid container alignItems="center" direction="row" flexWrap="nowrap" spacing={1}>
              {suggestedConnections.slice(3, 7).map((human) => {
                return (
                  <Grid item xs={3}>
                    <ServiceCard
                      name={human.name.first + ' ' + human.name.last}
                      avatarSrc={human.picture.large}
                      headerSrc="https://picsum.photos/200"
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Paper>

          <Grid container direction="column" alignItems="center" justifyContent="space-between">
            <Grid item py={2} width="100%">
              <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant='h5' py={2} fontWeight="bold" color="rgba(33, 33, 33, .85)">
                  Participate in markets
                </Typography>

                <Button
                  endIcon={<KeyboardArrowRight />}
                  variant="text"
                  size="large"
                >
                  See all
                </Button>
              </Stack>
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
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant='h5' py={2} fontWeight="bold" color="rgba(33, 33, 33, .85)">
                See gigs in your network
              </Typography>

              <Button
                endIcon={<KeyboardArrowRight />}
                variant="text"
                size="large"
              >
                See all
              </Button>
            </Stack>
          </Box>
          <Grid container direction="row" overflow="scroll" flexWrap="wrap" spacing={2}>
            {suggestedConnections.slice(3, 6).map((human: any) => {
              return (
                <Grid item xs={6}>
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

Explore.propTypes = {};

export default Explore;
