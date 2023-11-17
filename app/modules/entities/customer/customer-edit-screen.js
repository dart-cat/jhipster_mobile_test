import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import CustomerActions from './customer.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './customer-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  birthday: Yup.date().required(),
});

function CustomerEditScreen(props) {
  const { getCustomer, updateCustomer, route, customer, fetching, updating, errorUpdating, updateSuccess, navigation, reset } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getCustomer(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getCustomer, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(customer));
    }
  }, [customer, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {}, []);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('CustomerDetail', { entityId: customer?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateCustomer(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const nameRef = createRef();
  const birthdayRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="customerEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="name"
              ref={nameRef}
              label="Name"
              placeholder="Enter Name"
              testID="nameInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => birthdayRef.current?.focus()}
            />
            <FormField
              name="birthday"
              ref={birthdayRef}
              label="Birthday"
              placeholder="Enter Birthday"
              testID="birthdayInput"
              inputType="date"
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
    name: value.name ?? null,
    birthday: value.birthday ?? null,
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    name: value.name ?? null,
    birthday: value.birthday ?? null,
  };
  return entity;
};

const mapStateToProps = (state) => {
  return {
    customer: state.customers.customer,
    fetching: state.customers.fetchingOne,
    updating: state.customers.updating,
    updateSuccess: state.customers.updateSuccess,
    errorUpdating: state.customers.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomer: (id) => dispatch(CustomerActions.customerRequest(id)),
    getAllCustomers: (options) => dispatch(CustomerActions.customerAllRequest(options)),
    updateCustomer: (customer) => dispatch(CustomerActions.customerUpdateRequest(customer)),
    reset: () => dispatch(CustomerActions.customerReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerEditScreen);
