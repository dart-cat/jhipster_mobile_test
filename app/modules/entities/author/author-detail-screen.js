import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { convertLocalDateToString } from '../../../shared/util/date-transforms';

import AuthorActions from './author.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import AuthorDeleteModal from './author-delete-modal';
import styles from './author-styles';

function AuthorDetailScreen(props) {
  const { route, getAuthor, navigation, author, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = author?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Author');
      } else {
        setDeleteModalVisible(false);
        getAuthor(routeEntityId);
      }
    }, [routeEntityId, getAuthor, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Author.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="authorDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{author.id}</Text>
      {/* Name Field */}
      <Text style={styles.label}>Name:</Text>
      <Text testID="name">{author.name}</Text>
      {/* Birthday Field */}
      <Text style={styles.label}>Birthday:</Text>
      <Text testID="birthday">{convertLocalDateToString(author.birthday)}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('AuthorEdit', { entityId })}
          accessibilityLabel={'Author Edit Button'}
          testID="authorEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Author Delete Button'}
          testID="authorDeleteButton"
        />
        {deleteModalVisible && (
          <AuthorDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={author}
            testID="authorDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    author: state.authors.author,
    error: state.authors.errorOne,
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

export default connect(mapStateToProps, mapDispatchToProps)(AuthorDetailScreen);
