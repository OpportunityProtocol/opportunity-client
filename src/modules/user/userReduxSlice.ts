import { createSlice } from '@reduxjs/toolkit'
import { ZERO_ADDRESS } from '../../constant';
import { RootState } from '../../store';

interface UserReducerState {
    balance: number;
    address: string;
    connector: string;
    connected: boolean;
    verified: boolean;
    lensProfile: ILensProfile;
    metadataUri
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
        handle: ''
    }
}   

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userDataStored(state, action) {
        state = action.payload
    },
    userLensDataStored(state, action) {
        state.lensProfile = action.payload
    },
    userWalletDataStored(state, action) {
        state = { ...state, ...action.payload }
    },
    userWalletDataCleared(state, action) {
        state = {
            ...state,
            balance: 0,
            address: ZERO_ADDRESS,
            connector: '',
            connected: false
        }
    },
    userConnectionToggled(state, action) {
        state.connected = !state.connected
    },
  }
})

export const selectUserBalance = (state: RootState) => state.user.balance
export const selectUserAddress = (state: RootState) => state.user.address
export const selectUserConnector = (state: RootState) => state.user.connector
export const selectUserConnectionStatus = (state: RootState) => state.user.connected
export const { userWalletDataStored, userWalletDataCleared, userConnectionToggled } = userSlice.actions
export default userSlice.reducer