import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  purchaseRequest: ['purchaseId'],
  purchaseAllRequest: ['options'],
  purchaseUpdateRequest: ['purchase'],
  purchaseDeleteRequest: ['purchaseId'],

  purchaseSuccess: ['purchase'],
  purchaseAllSuccess: ['purchaseList', 'headers'],
  purchaseUpdateSuccess: ['purchase'],
  purchaseDeleteSuccess: [],

  purchaseFailure: ['error'],
  purchaseAllFailure: ['error'],
  purchaseUpdateFailure: ['error'],
  purchaseDeleteFailure: ['error'],

  purchaseReset: [],
});

export const PurchaseTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  purchase: { id: undefined },
  purchaseList: [],
  errorOne: null,
  errorAll: null,
  errorUpdating: null,
  errorDeleting: null,
  links: { next: 0 },
  totalItems: 0,
});

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({
    fetchingOne: true,
    errorOne: false,
    purchase: INITIAL_STATE.purchase,
  });

// request the data from an api
export const allRequest = (state) =>
  state.merge({
    fetchingAll: true,
    errorAll: false,
  });

// request to update from an api
export const updateRequest = (state) =>
  state.merge({
    updateSuccess: false,
    updating: true,
  });
// request to delete from an api
export const deleteRequest = (state) =>
  state.merge({
    deleting: true,
  });

// successful api lookup for single entity
export const success = (state, action) => {
  const { purchase } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    purchase,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { purchaseList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    purchaseList: loadMoreDataWhenScrolled(state.purchaseList, purchaseList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { purchase } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    purchase,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    purchase: INITIAL_STATE.purchase,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    purchase: INITIAL_STATE.purchase,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    purchaseList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    purchase: state.purchase,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    purchase: state.purchase,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PURCHASE_REQUEST]: request,
  [Types.PURCHASE_ALL_REQUEST]: allRequest,
  [Types.PURCHASE_UPDATE_REQUEST]: updateRequest,
  [Types.PURCHASE_DELETE_REQUEST]: deleteRequest,

  [Types.PURCHASE_SUCCESS]: success,
  [Types.PURCHASE_ALL_SUCCESS]: allSuccess,
  [Types.PURCHASE_UPDATE_SUCCESS]: updateSuccess,
  [Types.PURCHASE_DELETE_SUCCESS]: deleteSuccess,

  [Types.PURCHASE_FAILURE]: failure,
  [Types.PURCHASE_ALL_FAILURE]: allFailure,
  [Types.PURCHASE_UPDATE_FAILURE]: updateFailure,
  [Types.PURCHASE_DELETE_FAILURE]: deleteFailure,
  [Types.PURCHASE_RESET]: reset,
});
