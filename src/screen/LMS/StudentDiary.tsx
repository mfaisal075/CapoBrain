import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const StudentDiary = ({navigation}: any) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const onFromChange = (event: any, selectedDate?: Date) => {
    setShowFromDatePicker(false); // Hide the picker
    if (selectedDate) setFromDate(selectedDate); // Set the selected date
  };

  const onToChange = (event: any, selectedDate?: Date) => {
    setShowToDatePicker(false); // Hide the picker
    if (selectedDate) setToDate(selectedDate); // Set the selected date
  };

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
    <View style={styles.container}>
      <NavBar />

      <ScrollView>
        <View style={styles.accountContainer}>
          <View style={styles.actHeadingContainer}>
            <Text style={styles.tblHdCtr}>Daily Diary</Text>
          </View>

          {/* Back Button */}
          <View style={styles.bckBtnCtr}>
            <TouchableOpacity
              style={styles.bckBtn}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/back.png')}
                style={[styles.bckBtnIcon, {marginRight: -8}]}
              />
              <Image
                source={require('../../assets/back.png')}
                style={styles.bckBtnIcon}
              />
              <Text style={styles.bckBtnText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Student Details */}

          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => setShowFromDatePicker(true)}>
              <TextInput
                label="From"
                value={fromDate.toLocaleDateString('en-US')} // Display date in MM/DD/YYYY format
                theme={{
                  colors: {
                    primary: '#3B82F6',
                  },
                }}
                mode="outlined"
                editable={false} // Prevent keyboard from opening
                right={
                  <TextInput.Icon
                    icon="calendar"
                    onPress={() => setShowFromDatePicker(true)} // Open date picker on icon press
                  />
                }
              />
            </TouchableOpacity>
          </View>

          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={onFromChange}
            />
          )}

          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => setShowToDatePicker(true)}>
              <TextInput
                label="To"
                value={toDate.toLocaleDateString('en-US')} // Display date in MM/DD/YYYY format
                theme={{
                  colors: {
                    primary: '#3B82F6',
                  },
                }}
                mode="outlined"
                editable={false} // Prevent keyboard from opening
                right={
                  <TextInput.Icon
                    icon="calendar"
                    onPress={() => setShowToDatePicker(true)} // Open date picker on icon press
                  />
                }
              />
            </TouchableOpacity>
          </View>

          {showToDatePicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={onToChange}
            />
          )}

          <View style={styles.attendanceCtr}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                color: 'rgba(0,0,0,0.6)',
                textAlign: 'center',
              }}>
              No record present in the database!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentDiary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
  accountContainer: {
    height: 'auto',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: '5%',
  },
  actHeadingContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  tblHdCtr: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bckBtnCtr: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  bckBtn: {
    backgroundColor: '#5A6268',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
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
  attendanceCtr: {
    height: 'auto',
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Date Pickers Styling
  datePickerContainer: {
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
});
