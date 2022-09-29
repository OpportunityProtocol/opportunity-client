import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider, gql, HttpLink, ApolloLink, NormalizedCacheObject } from '@apollo/client';
import { APOLLO_CLIENT_URI, LENS_API } from './constant';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: APOLLO_CLIENT_URI,
  fetchOptions: 'no-cors',
  fetch
})

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: httpLink,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  cache: new InMemoryCache()
})

const lens_client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: LENS_API,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  cache: new InMemoryCache(),
})

export { lens_client }
export default client