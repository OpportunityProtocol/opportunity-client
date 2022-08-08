import React, { useEffect, useState, FunctionComponent } from "react";
import { useStyles } from "../modules/market/MarketStyles";
import { Grid, Container, Typography, Button, Box, Stack } from "@mui/material";

import MarketDisplay from "../modules/market/components/MarketDisplay";
import { ICarouselItemProps } from "../modules/market/MarketInterface";
import JobDisplay from "../modules/market/components/JobDisplay";
import ServiceCard from "../modules/contract/components/ServiceCard/ServiceCard";
import { KeyboardArrowRight, NorthEast } from "@mui/icons-material";
import { NextPage } from "next";
import { hexToDecimal } from "../common/helper";
import VerifiedAvatar from "../modules/user/components/VerifiedAvatar";
import { ServiceStruct } from "../typechain-types/NetworkManager";
import { QueryResult, useQuery } from "@apollo/client";
import {
  GET_CONTRACTS,
  GET_SERVICES,
} from "../modules/contract/ContractGQLQueries";
import { GET_MARKETS } from "../modules/market/MarketGQLQueries";
import { GET_VERIFIED_FREELANCERS } from "../modules/user/UserGQLQueries";
import { ConfirmationDialog } from "../common/components/ConfirmationDialog";
import SearchBarV1 from "../common/components/SearchBarV1/SearchBarV1";

const HEIGHT = "600px";
function CarouselItem({ item, itemLength, index }: ICarouselItemProps) {
  const classes = useStyles();
  return (
    <Box>
      <img src={item.source} style={{ width: "100%", height: HEIGHT }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: HEIGHT,
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
      />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        p={5}
        position="absolute"
        top={0}
        left={0}
        height="100%"
        width="100%"
      >
        <Container maxWidth="lg" sx={{ bgcolor: "transparent" }}>
          <Typography
            color="#fff"
            fontWeight="bold"
            py={1}
            fontSize={45}
            width="60%"
          >
            {item.title}
          </Typography>
          <Typography color="#fff" fontSize={20} py={1} width="60%">
            {item.subtitle}
          </Typography>
          <Button
            //onClick={item.onClick}
            size="large"
            variant="contained"
            className={classes.carouselButton}
          >
            {item.buttonTitle}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

const ExplorePage: NextPage = () => {
  const classes = useStyles();
  const [verifiedFreelancers, setVerifiedFreelancers] = useState<Array<any>>(
    []
  );
  const [featuredMarkets, setFeaturedMarkets] = useState<Array<any>>([]);
  const [services, setServices] = useState([]);
  const [featuredContracts, setFeaturedContracts] = useState([]);

  const getServices: QueryResult = useQuery(GET_SERVICES);
  const contractsQuery: QueryResult = useQuery(GET_CONTRACTS);
  const marketsQuery: QueryResult = useQuery(GET_MARKETS);
  const verifiedFreelancersQuery: QueryResult = useQuery(
    GET_VERIFIED_FREELANCERS
  );

  useEffect(() => {
    if (!contractsQuery.loading && contractsQuery.data) {
      setFeaturedContracts(contractsQuery.data.contracts);
    }
  }, [contractsQuery.loading]);

  useEffect(() => {
    if (!marketsQuery.loading && marketsQuery.data) {
      setFeaturedMarkets(marketsQuery.data.markets);
    }
  }, [marketsQuery.loading]);

  useEffect(() => {
    console.log(verifiedFreelancersQuery);
    if (!verifiedFreelancersQuery.loading && verifiedFreelancersQuery.data) {
      setVerifiedFreelancers(verifiedFreelancersQuery.data.verifiedUsers);
    }
  }, [verifiedFreelancersQuery.loading]);

  useEffect(() => {
    if (!getServices.loading && getServices.data) {
      setServices(getServices.data.services);
    }
  }, [getServices.loading]);

  //prepare explore page
  useEffect(() => {
    contractsQuery.refetch();
    marketsQuery.refetch();
    verifiedFreelancersQuery.refetch();
    getServices.refetch();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          height: 400,
          bgcolor: "#fff",
          width: "100%",
          borderBottom: "1px solid #ddd",
        }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box my={1}>
          <Typography
            fontWeight="bold"
            fontSize={35}
            textAlign="center"
            color="text.primary"
          >
            Welcome to Lens Talent
          </Typography>
          <Typography
            fontWeight="medium"
            py={1}
            maxWidth={550}
            textAlign="center"
            paragraph
            color="text.secondary"
          >
            Lens Talent allows anyone to find work in a decentralized and
            permissionless manner.{" "}
            <Typography fontSize={20} component="span">
              🌍
            </Typography>
          </Typography>
        </Box>
        <SearchBarV1 width={500} />
      </Box>
      <Container maxWidth="lg" className={classes.root}>
        <Box my={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="h5"
              py={2}
              fontWeight="bold"
              color="rgba(33, 33, 33, .85)"
            >
              Expand your network
            </Typography>

            <Button
              endIcon={<KeyboardArrowRight />}
              variant="text"
              size="large"
            >
              Explore freelancers
            </Button>
          </Stack>
          <Stack
            direction="row"
            flexWrap="nowrap"
            alignItems="center"
            justifyContent="flex-start"
            spacing={5}
          >
            {verifiedFreelancers.map(({ address }) => {
              return <VerifiedAvatar address={address} />;
            })}
          </Stack>
        </Box>

        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item py={2} width="100%">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h5"
                  pt={2}
                  pb={0.5}
                  fontWeight="bold"
                  color="rgba(33, 33, 33, .85)"
                >
                  Participate in markets
                </Typography>
                <Typography variant="body2" maxWidth={600}>
                  Lens Talent only currently only supports one market.{" "}
                  <Typography color="primary" variant="button" component="span">
                    Learn more about market proposals{" "}
                    <NorthEast fontSize="small" />
                  </Typography>
                </Typography>
              </Box>

              <Button
                endIcon={<KeyboardArrowRight />}
                variant="text"
                size="large"
              >
                All Markets
              </Button>
            </Stack>
          </Grid>
          <Grid item />
        </Grid>
        <Grid
          container
          direction="row"
          flexDirection="row"
          alignItems="center"
          spacing={2}
        >
          {featuredMarkets.slice(0, 6).map((details: any) => {
            return (
              <Grid item sm={4}>
                <MarketDisplay marketDetails={details} isShowingStats />
              </Grid>
            );
          })}
        </Grid>

        <Box
          sx={{
            mt: 8,
            p: 3,
            width: "100%",
            bgcolor: "#fff",
            border: "1px solid #ddd",
          }}
        >
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
          >
            <Box pb={2}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="rgba(33, 33, 33, .85)"
              >
                Featured Services
              </Typography>
              <Typography color="primary" variant="button" component="span">
                Learn more about creating services{" "}
                <NorthEast fontSize="small" />
              </Typography>
            </Box>
          </Stack>

          <Grid
            container
            alignItems="center"
            direction="row"
            flexWrap="nowrap"
            spacing={3}
          >
            {services.slice(0, 3).map((serviceData: ServiceStruct) => {
              return (
                <Grid item xs={4}>
                  <ServiceCard
                    id={hexToDecimal(serviceData.id._hex)}
                    data={serviceData}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Box my={6}>
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="h5"
                py={2}
                fontWeight="bold"
                color="rgba(33, 33, 33, .85)"
              >
                Featured contracts
              </Typography>

              <Button
                endIcon={<KeyboardArrowRight />}
                variant="text"
                size="large"
              >
                See all
              </Button>
            </Stack>
          </Box>
          <Grid
            sx={{ mb: 2 }}
            container
            direction="row"
            overflow="scroll"
            flexWrap="wrap"
            spacing={2}
          >
            {featuredContracts.map((contract: any) => {
              return (
                <Grid item xs={4}>
                  <JobDisplay data={contract} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ExplorePage;
