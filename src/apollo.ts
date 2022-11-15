import { createHttpLink, InMemoryCache, HttpLink, ApolloClient, ApolloProvider, gql, ApolloLink, NormalizedCacheObject } from '@apollo/client';
import { APOLLO_CLIENT_URI, LENS_API } from './constant';
import { setContext } from '@apollo/client/link/context';
import { getAuthenticationToken } from './modules/lens/LensAPIAuthentication';

const httpLink = new HttpLink({
  uri: APOLLO_CLIENT_URI,
  fetchOptions: 'no-cors',
  fetch
})

const lensLink = new HttpLink({
  uri: LENS_API,
  fetchOptions: 'no-cors',
  fetch
})

const client = new ApolloClient({
  link: httpLink,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  cache: new InMemoryCache()
})

const lens_client = new ApolloClient({
  link: lensLink,
  headers: {
    'Authorization': getAuthenticationToken(),
    'Access-Control-Allow-Origin': 'https://api-sandbox-mumbai.lens.dev'
  },
  cache: new InMemoryCache(),
})

export { lens_client }
export default client