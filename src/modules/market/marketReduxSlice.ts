import { createSlice } from '@reduxjs/toolkit'
import { ZERO_ADDRESS } from '../../constant';

interface IMarketDetails {
  [id:string]: object;
}

interface IMarketInfos {
  [id:string]: object;
}

interface MarketReducerState {
    marketDetails: IMarketDetails;
    marketInfos: IMarketInfos;
    numMarkets: number;
    synced: boolean;
}

const initialState: MarketReducerState = {
    marketDetails: {},
    marketInfos: {},
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