import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Menu, Divider} from 'react-native-paper';
import {useUser} from '../Ctx/UserContext';
import {useNavigation} from '@react-navigation/native';

const NavBar = () => {
  const navigation = useNavigation();
  const {userRole, logout, userName} = useUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = () => {
    logout(); // Reset user state
    navigation.reset({
      index: 1,
      routes: [{name: 'Login' as never}], // Ensure it redirects to Login
    });
  };

  return (
    <View style={styles.navBar}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      {/* Navigation Options */}
      <View style={styles.otherOpts}>
        {/* Profile Dropdown */}
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity style={styles.optContainer} onPress={openMenu}>
              <Image
                source={require('../assets/user.png')}
                style={styles.optIcon}
              />
            </TouchableOpacity>
          }>
          {/* User Info */}
          <View style={styles.userInfo}>
            <Image
              source={require('../assets/user.png')}
              style={styles.userIcon}
            />
            <View>
              <Text style={styles.userName}>{userName}</Text>
              {userRole === 'Student' ? (
                <Text style={styles.userRole}>Student</Text>
              ) : userRole === 'Teacher' ? (
                <Text style={styles.userRole}>Teacher</Text>
              ) : (
                <Text style={styles.userRole}>Parent</Text>
              )}
            </View>
          </View>

          <Divider />
          <Menu.Item
            onPress={() => console.log('Change Password')}
            title="Change Password"
          />
          <Menu.Item onPress={() => logout()} title="Logout" />
        </Menu>

        {/* Other Icons */}
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
  },
  logo: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    tintColor: '#3B82F6',
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  userIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    tintColor: '#3B82F6',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#777',
  },
});
