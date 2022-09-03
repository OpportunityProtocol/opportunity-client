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
import { NextPage } from "next";

/**
 * @author Nathan Farley
 * returns NextPage The Work page component
 */
const Work: NextPage<any> = () => {
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

  const [contractsChecked, setContractsChecked] = useState<boolean>(true);
  const [servicesChecked, setServicesChecked] = useState<boolean>(true);

  const handleOnChangeContractsChecked = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContractsChecked(event.target.checked);
  };

  const handleChangeServicesChecked = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setServicesChecked(event.target.checked);
  };

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid container item>
          <Stack direction="row" alignItems='center' my={1} width="100%">
            <Box>
            <SearchBarV1
              width={300}
              placeholder="Find work"
              value={searchQuery}
              onChange={onChange}
              onKeyDown={onSearch}
            />
            </Box>
       
        
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
                      alignItems: "flex-start",
                    }}
                  >
                    <img
                      src="/assets/images/regular_man_one.svg"
                      style={{ height: 200 }}
                    />
                    <Typography py={1} fontSize={20} variant="body2">
                      No results found for {searchQuery}
                    </Typography>
                    <Typography width={500} fontSize={15} paragraph>
                      Thank you for using Lens Talent. We are activaly working
                      on onboarding new users to the platform.{" "}
                      <Typography
                        color="primary"
                        component="span"
                        variant="button"
                      >
                        Contribute
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
              <Grid item xs={4} />
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(Work);
