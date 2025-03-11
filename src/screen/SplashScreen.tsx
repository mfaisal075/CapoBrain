import {Image, StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={require('../assets/hbg.png')}
      />

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.versionCtr}>
        <Text style={styles.version}>Version 1.3.11</Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: wp('100%'),
    height: hp('105%'),
    position: 'absolute',
    top: 0,
  },
  logoContainer: {
    alignSelf: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
  versionCtr: {
    position: 'absolute',
    bottom: 10,
  },
  version: {
    fontSize: 16,
    color: '#fff',
  },
});
