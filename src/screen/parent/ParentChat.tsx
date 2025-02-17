import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import NavBar from '../../components/NavBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ParentChat = ({navigation}: any) => {
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
      <NavBar />

      <View style={styles.accountContainer}>
        <View style={styles.actHeadingContainer}>
          {/* Avatar with Online Mark and Name */}
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={require('../../assets/avatar.png')} // Replace with actual avatar image
                style={styles.avatar}
              />
              {/* Online Status */}
              <View style={styles.onlineMark} />     
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.userName}>Abdullah</Text>
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>

          {/* Dashboard Button */}
          <TouchableOpacity
            style={styles.bckBtn}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/back.png')}
              style={[styles.bckBtnIcon, {marginRight: -8}]}
            />
            <Image
              source={require('../../assets/back.png')}
              style={styles.bckBtnIcon}
            />
            <Text style={styles.bckBtnText}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Input Container */}
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#7D7D7D"
          cursorColor={'#000'}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Icon name="send" size={30} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ParentChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
  accountContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: '5%',
    padding: 10,
  },
  actHeadingContainer: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineMark: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: 'green',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userTextContainer: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  onlineText: {
    fontSize: 12,
    color: 'green',
  },
  bckBtn: {
    backgroundColor: '#5A6268',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bckBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bckBtnIcon: {
    height: 16,
    width: 16,
    tintColor: '#fff',
    marginRight: 5,
  },

  // Chat Input Container
  chatInputContainer: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    height: 50,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 50,
    marginLeft: 10,
  },
});
