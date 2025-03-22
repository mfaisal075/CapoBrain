import {
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 8},
    shadowOpacity: 0.8, 
    shadowRadius: 10,
    elevation: 20, 
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  date: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 12,
    color: "#555",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",  
    paddingHorizontal: wp("5%"), 
    paddingVertical: hp("2%"),
    position: "absolute",
    backgroundColor:'#3b82f6'
  },
  backButton: {
    width: 25,
    height: 25,
    tintColor: "white",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    textAlign:'center',
    flex:1
  },
  message:{
  fontSize: 12,
    color: "#444",
    marginTop: 5,
}
});
