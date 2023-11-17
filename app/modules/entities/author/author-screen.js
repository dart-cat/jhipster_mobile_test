import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import AuthorActions from './author.reducer';
import styles from './author-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function AuthorScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { author, authorList, getAllAuthors, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Author entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchAuthors();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [author, fetchAuthors]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('AuthorDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Authors Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchAuthors = React.useCallback(() => {
    getAllAuthors({ page: page - 1, sort, size });
  }, [getAllAuthors, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchAuthors();
  };
  return (
    <View style={styles.container} testID="authorScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={authorList}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        initialNumToRender={oneScreensWorth}
        onEndReached={handleLoadMore}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
    authorList: state.authors.authorList,
    author: state.authors.author,
    fetching: state.authors.fetchingAll,
    error: state.authors.errorAll,
    links: state.authors.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllAuthors: (options) => dispatch(AuthorActions.authorAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorScreen);
