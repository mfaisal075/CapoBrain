import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import NavBar from '../components/NavBar';

const ApplyLeave = () => {
  return (
    <View style={styles.container}>
      {/* NavBar */}
      <NavBar />
      <Text>ApplyLeave</Text>
    </View>
  );
};

export default ApplyLeave;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
});
