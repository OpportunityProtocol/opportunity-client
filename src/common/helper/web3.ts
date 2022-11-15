import { TypedDataDomain } from "ethers";
import { omit } from "./common";

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
  