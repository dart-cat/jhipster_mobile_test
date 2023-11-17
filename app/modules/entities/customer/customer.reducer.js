import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  customerRequest: ['customerId'],
  customerAllRequest: ['options'],
  customerUpdateRequest: ['customer'],
  customerDeleteRequest: ['customerId'],

  customerSuccess: ['customer'],
  customerAllSuccess: ['customerList', 'headers'],
  customerUpdateSuccess: ['customer'],
  customerDeleteSuccess: [],

  customerFailure: ['error'],
  customerAllFailure: ['error'],
  customerUpdateFailure: ['error'],
  customerDeleteFailure: ['error'],

  customerReset: [],
});

export const CustomerTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  customer: { id: undefined },
  customerList: [],
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
    customer: INITIAL_STATE.customer,
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
  const { customer } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    customer,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { customerList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    customerList: loadMoreDataWhenScrolled(state.customerList, customerList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { customer } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    customer,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    customer: INITIAL_STATE.customer,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    customer: INITIAL_STATE.customer,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    customerList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    customer: state.customer,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    customer: state.customer,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CUSTOMER_REQUEST]: request,
  [Types.CUSTOMER_ALL_REQUEST]: allRequest,
  [Types.CUSTOMER_UPDATE_REQUEST]: updateRequest,
  [Types.CUSTOMER_DELETE_REQUEST]: deleteRequest,

  [Types.CUSTOMER_SUCCESS]: success,
  [Types.CUSTOMER_ALL_SUCCESS]: allSuccess,
  [Types.CUSTOMER_UPDATE_SUCCESS]: updateSuccess,
  [Types.CUSTOMER_DELETE_SUCCESS]: deleteSuccess,

  [Types.CUSTOMER_FAILURE]: failure,
  [Types.CUSTOMER_ALL_FAILURE]: allFailure,
  [Types.CUSTOMER_UPDATE_FAILURE]: updateFailure,
  [Types.CUSTOMER_DELETE_FAILURE]: deleteFailure,
  [Types.CUSTOMER_RESET]: reset,
});
