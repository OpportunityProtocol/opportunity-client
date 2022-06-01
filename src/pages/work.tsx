import React, { Fragment } from 'react';
import JobDisplay from '../modules/market/components/JobDisplay';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import {
  Grid,
  Collapse,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tabs,
  Tab,
  Typography,
  Box,
} from '@mui/material';
import TabPanel from '../common/components/TabPanel/TabPanel';
import SearchBarV2 from '../common/components/SearchBarV2/SearchBarV2';

/**** Temporary Placeholders *****/
const marketName = [
  { id: 1, name: 'Writing & Translation' },
  {
    id: 2,
    name: ' Design & Creative',
  },
  {
    id: 3,
    name: 'Development & IT',
  },
  {
    id: 4,
    name: 'Engineering & Architecture',
  },
  {
    id: 5,
    name: 'Accounting & Finance',
  },
  {
    id: 6,
    name: 'Sales & Marketing',
  },
];

const serviceName = [
  { id: 7, name: 'Service 1' },
  {
    id: 8,
    name: ' Design & Creative',
  },
  {
    id: 9,
    name: 'Development & IT',
  },
  {
    id: 10,
    name: 'Engineering & Architecture',
  },
  {
    id: 11,
    name: 'Accounting & Finance',
  },
  {
    id: 12,
    name: 'Sales & Marketing',
  },
];
/**** Temporary Placeholders End *****/

/**
 * @author Nathan Farley
 */
function Work() {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState({});
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleClick = (id) => {
    setOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  return (
    <Grid
      component={Container}
      maxWidth="xl"
      container
      direction="column"
      sx={{ bgcolor: 'background.paper' }}
    >
      <Grid item>
        <Box sx={{ width: '100%' }}>
          <Box mt={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab sx={{ borderBottom: '1px solid #212121' }} label="Contracts" />
              <Tab sx={{ fontSize: '14px' }} label="Services" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Grid container justifyContent="space-between">
              <Grid item xs={3} sx={{}}>
                <Typography pt={2} fontWeight="bold">
                  Filter Markets
                </Typography>
                <List component="nav">
                  {marketName.map((item) => (
                    <Fragment key={item.id}>
                      <ListItemButton onClick={() => handleClick(item.id)}>
                        <ListItemText
                          primary={item.name}
                          primaryTypographyProps={{ fontSize: 13, fontWeight: 'medium' }}
                        />
                        {open[item.id] ? (
                          <RemoveIcon fontSize="small" />
                        ) : (
                          <AddIcon fontSize="small" />
                        )}
                      </ListItemButton>
                      <Collapse in={open[item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }} style={{ backgroundColor: 'transparent' }}>
                            <ListItemText primary="Starred" sx={{ fontSize: 1 }} />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </Fragment>
                  ))}
                </List>
              </Grid>
              <Grid
                container
                justifyContent="space-evenly"
                alignItems="center"
                item
                xs={9}
                sx={{ pt: 0, bgcolor: 'inherit', maxHeight: 840, overflow: 'auto' }}
              >
                <Grid item xs={12} pb={0.5} pl={2}>
                  <Stack display="flex" direction="row" alignItems="center">
                    <Typography
                      width="100%"
                      py={2}
                      fontSize={13}
                      color={(theme) => theme.palette.primary.dark}
                      fontWeight="bold"
                    >
                      123,233,000 contracts
                    </Typography>
                    <SearchBarV2 placeholder="Search for your next gig" />
                  </Stack>
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid container justifyContent="space-between" sx={{ bgcolor: 'background.paper' }}>
              <Grid item xs={3} sx={{}}>
                <Typography pt={2} fontWeight="bold">
                  Filter Markets
                </Typography>
                <List component="nav">
                  {serviceName.map((item) => (
                    <Fragment key={item.id}>
                      <ListItemButton
                        style={{ backgroundColor: 'transparent' }}
                        onClick={() => handleClick(item.id)}
                      >
                        <ListItemText
                          primary={item.name}
                          primaryTypographyProps={{ fontSize: 13, fontWeight: 'medium' }}
                        />
                        {open[item.id] ? (
                          <RemoveIcon fontSize="small" />
                        ) : (
                          <AddIcon fontSize="small" />
                        )}
                      </ListItemButton>
                      <Collapse in={open[item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }} style={{ backgroundColor: 'transparent' }}>
                            <ListItemText
                              primary="Starred"
                              primaryTypographyProps={{ fontSize: 13, fontWeight: 'medium' }}
                            />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </Fragment>
                  ))}
                </List>
              </Grid>
              <Grid
                container
                justifyContent="space-evenly"
                alignItems="center"
                item
                xs={9}
                sx={{ pt: 0, bgcolor: '#f8f8f898', maxHeight: 830, overflow: 'auto' }}
              >
                <Grid
                  item
                  xs={12}
                  pb={0.5}
                  pl={2}
                  sx={{ bgcolor: 'background.paper' }}
                  justifyContent="flex-start"
                  alignItems="flex start"
                  justifySelf="flex-start"
                >
                  <Typography sx={{ bgcolor: 'background.paper' }} fontSize={13} fontWeight="bold">
                    123,233,000 contracts
                  </Typography>
                </Grid>
                <Grid item xs={12} p={1} sx={{ bgcolor: '#f8f8f898r' }}></Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>

                <Grid item xs={5.7} pb={1}>
                  <JobDisplay />
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Work;
