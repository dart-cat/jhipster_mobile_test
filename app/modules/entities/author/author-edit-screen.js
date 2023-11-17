import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import AuthorActions from './author.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './author-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  birthday: Yup.date().required(),
});

function AuthorEditScreen(props) {
  const { getAuthor, updateAuthor, route, author, fetching, updating, errorUpdating, updateSuccess, navigation, reset } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getAuthor(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getAuthor, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(author));
    }
  }, [author, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {}, []);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('AuthorDetail', { entityId: author?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateAuthor(formValueToEntity(data));

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
        testID="authorEditScrollView"
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
    author: state.authors.author,
    fetching: state.authors.fetchingOne,
    updating: state.authors.updating,
    updateSuccess: state.authors.updateSuccess,
    errorUpdating: state.authors.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAuthor: (id) => dispatch(AuthorActions.authorRequest(id)),
    getAllAuthors: (options) => dispatch(AuthorActions.authorAllRequest(options)),
    updateAuthor: (author) => dispatch(AuthorActions.authorUpdateRequest(author)),
    reset: () => dispatch(AuthorActions.authorReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorEditScreen);
