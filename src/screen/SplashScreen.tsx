import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SplashScreen = () => {
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const translateX = useRef(new Animated.Value(-50)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 2000,
        delay: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/screen.jpg')}
        style={[styles.backgroundImage, {opacity: bgOpacity}]}
        resizeMode="cover"
      />

      <View style={styles.logoContainer}>
        <Animated.Image
          source={require('../assets/logo.png')}
          style={[styles.logo, {transform: [{translateY}, {translateX}]}]}
          resizeMode="contain"
        />
      </View>

      <Animated.Text style={[styles.tagline, {opacity: textOpacity}]}>
        Version 1.3.22
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: wp('100%'),
    height: hp('100%'),
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logoContainer: {
    alignSelf: 'center',
    zIndex: 1,
  },
  logo: {
    width: wp('40%'),
    height: hp('20%'),
  },
  tagline: {
    fontSize: wp('4%'),
    color: '#fff',
    position: 'absolute',
    bottom: hp('10%'),
  },
});

export default SplashScreen;
