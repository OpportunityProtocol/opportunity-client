import { gql } from "@apollo/client";
import { ethers, TypedDataDomain } from "ethers";
import { StringValueNode } from "graphql";
import { LensHubInterface } from "../../abis";
import { lens_client } from "../../apollo";
import { LENS_HUB_PROXY } from "../../constant";
import fleek from "../../fleek";
import { CreatePostTypedDataDocument, CreatePublicPostRequest, HasTxHashBeenIndexedDocument, HasTxHashBeenIndexedRequest, ProfileDocument, PublicationMainFocus, SingleProfileQueryRequest } from "./LensTypes";
import { v4 as uuidv4 } from 'uuid';
import omitDeep from 'omit-deep';
import { login } from "./LensAPIAuthentication";

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
    `
}

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
    `
}

export const LENS_GET_COMPLETE_FOLLOW_STATE_BY_ADDRESS_AND_PROFILE_ID = gql`
query Following($address: String!) {
    following(request: { 
                  address: $address,
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

  query Followers($profileId: String!) {
    followers(request: { 
                  profileId: $profileId,
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
`

export const LENS_GET_DISPATCHER_BY_PROFILE_ID = gql`
query Profile($profileId: ProfileId!) {
  profile(request: { profileId: $profileId }) {
    dispatcher { 
      address
      canUseRelay
    }
  }
}`

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
`


export const getProfileRequest = async (request: SingleProfileQueryRequest) => {
  const result = await lens_client.query({
    query: ProfileDocument,
    variables: {
      request,
    },
  });

  return result.data.profile;
};

export const getLensProfileById = async (profileId: String, request?: SingleProfileQueryRequest) => {
  if (!profileId) {
    throw new Error('Must provide a profile id');
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

export const omit = (object: any, name: string) => {
  return omitDeep(object, name);
};

export const signedTypeData = (
  signer,
  domain: TypedDataDomain,
  types: Record<string, any>,
  value: Record<string, any>
) => {
  
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, '__typename'),
    omit(types, '__typename'),
    omit(value, '__typename')
  );
};

export const signCreatePostTypedData = async (signer: any, request: CreatePublicPostRequest) => {
  const result = await createPostTypedData(request);
  console.log('create post: createPostTypedData', result);

  const typedData = result.typedData;
  console.log('create post: typedData', typedData);

  const signature = await signedTypeData(signer, typedData.domain, typedData.types, typedData.value);
  console.log('create post: signature', signature);

  return { result, signature };
};


export const createPost = async (identifier: string, profileId: number, signer: any) => {
  const { publicUrl } : any = await fleek.uploadPostMetadata(identifier, JSON.stringify({
    version: '2.0.0',
    mainContentFocus: PublicationMainFocus.TextOnly,
    metadata_id: uuidv4(),
    description: 'Description',
    locale: 'en-US',
    content: 'Content',
    external_url: null,
    image: null,
    imageMimeType: null,
    name: 'Name',
    attributes: [],
    tags: ['using_api_examples'],
    appId: 'api_examples_github',
  }))


  // hard coded to make the code example clear
  const createPostRequest = {
    profileId: `0x${Math.abs(Number(profileId)).toString(16)}`,
    contentURI: publicUrl, //'ipfs://' + ipfsResult.path,
    collectModule: {
      freeCollectModule: { followerOnly: true },
    },
    referenceModule: {
      followerOnlyReferenceModule: false,
    },
  };

  const signedResult = await signCreatePostTypedData(signer, createPostRequest);

  const typedData = signedResult?.result.typedData;

  const { v, r, s } = ethers.utils.splitSignature(signedResult.signature);

  const lensHub = new ethers.Contract(LENS_HUB_PROXY, LensHubInterface, signer);

  const tx = await lensHub.postWithSig({
    profileId: typedData.value.profileId,
    contentURI: typedData.value.contentURI,
    collectModule: typedData.value.collectModule,
    collectModuleInitData: typedData.value.collectModuleInitData,
    referenceModule: typedData.value.referenceModule,
    referenceModuleInitData: typedData.value.referenceModuleInitData,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
};


const hasTxBeenIndexed = async (request: HasTxHashBeenIndexedRequest) => {
  const result = await lens_client.query({
    query: HasTxHashBeenIndexedDocument,
    variables: {
      request,
    },
    fetchPolicy: 'network-only',
  });

  return result.data.hasTxHashBeenIndexed;
};

export const pollUntilIndexed = async (input: { txHash: string } | { txId: string }) => {
  while (true) {
    const response = await hasTxBeenIndexed(input);
    console.log('pool until indexed: result', response);

    if (response.__typename === 'TransactionIndexedResult') {
      console.log('pool until indexed: indexed', response.indexed);
      console.log('pool until metadataStatus: metadataStatus', response.metadataStatus);

      console.log(response.metadataStatus);
      if (response.metadataStatus) {
        if (response.metadataStatus.status === 'SUCCESS') {
          return response;
        }

        if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
          throw new Error(response.metadataStatus.status);
        }
      } else {
        if (response.indexed) {
          return response;
        }
      }

      console.log('pool until indexed: sleep for 1500 milliseconds then try again');
      // sleep for a second before trying again
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      // it got reverted and failed!
      throw new Error(response.reason);
    }
  }
};