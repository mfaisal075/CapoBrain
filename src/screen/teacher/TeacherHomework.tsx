import {
  BackHandler,
  Dimensions,
  Image,
  Modal,
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from '../../Ctx/UserContext';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

const TeacherHomework = ({navigation}: any) => {
  const {token} = useUser();
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [hwModalVisible, setHwModalVisible] = useState(false);
  const [modalClassOpen, setModalClassOpen] = useState(false);
  const [modalClassValue, setModalClassValue] = useState(null);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectValue, setSubjectValue] = useState(null);
  const [modalSectionOpen, setModalSectionOpen] = useState(false);
  const [modalSectionValue, setModalSectionValue] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [desc, setdesc] = useState('');

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/teacherhomeworks_fetchhomework?from=${
            from.toISOString().split('T')[0]
          }&to=${to.toISOString().split('T')[0]}&_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return response.data.output;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not Authenticated');
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

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onChange = ({event, selectedDate}: any) => {
    setShowDatePicker(false); // Hide the picker
    if (selectedDate) setDate(selectedDate); // Set the selected date
  };

  const showDialog = () => {
    setHwModalVisible(true);
  };
  const hideDialog = () => {
    setHwModalVisible(false);
  };

  const onChangeFrom = (event: any, selectedDate: Date | undefined) => {
    setShowFromDatePicker(false); // Hide the picker
    if (selectedDate) setFrom(selectedDate); // Set the selected date
  };

  const onChangeTo = (event: any, selectedDate: Date | undefined) => {
    setShowToDatePicker(false); // Hide the picker
    if (selectedDate) setTo(selectedDate); // Set the selected date
  };

  const classItems: {label: string; value: string}[] = [];

  useEffect(() => {
    if (from || to) {
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
  }, [from, to]);
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
              style={[styles.btn, {backgroundColor: '#28A745'}]}
              onPress={showDialog}>
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
              <Text style={styles.btnText}>Dashboard</Text>
            </TouchableOpacity>
          </View>

          {/* Data Container */}
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
                      textAlign: 'center',
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
                      paddingHorizontal: 1,
                      marginHorizontal: -5,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      borderWidth: 1,
                      borderColor: '#ddd',
                      width: 145, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -10,
                      marginTop: -10,
                    },
                    td: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      paddingVertical: 0,
                      paddingHorizontal: 6,
                      textAlign: 'center',
                      width: 100, // Adjust width as needed
                      height: 50,
                      justifyContent: 'center',
                      marginBottom: -1,
                      borderBottomColor: 'white',
                    },
                    tr: {
                      backgroundColor: '#fff',
                      marginLeft: -3,
                    },
                    h6: {
                      marginVertical: 0,
                      textAlign: 'center',
                    },
                    span: {
                      backgroundColor: 'gray', // Green background (Approved)
                      color: '#fff', // White text
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      alignSelf: 'center', // Center the badge
                    },
                    center: {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    a: {
                      backgroundColor: 'green',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                      color: '#fff',
                      fontWeight: 'bold',
                      textDecorationLine: 'none',
                    },
                  }}
                />
              ) : (
                <View style={styles.attendanceCtr}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: 'rgba(0,0,0,0.6)',
                      textAlign: 'center',
                    }}>
                    No record present in the database!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Add Home Work Modal */}
      <Modal
        visible={hwModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideDialog}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
            }}>
            <View style={styles.modalTitleCtr}>
              <Text style={styles.modalTitle}>Add Home Work</Text>
            </View>
            <View
              style={{
                borderBottomColor: '#000',
                borderBottomWidth: 0.5,
                marginVertical: 10,
              }}
            />
            <View>
              <TouchableOpacity
                style={styles.clsIconCtr}
                onPress={() => hideDialog()}>
                <Icon name="close" size={26} color={'#000'} />
              </TouchableOpacity>
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Class <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={modalClassOpen}
                  value={modalClassValue}
                  setOpen={setModalClassOpen}
                  setValue={setModalClassValue}
                  placeholder="Please Select Any Class"
                  items={classItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                    zIndex: 100,
                  }}
                />
              </View>
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Section <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={modalSectionOpen}
                  value={modalSectionValue}
                  setOpen={setModalSectionOpen}
                  setValue={setModalSectionValue}
                  placeholder="Select Class First"
                  items={classItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                    zIndex: 100,
                  }}
                />
              </View>
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Assigned Subject <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={subjectOpen}
                  value={subjectValue}
                  setOpen={setSubjectOpen}
                  setValue={setSubjectValue}
                  placeholder="Select Section First"
                  items={classItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                    zIndex: 100,
                  }}
                />
              </View>

              {/* Date Picker */}
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Date <Text style={{color: 'red'}}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    borderColor: '#ccc',
                    width: '100%',
                    height: '100%',
                    padding: 8, // Match spacing
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{color: '#000'}}>
                      {date.toISOString().split('T')[0]}{' '}
                      {/* Display date in YYYY-MM-DD format */}
                    </Text>
                    <Icon name="calendar" size={24} color={'#3B82F6'} />
                  </View>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>
              <View
                style={[
                  styles.picker,
                  {
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    paddingHorizontal: 15,
                    height: 120,
                  },
                ]}>
                <Text style={styles.text}>
                  Description <Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  key="desc-input" // Add a unique key
                  value={desc}
                  onChangeText={text => setdesc(text)}
                  style={{
                    flex: 1,
                    textAlignVertical: 'top',
                    backgroundColor: 'transparent',
                  }}
                  cursorColor={'#000'}
                  multiline={true}
                  numberOfLines={5}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <TouchableOpacity style={styles.saveBtn}>
                <Text style={styles.saveBtnTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // Picker Container Styling
  pickerCtr: {
    height: 'auto',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: '5%',
  },
  picker: {
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 12,
    position: 'absolute',
    left: 15,
    top: -10,
    backgroundColor: '#fff',
    paddingHorizontal: 2,
  },
  addHWBtnCtr: {
    width: '90%',
    flexDirection: 'row-reverse',
    marginTop: 20,
  },
  addHWBtn: {
    width: '55%',
    height: 40,
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  addHWBtnTxt: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  innerDataCtr: {
    width: '100%',
    height: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //Modal Styling
  modalTitleCtr: {
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clsIconCtr: {
    position: 'absolute',
    right: 5,
    top: -50,
  },
  saveBtn: {
    backgroundColor: '#28A745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveBtnTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
  attendanceCtr: {
    height: 'auto',
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
