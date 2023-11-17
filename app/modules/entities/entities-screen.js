import React from 'react';
import { ScrollView, Text } from 'react-native';
// Styles
import RoundedButton from '../../shared/components/rounded-button/rounded-button';

import styles from './entities-screen.styles';

export default function EntitiesScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="entityScreenScrollList">
      <Text style={styles.centerText}>JHipster Entities will appear below</Text>
      <RoundedButton text="Author" onPress={() => navigation.navigate('Author')} testID="authorEntityScreenButton" />
      <RoundedButton text="Book" onPress={() => navigation.navigate('Book')} testID="bookEntityScreenButton" />
      <RoundedButton text="Customer" onPress={() => navigation.navigate('Customer')} testID="customerEntityScreenButton" />
      <RoundedButton text="Purchase" onPress={() => navigation.navigate('Purchase')} testID="purchaseEntityScreenButton" />
      {/* jhipster-react-native-entity-screen-needle */}
    </ScrollView>
  );
}
