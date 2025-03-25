import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Animated,
  ImageBackground,
  Linking,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    memberName: 'Hanzala Ahmad',
    date: '21-11-2024',
    inTime: '2:57 PM',
    title: 'Monthly Meeting',
    note: 'https://demo.capobrain.com/dashboard',
  },
  {
    id: '2',
    memberName: 'Ali Raza',
    date: '22-11-2024',
    inTime: '3:00 PM',
    title: 'Monthly Meeting',
    note: 'https://demo.capobrain.com/dashboard',
  },
  {
    id: '3',
    memberName: 'Ahmed Khan',
    date: '25-11-2024',
    inTime: '10:00 AM',
    title: 'PTM',
    note: 'https://demo.capobrain.com/dashboard',
  },
];

const ParentMeeting = ({navigation}: any) => {
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

    const backAction = () => {
      navigation.navigate('ParentHome');
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
          <View style={styles.card}>
            <Text style={styles.title}>{item.memberName}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#3b82f6'}}>📅 {item.date}</Text>
              <Text style={{marginLeft: 6, color: '#3b82f6'}}>
                🕒 {item.inTime}
              </Text>
            </View>
            <Text style={styles.meetingTitle}>{item.title}</Text>

            <TouchableOpacity onPress={() => Linking.openURL(item.note)}>
              <Text style={styles.linkText}>🔗 {item.note}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ParentMeeting;

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
    borderTopEndRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
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
});
