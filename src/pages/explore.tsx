import React, { ReactNode, useEffect, useState } from "react";
import { useStyles } from "../modules/market/MarketStyles";
import {
  Grid,
  Container,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  alpha,
  Card,
  CardHeader,
  Divider,
  getCardHeaderUtilityClass,
  Paper,
  IconButton,
  Menu,
  InputBase,
} from "@mui/material";
import MarketDisplay from "../modules/market/components/MarketDisplay";
import { ICarouselItemProps } from "../modules/market/MarketInterface";
import JobDisplay from "../modules/market/components/JobDisplay";
import ServiceCard from "../modules/contract/components/ServiceCard/ServiceCard";
import {
  Directions,
  KeyboardArrowRight,
  NorthEast,
  Search,
} from "@mui/icons-material";
import { NextPage } from "next";
import { hexToDecimal } from "../common/helper";
import VerifiedAvatar from "../modules/user/components/VerifiedAvatar";
import { ServiceStruct } from "../typechain-types/NetworkManager";
import { QueryResult, useQuery } from "@apollo/client";
import MenuIcon from "@mui/icons-material/Menu";
import {
  GET_CONTRACTS,
  GET_SERVICES,
} from "../modules/contract/ContractGQLQueries";
import { GET_MARKETS } from "../modules/market/MarketGQLQueries";
import { GET_VERIFIED_FREELANCERS } from "../modules/user/UserGQLQueries";
import Carousel from "react-material-ui-carousel";
import { loggedOutHeroCarouselItems } from "../modules/market/MarketConstants";
import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/styles";
import UserCard from "../modules/user/components/UserCard/UserCard";

import isWeekend from "date-fns/isWeekend";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

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

const heights = [340, 320, 400, 320, 360, 400];

const ExplorePage: NextPage = () => {
  const classes = useStyles();
  const [verifiedFreelancers, setVerifiedFreelancers] = useState<Array<any>>(
    []
  );
  const [featuredMarkets, setFeaturedMarkets] = useState<Array<any>>([]);
  const [services, setServices] = useState([]);
  const [featuredContracts, setFeaturedContracts] = useState<Array<any>>([]);

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

  const getCardHeader = (idx: number): ReactNode => {
    switch (idx) {
      case 0:
        return;
      case 1:
        return (
          <Typography
            p={1.5}
            fontSize={17}
            fontWeight="bold"
            color="rgba(33, 33, 33, .85)"
          >
            Markets
          </Typography>
        );
      case 2:
        return (
          <Typography
            p={1.5}
            fontSize={17}
            fontWeight="bold"
            color="rgba(33, 33, 33, .85)"
          >
            Jobs
          </Typography>
        );
      case 3:
        return (
          <Typography
            p={1.5}
            fontSize={17}
            fontWeight="bold"
            color="rgba(33, 33, 33, .85)"
          >
            Communities
          </Typography>
        );
      case 4:
        return (
          <Typography
            p={1.5}
            fontSize={17}
            fontWeight="bold"
            color="rgba(33, 33, 33, .85)"
          >
            Freelancers
          </Typography>
        );
      case 5:
        return (
          <Typography
            p={1.5}
            fontSize={17}
            fontWeight="bold"
            color="rgba(33, 33, 33, .85)"
          >
            Services
          </Typography>
        );
      default:
    }
  };

  const [value, setValue] = React.useState<Date | null>(new Date());
  const getCardContent = (idx: number) => {
    switch (idx) {
      case 0:
        return (
          <Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <StaticDatePicker<Date>
                orientation="portrait"
                openTo="day"
                disableOpenPicker
                readOnly
                value={value}
                 showToolbar={false}
                views={["day"]}
                onChange={(newValue) => {}}
              />
            </LocalizationProvider>
          </Box>
        );
      case 1:
        return (
          <Stack p={1.5} spacing={2}>
            {featuredMarkets.slice(0, 6).map((details: any) => {
              return <MarketDisplay marketDetails={details} text />;
            })}
          </Stack>
        );
      case 2:
        return (
          <Stack p={1.5} spacing={2}>
            {featuredContracts.map((item, idx: number, arr: Array<any>) => {
              return (
                <Grid item xs={6}>
                  <JobDisplay data={item} text />
                </Grid>
              );
            })}
          </Stack>
        );
      case 3:
        return (
          <Box p={1.5}>
            <Typography variant="caption" fontSize={13}>
              Communities are not supported yet. Learn more about our vision for
              communities{" "}
              <Typography
                color="primary"
                fontSize={13}
                component="span"
                variant="button"
              >
                here
              </Typography>
              .
            </Typography>
          </Box>
        );
      case 4:
        return (
          <Stack>
            {verifiedFreelancers.map(({ address }, idx, arr) => {
              return (
                <>
                  <UserCard address={address} />
                </>
              );
            })}
          </Stack>
        );
      case 5:
        return (
          <Stack p={1.5} spacing={2}>
            {services.slice(0, 3).map((serviceData: ServiceStruct) => {
              return (
                <ServiceCard
                  id={hexToDecimal(serviceData.id._hex)}
                  data={serviceData}
                  text
                />
              );
            })}
          </Stack>
        );
      default:
    }
  };

  return (
    <Box>
      <Box
        sx={{
          borderBottom: "2px solid #000",
          width: "100%",
          height: 300,
          margin: "auto",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.8)",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Stack>
            <Typography
              color="#fff"
              variant="h6"
              textAlign="center"
              fontSize={40}
              fontWeight="bold"
            >
              Welcome to Lens Talent
            </Typography>
            <Typography
              color="#fff"
              paragraph
              textAlign="center"
              fontSize={17}
              fontWeight="medium"
            >
              Lens Talent is a decentralized and permissionless protocol for
              labor markets
            </Typography>
          </Stack>
        </Box>
        <img
          src="/assets/images/india.jpeg"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        <Paper
          component="form"
          elevation={8}
          sx={{
            position: "absolute",
            top: 275,
            left: "28%",
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 800,
          }}
        >
          <IconButton disabled sx={{ p: "10px" }} aria-label="menu">
            <Search />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Find work anytime"
            inputProps={{ "aria-label": "search google maps" }}
          />
        </Paper>
      </Box>
      <Container maxWidth="xl" className={classes.root}>
        <Box
          sx={{
            mt: 12,
            mb: 12,
            width: "100%",
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
              <Typography
                color="primary"
                variant="button"
                component="span"
                onClick={() => searchContext?.actionable?.search("sdfsdf")}
              >
                Learn more about creating services{" "}
                <NorthEast fontSize="small" />
              </Typography>
            </Box>
          </Stack>

          <Grid
            sx={{ width: "100%" }}
            container
            alignItems="center"
            direction="row"
            flexWrap="nowrap"
            spacing={3}
          >
            {services.slice(0, 3).map((serviceData: ServiceStruct) => {
              return (
                <Grid item xs={4} key={serviceData?.id?._hex}>
                  <ServiceCard
                    //  outlined={false}
                    id={hexToDecimal(serviceData.id._hex)}
                    data={serviceData}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Masonry
          columns={3}
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "stretch",
          }}
        >
          {heights.map((height, index) => (
            <Card
              square
              elevation={10}
              key={index}
              sx={{ height, boxShadow: "0 19px 38px #aaa, 0 15px 12px #aaa" }}
            >
              {index !== 0 ? (
                <>
                  <CardContent>
                    <Box sx={{ width: "100%", height: "100%" }}>
                      {getCardHeader(index)}
                    </Box>
                  </CardContent>
                  <Divider />
                </>
              ) : null}

              <CardContent>{getCardContent(index)}</CardContent>
            </Card>
          ))}
        </Masonry>
      </Container>
    </Box>
  );
};

export default ExplorePage;

{
  /*   */
}

{
  /*  */
}
