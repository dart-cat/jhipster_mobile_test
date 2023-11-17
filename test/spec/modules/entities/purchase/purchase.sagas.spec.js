import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import PurchaseSagas from '../../../../../app/modules/entities/purchase/purchase.sagas';
import PurchaseActions from '../../../../../app/modules/entities/purchase/purchase.reducer';

const { getPurchase, getAllPurchases, updatePurchase, deletePurchase } = PurchaseSagas;
const stepper = (fn) => (mock) => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getPurchase(1);
  const step = stepper(getPurchase(FixtureAPI, { purchaseId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PurchaseActions.purchaseSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getPurchase(FixtureAPI, { purchaseId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PurchaseActions.purchaseFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllPurchases();
  const step = stepper(getAllPurchases(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PurchaseActions.purchaseAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllPurchases(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PurchaseActions.purchaseAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updatePurchase({ id: 1 });
  const step = stepper(updatePurchase(FixtureAPI, { purchase: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PurchaseActions.purchaseUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updatePurchase(FixtureAPI, { purchase: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PurchaseActions.purchaseUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deletePurchase({ id: 1 });
  const step = stepper(deletePurchase(FixtureAPI, { purchaseId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(PurchaseActions.purchaseDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deletePurchase(FixtureAPI, { purchaseId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(PurchaseActions.purchaseDeleteFailure()));
});
