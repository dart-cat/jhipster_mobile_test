import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import AuthorActions from './author.reducer';
import { convertLocalDateFromServer } from '../../../shared/util/date-transforms';

function* getAuthor(api, action) {
  const { authorId } = action;
  // make the call to the api
  const apiCall = call(api.getAuthor, authorId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(AuthorActions.authorSuccess(response.data));
  } else {
    yield put(AuthorActions.authorFailure(response.data));
  }
}

function* getAllAuthors(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllAuthors, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(AuthorActions.authorAllSuccess(response.data, response.headers));
  } else {
    yield put(AuthorActions.authorAllFailure(response.data));
  }
}

function* updateAuthor(api, action) {
  const { author } = action;
  // make the call to the api
  const idIsNotNull = !(author.id === null || author.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateAuthor : api.createAuthor, author);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(AuthorActions.authorUpdateSuccess(response.data));
  } else {
    yield put(AuthorActions.authorUpdateFailure(response.data));
  }
}

function* deleteAuthor(api, action) {
  const { authorId } = action;
  // make the call to the api
  const apiCall = call(api.deleteAuthor, authorId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(AuthorActions.authorDeleteSuccess());
  } else {
    yield put(AuthorActions.authorDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.birthday = convertLocalDateFromServer(data.birthday);
  return data;
}

export default {
  getAllAuthors,
  getAuthor,
  deleteAuthor,
  updateAuthor,
};
