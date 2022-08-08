import React, { Fragment } from "react";
import JobDisplay from "../modules/market/components/JobDisplay";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  Grid,
  Collapse,
  Container,
  ListItem,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Checkbox,
  Tabs,
  Tab,
  Typography,
  Box,
  CardContent,
  Card,
  Divider,
} from "@mui/material";
import TabPanel from "../common/components/TabPanel/TabPanel";
import SearchBarV2 from "../common/components/SearchBarV2/SearchBarV2";
import ServiceCard from "../modules/contract/components/ServiceCard/ServiceCard";
import SearchBarV1 from "../common/components/SearchBarV1/SearchBarV1";
import { TrendingUp } from "@material-ui/icons";
import { WorkOffRounded } from "@mui/icons-material";

/**** Temporary Placeholders *****/
const marketName = [{ id: 1, name: "Writing & Translation" }];

const serviceName = [
  { id: 7, name: "Service 1" },
  {
    id: 8,
    name: " Design & Creative",
  },
  {
    id: 9,
    name: "Development & IT",
  },
  {
    id: 10,
    name: "Engineering & Architecture",
  },
  {
    id: 11,
    name: "Accounting & Finance",
  },
  {
    id: 12,
    name: "Sales & Marketing",
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
  const handleClick = (e, id) => {
    setOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  return (
    <Grid
      component={Container}
      maxWidth="xl"
      container
      direction="column"
      /*sx={{ bgcolor: 'background.paper' }}*/
    >
      <Grid container item>
        <Box sx={{ width: "100%" }}>
          <Box mt={8} sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab
                sx={{ borderBottom: "1px solid #212121" }}
                label="Contracts"
              />
              <Tab sx={{ fontSize: "14px" }} label="Services" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Grid container spacing={5} direction="row" alignItems="flex-start">
              <Grid item xs={8}>
                <Stack
                  py={2}
                  display="flex"
                  direction="row"
                  alignItems="center"
                >
                  <Typography
                    width="100%"
                    fontSize={13}
                    color={(theme) => theme.palette.primary.dark}
                    fontWeight="bold"
                  >
                    123,233,000 contracts
                  </Typography>
                  <SearchBarV1 width="100%" />
                </Stack>

                {new Array(10).fill(-1).map((item) => {
                  return (
                    <Grid mb={1.5} xs={12} item sx={{ width: "100%" }}>
                      <JobDisplay />
                    </Grid>
                  );
                })}
              </Grid>

              <Grid item xs={4}>
                <Card
                  variant="outlined"
                  sx={{ mb: 1, bgcolor: "#fff", height: 500, width: "100%" }}
                >
                  <Box p={2} display="flex" alignItems="center">
                    <Typography pr={1} fontWeight="medium">
                      Most Valuable Verified Freelancers
                    </Typography>
                    <TrendingUp fontSize="small" color="primary" />
                  </Box>
                  <Divider />
                  <CardContent>Could not load freelancers</CardContent>
                </Card>

                <Card
                  variant="outlined"
                  sx={{ mb: 1, bgcolor: "#fff", height: 500, width: "100%" }}
                >
                  <Box p={2} display="flex" alignItems="center">
                    <Typography pr={1} fontWeight="medium">
                      Most Work Completed
                    </Typography>
                    <WorkOffRounded fontSize="small" color="primary" />
                  </Box>
                  <Divider />
                  <CardContent>Could not load freelancers</CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid container justifyContent="space-between">
              <Grid item xs={3} sx={{}}>
                <Box>
                  <Typography pt={2} fontWeight="bold">
                    Filter Markets
                  </Typography>
                  <List component="nav">
                    {marketName.map((item, idx) => (
                      <Fragment key={item.id}>
                        <ListItem
                          secondaryAction={
                            <Checkbox
                              edge="end"
                              onChange={(e) => handleClick(e, idx)}
                              checked={open[idx] === true}
                            />
                          }
                        >
                          <ListItemText
                            primary={item.name}
                            primaryTypographyProps={{
                              fontSize: 13,
                              fontWeight: "medium",
                            }}
                          />
                        </ListItem>
                      </Fragment>
                    ))}
                  </List>
                </Box>
              </Grid>
              <Grid
                container
                flexDirection="column"
                direction="column"
                flexWrap="nowrap"
                alignItems="flex-start"
                justifyContent="flex-start"
                item
                xs={9}
                sx={{
                  pt: 0,
                  width: "100%",
                  bgcolor: "#fafafa",
                  px: 2,
                  minHeight: "calc(100vh - 70px - 80px)",
                  overflow: "auto",
                }}
              >
                <Grid sx={{ width: "100%" }} item height="auto" pt={1} pb={1.5}>
                  <Stack display="flex" direction="row" alignItems="center">
                    <Typography
                      width="100%"
                      fontSize={13}
                      color={(theme) => theme.palette.primary.dark}
                      fontWeight="bold"
                    >
                      123,233,000 contracts
                    </Typography>
                    <SearchBarV2 placeholder="Search for your next gig" />
                  </Stack>
                </Grid>

                <Grid
                  container
                  item
                  direction="row"
                  justifyContent="space-between"
                >
                  {new Array(10).fill(-1).map((item) => {
                    return (
                      <Grid mb={1.5} xs={3.8} item sx={{ width: "100%" }}>
                        <ServiceCard />
                      </Grid>
                    );
                  })}
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
