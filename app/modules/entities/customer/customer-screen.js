import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import CustomerActions from './customer.reducer';
import styles from './customer-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function CustomerScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { customer, customerList, getAllCustomers, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Customer entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchCustomers();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [customer, fetchCustomers]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('CustomerDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Customers Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchCustomers = React.useCallback(() => {
    getAllCustomers({ page: page - 1, sort, size });
  }, [getAllCustomers, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchCustomers();
  };
  return (
    <View style={styles.container} testID="customerScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={customerList}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        initialNumToRender={oneScreensWorth}
        onEndReached={handleLoadMore}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
    customerList: state.customers.customerList,
    customer: state.customers.customer,
    fetching: state.customers.fetchingAll,
    error: state.customers.errorAll,
    links: state.customers.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllCustomers: (options) => dispatch(CustomerActions.customerAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerScreen);
