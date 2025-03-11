import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';

interface Notification {
  id: string;
  msg_subject: string;
  msg_date: string;
  msg_message: string;
}

const noteColors = [
  '#FFEB3B',
  '#FFCDD2',
  '#C8E6C9',
  '#BBDEFB',
  '#E1BEE7',
  '#EFDCAB',
  '#FFD180',
  '#D1C4E9',
  '#80CBC4',
  '#FFAB91',
  '#F48FB1',
  '#A5D6A7',
  '#B3E5FC',
  '#FFF59D',
  '#FFEB3B',
  '#FFCDD2',
  '#C8E6C9',
  '#BBDEFB',
  '#E1BEE7',
  '#EFDCAB',
];

const getRandomColor = (index: number) => {
  return noteColors[index % noteColors.length];
};

const TeacherMessages = ({navigation}: any) => {
  const {token} = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/navbarmessage',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setNotifications(response.data.message);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    fetchNotifications();
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/corkboard.png')}
        style={styles.background}
      />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Messages</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={[styles.listContainer, {marginTop: hp('5%')}]}
        renderItem={({item, index}) => (
          <View
            style={[
              styles.note,
              {
                backgroundColor: getRandomColor(index),
                transform: [{rotate: `${index % 2 === 0 ? '-3deg' : '3deg'}`}],
              },
            ]}>
            <Text style={styles.title}>{item.msg_subject}</Text>
            <Text style={styles.message}>{item.msg_message}</Text>

            <Text style={styles.date}>{item.msg_date}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TeacherMessages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  note: {
    padding: 15,
    width: 160,
    height: 150,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  date: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 12,
    color: '#555',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    position: 'absolute',
    top: hp('1%'),
    left: 0,
    zIndex: 1,
  },
  backButton: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    marginLeft: wp('3%'),
  },

  message: {
    fontSize: 12,
    color: '#444',
    marginTop: 5,
  },
});
