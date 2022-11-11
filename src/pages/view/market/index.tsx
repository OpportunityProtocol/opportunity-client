import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Grid,
  Container,
  Typography,
  Divider,
  Avatar,
  Card,
  CardContent,
  alpha,
  Chip,
} from "@mui/material";
import { QueryResult, useQuery } from "@apollo/client";
import { GET_MARKETS } from "../../../modules/market/MarketGQLQueries";
import MarketDisplay from "../../../modules/market/components/MarketDisplay";
import { NextPage } from "next";
import { GET_VERIFIED_FREELANCERS } from "../../../modules/user/UserGQLQueries";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { NextRouter, useRouter } from "next/router";
import { MoreHoriz, MoreHorizOutlined } from "@mui/icons-material";
import SearchBarV1 from "../../../common/components/SearchBarV1/SearchBarV1";

const MarketHome: NextPage<any> = () => {
  const router: NextRouter = useRouter();
  const [markets, setMarkets] = useState<Array<any>>([]);
  const [activeFreelancers, setActiveFreelancers] = useState<Array<any>>([]);
  const marketsQuery: QueryResult = useQuery(GET_MARKETS);
  const usersQuery: QueryResult = useQuery(GET_VERIFIED_FREELANCERS);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (!marketsQuery.loading && marketsQuery.data) {
      setMarkets([...marketsQuery.data?.markets]);
    }
  }, [marketsQuery.loading]);

  useEffect(() => {
    if (!usersQuery.loading && usersQuery.data) {
      setActiveFreelancers([...usersQuery.data?.verifiedUsers]);
    }
  }, [usersQuery.loading]);

  const handleOnSearchMarket = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.target.value);

  return (
    <Container maxWidth="xl" sx={{ height: "100%" }}>
      <Box>
        <Box mt={2} mb={2}>
          <SearchBarV1
            placeholder="Search Markets"
            value={searchQuery}
            onChange={handleOnSearchMarket}
          />
          <Typography variant="caption" fontWeight="medium">
            Current displaying {markets.length} markets
          </Typography>
        </Box>
        <Grid container direction="row" alignItems="center" spacing={3}>
          {markets
            .filter((market) =>
              String(market.name)
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((marketDetails) => {
              return (
                <Grid xs={12} md={6} lg={4} item>
                  <MarketDisplay marketDetails={marketDetails} />
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </Container>
  );
};

export default MarketHome;
