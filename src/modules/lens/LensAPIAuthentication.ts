//lens api
import { Signer } from 'ethers';
import { lens_client } from '../../apollo';
import { AuthenticateDocument, ChallengeDocument, ChallengeRequest, RefreshDocument, RefreshRequest, SignedAuthChallenge, VerifyDocument, VerifyRequest } from './LensTypes';

const setAuthenticationToken = (token: string) => {
    localStorage.setItem('LENS_API_AUTHENTICATION_TOKEN', token)

  };
  
export const getAuthenticationToken = (): string => {
    return localStorage.getItem('LENS_API_AUTHENTICATION_TOKEN')
};

const setRefreshToken = (token: string) => {
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
  const result = await lens_client.mutate({
    mutation: AuthenticateDocument,
    variables: {
      request,
    },
  });

  return result.data!.authenticate;
};

export const login = async (signer: any) => {
  if (getAuthenticationToken())  {
    return;
  }

  const address = await signer.getAddress()

  // we request a challenge from the server
  const challengeResponse = await generateChallenge({ address });

  // sign the text with the wallet
  const signature = await signer.signMessage(challengeResponse.text);

  const authenticatedResult = await authenticate({ address, signature });

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

  const authenticationResult = await login(signer);

  const refreshResult = await refreshAuth({
    refreshToken: authenticationResult!.refreshToken,
  });

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
  
    const authenticationResult = await login(address);
  
    const result = await verify({ accessToken: authenticationResult!.accessToken });
  
    return result;
  };

