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
import { ApolloQueryResult, QueryResult, useQuery } from "@apollo/client";
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

  const onLoad = () => {
    marketsQuery.refetch().then((result: ApolloQueryResult<any>) => {
      setMarkets([...result.data?.markets]);
    })

    usersQuery.refetch().then((result: ApolloQueryResult<any>) => {
      setActiveFreelancers([...result.data?.verifiedUsers]);
    })
  }

  const handleOnSearchMarket = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.target.value);
  
  useEffect(() => {
    onLoad()
  }, [])

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
            .filter((marketDetails) =>
              String(marketDetails.name)
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((marketDetails) => {
              return (
                <Grid key={marketDetails.name} xs={12} md={6} lg={4} item>
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
