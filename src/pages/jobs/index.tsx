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
import ServiceCard from '../../common/components/ServiceCard/ServiceCard';
import { useRouter } from 'next/router';
import TextInput from '../../common/components/BootstrapInput/BootstrapInput';
import SearchBarV2 from '../../common/components/SearchBarV2/SearchBarV2';

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
  const router = useRouter()
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
    return relationships.slice(10, 15).map((relationship: { picture: { large: string | undefined; }; }, idx: React.Key | null | undefined) => (
      <Grid item xs={12} key={idx}>
        <React.Fragment>
          <JobDisplay avatar={relationship.picture.large} suggestion={idx === 0 ? true : false} />
        </React.Fragment>
      </Grid>
    ));
  };

  const getServices = () => {
    return relationships.slice(10, 15).map((relationship: { picture: { large: string | undefined; }; }, idx: React.Key | null | undefined) => (
      <Grid item xs={4} key={idx}>
        <React.Fragment>
          <ServiceCard />
        </React.Fragment>
      </Grid>
    ));
  };

  return (
    <Container maxWidth="lg">
      <Grid container xs={12} direction="column" alignItems="center">
        <Grid my={1} container direction="row" alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography fontSize={25} fontWeight="bold" color="black">
              Writing and Translation
            </Typography>
            <Typography variant="subtitle1">Showing 69 total contracts</Typography>
          </Grid>

          <Grid item>
            <Stack direction="row" alignItems="center" spacing={3}>
            <SearchBarV2 placeholder='Search contracts' />

              <Button onClick={() => router.push('contract/create')} variant="contained" color="secondary" disableElevation disableRipple>
                Create
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs indicatorColor={""} value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Contracts" {...a11yProps(0)} />
          <Tab label="Services" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
      <Grid container direction="row" alignItems="flex-start" spacing={5}>
          <Grid item xs={8}>
            <Box>
              <Grid container direction="column" spacing={2}>
                {getRelationships()}
              </Grid>

              
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Alert icon={false} variant='filled' className={classes.marginBottom}>
              <Typography variant="subtitle2">Jobs Available: 2234</Typography>
              <Typography variant="subtitle2">Services Available: 323</Typography>
            </Alert>

       
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Grid container direction="row" alignItems="flex-start" spacing={5}>
          <Grid item xs={8}>
            <Box>
              <Grid container direction="row" spacing={2}>
                {getServices()}
              </Grid>

              
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Alert icon={false} variant='filled' className={classes.marginBottom}>
              <Typography variant="subtitle1" fontWeight="600">
                Writing and Translation
              </Typography>
              <Typography variant="body2">Jobs Available: 2234</Typography>
              <Typography variant="body2">Services Available: 323</Typography>
            </Alert>

       
          </Grid>
        </Grid>
      </TabPanel>
    </Box>

        


      </Grid>
    </Container>
  );
};

Jobs.propTypes = {};

export default Jobs;
