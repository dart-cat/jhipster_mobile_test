import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import BookSagas from '../../../../../app/modules/entities/book/book.sagas';
import BookActions from '../../../../../app/modules/entities/book/book.reducer';

const { getBook, getAllBooks, updateBook, deleteBook } = BookSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getBook(1);
  const step = stepper(getBook(FixtureAPI, { bookId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(BookActions.bookSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getBook(FixtureAPI, { bookId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(BookActions.bookFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllBooks();
  const step = stepper(getAllBooks(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(BookActions.bookAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllBooks(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(BookActions.bookAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateBook({ id: 1 });
  const step = stepper(updateBook(FixtureAPI, { book: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(BookActions.bookUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateBook(FixtureAPI, { book: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(BookActions.bookUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteBook({ id: 1 });
  const step = stepper(deleteBook(FixtureAPI, { bookId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(BookActions.bookDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteBook(FixtureAPI, { bookId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(BookActions.bookDeleteFailure()));
});
