import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {Image} from 'react-native';

const TeacherAttendance = ({navigation}: any) => {
  const [time, setTime] = useState(new Date()); // Ensure time is initialized

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('TeacherHome');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    const interval = setInterval(() => {
      setTime(new Date()); // Update time every second
    }, 1000);

    return () => {
      clearInterval(interval);
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <NavBar />

      <View style={styles.attendanceContainer}>
        <View style={styles.attHeadingContainer}>
          <Text style={styles.attHeadingText}>Isra</Text>
        </View>

        <View style={styles.bckBtnCtr}>
          <TouchableOpacity
            style={styles.bckBtn}
            onPress={() => navigation.goBack()}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../assets/back.png')}
                style={[styles.bckBtnIcon, {marginRight: -8}]}
              />
              <Image
                source={require('../../assets/back.png')}
                style={styles.bckBtnIcon}
              />
            </View>
            <Text style={styles.bckBtnText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attBtn}
            onPress={() => {navigation.navigate('StaffAttendanceList')}}>
            <Text style={styles.attBtnTxt}>Attendance List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attBtn}>
            <Text style={styles.attBtnTxt}>Student Attendance</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerCtr}>
          <Text style={styles.clockText}>
            {time.toLocaleTimeString('en-US', {hour12: true})}
          </Text>
        </View>
        <View style={styles.clockinBtnCtr}>
          <Text style={styles.clockinText}>
            Please Click on Clockin to mark Attendance
          </Text>
          <TouchableOpacity style={styles.clockinBtn}>
            <Text style={styles.clockinBtnTxt}>Clockin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TeacherAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
  attendanceContainer: {
    height: 'auto',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: '5%',
  },
  attHeadingContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  attHeadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00008B',
  },
  bckBtnCtr: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingRight: 20,
    marginBottom: 20,
  },
  bckBtn: {
    backgroundColor: '#5A6268',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  bckBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bckBtnIcon: {
    height: 16,
    width: 16,
    tintColor: '#fff',
    marginRight: 5,
  },
  attBtn: {
    width: 100,
    height: 65,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  attBtnTxt: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerCtr: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'flex-end',
  },
  clockText: {
    fontSize: 28,
  },
  clockinBtnCtr: {
    width: '100%',
    height: 300,
    alignItems: 'center',
  },
  clockinText: {
    marginTop: 50,
    fontSize: 20,
    textAlign: 'center',
    color: 'gray',
  },
  clockinBtn: {
    marginTop: 100,
    backgroundColor: '#218838',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  clockinBtnTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
