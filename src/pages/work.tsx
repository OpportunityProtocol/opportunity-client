import React, { ChangeEvent, Fragment, useContext, useState } from "react";
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
import { CheckBox, WorkOffRounded } from "@mui/icons-material";
import SearchContext from "../context/SearchContext";

/**
 * @author Nathan Farley
 */
function Work() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchContext = useContext(SearchContext);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(e.target.value);
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const onSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchContext.actionable.search(searchQuery);
    }
  };

  const [contractsChecked, setContractsChecked] = useState<boolean>(false)
  const [servicesChecked, setServicesChecked] = useState<boolean>(false)

  const handleOnChangeContractsChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractsChecked(event.target.checked);
  };

  const handleChangeServicesChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServicesChecked(event.target.checked);
  };

  return (
    <Grid
      component={Container}
      maxWidth="lg"
      container
      direction="column"
      // sx={{ bgcolor: 'background.paper' }}
    >
      <Grid container item>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          my={3}
          width="100%"
        >
          <Stack direction="row" spacing={2}>
            <Card
              elevation={0}
              variant="outlined"
              sx={{ height: 55 }}
            >
              <CardContent
                component={Stack}
                direction="row"
                spacing={2}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="body2" fontWeight="500">
                  Contracts
                </Typography>
                <Checkbox onChange={handleOnChangeContractsChecked} />
              </CardContent>
            </Card>

            <Card
              elevation={0}
              variant="outlined"
              sx={{ height: 55 }}
            >
              <CardContent
                component={Stack}
                direction="row"
                spacing={2}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="body2" fontWeight="500">
                  Services
                </Typography>
                <Checkbox onChange={handleChangeServicesChecked}   />
              </CardContent>
            </Card>
          </Stack>
          <SearchBarV2
            placeholder="Search contracts and services"
            width="50%"
            onKeyDown={onSearch}
            onChange={onChange}
            value={searchQuery}
            onClickPrimaryButton={onSearch}
          />
        </Stack>

        <Box sx={{ width: "100%" }}>
          <Grid container spacing={5} direction="row" alignItems="flex-start">
            <Grid item xs={8}>
              <Typography
                pb={2}
                width="100%"
                color={(theme) => theme.palette.primary.dark}
                variant="subtitle2"
              >
                A decentralized protocol for cooperation
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {searchContext.results.all &&
              searchContext.results.all.length === 0 ? (
                <Stack
                  sx={{
                    width: "100%",
                    height: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/assets/images/regular_man_one.svg"
                    style={{ height: 200 }}
                  />
                  <Typography
                    py={1}
                    fontSize={20}
                    variant="body2"
                    textAlign="center"
                  >
                    No results found for {searchQuery}
                  </Typography>
                  <Typography
                    width={500}
                    textAlign="center"
                    fontSize={15}
                    paragraph
                  >
                    Thank you for using Lens Talent. We are activaly working on
                    onboarding new users to the platform.{" "}
                    <Typography
                      color="primary"
                      component="span"
                      variant="button"
                    >
                      Help us by sharing.
                    </Typography>
                  </Typography>
                </Stack>
              ) : (
                searchContext.results.all.map((item) => {
                  return (
                    <Grid mb={1.5} xs={12} item sx={{ width: "100%" }}>
                      {item?.__typename === "Contract" ? (
                        <JobDisplay data={item} />
                      ) : (
                        <ServiceCard id={item?.id} data={item} />
                      )}
                    </Grid>
                  );
                })
              )}
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
        </Box>
      </Grid>
    </Grid>
  );
}

export default React.memo(Work);
