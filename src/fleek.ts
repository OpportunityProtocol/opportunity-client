import fleekStorage from "@fleekhq/fleek-storage-js";

export const USER_DATA_FOLDER = "user-data/";
export const CONTRACT_DATA_FOLDER = "contract-data/";
export const SERVICE_DATA_FOLDER = "service-data/";

interface IFleekApi {
  getUser: (key: string) => Promise<any>;
  getService: (key: string) => Promise<any>;
  getContract: (key: string) => Promise<any>;
  uploadUser: (keyIdentifier: string, data: any) => Promise<string>;
  uploadContract: (keyIdentifier: string, data: any) => Promise<string>;
  uploadService: (keyIdentifier: string, data: any) => Promise<string>;
}

const getIndividualUserFileData = async (key: string): Promise<any> => {
  const { hash, data: dataAsUint8 } = await fleekStorage.get({
    apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
    key: String(USER_DATA_FOLDER + key),
    getOptions: ["data", "bucket", "key", "hash", "publicUrl"],
  });

  const fileData = await fleekStorage.getFileFromHash({ hash })

  return fileData
};

const getIndividualServiceFileData = async (key: string): Promise<any> => {
  const { hash, data: dataAsUint8 }  = await fleekStorage.get({
    apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
    key: String(SERVICE_DATA_FOLDER + key),
    getOptions: ["data", "bucket", "key", "hash", "publicUrl"],
  });

  const fileData = await fleekStorage.getFileFromHash({ hash })

  return fileData
};

const getIndividualContractFileData = async (key: string): Promise<any> => {
  const { hash, data: dataAsUint8 } = await fleekStorage.get({
    apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
    key: String(CONTRACT_DATA_FOLDER + key),
    getOptions: ["data", "bucket", "key", "hash", "publicUrl"],
  });

  const fileData = await fleekStorage.getFileFromHash({ hash })

  return fileData
};

const uploadUserData = async (
  keyIdentifier: string,
  data: any
): Promise<string> => {
  const { key, hash } = await fleekStorage.upload({
    apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
    key: String(USER_DATA_FOLDER + keyIdentifier),
    data,
  });

  return key;
};

const uploadContractData = async (
  keyIdentifier: string,
  data: any
): Promise<string> => {
  const { key, hash } = await fleekStorage.upload({
    apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
    key: String(CONTRACT_DATA_FOLDER + keyIdentifier),
    data,
  });

  return key;
};

const uploadServiceData = async (
  keyIdentifier: string,
  data: any
): Promise<string> => {
  const { key, hash } = await fleekStorage.upload({
    apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
    key: String(SERVICE_DATA_FOLDER + keyIdentifier),
    data,
  });

  return key;
};

const fleek: IFleekApi = {
  getUser: getIndividualUserFileData,
  getContract: getIndividualContractFileData,
  getService: getIndividualServiceFileData,
  uploadUser: uploadUserData,
  uploadService: uploadServiceData,
  uploadContract: uploadContractData,
};

export { type IFleekApi };
export default fleek;
