import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/author/author.reducer';

test('attempt retrieving a single author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.author).toEqual({ id: undefined });
});

test('attempt retrieving a list of author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.authorList).toEqual([]);
});

test('attempt updating a author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.author).toEqual({ id: 1 });
});

test('success retrieving a list of author', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.authorAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.authorList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.author).toEqual({ id: 1 });
});
test('success deleting a author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.author).toEqual({ id: undefined });
});

test('failure retrieving a author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.author).toEqual({ id: undefined });
});

test('failure retrieving a list of author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.authorList).toEqual([]);
});

test('failure updating a author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.author).toEqual(INITIAL_STATE.author);
});
test('failure deleting a author', () => {
  const state = reducer(INITIAL_STATE, Actions.authorDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.author).toEqual(INITIAL_STATE.author);
});

test('resetting state for author', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.authorReset());
  expect(state).toEqual(INITIAL_STATE);
});
