import { createSlice } from '@reduxjs/toolkit'
import { ZERO_ADDRESS } from '../../constant';
import { RootState } from '../../store';

type UserReducerState  = {
    wallet: IWalletData;
    lensProfile: ILensProfile;
    metadataUri: string;
}

type IWalletData = {
    balance: number,
    address: string,
    connector: string,
    chain: number;
}

type ILensProfileUser = {
    handle: string;
            imageURI: string;
            metadataPtr: string;
}

type ILensProfile = {
    user: ILensProfileUser;
    profileId: number | string;
    profile: any | null;
    error: String;
}

const initialState: UserReducerState = {
    wallet: {
        balance: 0,
        address: ZERO_ADDRESS,
        connector: null,
        chain: -1
    },
    lensProfile: {
        user: {
            handle: "",
            imageURI: "",
            metadataPtr: "",
        },
        profileId: -1,
        profile: null,
        error: null
    },
    metadataUri: '',
}   

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLensDataStored(state, action) {
        console.log(action.payload)
        return  { ...state, lensProfile: { ...action.payload } }
    },
    userWalletDataStored(state, action) {
        state.wallet = { ...state.wallet, ...action.payload}
    },
    userWalletDataCleared(state, action) {
        return { ...state, wallet: initialState.wallet }
    },
    userUpdateDaiBalance(state, action) {
        return { 
            ...state,
            wallet: {
                ...state.wallet,
                balance: action.payload
            }
        }
    }
  }
})

export { type IWalletData, type ILensProfile }
export const selectLens = (state: UserReducerState) => state?.lensProfile
export const selectUserBalance = (state: UserReducerState) => state.wallet?.balance
export const selectUserAddress = (state: UserReducerState) => state.wallet?.address
export const selectUserConnector = (state: UserReducerState) => state.wallet?.connector
export const selectWallet = (state: UserReducerState) => state?.wallet;
export const { userUpdateDaiBalance, userWalletDataStored, userWalletDataCleared, userLensDataStored,  } = userSlice.actions
export default userSlice.reducer