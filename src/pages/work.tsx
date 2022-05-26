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
  Tabs,
  Tab,
  Typography,
  Box,
} from '@mui/material';
import TabPanel from '../common/components/TabPanel/TabPanel';

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
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Box m={3} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
              <Tab
                sx={{ fontSize: '14px', borderBottom: '1px solid #212121' }}
                label="Contract"
      
              />
              <Tab sx={{ fontSize: '14px' }} label="Service" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Grid container justifyContent="space-between" sx={{ bgcolor: 'background.paper' }}>
              <Grid item xs={3} sx={{}}>
                <List
                  sx={{ bgcolor: 'background.paper' }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                  {marketName.map((item) => (
                    <Fragment key={item.id}>
                      <ListItemButton
                        style={{ backgroundColor: 'transparent' }}
                        onClick={() => handleClick(item.id)}
                      >
                        <ListItemText primary={item.name} sx={{ fontSize: '14px' }} />
                        {open[item.id] ? <RemoveIcon /> : <AddIcon />}
                      </ListItemButton>
                      <Collapse in={open[item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }} style={{ backgroundColor: 'transparent' }}>
                            <ListItemText primary="Starred" sx={{ fontSize: '14px' }} />
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
                sx={{ pt: 0, bgcolor: '#f8f8f8', maxHeight: 840, overflow: 'auto' }}
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
                <Grid item xs={12} p={1} sx={{ bgcolor: '#f8f8f8' }}></Grid>
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
                <List
                  sx={{ bgcolor: 'background.paper' }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                  {serviceName.map((item) => (
                    <Fragment key={item.id}>
                      <ListItemButton
                        style={{ backgroundColor: 'transparent' }}
                        onClick={() => handleClick(item.id)}
                      >
                        <ListItemText primary={item.name} sx={{ fontSize: '14px' }} />
                        {open[item.id] ? <RemoveIcon /> : <AddIcon />}
                      </ListItemButton>
                      <Collapse in={open[item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }} style={{ backgroundColor: 'transparent' }}>
                            <ListItemText primary="Starred" sx={{ fontSize: '14px' }} />
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
