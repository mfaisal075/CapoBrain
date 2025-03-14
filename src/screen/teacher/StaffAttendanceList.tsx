import {
  BackHandler,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TableRow = {
  date: string | number;
  clockin: string;
  clockout: string;
  status: string;
};

const StaffAttendanceList = ({navigation}: any) => {
  const originalData: TableRow[] = [
    {date: '14-Nov-24', clockin: '5:50:00', clockout: '--:--:--', status: ''},
    {date: '15-Nov-24', clockin: '10:15:00', clockout: '--:--:--', status: ''},
    {
      date: '16-Nov-24',
      clockin: '10:41:00',
      clockout: '12:00:00',
      status: 'Present',
    },
    {date: '20-Nov-24', clockin: '2:52:00', clockout: '--:--:--', status: ''},
    {
      date: '21-Nov-24',
      clockin: '12:22:00',
      clockout: '12:27:00',
      status: 'Present',
    },
    {
      date: '28-Nov-24',
      clockin: '11:33:00',
      clockout: '12:33:00',
      status: 'Present',
    },
    {
      date: '05-Dec-24',
      clockin: '9:43:00',
      clockout: '9:43:00',
      status: 'Present',
    },
    {
      date: '06-Dec-24',
      clockin: '3:28:00',
      clockout: '3:28:00',
      status: 'Present',
    },
    {
      date: '09-Dec-24',
      clockin: '10:04:00',
      clockout: '10:04:00',
      status: 'Present',
    },
  ];

  const [tableData, setTableData] = useState<TableRow[]>(originalData);

  useEffect(() => {
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
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
        onPress={() => navigation.navigate('TeacherStudentList' as never)}>
        <View
          style={{
            width: 150,
            height: 30,
            backgroundColor: '#0069D9',
            borderRadius: 5,
            marginRight: 10,
            alignSelf: 'flex-end',
            marginTop: 10,
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

      {/* Table */}
      <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
        <View>
          <FlatList
            style={styles.flatList}
            data={tableData}
            keyExtractor={(item, index) =>
              item.date ? item.date.toString() : index.toString()
            }
            ListHeaderComponent={() => (
              <View style={styles.row}>
                {['Date', 'Clock In', 'Clock Out', 'Status'].map(header => (
                  <Text key={header} style={[styles.column, styles.headTable]}>
                    {header}
                  </Text>
                ))}
              </View>
            )}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.row,
                  {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                ]}>
                <Text style={styles.column}>{item.date}</Text>
                <Text style={styles.column}>{item.clockin}</Text>
                <Text style={styles.column}>{item.clockout}</Text>
                <Text style={styles.column}>{item.status}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
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
    width: 120,
    padding: 1,
    textAlign: 'center',
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
});
