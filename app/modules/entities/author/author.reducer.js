import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  authorRequest: ['authorId'],
  authorAllRequest: ['options'],
  authorUpdateRequest: ['author'],
  authorDeleteRequest: ['authorId'],

  authorSuccess: ['author'],
  authorAllSuccess: ['authorList', 'headers'],
  authorUpdateSuccess: ['author'],
  authorDeleteSuccess: [],

  authorFailure: ['error'],
  authorAllFailure: ['error'],
  authorUpdateFailure: ['error'],
  authorDeleteFailure: ['error'],

  authorReset: [],
});

export const AuthorTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  author: { id: undefined },
  authorList: [],
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
    author: INITIAL_STATE.author,
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
  const { author } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    author,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { authorList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    authorList: loadMoreDataWhenScrolled(state.authorList, authorList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { author } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    author,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    author: INITIAL_STATE.author,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    author: INITIAL_STATE.author,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    authorList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    author: state.author,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    author: state.author,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.AUTHOR_REQUEST]: request,
  [Types.AUTHOR_ALL_REQUEST]: allRequest,
  [Types.AUTHOR_UPDATE_REQUEST]: updateRequest,
  [Types.AUTHOR_DELETE_REQUEST]: deleteRequest,

  [Types.AUTHOR_SUCCESS]: success,
  [Types.AUTHOR_ALL_SUCCESS]: allSuccess,
  [Types.AUTHOR_UPDATE_SUCCESS]: updateSuccess,
  [Types.AUTHOR_DELETE_SUCCESS]: deleteSuccess,

  [Types.AUTHOR_FAILURE]: failure,
  [Types.AUTHOR_ALL_FAILURE]: allFailure,
  [Types.AUTHOR_UPDATE_FAILURE]: updateFailure,
  [Types.AUTHOR_DELETE_FAILURE]: deleteFailure,
  [Types.AUTHOR_RESET]: reset,
});
