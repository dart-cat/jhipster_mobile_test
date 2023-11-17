import * as React from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { DrawerButton } from './drawer/drawer-button';
import { navigate, goBackOrIfParamsOrDefault } from './nav-ref';

// import screens
import EntitiesScreen from '../modules/entities/entities-screen';
import AuthorScreen from '../modules/entities/author/author-screen';
import AuthorDetailScreen from '../modules/entities/author/author-detail-screen';
import AuthorEditScreen from '../modules/entities/author/author-edit-screen';
import BookScreen from '../modules/entities/book/book-screen';
import BookDetailScreen from '../modules/entities/book/book-detail-screen';
import BookEditScreen from '../modules/entities/book/book-edit-screen';
import CustomerScreen from '../modules/entities/customer/customer-screen';
import CustomerDetailScreen from '../modules/entities/customer/customer-detail-screen';
import CustomerEditScreen from '../modules/entities/customer/customer-edit-screen';
import PurchaseScreen from '../modules/entities/purchase/purchase-screen';
import PurchaseDetailScreen from '../modules/entities/purchase/purchase-detail-screen';
import PurchaseEditScreen from '../modules/entities/purchase/purchase-edit-screen';
// jhipster-react-native-navigation-import-needle

export const entityScreens = [
  {
    name: 'Entities',
    route: '',
    component: EntitiesScreen,
    options: {
      headerLeft: DrawerButton,
    },
  },
  {
    name: 'Author',
    route: 'author',
    component: AuthorScreen,
    options: {
      title: 'Authors',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('AuthorEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'AuthorDetail',
    route: 'author/detail',
    component: AuthorDetailScreen,
    options: { title: 'View Author', headerLeft: () => <HeaderBackButton onPress={() => navigate('Author')} /> },
  },
  {
    name: 'AuthorEdit',
    route: 'author/edit',
    component: AuthorEditScreen,
    options: {
      title: 'Edit Author',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('AuthorDetail', 'Author')} />,
    },
  },
  {
    name: 'Book',
    route: 'book',
    component: BookScreen,
    options: {
      title: 'Books',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('BookEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'BookDetail',
    route: 'book/detail',
    component: BookDetailScreen,
    options: { title: 'View Book', headerLeft: () => <HeaderBackButton onPress={() => navigate('Book')} /> },
  },
  {
    name: 'BookEdit',
    route: 'book/edit',
    component: BookEditScreen,
    options: { title: 'Edit Book', headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('BookDetail', 'Book')} /> },
  },
  {
    name: 'Customer',
    route: 'customer',
    component: CustomerScreen,
    options: {
      title: 'Customers',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('CustomerEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'CustomerDetail',
    route: 'customer/detail',
    component: CustomerDetailScreen,
    options: { title: 'View Customer', headerLeft: () => <HeaderBackButton onPress={() => navigate('Customer')} /> },
  },
  {
    name: 'CustomerEdit',
    route: 'customer/edit',
    component: CustomerEditScreen,
    options: {
      title: 'Edit Customer',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('CustomerDetail', 'Customer')} />,
    },
  },
  {
    name: 'Purchase',
    route: 'purchase',
    component: PurchaseScreen,
    options: {
      title: 'Purchases',
      headerLeft: () => <HeaderBackButton onPress={() => navigate('Entities')} />,
      headerRight: () => (
        <HeaderBackButton
          label=" New "
          onPress={() => navigate('PurchaseEdit', { id: undefined })}
          backImage={(props) => <Ionicons name="md-add-circle-outline" size={32} color={props.tintColor} />}
        />
      ),
    },
  },
  {
    name: 'PurchaseDetail',
    route: 'purchase/detail',
    component: PurchaseDetailScreen,
    options: { title: 'View Purchase', headerLeft: () => <HeaderBackButton onPress={() => navigate('Purchase')} /> },
  },
  {
    name: 'PurchaseEdit',
    route: 'purchase/edit',
    component: PurchaseEditScreen,
    options: {
      title: 'Edit Purchase',
      headerLeft: () => <HeaderBackButton onPress={() => goBackOrIfParamsOrDefault('PurchaseDetail', 'Purchase')} />,
    },
  },
  // jhipster-react-native-navigation-declaration-needle
];

export const getEntityRoutes = () => {
  const routes = {};
  entityScreens.forEach((screen) => {
    routes[screen.name] = screen.route;
  });
  return routes;
};

const EntityStack = createStackNavigator();

export default function EntityStackScreen() {
  return (
    <EntityStack.Navigator>
      {entityScreens.map((screen, index) => {
        return <EntityStack.Screen name={screen.name} component={screen.component} key={index} options={screen.options} />;
      })}
    </EntityStack.Navigator>
  );
}
