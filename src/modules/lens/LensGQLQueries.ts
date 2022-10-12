import { gql } from "@apollo/client";

const getLensFollowingStateByAddressQuery = (address: string) => {
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

const LENS_GET_COMPLETE_FOLLOW_STATE_BY_ADDRESS_AND_PROFILE_ID = gql`
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

export { LENS_GET_COMPLETE_FOLLOW_STATE_BY_ADDRESS_AND_PROFILE_ID, getLensFollowingStateByAddressQuery }