import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import CustomerActions from './customer.reducer';

import styles from './customer-styles';

function CustomerDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteCustomer(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Customer');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Customer {entity.id}?</Text>
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
    customer: state.customers.customer,
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDeleteModal);
