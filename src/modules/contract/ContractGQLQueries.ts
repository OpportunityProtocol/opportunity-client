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

const GET_CONTRACT = gql`
  query GetContract($contractId: ID!) {
    contract(id: $contractId) {
        id
        employer
        marketId
        metadata
        worker
        ownership
    }
  }
`

const GET_CONTRACTS_BY_EMPLOYER = gql`
  query GetContractsByEmployer($employer: Bytes!) {
    contracts(employer: $employer) {
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
      owner
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
        metadata
        pubId
    }
  }
`

const GET_PURCHASED_SERVICES = gql`
  query GetPurchasedServices {
    purchasedService {
      id
      client
      referral
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
        client
        referral
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

const GET_PURCHASED_SERVICES_BY_CLIENT = gql`
  query GetPurchasedService($client: ID!) {
    purchasedService(client: $client) {
        id
        client
        referral
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

const GET_SERVICES_BY_CREATOR = gql`
  query GetServicesByCreator($creator: Bytes!) {
    services(creator: $creator) {
      id
      employer
      marketId
      metadata
      worker
      ownership
    }
  }
`

export { GET_CONTRACTS_BY_EMPLOYER, GET_PURCHASED_SERVICES_BY_CLIENT, GET_SERVICES_BY_CREATOR, GET_CONTRACTS, GET_PURCHASED_SERVICES, GET_SERVICES, GET_CONTRACT, GET_SERVICE_BY_ID, GET_PURCHASED_SERVICE }