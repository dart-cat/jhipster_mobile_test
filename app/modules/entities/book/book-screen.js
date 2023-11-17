import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import BookActions from './book.reducer';
import styles from './book-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function BookScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { book, bookList, getAllBooks, fetching } = props;

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Book entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchBooks();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [book, fetchBooks]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('BookDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Books Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const fetchBooks = React.useCallback(() => {
    getAllBooks({ page: page - 1, sort, size });
  }, [getAllBooks, page, sort, size]);

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchBooks();
  };
  return (
    <View style={styles.container} testID="bookScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={bookList}
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
    bookList: state.books.bookList,
    book: state.books.book,
    fetching: state.books.fetchingAll,
    error: state.books.errorAll,
    links: state.books.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllBooks: (options) => dispatch(BookActions.bookAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookScreen);
