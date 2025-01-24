import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const NavBar = () => {
  return (
    <View style={styles.navBar}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.otherOpts}>
        <TouchableOpacity style={styles.optContainer}>
          <Image
            source={require('../assets/user.png')}
            style={styles.optIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optContainer}>
          <Image
            source={require('../assets/settings.png')}
            style={styles.optIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optContainer}>
          <Image
            source={require('../assets/game.png')}
            style={[styles.optIcon, {transform: [{rotate: '-80deg'}]}]}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optContainer}>
          <Image
            source={require('../assets/calendar.png')}
            style={styles.optIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optContainer}>
          <Image
            source={require('../assets/exclamation.png')}
            style={styles.optIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optContainer}>
          <Image
            source={require('../assets/envelope.png')}
            style={styles.optIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  // Nav Bar style
  navBar: {
    height: 70,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  logoContainer: {
    height: 45,
    width: 70,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
  },
  logo: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  otherOpts: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  optContainer: {
    height: 40,
    width: 40,
    backgroundColor: 'rgba(59, 130, 246,0.5)',
    borderRadius: 50,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optIcon: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
    tintColor: '#3B82F6',
  },
});
