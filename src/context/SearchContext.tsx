import React, { useEffect, useState } from "react";
import axios from "axios";
import { QueryResult, useQuery } from "@apollo/client";
import {
  GET_CONTRACTS,
  GET_SERVICES,
} from "../modules/contract/ContractGQLQueries";
import { GET_VERIFIED_FREELANCERS } from "../modules/user/UserGQLQueries";
import useFirstRender from "../hooks/useFirstRender";
import { shuffle } from "../common/helper";

enum SearchFilter {
  CONTRACTS_ONLY,
  SERVICES_ONLY,
  USERS_ONLY,
  ANY,
}

const SearchContext = React.createContext({
  query: {
    filter: SearchFilter.ANY,
    text: "",
  },
  results: {
    all: [],
    contracts: [],
    services: [],
  },
  actionable: {
    search: (search: string) => {},
  },
});

const SearchProvider = ({ children }) => {
  const contractQuery: QueryResult = useQuery(GET_CONTRACTS);
  const servicesQuery: QueryResult = useQuery(GET_SERVICES);
  const verifiedUsersQuery: QueryResult = useQuery(GET_VERIFIED_FREELANCERS);
  const isFirstRender: boolean = useFirstRender();

  const search = async (query: string) => {
    setSearchState({
      ...searchState,
      query: {
        filter: SearchFilter.ANY,
        text: query,
      },
    });

    console.log("Before ");
    switch (searchState?.query.filter) {
      case SearchFilter.ANY:
        console.log("HI");
        await contractQuery.refetch();
        await servicesQuery.refetch();
        break;
      default:
    }

    //search query
  };

  const [searchState, setSearchState] = useState<any>({
    query: {
      filter: SearchFilter.ANY,
      text: "",
    },
    results: {
      cache: [],
      all: [],
      contracts: [],
      services: [],
    },
    actionable: {
      search: search,
    },
  });

  useEffect(() => {
    if (isFirstRender) {
      search("*");
    }
  }, []);

  useEffect(() => {
    //refactor to one GQL call
    const services = servicesQuery.data?.services;
    const contracts = contractQuery.data?.contracts;

    let results = [];

    if (
      contracts &&
      (searchState.query.filter === SearchFilter.ANY ||
        searchState.query.filter === SearchFilter.CONTRACTS_ONLY)
    ) {
      //TODO: Load metadata and add to results for better search
      results = results.concat(contracts);
    }

    if (
      services &&
      (searchState.query.filter === SearchFilter.ANY ||
        searchState.query.filter === SearchFilter.SERVICES_ONLY)
    ) {
      //TODO: Load metadata and add to results for better search
      results = results.concat(services);
    }

    if (isFirstRender) {
      setSearchState({
        ...searchState,
        results: {
          ...searchState.results,
          cache: [], //TODO: Cache results on first search
        },
      });
    }

    setSearchState({
      ...searchState,
      results: {
        services: services ? services : [],
        contracts: contracts ? contracts : [],
        all: shuffle(results),
      },
    });
  }, [searchState.query.text, servicesQuery.loading, contractQuery.loading]);

  return (
    <SearchContext.Provider value={searchState}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchProvider };
export default SearchContext;
