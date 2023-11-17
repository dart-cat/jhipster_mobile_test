import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { convertLocalDateToString } from '../../../shared/util/date-transforms';

import BookActions from './book.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import BookDeleteModal from './book-delete-modal';
import styles from './book-styles';

function BookDetailScreen(props) {
  const { route, getBook, navigation, book, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = book?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Book');
      } else {
        setDeleteModalVisible(false);
        getBook(routeEntityId);
      }
    }, [routeEntityId, getBook, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Book.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="bookDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{book.id}</Text>
      {/* Name Field */}
      <Text style={styles.label}>Name:</Text>
      <Text testID="name">{book.name}</Text>
      {/* DateOfIssue Field */}
      <Text style={styles.label}>DateOfIssue:</Text>
      <Text testID="dateOfIssue">{convertLocalDateToString(book.dateOfIssue)}</Text>
      <Text style={styles.label}>Author:</Text>
      {book.authors &&
        book.authors.map((entity, index) => (
          <Text key={index} testID={`authors-${index}`}>
            {String(entity.name || '')}
          </Text>
        ))}

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('BookEdit', { entityId })}
          accessibilityLabel={'Book Edit Button'}
          testID="bookEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Book Delete Button'}
          testID="bookDeleteButton"
        />
        {deleteModalVisible && (
          <BookDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={book}
            testID="bookDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    book: state.books.book,
    error: state.books.errorOne,
    fetching: state.books.fetchingOne,
    deleting: state.books.deleting,
    errorDeleting: state.books.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBook: (id) => dispatch(BookActions.bookRequest(id)),
    getAllBooks: (options) => dispatch(BookActions.bookAllRequest(options)),
    deleteBook: (id) => dispatch(BookActions.bookDeleteRequest(id)),
    resetBooks: () => dispatch(BookActions.bookReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookDetailScreen);
