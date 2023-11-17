import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import CustomerSagas from '../../../../../app/modules/entities/customer/customer.sagas';
import CustomerActions from '../../../../../app/modules/entities/customer/customer.reducer';

const { getCustomer, getAllCustomers, updateCustomer, deleteCustomer } = CustomerSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getCustomer(1);
  const step = stepper(getCustomer(FixtureAPI, { customerId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CustomerActions.customerSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getCustomer(FixtureAPI, { customerId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CustomerActions.customerFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllCustomers();
  const step = stepper(getAllCustomers(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CustomerActions.customerAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllCustomers(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CustomerActions.customerAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateCustomer({ id: 1 });
  const step = stepper(updateCustomer(FixtureAPI, { customer: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CustomerActions.customerUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateCustomer(FixtureAPI, { customer: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CustomerActions.customerUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteCustomer({ id: 1 });
  const step = stepper(deleteCustomer(FixtureAPI, { customerId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CustomerActions.customerDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteCustomer(FixtureAPI, { customerId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CustomerActions.customerDeleteFailure()));
});
