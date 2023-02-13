import React, { useEffect, useState } from "react";
import { Box, Grid, Container, Typography } from "@mui/material";
import { ApolloQueryResult, QueryResult, useQuery } from "@apollo/client";
import { NextPage } from "next";
import { GET_MARKETS } from "../modules/market/MarketGQLQueries";
import MarketDisplay from "../modules/market/components/MarketDisplay";
import SearchBarV1 from "../common/components/SearchBarV1/SearchBarV1";

const Explore: NextPage<any> = () => {
  const [markets, setMarkets] = useState<Array<any>>([]);
  const marketsQuery: QueryResult = useQuery(GET_MARKETS);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const marketSearchResults = markets.filter((marketDetails) =>
    String(marketDetails.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOnSearchMarket = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(event.target.value);

  useEffect(() => {
    marketsQuery.refetch().then((queryResult: ApolloQueryResult<any>) => {
      const { markets } = queryResult.data;
      setMarkets(markets);
    });
  }, []);

  return (
    <Container maxWidth="xl" sx={{ height: "100%" }}>
      <Box
        pb={2}
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Box>
          <Typography
            fontWeight="bold"
            fontSize={24}
            color="rgba(33, 33, 33, .85)"
          >
            Explore Markets
          </Typography>
          <Typography variant="subtitle2">
            Showing {markets.length} markets
          </Typography>
        </Box>

        <SearchBarV1
          placeholder="Search Markets"
          value={searchQuery}
          onChange={handleOnSearchMarket}
        />
      </Box>

      {marketSearchResults.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "800px",
            width: "100%",
          }}
        >
          <Typography variant="h5" fontWeight="700" py={3}>
            No results found for markets relating to "{searchQuery}"
          </Typography>
          <figure
            style={{
              margin: 0,
              background: "#eee",
              padding: "1em",
              borderRadius: "5px",
            }}
          >
            <blockquote>
              {" "}
              "The contrary investor is every human when he resigns momentarily
              from the herd and thinks for himself"{" "}
            </blockquote>
            <figcaption>&mdash; Archibald MacLeish </figcaption>
          </figure>
        </Box>
      )}
      <Grid container direction="row" alignItems="center" spacing={3}>
        {marketSearchResults.map((marketDetails) => {
          return (
            <Grid key={marketDetails.name} xs={12} md={6} lg={4} item>
              <MarketDisplay marketDetails={marketDetails} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Explore;
