export default {
  // Functions return fixtures

  // entity fixtures
  updateAuthor: (author) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-author.json'),
    };
  },
  getAllAuthors: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-authors.json'),
    };
  },
  getAuthor: (authorId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-author.json'),
    };
  },
  deleteAuthor: (authorId) => {
    return {
      ok: true,
    };
  },
  updateBook: (book) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-book.json'),
    };
  },
  getAllBooks: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-books.json'),
    };
  },
  getBook: (bookId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-book.json'),
    };
  },
  deleteBook: (bookId) => {
    return {
      ok: true,
    };
  },
  updateCustomer: (customer) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-customer.json'),
    };
  },
  getAllCustomers: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-customers.json'),
    };
  },
  getCustomer: (customerId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-customer.json'),
    };
  },
  deleteCustomer: (customerId) => {
    return {
      ok: true,
    };
  },
  updatePurchase: (purchase) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/update-purchase.json'),
    };
  },
  getAllPurchases: () => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-all-purchases.json'),
    };
  },
  getPurchase: (purchaseId) => {
    return {
      ok: true,
      data: require('../../shared/fixtures/get-purchase.json'),
    };
  },
  deletePurchase: (purchaseId) => {
    return {
      ok: true,
    };
  },
  // jhipster-react-native-api-fixture-needle

  // user fixtures
  updateUser: (user) => {
    return {
      ok: true,
      data: require('../fixtures/update-user.json'),
    };
  },
  getAllUsers: () => {
    return {
      ok: true,
      data: require('../fixtures/get-users.json'),
    };
  },
  getUser: (userId) => {
    return {
      ok: true,
      data: require('../fixtures/get-user.json'),
    };
  },
  deleteUser: (userId) => {
    return {
      ok: true,
    };
  },
  // auth fixtures
  setAuthToken: () => {},
  removeAuthToken: () => {},
  login: (authObj) => {
    if (authObj.username === 'user' && authObj.password === 'user') {
      return {
        ok: true,
        data: require('../fixtures/login.json'),
      };
    } else {
      return {
        ok: false,
        status: 400,
        data: 'Invalid credentials',
      };
    }
  },
  register: ({ user }) => {
    if (user === 'user') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: {
          title: 'Invalid email',
        },
      };
    }
  },
  forgotPassword: ({ email }) => {
    if (email === 'valid@gmail.com') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: 'Invalid email',
      };
    }
  },
  getAccount: () => {
    return {
      ok: true,
      status: 200,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      data: require('../fixtures/get-account.json'),
    };
  },
  updateAccount: () => {
    return {
      ok: true,
    };
  },
  changePassword: ({ currentPassword }) => {
    if (currentPassword === 'valid-password') {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        data: 'Password error',
      };
    }
  },
};
