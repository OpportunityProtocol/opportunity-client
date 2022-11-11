import { gql } from "@apollo/client";

const GET_MARKETS = gql`
  query GetMarkets {
    markets {
      id
      name
      baseCost
      priceRise
      hatchTokens
      tradingFeeRate
      platformFeeRate
      allInterestToPlatform
    }
  }
`;

const GET_MARKET_DETAILS_BY_NAME = gql`
  query GetMarketDetailsByID($name: String!) {
    market(where: { name: $name }) {
      id
      name
      baseCost
      priceRise
      hatchTokens
      tradingFeeRate
      platformFeeRate
      allInterestToPlatform
    }
  }
`;

const GET_MARKET_DETAILS_BY_ID = gql`
  query GetMarketDetailsByID($marketId: ID!) {
    markets(where: { id: $marketId } ) {
      id
      name
      baseCost
      priceRise
      hatchTokens
      tradingFeeRate
      platformFeeRate
      allInterestToPlatform
    }
  }
`;

const GET_TOKEN_INFOS = gql`
  query GetTokenInfos {
    serviceTokens {
      id
      marketID
      name
      address
      lister
    }
  }
`;

const GET_TOKEN_INFO_BY_SERVICE_ID = gql`
  query GetTokenInfoById($serviceId: ID!) {
    serviceTokens(where: { id: $serviceId } ) {
      id
      marketID
      name
      address
      lister
    }
  }
`;

export {
  GET_TOKEN_INFOS,
  GET_TOKEN_INFO_BY_SERVICE_ID,
  GET_MARKETS,
  GET_MARKET_DETAILS_BY_ID,
  GET_MARKET_DETAILS_BY_NAME,
};
