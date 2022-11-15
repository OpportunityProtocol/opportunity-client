import { gql } from "@apollo/client";
import { ethers, TypedDataDomain } from "ethers";
import { StringValueNode } from "graphql";
import { LensHubInterface } from "../../abis";
import { lens_client } from "../../apollo";
import { LENS_HUB_PROXY } from "../../constant";
import fleek from "../../fleek";
import {
  CreatePostTypedDataDocument,
  CreatePublicPostRequest,
  FeedRequest,
  HasTxHashBeenIndexedDocument,
  HasTxHashBeenIndexedRequest,
  ProfileDocument,
  ProfileFeedDocument,
  PublicationMainFocus,
  SingleProfileQueryRequest,
} from "./LensTypes";
import { v4 as uuidv4 } from "uuid";
import { login } from "./LensAPIAuthentication";
import { FREE_COLLECT_MODULE, ZERO_ADDRESS } from "../../constant/contracts";
import { signedTypeData } from "../../common/helper/web3";

const abiCoder = ethers.utils.defaultAbiCoder;

export const getLensFollowingStateByAddressQuery = (address: string) => {
  return gql`
    query Following {
        following(request: { 
                      address: "${address}",
                    limit: 10
                   }) {
          items {
            profile {
              id
              name
              bio
              attributes {
                  displayType
                  traitType
                  key
                  value
              }
              followNftAddress
              metadata
              isDefault
              handle
              picture {
                ... on NftImage {
                  contractAddress
                  tokenId
                  uri
                  verified
                }
                ... on MediaSet {
                  original {
                    url
                    width
                    height
                    mimeType
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                  }
                  small {
                    url
                    width
                    height
                    mimeType
                  }
                }
              }
              coverPicture {
                ... on NftImage {
                  contractAddress
                  tokenId
                  uri
                  verified
                }
                ... on MediaSet {
                  original {
                    url
                    width
                    height
                    mimeType
                  }
                  small {
                    width
                    url
                    height
                    mimeType
                  }
                  medium {
                    url
                    width
                    height
                    mimeType
                  }
                }
              }
              ownedBy
              dispatcher {
                address
                canUseRelay
              }
              stats {
                totalFollowers
                totalFollowing
                totalPosts
                totalComments
                totalMirrors
                totalPublications
                totalCollects
              }
              followModule {
                ... on FeeFollowModuleSettings {
                  type
                  amount {
                    asset {
                      name
                      symbol
                      decimals
                      address
                    }
                    value
                  }
                  recipient
                }
                ... on ProfileFollowModuleSettings {
                 type
                }
                ... on RevertFollowModuleSettings {
                 type
                }
              }
            }
            totalAmountOfTimesFollowing
          }
          pageInfo {
            prev
            next
            totalCount
          }
        }
      }
    `;
};

export const lensGetFollowersStateByProfileId = (id: string) => {
  return gql`
    query Followers {
        followers(request: { 
                      profileId: "${id}",
                    limit: 10
                   }) {
             items {
            wallet {
              address
              defaultProfile {
                id
                name
                bio
                attributes {
                  displayType
                  traitType
                  key
                  value
                }
                followNftAddress
                  metadata
                isDefault
                handle
                picture {
                  ... on NftImage {
                    contractAddress
                    tokenId
                    uri
                    verified
                  }
                  ... on MediaSet {
                    original {
                      url
                      mimeType
                    }
                  }
                }
                coverPicture {
                  ... on NftImage {
                    contractAddress
                    tokenId
                    uri
                    verified
                  }
                  ... on MediaSet {
                    original {
                      url
                      mimeType
                    }
                  }
                }
                ownedBy
                dispatcher {
                  address
                  canUseRelay
                }
                stats {
                  totalFollowers
                  totalFollowing
                  totalPosts
                  totalComments
                  totalMirrors
                  totalPublications
                  totalCollects
                }
                followModule {
                  ... on FeeFollowModuleSettings {
                    type
                    contractAddress
                    amount {
                      asset {
                        name
                        symbol
                        decimals
                        address
                      }
                      value
                    }
                    recipient
                  }
                  ... on ProfileFollowModuleSettings {
                   type
                  }
                  ... on RevertFollowModuleSettings {
                   type
                  }
                }
              }
            }
            totalAmountOfTimesFollowed
          }
          pageInfo {
            prev
            next
            totalCount
          }
        }
      }
    `;
};

export const LENS_GET_COMPLETE_FOLLOW_STATE_BY_ADDRESS_AND_PROFILE_ID = gql`
  query Following($address: String!) {
    following(request: { address: $address, limit: 10 }) {
      items {
        profile {
          id
          name
          bio
          attributes {
            displayType
            traitType
            key
            value
          }
          followNftAddress
          metadata
          isDefault
          handle
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                width
                height
                mimeType
              }
              medium {
                url
                width
                height
                mimeType
              }
              small {
                url
                width
                height
                mimeType
              }
            }
          }
          coverPicture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                width
                height
                mimeType
              }
              small {
                width
                url
                height
                mimeType
              }
              medium {
                url
                width
                height
                mimeType
              }
            }
          }
          ownedBy
          dispatcher {
            address
            canUseRelay
          }
          stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
          }
          followModule {
            ... on FeeFollowModuleSettings {
              type
              amount {
                asset {
                  name
                  symbol
                  decimals
                  address
                }
                value
              }
              recipient
            }
            ... on ProfileFollowModuleSettings {
              type
            }
            ... on RevertFollowModuleSettings {
              type
            }
          }
        }
        totalAmountOfTimesFollowing
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  query Followers($profileId: String!) {
    followers(request: { profileId: $profileId, limit: 10 }) {
      items {
        wallet {
          address
          defaultProfile {
            id
            name
            bio
            attributes {
              displayType
              traitType
              key
              value
            }
            followNftAddress
            metadata
            isDefault
            handle
            picture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
            }
            coverPicture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
            }
            ownedBy
            dispatcher {
              address
              canUseRelay
            }
            stats {
              totalFollowers
              totalFollowing
              totalPosts
              totalComments
              totalMirrors
              totalPublications
              totalCollects
            }
            followModule {
              ... on FeeFollowModuleSettings {
                type
                contractAddress
                amount {
                  asset {
                    name
                    symbol
                    decimals
                    address
                  }
                  value
                }
                recipient
              }
              ... on ProfileFollowModuleSettings {
                type
              }
              ... on RevertFollowModuleSettings {
                type
              }
            }
          }
        }
        totalAmountOfTimesFollowed
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

export const LENS_GET_DISPATCHER_BY_PROFILE_ID = gql`
  query Profile($profileId: ProfileId!) {
    profile(request: { profileId: $profileId }) {
      dispatcher {
        address
        canUseRelay
      }
    }
  }
`;

export const LENS_GET_PROFILE_BY_PROFILE_ID = gql`
  query Profile {
    profile(request: { profileId: $id }) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
          type
        }
        ... on RevertFollowModuleSettings {
          type
        }
      }
    }
  }
`;

export const getProfileRequest = async (request: SingleProfileQueryRequest) => {
  const result = await lens_client.query({
    query: ProfileDocument,
    variables: {
      request,
    },
  });

  return result.data.profile;
};

export const getLensProfileById = async (
  profileId: String,
  request?: SingleProfileQueryRequest
) => {
  if (!profileId) {
    throw new Error("Must provide a profile id");
  }

  if (!request) {
    request = { profileId: profileId! };
  }

  const profile = await getProfileRequest(request);

  return profile;
};

export const createPostTypedData = async (request: CreatePublicPostRequest) => {
  const result = await lens_client.mutate({
    mutation: CreatePostTypedDataDocument,
    variables: {
      request,
    },
  });

  return result.data!.createPostTypedData;
};

export const signCreatePostTypedData = async (
  signer: any,
  request: CreatePublicPostRequest
) => {
  const result = await createPostTypedData(request);
  const typedData = result.typedData;
  const signature = await signedTypeData(
    signer,
    typedData.domain,
    typedData.types,
    typedData.value
  );

  return { result, signature };
};

export const createPost = async (
  content: string,
  identifier: string,
  profileId: number,
  signer: any
) => {
  const { publicUrl }: any = await fleek.uploadPostMetadata(
    identifier,
    JSON.stringify({
      version: "2.0.0",
      mainContentFocus: PublicationMainFocus.TextOnly,
      metadata_id: uuidv4(),
      description: "Description",
      locale: "en-US",
      content,
      external_url: null,
      image: null,
      imageMimeType: null,
      name: "Name",
      attributes: [],
      tags: [],
      appId: "lens-talent",
    })
  );

  new ethers.Contract(LENS_HUB_PROXY, LensHubInterface, signer).post(
    {
      profileId,
      contentURI: publicUrl,
      collectModule: FREE_COLLECT_MODULE,
      collectModuleInitData: abiCoder.encode(["bool"], [true]),
      referenceModule: ZERO_ADDRESS,
      referenceModuleInitData: [],
    },
    {
      gasLimit: ethers.BigNumber.from("2000000"),
      gasPrice: 90000000000,
    }
  );
};

const getProfileFeedRequest = async (request: FeedRequest) => {
  const result = await lens_client.query({
    query: ProfileFeedDocument,
    variables: {
      request,
    },
  });

  return result.data.feed;
};

export const getProfileFeed = async (address: string, profileId: any) => {
  if (!profileId) {
    throw new Error('Must a profile id to get a profile feed');
  }

  if (!address) {
    throw new Error("Must provide an address to get a profile feed")
  }

  await login(address);

  const result = await getProfileFeedRequest({ profileId, limit: 50 });

  return result;
};