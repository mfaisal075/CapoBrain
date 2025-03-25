import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Animated,
  Linking,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';

interface Notification {
  id: number;
  purpose: string;
  visit_date: string;
}

interface NotificationData {
  purpose: {
    purpose: string;
  };
  meeting: {
    visit_date: string;
    visit_out_time: string;
    visit_in_time: string;
    link: 'https://demo.capobrain.com/dashboard';
  };
}

const StdMeeting = ({navigation}: any) => {
  const {token} = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const moveAnim = useRef(new Animated.Value(0)).current;
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(
    null,
  );
  const [notifications, setNotification] = useState<Notification[]>([]);
  const [notificationsData, setNotificationData] =
    useState<NotificationData | null>(null);

  const fetchData = async () => {
    if (token) {
      try {
        const res = await axios.get(
          'https://demo.capobrain.com/navbarmeetingnotify',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setNotification(res.data.meeting);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleModal = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/single_meetingopen?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSelectedTransaction(id);
      setIsVisible(true);
      setNotificationData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

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
    fetchData();
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const EntryRow = ({label, value}: {label: string; value: string}) => (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{fontWeight: 'bold', color: '#3b82f6'}}>{label}</Text>
      <Text
        style={{
          color: '#3b82f6',
        }}>
        {value}
      </Text>
    </View>
  );

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
          source={require('../assets/bgimg.jpg')}
        />
      </Animated.View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10, paddingVertical: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Meeting Notifications</Text>
      </View>

      <FlatList
        style={{paddingVertical: 10}}
        data={notifications}
        keyExtractor={(item, index) => item.id.toString() || `item-${index}`}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              toggleModal(item.id);
            }}>
            <View style={styles.card}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.meetingTitle}>{item.purpose}</Text>
                <Text style={{color: '#3b82f6'}}>{item.visit_date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal isVisible={isVisible}>
        <View
          style={[
            styles.cards,
            {overflow: 'hidden', justifyContent: 'space-between'},
          ]}>
          <Animated.View
            style={[
              styles.animatedBackground,
              {transform: [{translateY: moveAnim}]},
            ]}>
            <ImageBackground
              resizeMode="cover"
              style={styles.backgroundImage}
              source={require('../assets/bgimg.jpg')}
            />
          </Animated.View>

          <View style={{flex: 1}}>
            {selectedTransaction && (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  textAlign: 'center',
                  marginVertical: 10,
                }}>
                {notificationsData?.purpose.purpose}
              </Text>
            )}

            {notificationsData && (
              <View style={{marginLeft: '2%', marginRight: '8%', marginTop: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <EntryRow
                    label="Date:"
                    value={notificationsData.meeting.visit_date}
                  />
                  <EntryRow
                    label="Time:"
                    value={notificationsData.meeting.visit_in_time}
                  />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('https://demo.capobrain.com/dashboard')
                  }
                  style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: '#3b82f6',
                      fontWeight: 'bold',
                      marginLeft: 1,
                      marginTop: 5,
                    }}>
                    Link:
                  </Text>
                  <Text
                    style={[
                      styles.linkText,
                      {
                        textDecorationLine: 'underline',
                        color: '#3b82f6',
                        marginTop: 4,
                      },
                    ]}>
                    https://demo.capobrain.com/dashboard
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              setSelectedTransaction(null);
              setIsVisible(false);
            }}
            style={{alignSelf: 'center', marginVertical: 15}}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 23,
                justifyContent: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                Close
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default StdMeeting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: 'white',
    marginLeft: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 20,
    marginHorizontal: '2%',
    marginVertical: '1%',
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  meetingTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#3b82f6',
  },
  linkText: {
    color: '#3b82f6',
  },
  cards: {
    borderRadius: 10,
    marginBottom: 10,
    margin: '2%',
    minHeight: 200, // Reduced from fixed height
    backgroundColor: 'white',
    justifyContent: 'space-between', // Add this
  },
});
