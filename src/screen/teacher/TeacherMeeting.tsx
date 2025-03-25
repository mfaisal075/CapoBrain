import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Animated,
  ImageBackground,
  Linking,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

interface Notification {
  id: string;
  memberName: string;
  date: string;
  inTime: string;
  title: string;
  note: string;
}

const notifications: Notification[] = [
  {
    id: '1',
    memberName: ' Ahmad',
    date: '21-11-2024',
    inTime: '2:57 PM',
    title: 'Monthly Meeting',
    note: 'https://demo.capobrain.com/dashboard',
  },
  {
    id: '2',
    memberName: 'Ahmad',
    date: '22-11-2024',
    inTime: '3:00 PM',
    title: 'Monthly Meeting',
    note: 'https://demo.capobrain.com/dashboard',
  },
  {
    id: '3',
    memberName: 'Ahmed',
    date: '25-11-2024',
    inTime: '10:00 AM',
    title: 'PTM',
    note: 'https://demo.capobrain.com/dashboard',
  },
];

const TeacherMeeting = ({navigation}: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const moveAnim = useRef(new Animated.Value(0)).current;
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null,
  );

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

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Meeting Notifications</Text>
      </View>

      <FlatList
        style={{paddingVertical: 10}}
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedTransaction(item.id);
              setIsVisible(true);
            }}>
            <View style={styles.card}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.meetingTitle}>{item.title}</Text>
                <Text style={{color: '#3b82f6'}}>{item.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal isVisible={isVisible}>
        <View style={[styles.cards, {overflow: 'hidden'}]}>
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

          {selectedTransaction && (
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#3b82f6',
                textAlign: 'center',
                marginVertical: 10,
              }}>
              {
                notifications.find(item => item.id === selectedTransaction)
                  ?.title
              }
            </Text>
          )}

          <FlatList
            data={notifications.filter(
              entry => entry.id === selectedTransaction,
            )}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View
                style={{
                  marginLeft: '2%',
                  marginRight: '8%',
                  marginTop: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <EntryRow label="Date:" value={item.date} />
                  <EntryRow label="Time:" value={item.inTime} />
                </View>
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.note)}
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
                    {item.note}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              setSelectedTransaction(null);
              setIsVisible(false);
            }}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 23,
                alignSelf: 'center',
                marginBottom: 15,
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

export default TeacherMeeting;

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
    height: 150,
    backgroundColor: 'white',
  },
});
