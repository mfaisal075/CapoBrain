import {BackHandler, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';

const StdComplain = ({navigation}: any) => {
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 24, marginTop: 20, marginLeft: 20}}>
        Complain
      </Text>
    </View>
  );
};

export default StdComplain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
});
