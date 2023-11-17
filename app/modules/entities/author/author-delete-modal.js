import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import AuthorActions from './author.reducer';

import styles from './author-styles';

function AuthorDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteAuthor(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Author');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Author {entity.id}?</Text>
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
    author: state.authors.author,
    fetching: state.authors.fetchingOne,
    deleting: state.authors.deleting,
    errorDeleting: state.authors.errorDeleting,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAuthor: (id) => dispatch(AuthorActions.authorRequest(id)),
    getAllAuthors: (options) => dispatch(AuthorActions.authorAllRequest(options)),
    deleteAuthor: (id) => dispatch(AuthorActions.authorDeleteRequest(id)),
    resetAuthors: () => dispatch(AuthorActions.authorReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorDeleteModal);
