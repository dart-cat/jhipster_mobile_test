import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { convertLocalDateToString } from '../../../shared/util/date-transforms';

import CustomerActions from './customer.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import CustomerDeleteModal from './customer-delete-modal';
import styles from './customer-styles';

function CustomerDetailScreen(props) {
  const { route, getCustomer, navigation, customer, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = customer?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Customer');
      } else {
        setDeleteModalVisible(false);
        getCustomer(routeEntityId);
      }
    }, [routeEntityId, getCustomer, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Customer.</Text>
      </View>
    );
  }
  if (!entityId || fetching || !correctEntityLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="customerDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{customer.id}</Text>
      {/* Name Field */}
      <Text style={styles.label}>Name:</Text>
      <Text testID="name">{customer.name}</Text>
      {/* Birthday Field */}
      <Text style={styles.label}>Birthday:</Text>
      <Text testID="birthday">{convertLocalDateToString(customer.birthday)}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('CustomerEdit', { entityId })}
          accessibilityLabel={'Customer Edit Button'}
          testID="customerEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Customer Delete Button'}
          testID="customerDeleteButton"
        />
        {deleteModalVisible && (
          <CustomerDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={customer}
            testID="customerDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    customer: state.customers.customer,
    error: state.customers.errorOne,
    fetching: state.customers.fetchingOne,
    deleting: state.customers.deleting,
    errorDeleting: state.customers.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomer: (id) => dispatch(CustomerActions.customerRequest(id)),
    getAllCustomers: (options) => dispatch(CustomerActions.customerAllRequest(options)),
    deleteCustomer: (id) => dispatch(CustomerActions.customerDeleteRequest(id)),
    resetCustomers: () => dispatch(CustomerActions.customerReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetailScreen);
