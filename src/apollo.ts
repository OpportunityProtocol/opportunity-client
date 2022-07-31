import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider, gql, HttpLink, ApolloLink } from '@apollo/client';
import { APOLLO_CLIENT_URI } from './constant';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: APOLLO_CLIENT_URI.replace("/graphql", ""),
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

export default client