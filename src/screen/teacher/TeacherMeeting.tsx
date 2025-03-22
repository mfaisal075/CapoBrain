import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Notification {
  id: string;
  memberName: string;
  date: string;
  inTime: string;
  note: string;
}

const notifications: Notification[] = [
  {
    id: '1',
    memberName: 'Hanzala Ahmad',
    date: '21-11-2024',
    inTime: '2:57 PM',
    note: 'https://demo.capobrain.com/dashboard',
  },
  {
    id: '2',
    memberName: 'Ali Raza',
    date: '22-11-2024',
    inTime: '3:00 PM',
    note: 'https://demo.capobrain.com/dashboard',
  },
  {
    id: '3',
    memberName: 'Ahmed Khan',
    date: '25-11-2024',
    inTime: '10:00 AM',
    note: 'https://demo.capobrain.com/dashboard',
  },
];

const TeacherMeeting = ({navigation}: any) => {
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('TeacherHome');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TeacherHome' as never)}>
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
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.memberName}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View style={styles.datebtn}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {item.date}
                </Text>
              </View>
              <View style={styles.datebtn}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {item.inTime}
                </Text>
              </View>
            </View>

            <Text>{item.note}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TeacherMeeting;

const styles = StyleSheet.create({
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
    textAlign: 'center',
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 20,
    margin: '4%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  datebtn: {
    backgroundColor: '#3b82f6',
    width: 100,
    height: 30,
    justifyContent: 'center',
    borderRadius: 5,
    margin: 5,
  },
});
