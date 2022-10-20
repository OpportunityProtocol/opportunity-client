import { createSlice } from '@reduxjs/toolkit'
import { ZERO_ADDRESS } from '../../constant';
import { RootState } from '../../store';

interface UserReducerState {
    balance: number;
    address: string;
    erc20Balance: ERC20Balance
    connector: string;
    connection: any;
    account: any;
    lensProfile: ILensProfile;
    metadataUri
}

interface ERC20Balance {
    [address:string]: number
}

interface ILensProfile {
    profileId: 0;
    profile: any;
    error: String;
}

const initialState: UserReducerState = {
    balance: 0,
    address: ZERO_ADDRESS,
    connector: null,
    connection: null,
    account: null,
    metadataUri: '',
    lensProfile: {
        profileId: 0,
        profile: null,
        error: null
    },
    erc20Balance: {}
}   

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userDataStored(state, action) {
        return action.payload
    },
    userLensDataStored(state, action) {
        state.lensProfile = action.payload
    },
    userWalletDataStored(state, action) {
        return { ...state,  ...action.payload }
    },
    userWalletDataCleared(state, action) {
        return initialState 
    },
    userERC20BalanceChanged(state, action) {
        state.erc20Balance = { ...state, ...action.payload }
    },
  }
})

export const selectLens = (state: RootState) => state.user.lensProfile
export const selectUserBalance = (state: RootState) => state.user.balance
export const selectErc20Balance = (state: RootState, erc20Address: string) => state.user.erc20Balance[erc20Address]
export const selectUserAddress = (state: RootState) => state.user.address
export const selectUserConnector = (state: RootState) => state.user.connector
export const selectUserConnectionStatus = (state: RootState) => state.user.connection
export const selectUserAccountData = (state: RootState) => state.user.account
export const { userWalletDataStored, userWalletDataCleared, userERC20BalanceChanged, userLensDataStored,  } = userSlice.actions
export default userSlice.reducer