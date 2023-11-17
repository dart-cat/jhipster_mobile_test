import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import PurchaseActions from './purchase.reducer';

function* getPurchase(api, action) {
  const { purchaseId } = action;
  // make the call to the api
  const apiCall = call(api.getPurchase, purchaseId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PurchaseActions.purchaseSuccess(response.data));
  } else {
    yield put(PurchaseActions.purchaseFailure(response.data));
  }
}

function* getAllPurchases(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllPurchases, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PurchaseActions.purchaseAllSuccess(response.data, response.headers));
  } else {
    yield put(PurchaseActions.purchaseAllFailure(response.data));
  }
}

function* updatePurchase(api, action) {
  const { purchase } = action;
  // make the call to the api
  const idIsNotNull = !(purchase.id === null || purchase.id === undefined);
  const apiCall = call(idIsNotNull ? api.updatePurchase : api.createPurchase, purchase);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PurchaseActions.purchaseUpdateSuccess(response.data));
  } else {
    yield put(PurchaseActions.purchaseUpdateFailure(response.data));
  }
}

function* deletePurchase(api, action) {
  const { purchaseId } = action;
  // make the call to the api
  const apiCall = call(api.deletePurchase, purchaseId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(PurchaseActions.purchaseDeleteSuccess());
  } else {
    yield put(PurchaseActions.purchaseDeleteFailure(response.data));
  }
}

export default {
  getAllPurchases,
  getPurchase,
  deletePurchase,
  updatePurchase,
};
