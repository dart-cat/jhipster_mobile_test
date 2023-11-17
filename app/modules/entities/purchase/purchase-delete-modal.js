import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import PurchaseActions from './purchase.reducer';

import styles from './purchase-styles';

function PurchaseDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deletePurchase(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Purchase');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Purchase {entity.id}?</Text>
          </View>
          <View style={[styles.flexRow]}>
            <TouchableHighlight
              style={[styles.openButton, styles.cancelButton]}
              onPress={() => {
                setVisible(false);
              }}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.openButton, styles.submitButton]} onPress={deleteEntity} testID="deleteButton">
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const mapStateToProps = (state) => {
  return {
    purchase: state.purchases.purchase,
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

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDeleteModal);
