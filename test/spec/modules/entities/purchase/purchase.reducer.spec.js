import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/purchase/purchase.reducer';

test('attempt retrieving a single purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.purchase).toEqual({ id: undefined });
});

test('attempt retrieving a list of purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.purchaseList).toEqual([]);
});

test('attempt updating a purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.purchase).toEqual({ id: 1 });
});

test('success retrieving a list of purchase', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.purchaseAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.purchaseList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.purchase).toEqual({ id: 1 });
});
test('success deleting a purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.purchase).toEqual({ id: undefined });
});

test('failure retrieving a purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.purchase).toEqual({ id: undefined });
});

test('failure retrieving a list of purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.purchaseList).toEqual([]);
});

test('failure updating a purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.purchase).toEqual(INITIAL_STATE.purchase);
});
test('failure deleting a purchase', () => {
  const state = reducer(INITIAL_STATE, Actions.purchaseDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.purchase).toEqual(INITIAL_STATE.purchase);
});

test('resetting state for purchase', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.purchaseReset());
  expect(state).toEqual(INITIAL_STATE);
});
