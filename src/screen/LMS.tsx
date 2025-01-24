import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import NavBar from '../components/NavBar';

const LMS = () => {
  return (
    <View style={styles.container}>
      {/* NavBar */}
      <NavBar />
      <Text>LMS</Text>
    </View>
  );
};

export default LMS;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
});
