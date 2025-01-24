import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import NavBar from '../components/NavBar';

const Result = () => {
  return (
    <View style={styles.container}>
      {/* NavBar */}
      <NavBar />
      <Text>Result</Text>
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
});
