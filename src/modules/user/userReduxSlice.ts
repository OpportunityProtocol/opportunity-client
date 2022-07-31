import { createSlice } from '@reduxjs/toolkit'
import { ZERO_ADDRESS } from '../../constant';
import { RootState } from '../../store';

interface UserReducerState {
    balance: number;
    address: string;
    erc20Balance: ERC20Balance
    connector: string;
    connected: boolean;
    verified: boolean;
    lensProfile: ILensProfile;
    metadataUri
}

interface ERC20Balance {
    [address:string]: number
}

interface ILensProfile {
    profileId: 0;
    handle: string;
}

const initialState: UserReducerState = {
    balance: 0,
    address: ZERO_ADDRESS,
    connector: null,
    connected: false,
    metadataUri: '',
    verified: false,
    lensProfile: {
        profileId: 0,
        handle: '',
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
        state.verified = true
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
    userConnectionToggled(state, action) {
        state.connected = !state.connected
    },
  }
})

export const selectLens = (state: RootState) => state.user.lensProfile
export const selectUserBalance = (state: RootState) => state.user.balance
export const selectErc20Balance = (state: RootState, erc20Address: string) => state.user.erc20Balance[erc20Address]
export const selectUserAddress = (state: RootState) => state.user.address
export const selectUserConnector = (state: RootState) => state.user.connector
export const selectUserConnectionStatus = (state: RootState) => state.user.connected
export const selectVerificationStatus = (state: RootState) => state.user.verified
export const { userWalletDataStored, userWalletDataCleared, userERC20BalanceChanged, userConnectionToggled, userLensDataStored,  } = userSlice.actions
export default userSlice.reducer