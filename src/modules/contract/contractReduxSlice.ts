import { createSlice } from '@reduxjs/toolkit'
import { ZERO_ADDRESS } from '../../constant';
import { RootState } from '../../store';
import { PurchasedServiceMetadataStruct, RelationshipStruct, ServiceStruct } from '../../typechain-types/NetworkManager';

type PurchasedServiceStruct = ServiceStruct & PurchasedServiceMetadataStruct

interface ContractReducerState {
    /** Services **/
    //published
    publishedServicesIds: Array<number>;
    publishedServicesById: { [serviceId: string]: ServiceStruct};
    publishedServices: Array<ServiceStruct>;

    //purchased by another user and active
    activePublishedServicesIds: Array<number>;
    activePublishedServicesById: { [serviceId: string]: PurchasedServiceStruct};
    activePublishedServices: Array<PurchasedServiceStruct>;
    activePublishedServicesByPurchaseId: { [purchaseId: string]: any };

    //purchased
    purchasedServicesIds: Array<number>;
    purchasedServicesById: { [serviceId: string]: ServiceStruct};
    purchasedServices: Array<ServiceStruct>;

    /** Contracts **/
    publishedContractsIds: Array<number>;
    publishedContractsById: { [contractId: string]: RelationshipStruct & any }
    publishedContracts: Array<RelationshipStruct & any>;

    activeContractsIds: Array<number>;
    activeContractsById: { [contractId: string]: RelationshipStruct & any};
    activeContracts: Array<RelationshipStruct & any>;
}

const initialState: ContractReducerState = {
    publishedServicesIds: [],
    publishedServicesById: {},
    publishedServices: [],

    activePublishedServicesIds: [],
    activePublishedServicesById: {},
    activePublishedServices: [],
    activePublishedServicesByPurchaseId: {},

    purchasedServicesIds: [],
    purchasedServicesById: {},
    purchasedServices: [],

    publishedContractsIds: [],
    publishedContractsById: {},
    publishedContracts: [],

    activeContractsIds: [],
    activeContractsById: {},
    activeContracts: []
}

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    contractServiceIdAdded(state, action) {
        state.publishedServicesIds.push(action.payload)
    },
    contractServiceDataAdded(state, action) {
      state.publishedServices.push(action.payload)
      state.publishedServicesById[action.payload.id] = action.payload;
    },
    activePublishedServiceIdAdded(state, action) {
      state.activePublishedServicesIds.push(action.payload)
    },
    activePublishedServiceDataAdded(state, action) {
      state.activePublishedServices.push(action.payload)
      state.activePublishedServicesById[action.payload.id] = action.payload
      state.activePublishedServicesByPurchaseId[action.payload.purchaseId] = action.payload
    },
    purchasedServiceIdAdded(state, action) {
      state.purchasedServicesIds.push(action.payload)
    },
    purchasedServiceDataAdded(state, action) {
      state.purchasedServices.push(action.payload)
      state.purchasedServicesById[action.payload.id] = action.payload;
    },
    contractIdAdded(state, action) {
      state.publishedContractsIds.push(action.payload)
    },
    contractDataAdded(state, action) {
      state.publishedContracts.push(action.payload)
      state.publishedContractsById[action.payload.id] = action.payload
    },
    activeContractIdAdded(state, action) {
      state.activeContractsIds.push(action.payload)
    },
    activeContractDataAdded(state, action) {
      state.activeContracts.push(action.payload)
      state.activeContractsById[action.payload.id] = action.payload
    }
  }
})

export const selectPublishedContracts = (state: RootState) => state.contract.publishedContracts
export const selectPublishedContractsIds = (state: RootState) => state.contract.publishedContractsIds

export const selectActiveContractIds = (state: RootState) => state.contract.activeContracts
export const selectActiveContracts = (state: RootState) => state.contract.activeContractsIds

export const selectPublishedServicesIdMapping = (state: RootState) => state.contract.publishedServicesById
export const selectPublishedServices = (state: RootState) => state.contract.publishedServices
export const selectPublishedService = (state: RootState, id: number) => state.contract.publishedServicesById[id]
export const selectPublishedServiceIds = (state: RootState) => state.contract.publishedServicesIds 

export const selectActivePublishedServicesServiceIdMapping = (state: RootState) => state.contract.activePublishedServicesById
export const selectActivePublishedServicesPurchaseIdMapping = (state: RootState) => state.contract.activePublishedServicesByPurchaseId
export const selectActivePublishedServices = (state: RootState) => state.contract.activePublishedServices
export const selectActivePublishedServiceByServiceId = (state: RootState, id: number) => state.contract.activePublishedServicesById[id]
export const selectActivePublishedServiceByPurchaseId = (state: RootState, id: number) => state.contract.activePublishedServicesByPurchaseId[id]
export const selectActivePublishedServiceIds = (state: RootState) => state.contract.activePublishedServicesIds

export const selectPurchasedServicesIdMapping = (state: RootState) => state.contract.purchasedServicesById
export const selectPurchasedServices = (state: RootState) => state.contract.purchasedServices
export const selectPurchasedService = (state: RootState, id: number) => state.contract.purchasedServicesById[id]
export const selectPurchasedServiceIds = (state: RootState) => state.contract.purchasedServicesIds
export const { 
  activePublishedServiceDataAdded,
  activePublishedServiceIdAdded,
  purchasedServiceIdAdded, 
  purchasedServiceDataAdded, 
  contractServiceIdAdded, 
  contractServiceDataAdded
} = contractSlice.actions
export default contractSlice.reducer