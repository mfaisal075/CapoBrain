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
  purpose: string;
  memberName: string;
  class: string;
  visitorName: string;
  contact: string;
  cnic: string;
  persons: number;
  date: string;
  inTime: string;
  outTime: string;
  note: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    purpose: "Monthly Meeting",
    memberName: "Hanzala Ahmad",
    class: "Three (A)",
    visitorName: "Abiha",
    contact: "31010981908",
    cnic: "341019789237",
    persons: 2,
    date: "21-11-2024",
    inTime: "2:57 PM",
    outTime: "2:58 PM",
    note:'The Quick Brown Fox Jumps Over The Lazy Dog...'
  },
  {
    id: "2",
    purpose: "PTA Meeting",
    memberName: "Ali Raza",
    class: "Four (B)",
    visitorName: "Fatima",
    contact: "30012345678",
    cnic: "421019789111",
    persons: 3,
    date: "22-11-2024",
    inTime: "3:00 PM",
    outTime: "3:30 PM",
    note:'The Quick Brown Fox Jumps Over The Lazy Dog...'
  },
  {
    id: "3",
    purpose: "Annual Function",
    memberName: "Ahmed Khan",
    class: "Five (C)",
    visitorName: "Zainab",
    contact: "31234567890",
    cnic: "351019789333",
    persons: 1,
    date: "25-11-2024",
    inTime: "10:00 AM",
    outTime: "12:00 PM",
    note:'The quick Brown Fox Jumps Over The Lazy Dog...'
  },

 
];

const ParentMeeting = ({navigation}: any) => {

  useEffect(() => {
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
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ParentHome' as never)}>
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.purpose}</Text>
            <Text>👤 {item.memberName} ({item.class})</Text>
            <Text>🧑 Visitor: {item.visitorName} ({item.persons} Persons)</Text>
            <Text>📞 Contact: {item.contact}</Text>
            <Text>🆔 CNIC: {item.cnic}</Text>
            <Text>📅 {item.date}</Text>
            <Text>🕒 {item.inTime} - {item.outTime}</Text>
            <Text>📝 Note: {item.note}</Text>
          </View>
        )}
      />

    </View>
  );
};

export default ParentMeeting;

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
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 20,
    margin:('4%'),
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
