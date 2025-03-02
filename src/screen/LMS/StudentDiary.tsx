import {
  BackHandler,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
import {useFocusEffect} from '@react-navigation/native';

const StudentDiary = ({navigation}: any) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const {token} = useUser();

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchstudentdiary' +
            `?from=${fromDate.toISOString().split('T')[0]}&to=${
              toDate.toISOString().split('T')[0]
            }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return response.data;
      } catch (error) {}
    }
  };

  const {data, refetch, isFetching} = useQuery({
    queryKey: ['tableData'],
    queryFn: fetchData,
    refetchOnWindowFocus: true,
  });

  const customHTMLElementModels = {
    center: HTMLElementModel.fromCustomModel({
      tagName: 'center',
      mixedUAStyles: {
        alignItems: 'center',
        textAlign: 'center',
      },
      contentModel: HTMLContentModel.block,
    }),
  };

  const onFromChange = (event: any, selectedDate?: Date) => {
    setShowFromDatePicker(false); // Hide the picker
    if (selectedDate) setFromDate(selectedDate); // Set the selected date
  };

  const onToChange = (event: any, selectedDate?: Date) => {
    setShowToDatePicker(false); // Hide the picker
    if (selectedDate) setToDate(selectedDate); // Set the selected date
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (fromDate || toDate) {
      refetch();
    }
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [fromDate, toDate]);
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

          <View style={styles.tblDataCtr}>
            <ScrollView
              horizontal
              style={{flex: 1, padding: 10}}
              refreshControl={
                <RefreshControl refreshing={isFetching} onRefresh={refetch} />
              }>
              {data ? (
                <RenderHtml
                  contentWidth={Dimensions.get('window').width}
                  source={{html: data}}
                  customHTMLElementModels={customHTMLElementModels}
                  tagsStyles={{
                    h4: {
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#000',
                    },
                    table: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      width: '100%',
                      marginLeft: -10,
                    },
                    th: {
                      backgroundColor: '#f2f2f2',
                      paddingVertical: 0,
                      paddingHorizontal: 6,
                      marginHorizontal: -5,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      borderWidth: 1,
                      borderColor: '#ddd',
                      width: 100, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -5,
                    },
                    td: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      paddingVertical: 0,
                      paddingHorizontal: 6,
                      textAlign: 'center',
                      width: 90, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -3,
                    },
                    tr: {},
                    h6: {
                      marginVertical: 0,
                      textAlign: 'center',
                    },
                    a: {
                      width: 55,
                      backgroundColor: '#3B82F6',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 5,
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 12,
                    },
                  }}
                />
              ) : null}
            </ScrollView>
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

  // Date Pickers Styling
  datePickerContainer: {
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  tblDataCtr: {
    marginTop: 10,
    marginBottom: 20,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
});
