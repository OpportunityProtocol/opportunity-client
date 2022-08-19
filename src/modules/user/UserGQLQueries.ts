import { gql } from "@apollo/client";

const GET_VERIFIED_FREELANCER_BY_ADDRESS = gql`
  query GetVerifiedFreelancerByAddress($userAddress: Bytes!) {
    verifiedUsers(where: { address: $userAddress }) {
        id
        address
        handle
        imageURI
        metadata
    }
  }
`;

const GET_VERIFIED_FREELANCERS = gql`
  query GetVerifiedFreelancers {
    verifiedUsers {
        id
        address
        handle
        imageURI
        metadata
    }
  }
`;

export { GET_VERIFIED_FREELANCERS, GET_VERIFIED_FREELANCER_BY_ADDRESS }