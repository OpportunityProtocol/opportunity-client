import fleekStorage from '@fleekhq/fleek-storage-js'; 

export const USER_DATA_FOLDER = 'user-data/'
export const CONTRACT_DATA_FOLDER = 'contract-data/'
export const SERVICE_DATA_FOLDER = 'service-data/'

const getIndividualUserFileData = async (key: string): Promise<any>  => {
    const myFile = await fleekStorage.get({
        apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
        apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
        key: String(USER_DATA_FOLDER+key),
        getOptions: [
          'data',
          'bucket',
          'key',
          'hash',
          'publicUrl'
        ],
      })
}

const getIndividualServiceFileData = async (key: string): Promise<any>  => {
    const myFile = await fleekStorage.get({
        apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
        apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
        key: String(SERVICE_DATA_FOLDER+key),
        getOptions: [
          'data',
          'bucket',
          'key',
          'hash',
          'publicUrl'
        ],
      })
}

const getIndividualContractFileData = async (key: string): Promise<any> => {
    const { data } = await fleekStorage.get({
        apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
        apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
        key: String(CONTRACT_DATA_FOLDER+key),
        getOptions: [
          'data',
          'bucket',
          'key',
          'hash',
          'publicUrl'
        ],
      })

      return data
}

const uploadUserData = async (keyIdentifier: string, data: any): Promise<string> => {
    const { key, hash } = await fleekStorage.upload({
        apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
        apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
        key: String(USER_DATA_FOLDER+keyIdentifier),
        data
      });

      return key
}

const uploadContractData = async (keyIdentifier: string, data: any): Promise<string> => {
    const { key, hash } = await fleekStorage.upload({
        apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
        apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
        key: String(CONTRACT_DATA_FOLDER+keyIdentifier),
        data
      });

      return key
}

const uploadServiceData = async (keyIdentifier: string, data: any): Promise<string> => {
    const { key, hash } = await fleekStorage.upload({
        apiKey: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_KEY,
        apiSecret: process.env.NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET,
        key: String(SERVICE_DATA_FOLDER+keyIdentifier),
        data
      });

      return key
}

const fleek: any = {}
fleek.getUser = getIndividualUserFileData
fleek.getContract = getIndividualContractFileData
fleek.getService = getIndividualServiceFileData
fleek.uploadUser = uploadUserData
fleek.uploadService = uploadServiceData
fleek.uploadContractData = uploadContractData
export default fleek