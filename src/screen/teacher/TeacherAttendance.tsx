import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TeacherAttendance = ({navigation}: any) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState<
    'not_marked' | 'clocked_in' | 'clocked_out'
  >('not_marked');
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    setAttendanceStatus('clocked_in');
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockOutTime(now);
    setAttendanceStatus('clocked_out');
  };

  const handleReset = () => {
    setClockInTime(null);
    setClockOutTime(null);
    setAttendanceStatus('not_marked');
  };

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
      setCurrentTime(new Date()); // Update time every second
    }, 1000);

    return () => {
      clearInterval(interval);
      backHandler.remove();
    };
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
        <Text style={styles.headerText}>Attendance</Text>
      </View>

      <Text style={styles.teacherName}>Ahmad</Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          alignSelf: 'flex-end',
          marginRight: 10,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('StaffAttendanceList' as never)}>
          <View
            style={{
              width: 120,
              height: 30,
              backgroundColor: '#0069D9',
              borderRadius: 5,
              marginLeft: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
                marginTop: 3,
              }}>
              Attendance List
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('StdAttendanceList' as never)}>
          <View
            style={{
              width: 150,
              height: 30,
              backgroundColor: '#0069D9',
              borderRadius: 5,
              marginLeft: 5,
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
      </View>
      <Text style={styles.currentTime}>{currentTime.toLocaleTimeString()}</Text>

      <Text style={styles.statusText}>
        {attendanceStatus === 'not_marked'
          ? 'Please Click on Clock In to mark Attendance'
          : attendanceStatus === 'clocked_in'
          ? `Your Attendance is marked at ${clockInTime?.toLocaleTimeString()}`
          : `Clocked Out at ${clockOutTime?.toLocaleTimeString()}`}
      </Text>

      {attendanceStatus === 'not_marked' && (
        <TouchableOpacity onPress={handleClockIn} style={styles.clockInButton}>
          <Text style={styles.buttonText}>Clock In</Text>
        </TouchableOpacity>
      )}
      {attendanceStatus === 'clocked_in' && (
        <TouchableOpacity
          onPress={handleClockOut}
          style={styles.clockOutButton}>
          <Text style={styles.buttonText}>Clock Out</Text>
        </TouchableOpacity>
      )}

      {attendanceStatus === 'clocked_out' && (
        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Attendance Summary</Text>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, {fontWeight: 'bold'}]}>
              Clock In
            </Text>
            <Text style={[styles.tableCell, {fontWeight: 'bold'}]}>
              Clock Out
            </Text>
            <Text style={[styles.tableCell, {fontWeight: 'bold'}]}>Date</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {clockInTime?.toLocaleTimeString()}
            </Text>
            <Text style={styles.tableCell}>
              {clockOutTime?.toLocaleTimeString()}
            </Text>
            <Text style={styles.tableCell}>
              {clockInTime?.toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity onPress={handleReset} style={styles.okButton}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TeacherAttendance;

const styles = StyleSheet.create({
  statusText: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
    color: 'gray',
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
  teacherName: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  currentTime: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  clockInButton: {
    borderRadius: 5,
    width: 70,
    alignSelf: 'center',
    backgroundColor: '#218838',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockOutButton: {
    borderRadius: 5,
    width: 70,
    alignSelf: 'center',
    backgroundColor: '#E0A800',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  okButton: {
    marginTop: 10,
    backgroundColor: '#0069D9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
