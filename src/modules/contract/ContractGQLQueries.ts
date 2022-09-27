import { gql } from "@apollo/client";

const GET_CONTRACTS = gql`
  query GetContracts{
    contracts {
        id
        employer
        marketId
        metadata
        worker
        ownership
    }
  }
`;

const GET_CONTRACT_BY_ID = gql`
  query GetContract($contractId: ID!) {
    contract(id: $contractId) {
        id
        employer
        marketId
        metadata
        worker
        ownership
        acceptanceTimestamp
        resolutionTimestamp
    }
  }
`

const GET_CONTRACTS_BY_EMPLOYER = gql`
  query GetContractsByEmployer($employer: Bytes!) {
    contracts(where: { employer: $employer } ) {
      id
      employer
      marketId
      metadata
      worker
      ownership
    }
  }
`

const GET_CONTRACTS_BY_WORKER = gql`
  query GetContractsByWorker($worker: Bytes!) {
    contracts(where: { worker: $worker } ) {
      id
      employer
      marketId
      metadata
      worker
      ownership
    }
  }
`

const GET_CONTRACTS_BY_MARKET_ID = gql`
query GetContractsByMarketID($id: ID!) {
  contracts(where: { marketId: $id} ) {
    id
    employer
    marketId
    metadata
    worker
    ownership
  }
}
`

const GET_SERVICES = gql`
  query GetServices {
    services {
      id
      marketId
      creator
      metadataPtr
      pubId
      offers
    }
  }
`;

const GET_SERVICE_BY_ID = gql`
  query GetService($serviceId: ID!) {
    service(id: $serviceId) {
      id
      marketId
      creator
      metadataPtr
      pubId
      offers
    }
  }
`

const GET_PURCHASED_SERVICES = gql`
  query GetPurchasedServices {
    purchasedService {
      id
      client
      datePurchased
      purchaseId
      offer
      status
      owner
      pubId
      serviceId
    }
  }
`;

const GET_PURCHASED_SERVICE = gql`
  query GetPurchasedService($purchaseId: ID!) {
    purchasedService(id: $purchaseId) {
        id
        creator
        client
        datePurchased
        purchaseId
        offer
        status
        owner
        pubId
        serviceId
    }
  }
`

const GET_ACTIVE_SERVICES_BY_CREATOR = gql`
  query GetActiveServices($creator: ID!) {
    purchasedServices(where: { creator: $creator } ) {
        id
        creator
        client
        datePurchased
        purchaseId
        offer
        status
        pubId
        serviceId
    }
  }
`

const GET_PURCHASED_SERVICES_BY_CLIENT = gql`
  query GetPurchasedServices($client: ID!) {
    purchasedServices(where: { client: $client } ) {
        id
        creator
        client
        datePurchased
        purchaseId
        offer
        status
        pubId
        serviceId
    }
  }
`

const GET_SERVICES_BY_CREATOR = gql`
  query GetServicesByCreator($creator: Bytes!) {
    services(where: { creator: $creator } ) {
      id
      marketId
      creator
      metadataPtr
      pubId
      offers
    }
  }
`

const GET_SERVICES_BY_MARKET_ID = gql`
query GetServicesByMarketID($id: ID!) {
  services(where: { marketId: $id } ) {
    id
    marketId
    creator
    metadataPtr
    pubId
    offers
  }
}
`

export {GET_SERVICES_BY_MARKET_ID, GET_CONTRACTS_BY_MARKET_ID, GET_CONTRACTS_BY_EMPLOYER, GET_CONTRACTS_BY_WORKER ,GET_ACTIVE_SERVICES_BY_CREATOR, GET_PURCHASED_SERVICES_BY_CLIENT, GET_SERVICES_BY_CREATOR, GET_CONTRACTS, GET_PURCHASED_SERVICES, GET_SERVICES, GET_CONTRACT_BY_ID, GET_SERVICE_BY_ID, GET_PURCHASED_SERVICE }