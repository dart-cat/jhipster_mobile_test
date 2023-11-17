import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import PurchaseActions from './purchase.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import PurchaseDeleteModal from './purchase-delete-modal';
import styles from './purchase-styles';

function PurchaseDetailScreen(props) {
  const { route, getPurchase, navigation, purchase, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = purchase?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Purchase');
      } else {
        setDeleteModalVisible(false);
        getPurchase(routeEntityId);
      }
    }, [routeEntityId, getPurchase, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Purchase.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="purchaseDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{purchase.id}</Text>
      {/* Cost Field */}
      <Text style={styles.label}>Cost:</Text>
      <Text testID="cost">{purchase.cost}</Text>
      <Text style={styles.label}>Book:</Text>
      <Text testID="book">{String(purchase.book ? purchase.book.name : '')}</Text>
      <Text style={styles.label}>Customer:</Text>
      <Text testID="customer">{String(purchase.customer ? purchase.customer.name : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('PurchaseEdit', { entityId })}
          accessibilityLabel={'Purchase Edit Button'}
          testID="purchaseEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Purchase Delete Button'}
          testID="purchaseDeleteButton"
        />
        {deleteModalVisible && (
          <PurchaseDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={purchase}
            testID="purchaseDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    purchase: state.purchases.purchase,
    error: state.purchases.errorOne,
    fetching: state.purchases.fetchingOne,
    deleting: state.purchases.deleting,
    errorDeleting: state.purchases.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPurchase: (id) => dispatch(PurchaseActions.purchaseRequest(id)),
    getAllPurchases: (options) => dispatch(PurchaseActions.purchaseAllRequest(options)),
    deletePurchase: (id) => dispatch(PurchaseActions.purchaseDeleteRequest(id)),
    resetPurchases: () => dispatch(PurchaseActions.purchaseReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDetailScreen);
