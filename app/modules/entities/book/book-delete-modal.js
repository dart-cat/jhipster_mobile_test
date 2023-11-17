import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import BookActions from './book.reducer';

import styles from './book-styles';

function BookDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteBook(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Book');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Book {entity.id}?</Text>
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
    book: state.books.book,
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

export default connect(mapStateToProps, mapDispatchToProps)(BookDeleteModal);
