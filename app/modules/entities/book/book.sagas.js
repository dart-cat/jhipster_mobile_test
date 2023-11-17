import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import BookActions from './book.reducer';
import { convertLocalDateFromServer } from '../../../shared/util/date-transforms';

function* getBook(api, action) {
  const { bookId } = action;
  // make the call to the api
  const apiCall = call(api.getBook, bookId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(BookActions.bookSuccess(response.data));
  } else {
    yield put(BookActions.bookFailure(response.data));
  }
}

function* getAllBooks(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllBooks, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(BookActions.bookAllSuccess(response.data, response.headers));
  } else {
    yield put(BookActions.bookAllFailure(response.data));
  }
}

function* updateBook(api, action) {
  const { book } = action;
  // make the call to the api
  const idIsNotNull = !(book.id === null || book.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateBook : api.createBook, book);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(BookActions.bookUpdateSuccess(response.data));
  } else {
    yield put(BookActions.bookUpdateFailure(response.data));
  }
}

function* deleteBook(api, action) {
  const { bookId } = action;
  // make the call to the api
  const apiCall = call(api.deleteBook, bookId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(BookActions.bookDeleteSuccess());
  } else {
    yield put(BookActions.bookDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.dateOfIssue = convertLocalDateFromServer(data.dateOfIssue);
  return data;
}

export default {
  getAllBooks,
  getBook,
  deleteBook,
  updateBook,
};
