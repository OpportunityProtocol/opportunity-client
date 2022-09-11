import React, { ReactNode, useEffect, useState } from "react";
import { useStyles } from "../modules/market/MarketStyles";
import {
  Container,
  Typography,
  TableHead,
  TableRow,
  Box,
  Stack,
  Paper,
  Table,
  Chip,
} from "@mui/material";

import { withStyles } from '@mui/styles'
import ServiceCard from "../modules/contract/components/ServiceCard/ServiceCard";

import { NextPage } from "next";
import { QueryResult, useQuery } from "@apollo/client";
import {
  GET_CONTRACTS,
  GET_SERVICES,
} from "../modules/contract/ContractGQLQueries";
import { GET_MARKETS } from "../modules/market/MarketGQLQueries";
import { GET_VERIFIED_FREELANCERS } from "../modules/user/UserGQLQueries";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import SearchBarV1 from "../common/components/SearchBarV1/SearchBarV1";

const MuiTableHead = withStyles((theme) => ({
  root: {
    width: "100% !important",
    minWidth: "100% !important",
    backgroundColor: "#fff",
  },
}))(TableHead);

const TableHeaderCell = withStyles((theme) => ({
  root: {
    color: "white",
    fontSize: "12px !important",
    padding: "10px !important",
    fontWeight: "bold",
  },
}))(TableCell);

enum Persona {
  ALL,
  MY_CONTRACTS,
  MY_SERVICES,
}

const ExplorePage: NextPage = () => {
  const classes = useStyles();
  const [state, setState] = useState({
    persona: Persona.ALL,
  });
  const [verifiedFreelancers, setVerifiedFreelancers] = useState<Array<any>>(
    []
  );

  const [services, setServices] = useState([]);
  const [featuredContracts, setFeaturedContracts] = useState<Array<any>>([]);

  const getServices: QueryResult = useQuery(GET_SERVICES);
  const contractsQuery: QueryResult = useQuery(GET_CONTRACTS);

  const verifiedFreelancersQuery: QueryResult = useQuery(
    GET_VERIFIED_FREELANCERS
  );

  useEffect(() => {
    if (!contractsQuery.loading && contractsQuery.data) {
      setFeaturedContracts(contractsQuery.data.contracts);
    }
  }, [contractsQuery.loading]);

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
    verifiedFreelancersQuery.refetch();
    getServices.refetch();
  };

  //prepare explore page
  useEffect(() => {
    contractsQuery.refetch();
    verifiedFreelancersQuery.refetch();
    getServices.refetch();
  }, []);

  const [value, setValue] = React.useState<Date | null>(new Date());

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "100%",
        overflow: "hidden",
        padding: "0px 75px !important",
      }}
    >
      <Box
        sx={{
          //mt: 12,
          width: "100%",
          height: 120,

          position: "relative",
        }}
      >
        <img
          src="/assets/images/project_management.jpg"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Box
        sx={{
       
          mt: 3,
          width: "100%",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            fontWeight="bold"
            fontSize={25}
            color="rgba(33, 33, 33, .85)"
          >
            Work
          </Typography>

          <Stack spacing={1} direction="row" alignItems="center">
            <Chip
              onClick={() =>
                setState({
                  ...state,
                  persona: Persona.ALL,
                })
              }
              sx={{
                fontSize: 12,
                fontWeight: "medium",
                color: state.persona === Persona.ALL ? "white" : "black",
                bgcolor: (theme) =>
                  state.persona === Persona.ALL
                    ? theme.palette.primary.main
                    : "#ddd",
              }}
              clickable
              label="All"
            />
            <Chip
              onClick={() =>
                setState({
                  ...state,
                  persona: Persona.MY_CONTRACTS,
                })
              }
              sx={{
                fontSize: 12,
                fontWeight: "medium",
                color:
                  state.persona === Persona.MY_CONTRACTS ? "white" : "black",
                bgcolor: (theme) =>
                  state.persona === Persona.MY_CONTRACTS
                    ? theme.palette.primary.main
                    : "#ddd",
              }}
              clickable
              label="My contracts"
            />
            <Chip
              onClick={() =>
                setState({
                  ...state,
                  persona: Persona.MY_SERVICES,
                })
              }
              sx={{
                fontSize: 12,
                fontWeight: "medium",
                color:
                  state.persona === Persona.MY_SERVICES ? "white" : "black",
                bgcolor: (theme) =>
                  state.persona === Persona.MY_SERVICES
                    ? theme.palette.primary.main
                    : "#ddd",
              }}
              clickable
              label="My services"
            />
          </Stack>
        </Stack>


          <Box sx={{ my: 2,width: 500, display: "flex", flexDirection: "column" }}>
          
            <SearchBarV1 placeholder="Try website designer..." />
          </Box>
      

        <Box sx={{ width: "100%", mb: 2 }}>
          <Table sx={{ width: "100%" }}>
            <MuiTableHead
              sx={{
                width: "100% !important",
                ".MuiTableHead-root": {
                  width: "100% !important",
                },
              }}
            >
              <TableRow
                component={Paper}
                variant="outlined"
                sx={{
                  width: "100%",
                  minWidth: "100% !important",
                  display: "flex",
                }}
              >
                <TableHeaderCell sx={{ width: 150, fontWeight: "bold" }}>
                  Type
                </TableHeaderCell>
                <TableHeaderCell
                  sx={{ width: "100% !important", fontWeight: "bold" }}
                >
                  Information
                </TableHeaderCell>
                <TableHeaderCell sx={{ width: 150, fontWeight: "bold" }}>
                  Payout
                </TableHeaderCell>
                <TableHeaderCell sx={{ width: 150, fontWeight: "bold" }}>
                  Status
                </TableHeaderCell>
                <TableHeaderCell sx={{ width: 150, fontWeight: "bold" }}>
                  Deadline
                </TableHeaderCell>
              </TableRow>
            </MuiTableHead>
          </Table>
        </Box>

        <Box sx={{  }}>
          <Stack spacing={2}>
            {services.map((row) => {
              return <ServiceCard />;
            })}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default ExplorePage;
