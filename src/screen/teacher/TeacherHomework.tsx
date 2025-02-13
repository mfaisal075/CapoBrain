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

const TeacherHomework = ({navigation}: any) => {
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const onChangeFrom = (event: any, selectedDate: Date | undefined) => {
    setShowFromDatePicker(false); // Hide the picker
    if (selectedDate) setFrom(selectedDate); // Set the selected date
  };

  const onChangeTo = (event: any, selectedDate: Date | undefined) => {
    setShowToDatePicker(false); // Hide the picker
    if (selectedDate) setTo(selectedDate); // Set the selected date
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

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.container}>
      <NavBar />

      <ScrollView>
        <View style={styles.accountContainer}>
          {/* From Date Picker */}
          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => setShowFromDatePicker(true)}>
              <TextInput
                label="From"
                value={from.toISOString().split('T')[0]} // Display date in YYYY-MM-DD format
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
              value={from}
              mode="date"
              display="default"
              onChange={onChangeFrom}
            />
          )}

          {/* To Date Picker */}
          <View
            style={[
              styles.datePickerContainer,
              {marginTop: 10, marginBottom: 40},
            ]}>
            <TouchableOpacity onPress={() => setShowToDatePicker(true)}>
              <TextInput
                label="To"
                value={to.toISOString().split('T')[0]} // Display date in YYYY-MM-DD format
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
              value={to}
              mode="date"
              display="default"
              onChange={onChangeTo}
            />
          )}

          {/*Buttons */}
          <View style={styles.btnCtr}>
            <TouchableOpacity
              style={[styles.btn, {backgroundColor: '#3B82F6'}]}
              onPress={() => navigation.navigate('TSummerHomework')}>
              <Text style={styles.btnText}>Summer Home Work </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, {backgroundColor: '#28A745'}]}>
              <Text style={styles.btnText}>Add Home Work </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                {backgroundColor: '#5A6268', flexDirection: 'row'},
              ]}
              onPress={() => navigation.navigate('TeacherHome')}>
              <Image
                source={require('../../assets/back.png')}
                style={[styles.bckBtnIcon, {marginRight: -8}]}
              />
              <Image
                source={require('../../assets/back.png')}
                style={styles.bckBtnIcon}
              />
              <Text style={styles.btnText}>Dashboard </Text>
            </TouchableOpacity>
          </View>

          {/* Data Container */}
          <View style={styles.dataCtr}>
            <Text style={styles.noDataTxt}>
              No record present in the database!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TeacherHomework;

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
    alignItems: 'center',
  },
  datePickerContainer: {
    marginTop: 20,
    marginBottom: 10,
    width: '80%',
  },
  btnCtr: {
    width: '80%',
  },
  btn: {
    height: 40,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  bckBtnIcon: {
    height: 14,
    width: 14,
    tintColor: '#fff',
    marginRight: 5,
  },
  dataCtr: {
    width: '90%',
    height: 200,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataTxt: {
    fontSize: 18,
    color: 'gray',
  },
});
