import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import NavBar from '../components/NavBar';

const Course = () => {
  return (
    <View style={styles.container}>
      {/* NavBar */}
      <NavBar />
      <Text>Course</Text>
    </View>
  );
};

export default Course;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
});
