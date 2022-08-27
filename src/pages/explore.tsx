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
  Modal,
  ListItemAvatar,
  Avatar,
  FormControl
} from "@mui/material";
import MarketDisplay from "../modules/market/components/MarketDisplay";
import { ICarouselItemProps } from "../modules/market/MarketInterface";
import JobDisplay from "../modules/market/components/JobDisplay";
import ServiceCard from "../modules/contract/components/ServiceCard/ServiceCard";
import {
  Directions,
  KeyboardArrowRight,
  NorthEast,
  Refresh,
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







import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import InputAdornment from '@mui/material/InputAdornment';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Input from '@mui/material/Input';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


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

  const onRefresh = () => {
    contractsQuery.refetch();
    marketsQuery.refetch();
    verifiedFreelancersQuery.refetch();
    getServices.refetch();
  }

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

  const [sendMessageopen, setSendmessageOpen] = React.useState(false);
  const handleOpen = () => setSendmessageOpen(true);
  const handleClose = () => setSendmessageOpen(false);


  
 



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
            sx={{ ml: 1, flex: 1, fontWeight: 'medium' }}
            placeholder="Find work anytime"
            inputProps={{ "aria-label": "search google maps" }}
          />
          <Box alignSelf='flex-end'>
            <IconButton onClick={onRefresh}>
              <Refresh />
            </IconButton>
          </Box>
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





        <Grid display="flex" alignItems="center" >
          <Button variant="outlined" onClick={handleOpen}>
            Send Message
          </Button>
        </Grid>
        <Dialog
        fullScreen
        open={sendMessageopen}
        onClose={handleClose}
        TransitionComponent={Transition}
     
        sx={{
            '& .MuiDialog-paper': {
             
              backgroundColor: 'rgba(236,246,242,1)'
            },
          }}
    
       
      >
        <Grid sx={{
          maxWidth: '1300px',
          width: '100%',
          paddingRight: '15px',
          paddingLeft: '15px',
          marginRight: 'auto',
          marginLeft: 'auto',
          paddingTop: '10em',
          paddingBottom: '10em',
         


        }}>
        <Grid sx={{
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginRight: '-15px',
          marginLeft: '-15px',


        }}>
        <Grid sx={{
          position: 'relative',
          width: '100%',
          paddingRight: '15px',
          paddingLeft: '15px',
          flex: '0 0 83.33333%',
          maxWidth: '83.33333%',
          flexDirection: 'column',

        }}>

<Grid sx={{
          width: "100%",
          boxShadow: '0px 21px 41px -13px rgba(0, 0, 0, 0.18)',

        }}>

  <Grid sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginRight: '0',
          marginLeft: '0',

        }}>

       
        <Grid sx={{ 
        
          paddingRight: '0',
          paddingLeft: '0',
          alignItems: 'stretch !important',
          display: 'flex !important',
          flex: '0 0 41.66667%',
          maxWidth: '41.66667%',
          position: 'relative',     
          width: '100%',
          flexDirection: 'column',

        }}>
        <Grid
        sx={{
          marginTop: '-20px',
          justifyContent: 'center',
          alignItems: "center",
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
          background:  'rgb(73, 168, 130) !important',
          width: '100% !important',
          padding: '3rem !important',
          display: "flex",
          flexDirection: 'column',
          borderBottom: '1px gray',


        }}>
        
      
          <Avatar sx={{ width: '55px', height: '55px'}} />
        <Typography sx={{ marginTop: '20px', lineHeight: '1.5', fontWeight: '400', fontFamily: '"Poppins", Arial, sans-serif', color: '#000', fontSize: '1.50rem' }}>Username</Typography>
     

        </Grid>
        <Divider />
        <Grid sx={{
          
          marginBottom: '-20px',
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          background:  'rgb(73, 168, 130) !important',
          width: '100% !important',
          paddingLeft: '3rem !important',
          paddingRight: '3rem !important',
          paddingBottom: '3rem !important',

        }}> 


        <List>
        
          <ListItem >
            <ListItemText primary="Contract Title" secondary="Titania"  primaryTypographyProps={{fontWeight: '550'}}/>
          </ListItem>
          <ListItem >
            <ListItemText primary="Contract Description" secondary="Tethys" primaryTypographyProps={{fontWeight: '550'}} />
          </ListItem>
          <ListItem >
            <ListItemText primary="Market Id" secondary="Tethys"  primaryTypographyProps={{fontWeight: '550'}}/>
          </ListItem>
          <ListItem >
            <ListItemText primary="Contact Budget" secondary="Tethys"  primaryTypographyProps={{fontWeight: '550'}}/>
          </ListItem>
          <ListItem >
            <ListItemText primary="Definition of done" secondary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed hendrerit sem.
              Donec nec mi sit amet nisl accumsan fringilla quis eget lectus. Quisque pellentesque
              tortor tortor, at convallis metus ornare ac. Aenean quis pellentesque nisl. Ut
              suscipit a nisi sed porttitor. Donec cursus velit diam, non accumsan urna aliquet
              hendrerit."  primaryTypographyProps={{fontWeight: '550'}}/>
          </ListItem>
      
        </List>

        
        

        </Grid>
        

        </Grid>
        <Grid sx={{ 
         
          paddingRight: '0',
          paddingLeft: '0',
          alignItems: 'stretch !important',
          display: 'flex !important',
          flex: '0 0 58.33333%',
          maxWidth: '58.33333%',
          position: 'relative',     
          width: '100%',
          flexDirection: 'column',

        }}>

        <Grid sx={{
          background: '#fff',
          paddingLeft: '3rem !important',
          paddingRight: '3rem !important',
          paddingTop: '3rem !important',
          width: '100% !important',
        }}>
        
        <CloseIcon
              fontSize="large"
              onClick={handleClose}
              sx={{
                padding: "0px",
                height: "20px",
                position: "absolute",
                right: "17px",
                top: "17px",
                width: "20px",
                cursor: "pointer",
              }}
            />
         
      <Typography sx={{
        lineHeight: '1.5',
        fontWeight: '400',
        fontFamily: '"Poppins", Arial, sans-serif',
        color: '#000',
        fontSize: '1.75rem',

      }}>Create Proposal</Typography>




        <List>
        
        <ListItem  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
            <ListItemText primary="Proposal Payout" secondary="Enter a proposed payout you would like to receive for this job." primaryTypographyProps={{fontWeight: '550'}} />
            <FormControl >
          
          <Input id="outlined-basic" type="number" startAdornment={
            <InputAdornment position="start">
                <img src="/assets/images/dai.png" style={{ width: 20, height: 20 }} />
            </InputAdornment>
          }/>
          
        </FormControl>
          </ListItem>
          <ListItem  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
            <ListItemText primary="Contract Proposal" secondary="Write a proposal detailing why you would be a good fit for this job." primaryTypographyProps={{fontWeight: '550'}}  />
            <FormControl fullWidth sx={{ width:'100%' }}>
          
          <TextField id="outlined-basic" label="" variant="outlined"  multiline
          rows={16}/>
          
        </FormControl>
          </ListItem>
         
         
      
        </List>
        <Grid sx={{alignItems: 'center', display: 'flex', justifyContent: 'center', marginBottom: '11px'}}>
          <Button size="large" onClick={handleClose}>
            Send Proposal
          </Button>
        </Grid>


        </Grid>
        </Grid>
        </Grid>
        </Grid>
        </Grid>
        </Grid>
        </Grid>
      </Dialog>





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
              sx={{ height, boxShadow: "none", border: '1px solid #ddd' }}
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
