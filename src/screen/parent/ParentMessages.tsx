import {
  Animated,
  BackHandler,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {useUser} from '../../Ctx/UserContext';

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

const ParentMessages = ({navigation}: any) => {
  const {token} = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
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

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty or invalid dates

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedBackground,
          {transform: [{translateY: moveAnim}]},
        ]}>
        <ImageBackground
          resizeMode="cover"
          style={styles.backgroundImage}
          source={require('../../assets/bgimg.jpg')}
        />
      </Animated.View>

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

      {notifications.length > 0 ? (
        <FlatList
          style={{paddingVertical: 20}}
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
                  transform: [
                    {rotate: `${index % 2 === 0 ? '-3deg' : '3deg'}`},
                  ],
                },
              ]}>
              <Text style={styles.title}>{item.msg_subject}</Text>
              <Text style={styles.message}>{item.msg_message}</Text>

              <Text style={styles.date}>{formatDate(item.msg_date)}</Text>
            </View>
          )}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: '#3b82f6', fontWeight: 'bold'}}>
            No data found in the database!
          </Text>
        </View>
      )}
    </View>
  );
};

export default ParentMessages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  note: {
    padding: 15,
    width: 160,
    height: 130,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 8, height: 8},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#3b82f6',
  },
  date: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 12,
    color: '#3b82f6',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    position: 'absolute',
    backgroundColor: '#3b82f6',
    zIndex: 100,
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
    textAlign: 'center',
    flex: 1,
  },

  message: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 5,
  },
  animatedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
});
