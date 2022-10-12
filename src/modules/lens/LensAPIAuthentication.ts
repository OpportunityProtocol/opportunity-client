//lens api
import { Signer } from 'ethers';
import { lens_client } from '../../apollo';
import { AuthenticateDocument, ChallengeDocument, ChallengeRequest, RefreshDocument, RefreshRequest, SignedAuthChallenge, VerifyDocument, VerifyRequest } from './LensTypes';

const setAuthenticationToken = (token: string) => {
    console.log('setAuthenticationToken: token', token);
    localStorage.setItem('LENS_API_AUTHENTICATION_TOKEN', token)

  };
  
export const getAuthenticationToken = (): string => {
    return localStorage.getItem('LENS_API_AUTHENTICATION_TOKEN')
};

const setRefreshToken = (token: string) => {
    console.log('setRefreshToken: ', token)
    localStorage.setItem('LENS_API_REFRESH_TOKEN', token)
}

export const getRefreshToken = (): string => {
    return localStorage.getItem('LENS_API_REFRESH_TOKEN')
}

export const generateChallenge = async (request: ChallengeRequest) => {
  const result = await lens_client.query({
    query: ChallengeDocument,
    variables: {
      request,
    },
  });

  return result.data.challenge;
};

const authenticate = async (request: SignedAuthChallenge) => {
    console.log('CHALLENGE: ')
    console.log(request)
  const result = await lens_client.mutate({
    mutation: AuthenticateDocument,
    variables: {
      request,
    },
  });


  console.log(result)
  return result.data!.authenticate;
};

export const login = async (signer: any) => {
  if (getAuthenticationToken()) {
    console.log('login: already logged in');
    return;
  }

  const address = await signer.getAddress()

  console.log('login: address', address);

  // we request a challenge from the server
  const challengeResponse = await generateChallenge({ address });
console.log('HI')
  // sign the text with the wallet
  const signature = await signer.signMessage(challengeResponse.text);
  console.log('BYE')
  const authenticatedResult = await authenticate({ address, signature });

  console.log(authenticatedResult)
  console.log('login: result', authenticatedResult);
  setAuthenticationToken(authenticatedResult.accessToken);

  return authenticatedResult;
};

const refreshAuth = async (request: RefreshRequest) => {
  const result = await lens_client.mutate({
    mutation: RefreshDocument,
    variables: {
      request,
    },
  });

  return result.data!.refresh;
};

export const refresh = async (signer: any) => {
  const address = await signer.getAddress()
  console.log('refresh: address', address);

  const authenticationResult = await login(signer);

  const refreshResult = await refreshAuth({
    refreshToken: authenticationResult!.refreshToken,
  });
  console.log('refresh: result', refreshResult);

  return refreshResult;
}

const verify = async (request: VerifyRequest) => {
    const result = await lens_client.query({
      query: VerifyDocument,
      variables: {
        request,
      },
    });
  
    return result.data.verify;
  };
  
  export const verifyRequest = async (signer: any) => {
    const address = await signer.getAddress()
    console.log('verify: address', address);
  
    const authenticationResult = await login(address);
  
    const result = await verify({ accessToken: authenticationResult!.accessToken });
    console.log('verify: result', result);
  
    return result;
  };

