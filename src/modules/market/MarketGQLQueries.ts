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

export { GET_MARKETS }