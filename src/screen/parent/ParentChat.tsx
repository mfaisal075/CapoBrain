import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';

interface Chat {
  id: number;
  message: string;
  send_name: string;
  notification_status: string;
}

const ParentChat = ({navigation}: any) => {
  const {token, userId} = useUser();
  const [messages, setMessages] = useState<
    {id: number; text: string; sender: 'me' | 'other'}[]
  >([]);
  const [inputText, setInputText] = useState('');

  const hendleGetMessages = async () => {
    if (token) {
      try {
        const res = await axios.get(
          `https://demo.capobrain.com/get-messages?parent_id=${userId}&school_id=2&_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: {id: number; text: string; sender: 'me' | 'other'} = {
      id: messages.length + 1,
      text: inputText,
      sender: 'me',
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  useEffect(() => {
    hendleGetMessages();
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
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{flex: 1}}>
        <View
          style={{
            backgroundColor: '#3b82f6',
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-left"
              size={38}
              color={'#fff'}
              style={{paddingHorizontal: 10}}
            />
          </TouchableOpacity>
          <Image
            style={{width: 40, height: 40, marginRight: 10}}
            source={require('../../assets/avatar.png')}
          />

          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
              }}>
              Iftikhar
            </Text>
            <Text
              style={{
                color: 'white',
              }}>
              Online
            </Text>
          </View>
        </View>

        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === 'me' ? styles.myMessage : styles.otherMessage,
            ]}>
            <Text style={{color: message.sender === 'me' ? 'black' : 'black'}}>
              Name
            </Text>
            <Text style={{color: message.sender === 'me' ? 'white' : 'black'}}>
              {message.text}
            </Text>
            <Text
              style={{
                color: message.sender === 'me' ? 'black' : 'black',
                textAlign: 'right',
              }}>
              3:30PM
            </Text>
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F8F9FA',
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderTopWidth: 1,
          borderColor: 'gray',
        }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
            paddingHorizontal: 10,
            color: 'black',
            height: hp('6%'),
          }}
          placeholder="Type something"
          placeholderTextColor="gray"
          value={inputText}
          onChangeText={setInputText}
        />

        <TouchableOpacity onPress={sendMessage}>
          <View
            style={{
              backgroundColor: '#3b82f6',
              borderRadius: 5,
              width: 44,
              height: 36,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 10,
            }}>
            <Image
              style={{
                width: 25,
                height: 25,
                alignSelf: 'center',
                tintColor: 'white',
                marginLeft: 5,
              }}
              source={require('../../assets/send.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ParentChat;

const styles = StyleSheet.create({
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    maxWidth: '70%',
    marginTop: 6,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
    marginRight: 10,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
    marginLeft: 10,
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: 'white',
    marginLeft: 3,
  },
});
