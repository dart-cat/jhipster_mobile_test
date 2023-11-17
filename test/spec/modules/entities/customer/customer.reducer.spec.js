import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/customer/customer.reducer';

test('attempt retrieving a single customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.customer).toEqual({ id: undefined });
});

test('attempt retrieving a list of customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.customerList).toEqual([]);
});

test('attempt updating a customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.customer).toEqual({ id: 1 });
});

test('success retrieving a list of customer', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.customerAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.customerList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.customer).toEqual({ id: 1 });
});
test('success deleting a customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.customer).toEqual({ id: undefined });
});

test('failure retrieving a customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.customer).toEqual({ id: undefined });
});

test('failure retrieving a list of customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.customerList).toEqual([]);
});

test('failure updating a customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.customer).toEqual(INITIAL_STATE.customer);
});
test('failure deleting a customer', () => {
  const state = reducer(INITIAL_STATE, Actions.customerDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.customer).toEqual(INITIAL_STATE.customer);
});

test('resetting state for customer', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.customerReset());
  expect(state).toEqual(INITIAL_STATE);
});
