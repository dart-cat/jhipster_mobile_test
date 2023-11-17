import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/book/book.reducer';

test('attempt retrieving a single book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.book).toEqual({ id: undefined });
});

test('attempt retrieving a list of book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.bookList).toEqual([]);
});

test('attempt updating a book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.book).toEqual({ id: 1 });
});

test('success retrieving a list of book', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.bookAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.bookList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.book).toEqual({ id: 1 });
});
test('success deleting a book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.book).toEqual({ id: undefined });
});

test('failure retrieving a book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.book).toEqual({ id: undefined });
});

test('failure retrieving a list of book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.bookList).toEqual([]);
});

test('failure updating a book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.book).toEqual(INITIAL_STATE.book);
});
test('failure deleting a book', () => {
  const state = reducer(INITIAL_STATE, Actions.bookDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.book).toEqual(INITIAL_STATE.book);
});

test('resetting state for book', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.bookReset());
  expect(state).toEqual(INITIAL_STATE);
});
