import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import NavBar from '../components/NavBar';

const HomeWork = () => {
  return (
    <View style={styles.container}>
      {/* NavBar */}
      <NavBar />
      <Text>HomeWork</Text>
    </View>
  );
};

export default HomeWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
});
