/**
 * @title Jobs
 * @author Elijah Hampton
 */

import React, { useEffect, useState } from 'react';
import { useStyles } from '../../modules/market/MarketStyles';

import {
  Box,
  Typography,
  IconButton,
  Container,
  Menu,
  MenuItem,
  Avatar,
  FormControl,
  NativeSelect,
  Grid,
  Divider,
  Button,
  Stack,
  Tabs,
  Card,
  Tab,
  CardHeader,
  CardContent,
  Alert,
} from '@mui/material';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

import TabPanel from '../../common/components/TabPanel/TabPanel';
import { FilterList } from '@mui/icons-material/';
import JobDisplay from '../../modules/market/components/JobDisplay';
import BootstrapInput from '../../common/components/BootstrapInput/BootstrapInput';
import { timelineButtons } from '../../modules/market/MarketConstants';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 1,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 2,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 3,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 4,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 5,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 6,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 7,
    amt: 2100,
  },
];

function a11yProps(index: number) {
  return {
    value: index,
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Jobs: React.FunctionComponent = () => {
  const classes = useStyles();
  const [value, setValue] = useState<any>(0);
  const [sortBy, setSortBy] = useState<string>('Sort by');
  const [relationships, setRelationships] = useState<any>([]);
  const [networkSugggestions, setNetworkSuggestions] = useState<any>([]);

  const [marketSpotlightAnchor, setMarketSpotlightAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(marketSpotlightAnchor);

  const handleOnClickMarketSpotlightMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMarketSpotlightAnchor(event.currentTarget);
  };

  const handleOnCloseMarketSpotlightMenu = () => {
    setMarketSpotlightAnchor(null);
  };

  const handleOnChangeSortBy = () => {};

  const renderUsers = async () => {
    const a = await fetch('https://randomuser.me/api/?results=20');
    const b = await a.json();
    setRelationships(b.results);
    setNetworkSuggestions(b.results);
    console.log(b.results)
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    renderUsers();
  }, []);

  const getRelationships = () => {
    return relationships.slice(10, 15).map((relationship, idx) => (
      <Grid item xs={12} key={idx}>
        <React.Fragment>
          <JobDisplay avatar={relationship.picture.large} suggestion={idx === 0 ? true : false} />
        </React.Fragment>
      </Grid>
    ));
  };

  return (
    <Container maxWidth="lg">
      <Grid container xs={12} direction="column" alignItems="center" bgcolor="#fbfbfd">
        <Grid my={1} container direction="row" alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography fontSize={25} fontWeight="bold" color="black">
              Contracts and Services
            </Typography>
            <Typography variant="subtitle1">Showing 69 total contracts</Typography>
          </Grid>

          <Grid item>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Button variant="contained" color="secondary" disableElevation disableRipple>
                Create Contract
              </Button>
              <FormControl variant="standard">
                <NativeSelect
                  id="sort-by-select"
                  value={sortBy}
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
        </Grid>

        <Grid container direction="row" alignItems="flex-start" spacing={5}>
          <Grid item xs={8}>
            <Box>
              <Tabs
                variant="standard"
                value={value}
                indicatorColor="secondary"
                textColor="secondary"
                onChange={handleChange}
              >
                <Tab label="All Contracts" {...a11yProps(0)} />
                <Tab label="Jobs" {...a11yProps(1)} />
                <Tab label="Services" {...a11yProps(2)} />
                <Tab label="Suggestions" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={0} index={0}>
              <Grid container direction="column" spacing={0}>
                {getRelationships()}
              </Grid>
            </TabPanel>

            <TabPanel value={1} index={1}>
              Item One
            </TabPanel>

            {relationships?.length === 0 ? (
              <Box>
                <Typography>No listings exist in this market. Be the first to post one.</Typography>
              </Box>
            ) : null}
          </Grid>

          <Grid item xs={4}>
            <Alert icon={false} variant='filled' component={Card} className={classes.marginBottom}>
              <Typography variant="subtitle1" fontWeight="600">
                Writing and Translation
              </Typography>
              <Typography variant="body2">Jobs Available: 2234</Typography>
              <Typography variant="body2">Services Available: 323</Typography>
            </Alert>

            <Card variant="outlined" className={classes.marginBottom}>
              <Box p={2} fontWeight="bold">
                Market Payouts
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart width={300} height={200} data={data}>
                  <Line type="monotone" dataKey="uv" stroke='rgb(98, 202, 161)' strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <Stack direction="row" alignItems="center" justifyContent="space-evenly">
                {timelineButtons.map((buttonTitle, idx) => (
                  <Button
                    disableElevation
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    variant="text"
                    color="primary"
                    size="small"
                    classes={{ text: classes.graphButton }}
                    key={idx}
                  >
                    {buttonTitle}
                  </Button>
                ))}
              </Stack>
            </Card>

            <Card variant="outlined" className={classes.marginBottom}>
              <CardContent>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <Stack>
                    <Typography fontWeight="bold">Market Spotlight</Typography>
                    <Typography variant="caption" color="#aaa">
                      Filtered by payouts
                    </Typography>
                  </Stack>
                  <IconButton
                    id="basic-button"
                    aria-controls={open ? 'market-spotlight-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleOnClickMarketSpotlightMenu}
                  >
                    <FilterList fontSize="small" />
                  </IconButton>
                  <Menu
                    id="market-spotlight-menu"
                    anchorEl={marketSpotlightAnchor}
                    open={open}
                    onClose={handleOnCloseMarketSpotlightMenu}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleOnCloseMarketSpotlightMenu}>Payouts</MenuItem>
                    <MenuItem onClick={handleOnCloseMarketSpotlightMenu}>Connections</MenuItem>
                  </Menu>
                </Stack>
              </CardContent>
              <Divider />
              <CardContent>
                {networkSugggestions.slice(15, 18).map((human, idx) => {
                  return (
                    <CardHeader
                      key={idx}
                      classes={{
                        action: classes.action,
                      }}
                      avatar={
                        <Avatar
                          aria-label="recipe"
                          src={human.picture.large}
                          className={classes.avatar}
                        />
                      }
                      action={
                        <Button variant="outlined" color="secondary" disableElevation disableRipple>
                          Connect
                        </Button>
                      }
                      subheaderTypographyProps={{
                        variant: 'body2',
                        color: 'rgb(98, 202, 161)',
                      }}
                      title={human.name.first + ' ' + human.name.last}
                      subheader={`$${Math.floor(Math.random() * 10000)} earned`}
                    />
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

Jobs.propTypes = {};

export default Jobs;
