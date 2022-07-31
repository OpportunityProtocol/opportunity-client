import React, { useEffect, useState, FunctionComponent } from "react";
import { useStyles } from "../modules/market/MarketStyles";
import {
  Grid,
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Avatar,
  Paper,
} from "@mui/material";

import { ClassNameMap } from "@mui/material";
import MarketDisplay from "../modules/market/components/MarketDisplay";

import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
import Carousel from "react-material-ui-carousel";
import { GradientAvatarClassKey } from "@mui-treasury/styles/avatar/gradient/gradientAvatar.styles";
import { ICarouselItemProps } from "../modules/market/MarketInterface";
import { loggedOutHeroCarouselItems } from "../modules/market/MarketConstants";
import JobDisplay from "../modules/market/components/JobDisplay";
import ServiceCard from "../modules/contract/components/ServiceCard/ServiceCard";
import { useRouter } from "next/router";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useContractRead } from "wagmi";
import { NETWORK_MANAGER_ADDRESS, TOKEN_FACTORY_ADDRESS } from "../constant";
import { NetworkManagerInterface, TokenFactoryInterface } from "../abis";
import { CHAIN_ID } from "../constant/provider";
import { ProfileDataStruct } from "../typechain-types/FeeFollowModule";
import { MarketDetailsStruct } from "../typechain-types/ITokenExchange";
import { NextPage } from "next";
import { hexToDecimal } from "../common/helper";
import { BigNumber } from "ethers";
import { Result } from "ethers/lib/utils";
import VerifiedAvatar from "../modules/user/components/VerifiedAvatar";
import { ServiceStruct } from "../typechain-types/NetworkManager";
import SearchBarV2 from "../common/components/SearchBarV2/SearchBarV2";
import Dropdown from "../common/components/Dropdown";
import TransactionTokenDialog from "../modules/market/components/TransactionTokenDialog";
import { useQuery } from "@apollo/client";
import {
  GET_CONTRACTS,
  GET_SERVICES,
} from "../modules/contract/ContractGQLQueries";

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

  const [marketsLoading, setMarketsLoading] = useState<boolean>(false);
  const [verifiedFreelancersLoading, setVerifiedFreelancersLoading] =
    useState<boolean>(false);
  const [verifiedFreelancers, setVerifiedFreelancers] = useState<Array<any>>(
    []
  );
  const [numMarkets, setNumMarkets] = useState<any>([]);
  const [services, setServices] = useState([]);
  const [featuredContracts, setFeaturedContracts] = useState([]);
  const [contractsLoading, setContractsLoading] = useState(false);

  const getServices = useQuery(GET_SERVICES);
  const contractsQuery = useQuery(GET_CONTRACTS);

  useEffect(() => {
    if (!contractsQuery.loading && contractsQuery.data) {
      setFeaturedContracts(contractsQuery.data.contracts);
    }
  }, [contractsQuery.loading]);

  const networkManager_getMarkets = useContractRead(
    {
      addressOrName: TOKEN_FACTORY_ADDRESS,
      contractInterface: TokenFactoryInterface,
    },
    "getNumMarkets",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      onSuccess: (data: Result) => {
        const total = hexToDecimal(data._hex);
        let list = [];
        for (let i = 0; i < total; i++) {
          list.push(Number(i) + 1);
        }
        setNumMarkets(list);
        // setMarketsDetails(data)
        setMarketsLoading(false);
      },
      onError: (error) => {
        setMarketsLoading(false);
      },
    }
  );

  const networkManager_getContracts = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getContracts",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      onSuccess(data: Result) {
        setContracts(data);
      },
      onError(error) {
        console.log(error);
      },
      onSettled(data, error) {
        setContractsLoading(false);
      },
    }
  );

  const networkManager_getVerifiedFreelancers = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getVerifiedFreelancers",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      onSuccess: (data: Result) => {
        setVerifiedFreelancers(data as Array<any>);
        setVerifiedFreelancersLoading(false);
      },
      onError: (error) => {
        setVerifiedFreelancersLoading(false);
      },
    }
  );

  const renderFreelancers = () => {
    const freelancers = verifiedFreelancers.slice();
    return freelancers.splice(0, 6).map((address) => {
      return <VerifiedAvatar address={address} />;
    });
  };

  //prepare explore page
  useEffect(() => {
    setMarketsLoading(true);
    setVerifiedFreelancersLoading(true);
    setContractsLoading(true);
    //networkManager_getMarkets.refetch()
    //networkManager_getVerifiedFreelancers.refetch()
    //networkManager_getContracts.refetch()
  }, []);

  useEffect(() => {
    if (!getServices.loading && getServices.data) {
      const serviceData = getServices.data.services;
      setServices(serviceData);
    } else {
      setServices([]);
    }
  }, [getServices.loading]);

  return (
    <Box>
      <Container maxWidth="lg" className={classes.root}>
        <Carousel
          animation="slide"
          fullHeightHover={true}
          indicators={false}
          autoPlay
          interval={8000}
        >
          {loggedOutHeroCarouselItems.map((item, i, arr) => (
            <CarouselItem
              key={i}
              item={item}
              itemLength={arr.length}
              index={i}
            />
          ))}
        </Carousel>
        <Box sx={{ width: "100%", margin: "0px" }}>
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
              spacing={5}
            >
              {renderFreelancers()}
            </Stack>
          </Box>

          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
          >
            <Box>
              <Typography
                py={3}
                fontWeight="bold"
                color="rgba(33, 33, 33, .85)"
                fontSize={30}
              >
                Buy{" "}
                <Typography
                  sx={{ color: (theme) => theme.palette.primary.main }}
                  fontSize={30}
                  fontWeight="bold"
                  component="span"
                >
                  confidence
                </Typography>{" "}
                recently created services
              </Typography>
            </Box>

            <Dropdown />
          </Stack>

          <Grid
            container
            alignItems="center"
            direction="row"
            flexWrap="nowrap"
            spacing={3}
          >
            {services.slice(0, 4).map((serviceData: ServiceStruct) => {
              return (
                <Grid item xs={3}>
                  <ServiceCard
                    id={hexToDecimal(serviceData.id._hex)}
                    data={serviceData}
                  />
                </Grid>
              );
            })}
          </Grid>

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
                <Typography
                  variant="h5"
                  py={2}
                  fontWeight="bold"
                  color="rgba(33, 33, 33, .85)"
                >
                  Participate in markets
                </Typography>

                <Button
                  endIcon={<KeyboardArrowRight />}
                  variant="text"
                  size="large"
                >
                  See all
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
            {numMarkets.slice(0, 6).map((marketId) => {
              return (
                <Grid item sm={4}>
                  <MarketDisplay marketId={marketId} isShowingStats />
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
                <Grid item xs={5.9}>
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
