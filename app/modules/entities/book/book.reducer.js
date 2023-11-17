import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  bookRequest: ['bookId'],
  bookAllRequest: ['options'],
  bookUpdateRequest: ['book'],
  bookDeleteRequest: ['bookId'],

  bookSuccess: ['book'],
  bookAllSuccess: ['bookList', 'headers'],
  bookUpdateSuccess: ['book'],
  bookDeleteSuccess: [],

  bookFailure: ['error'],
  bookAllFailure: ['error'],
  bookUpdateFailure: ['error'],
  bookDeleteFailure: ['error'],

  bookReset: [],
});

export const BookTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  book: { id: undefined },
  bookList: [],
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
    book: INITIAL_STATE.book,
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
  const { book } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    book,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { bookList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    bookList: loadMoreDataWhenScrolled(state.bookList, bookList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { book } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    book,
  });
};
// successful api delete
export const deleteSuccess = (state) => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    book: INITIAL_STATE.book,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    book: INITIAL_STATE.book,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    bookList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    book: state.book,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    book: state.book,
  });
};

export const reset = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.BOOK_REQUEST]: request,
  [Types.BOOK_ALL_REQUEST]: allRequest,
  [Types.BOOK_UPDATE_REQUEST]: updateRequest,
  [Types.BOOK_DELETE_REQUEST]: deleteRequest,

  [Types.BOOK_SUCCESS]: success,
  [Types.BOOK_ALL_SUCCESS]: allSuccess,
  [Types.BOOK_UPDATE_SUCCESS]: updateSuccess,
  [Types.BOOK_DELETE_SUCCESS]: deleteSuccess,

  [Types.BOOK_FAILURE]: failure,
  [Types.BOOK_ALL_FAILURE]: allFailure,
  [Types.BOOK_UPDATE_FAILURE]: updateFailure,
  [Types.BOOK_DELETE_FAILURE]: deleteFailure,
  [Types.BOOK_RESET]: reset,
});
