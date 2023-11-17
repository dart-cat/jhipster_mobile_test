import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import PurchaseActions from './purchase.reducer';
import styles from './purchase-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function PurchaseScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { purchase, purchaseList, getAllPurchases, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Purchase entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchPurchases();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [purchase, fetchPurchases]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('PurchaseDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Purchases Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchPurchases = React.useCallback(() => {
    getAllPurchases({ page: page - 1, sort, size });
  }, [getAllPurchases, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchPurchases();
  };
  return (
    <View style={styles.container} testID="purchaseScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={purchaseList}
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
    purchaseList: state.purchases.purchaseList,
    purchase: state.purchases.purchase,
    fetching: state.purchases.fetchingAll,
    error: state.purchases.errorAll,
    links: state.purchases.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllPurchases: (options) => dispatch(PurchaseActions.purchaseAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseScreen);
