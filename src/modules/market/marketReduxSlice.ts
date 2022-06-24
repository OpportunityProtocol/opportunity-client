import { createSlice } from '@reduxjs/toolkit'
import { ZERO_ADDRESS } from '../../constant';

interface MarketReducerState {
    marketDetails: Map<string, object>;
    marketInfos:  Map<string, object>;
    numMarkets: number;
    synced: boolean;
}

const initialState: MarketReducerState = {
    marketDetails: new Map<string, object>(),
    marketInfos: new Map<string, object>(),
    numMarkets: 0,
    synced: false
}

const marketsSlice = createSlice({
  name: 'markets',
  initialState,
  reducers: {
    marketDetailsAdded(state, action) {
        state.marketDetails[action.payload.marketId] = action.payload.marketDetails
    },
    marketInfosAdded(state, action) {
        state.marketInfos[action.payload.marketId] = action.payload.marketInfos;
    }
  }
})

export const { marketDetailsAdded, marketInfosAdded } = marketsSlice.actions
export default marketsSlice.reducer