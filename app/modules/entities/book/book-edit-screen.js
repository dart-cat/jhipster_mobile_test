import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import BookActions from './book.reducer';
import AuthorActions from '../author/author.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './book-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  dateOfIssue: Yup.date().required(),
});

function BookEditScreen(props) {
  const {
    getBook,
    updateBook,
    route,
    book,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllAuthors,
    authorList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getBook(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getBook, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(book));
    }
  }, [book, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllAuthors();
  }, [getAllAuthors]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('BookDetail', { entityId: book?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = (data) => updateBook(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const nameRef = createRef();
  const dateOfIssueRef = createRef();
  const authorsRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="bookEditScrollView"
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
              onSubmitEditing={() => dateOfIssueRef.current?.focus()}
            />
            <FormField
              name="dateOfIssue"
              ref={dateOfIssueRef}
              label="Date Of Issue"
              placeholder="Enter Date Of Issue"
              testID="dateOfIssueInput"
              inputType="date"
            />
            <FormField
              name="authors"
              inputType="select-multiple"
              ref={authorsRef}
              listItems={authorList}
              listItemLabelField="name"
              label="Author"
              placeholder="Select Author"
              testID="authorSelectInput"
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
    dateOfIssue: value.dateOfIssue ?? null,
    authors: value.authors?.map((i) => i.id),
  };
};
const formValueToEntity = (value) => {
  const entity = {
    id: value.id ?? null,
    name: value.name ?? null,
    dateOfIssue: value.dateOfIssue ?? null,
  };
  entity.authors = value.authors.map((id) => ({ id }));
  return entity;
};

const mapStateToProps = (state) => {
  return {
    authorList: state.authors.authorList ?? [],
    book: state.books.book,
    fetching: state.books.fetchingOne,
    updating: state.books.updating,
    updateSuccess: state.books.updateSuccess,
    errorUpdating: state.books.errorUpdating,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllAuthors: (options) => dispatch(AuthorActions.authorAllRequest(options)),
    getBook: (id) => dispatch(BookActions.bookRequest(id)),
    getAllBooks: (options) => dispatch(BookActions.bookAllRequest(options)),
    updateBook: (book) => dispatch(BookActions.bookUpdateRequest(book)),
    reset: () => dispatch(BookActions.bookReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookEditScreen);
