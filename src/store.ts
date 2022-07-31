import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import contractReduxSlice from './modules/contract/contractReduxSlice'
import marketReducer from './modules/market/marketReduxSlice'
import userReducer from './modules/user/userReduxSlice'
// ...

export const store = configureStore({
  reducer: {
    markets: marketReducer,
    user: userReducer,
    contract: contractReduxSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch