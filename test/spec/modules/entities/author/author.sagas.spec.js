import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import AuthorSagas from '../../../../../app/modules/entities/author/author.sagas';
import AuthorActions from '../../../../../app/modules/entities/author/author.reducer';

const { getAuthor, getAllAuthors, updateAuthor, deleteAuthor } = AuthorSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getAuthor(1);
  const step = stepper(getAuthor(FixtureAPI, { authorId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(AuthorActions.authorSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getAuthor(FixtureAPI, { authorId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(AuthorActions.authorFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllAuthors();
  const step = stepper(getAllAuthors(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(AuthorActions.authorAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllAuthors(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(AuthorActions.authorAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateAuthor({ id: 1 });
  const step = stepper(updateAuthor(FixtureAPI, { author: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(AuthorActions.authorUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateAuthor(FixtureAPI, { author: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(AuthorActions.authorUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteAuthor({ id: 1 });
  const step = stepper(deleteAuthor(FixtureAPI, { authorId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(AuthorActions.authorDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteAuthor(FixtureAPI, { authorId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(AuthorActions.authorDeleteFailure()));
});
