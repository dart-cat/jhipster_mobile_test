import { takeLatest, all } from 'redux-saga/effects';
import API from '../services/api';
import FixtureAPI from '../services/fixture-api';
import AppConfig from '../../config/app-config';

/* ------------- Types ------------- */

import { StartupTypes } from '../reducers/startup.reducer';
import { LoginTypes } from '../../modules/login/login.reducer';
import { AccountTypes } from '../../shared/reducers/account.reducer';
import { RegisterTypes } from '../../modules/account/register/register.reducer';
import { ForgotPasswordTypes } from '../../modules/account/password-reset/forgot-password.reducer';
import { ChangePasswordTypes } from '../../modules/account/password/change-password.reducer';
import { UserTypes } from '../../shared/reducers/user.reducer';
import { AuthorTypes } from '../../modules/entities/author/author.reducer';
import { BookTypes } from '../../modules/entities/book/book.reducer';
import { CustomerTypes } from '../../modules/entities/customer/customer.reducer';
import { PurchaseTypes } from '../../modules/entities/purchase/purchase.reducer';
// jhipster-react-native-saga-redux-import-needle

/* ------------- Sagas ------------- */

import { startup } from './startup.saga';
import { login, logout, loginLoad } from '../../modules/login/login.sagas';
import { register } from '../../modules/account/register/register.sagas';
import { forgotPassword } from '../../modules/account/password-reset/forgot-password.sagas';
import { changePassword } from '../../modules/account/password/change-password.sagas';
import { getAccount, updateAccount } from '../../shared/sagas/account.sagas';
import UserSagas from '../../shared/sagas/user.sagas';
import AuthorSagas from '../../modules/entities/author/author.sagas';
import BookSagas from '../../modules/entities/book/book.sagas';
import CustomerSagas from '../../modules/entities/customer/customer.sagas';
import PurchaseSagas from '../../modules/entities/purchase/purchase.sagas';
// jhipster-react-native-saga-method-import-needle

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = AppConfig.useFixtures ? FixtureAPI : API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // JHipster accounts
    takeLatest(LoginTypes.LOGIN_LOAD, loginLoad, api),
    takeLatest(LoginTypes.LOGIN_REQUEST, login, api),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout, api),

    takeLatest(AuthorTypes.AUTHOR_REQUEST, AuthorSagas.getAuthor, api),
    takeLatest(AuthorTypes.AUTHOR_ALL_REQUEST, AuthorSagas.getAllAuthors, api),
    takeLatest(AuthorTypes.AUTHOR_UPDATE_REQUEST, AuthorSagas.updateAuthor, api),
    takeLatest(AuthorTypes.AUTHOR_DELETE_REQUEST, AuthorSagas.deleteAuthor, api),

    takeLatest(BookTypes.BOOK_REQUEST, BookSagas.getBook, api),
    takeLatest(BookTypes.BOOK_ALL_REQUEST, BookSagas.getAllBooks, api),
    takeLatest(BookTypes.BOOK_UPDATE_REQUEST, BookSagas.updateBook, api),
    takeLatest(BookTypes.BOOK_DELETE_REQUEST, BookSagas.deleteBook, api),

    takeLatest(CustomerTypes.CUSTOMER_REQUEST, CustomerSagas.getCustomer, api),
    takeLatest(CustomerTypes.CUSTOMER_ALL_REQUEST, CustomerSagas.getAllCustomers, api),
    takeLatest(CustomerTypes.CUSTOMER_UPDATE_REQUEST, CustomerSagas.updateCustomer, api),
    takeLatest(CustomerTypes.CUSTOMER_DELETE_REQUEST, CustomerSagas.deleteCustomer, api),

    takeLatest(PurchaseTypes.PURCHASE_REQUEST, PurchaseSagas.getPurchase, api),
    takeLatest(PurchaseTypes.PURCHASE_ALL_REQUEST, PurchaseSagas.getAllPurchases, api),
    takeLatest(PurchaseTypes.PURCHASE_UPDATE_REQUEST, PurchaseSagas.updatePurchase, api),
    takeLatest(PurchaseTypes.PURCHASE_DELETE_REQUEST, PurchaseSagas.deletePurchase, api),
    // jhipster-react-native-saga-redux-connect-needle

    takeLatest(RegisterTypes.REGISTER_REQUEST, register, api),
    takeLatest(ForgotPasswordTypes.FORGOT_PASSWORD_REQUEST, forgotPassword, api),
    takeLatest(ChangePasswordTypes.CHANGE_PASSWORD_REQUEST, changePassword, api),
    takeLatest(UserTypes.USER_REQUEST, UserSagas.getUser, api),
    takeLatest(UserTypes.USER_UPDATE_REQUEST, UserSagas.updateUser, api),
    takeLatest(UserTypes.USER_DELETE_REQUEST, UserSagas.deleteUser, api),
    takeLatest(UserTypes.USER_ALL_REQUEST, UserSagas.getAllUsers, api),

    takeLatest(AccountTypes.ACCOUNT_REQUEST, getAccount, api),
    takeLatest(AccountTypes.ACCOUNT_UPDATE_REQUEST, updateAccount, api),
  ]);
}
