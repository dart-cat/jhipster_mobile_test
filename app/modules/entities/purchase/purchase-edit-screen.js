import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';

import PurchaseActions from './purchase.reducer';
import BookActions from '../book/book.reducer';
import CustomerActions from '../customer/customer.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './purchase-styles';

function PurchaseEditScreen(props) {
  const {
    getPurchase,
    updatePurchase,
    route,
    purchase,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllBooks,
    bookList,
    getAllCustomers,
    customerList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getPurchase(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getPurchase, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(purchase));
    }
  }, [purchase, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllBooks();
    getAllCustomers();
  }, [getAllBooks, getAllCustomers]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('PurchaseDetail', { entityId: purchase?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updatePurchase(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const costRef = createRef();
  const bookRef = createRef();
  const customerRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="purchaseEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} onSubmit={onSubmit} ref={formRef}>
            <FormField name="cost" ref={costRef} label="Cost" placeholder="Enter Cost" testID="costInput" inputType="number" />
            <FormField
              name="book"
              inputType="select-one"
              ref={bookRef}
              listItems={bookList}
              listItemLabelField="name"
              label="Book"
              placeholder="Select Book"
              testID="bookSelectInput"
            />
            <FormField
              name="customer"
              inputType="select-one"
              ref={customerRef}
              listItems={customerList}
              listItemLabelField="name"
              label="Customer"
              placeholder="Select Customer"
              testID="customerSelectInput"
            />

            <FormButton title={'Save'} testID={'submitButton'} />
          </Form>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

// convenience methods for customizing the mapping of the entity to/from the form value
const entityToFormValue = (value) => {
  if (!value) {
    return {};
  }
  return {
    id: value.id ?? null,
    cost: value.cost ?? null,
    book: value.book && value.book.id ? value.book.id : null,
    customer: value.customer && value.customer.id ? value.customer.id : null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    cost: value.cost ?? null,
  };
  entity.book = value.book ? { id: value.book } : null;
  entity.customer = value.customer ? { id: value.customer } : null;
  return entity;
};

const mapStateToProps = (state) => {
  return {
    bookList: state.books.bookList ?? [],
    customerList: state.customers.customerList ?? [],
    purchase: state.purchases.purchase,
    fetching: state.purchases.fetchingOne,
    updating: state.purchases.updating,
    updateSuccess: state.purchases.updateSuccess,
    errorUpdating: state.purchases.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllBooks: (options) => dispatch(BookActions.bookAllRequest(options)),
    getAllCustomers: (options) => dispatch(CustomerActions.customerAllRequest(options)),
    getPurchase: (id) => dispatch(PurchaseActions.purchaseRequest(id)),
    getAllPurchases: (options) => dispatch(PurchaseActions.purchaseAllRequest(options)),
    updatePurchase: (purchase) => dispatch(PurchaseActions.purchaseUpdateRequest(purchase)),
    reset: () => dispatch(PurchaseActions.purchaseReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseEditScreen);
