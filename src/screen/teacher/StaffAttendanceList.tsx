import {
  BackHandler,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Animated} from 'react-native';

type TableRow = {
  id: string;
  date: string | number;
  clockin: string;
  clockout: string;
  status: string;
};

const StaffAttendanceList = ({navigation}: any) => {
  const originalData: TableRow[] = [
    {
      id: '1',
      date: '14-Nov-24',
      clockin: '5:50:00',
      clockout: '--:--:--',
      status: '',
    },
    {
      id: '2',
      date: '15-Nov-24',
      clockin: '10:15:00',
      clockout: '--:--:--',
      status: '',
    },
    {
      id: '3',
      date: '16-Nov-24',
      clockin: '10:41:00',
      clockout: '12:00:00',
      status: 'Present',
    },
    {
      id: '4',
      date: '20-Nov-24',
      clockin: '2:52:00',
      clockout: '--:--:--',
      status: '',
    },
    {
      id: '5',
      date: '21-Nov-24',
      clockin: '12:22:00',
      clockout: '12:27:00',
      status: 'Present',
    },
    {
      id: '6',
      date: '28-Nov-24',
      clockin: '11:33:00',
      clockout: '12:33:00',
      status: 'Present',
    },
    {
      id: '7',
      date: '05-Dec-24',
      clockin: '9:43:00',
      clockout: '9:43:00',
      status: 'Present',
    },
    {
      id: '8',
      date: '06-Dec-24',
      clockin: '3:28:00',
      clockout: '3:28:00',
      status: 'Present',
    },
    {
      id: '9',
      date: '09-Dec-24',
      clockin: '10:04:00',
      clockout: '10:04:00',
      status: 'Present',
    },
  ];

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
      navigation.navigate('TeacherAttendance' as never);
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
        <TouchableOpacity
          onPress={() => navigation.navigate('TeacherAttendance' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}> Attendance List</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('StdAttendance' as never)}>
        <View
          style={{
            width: 150,
            height: 30,
            backgroundColor: '#3b82f6',
            borderRadius: 5,
            marginRight: 10,
            alignSelf: 'flex-end',
            marginTop: 10,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 15,
              textAlign: 'center',
              marginTop: 3,
            }}>
            Student Attendance
          </Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={originalData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>{item.status}</Text>
              <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                {item.date}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#3b82f6'}}>{item.clockin}</Text>
              <Text style={{color: '#3b82f6'}}>{item.clockout}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default StaffAttendanceList;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: 100,
    padding: 1,
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
  },
  backButton: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  flatList: {
    margin: 10,
    flex: 1,
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
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginLeft: '2%',
    elevation: 5,
    opacity: 1,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginRight: '2%',
    marginTop: '1%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
});
