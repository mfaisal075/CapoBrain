import {
  BackHandler,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';

const ParentApplyLeave = ({navigation}: any) => {
  const [visible, setVisible] = useState(false);
  const [leaveSubject, setLeaveSubject] = useState('');
  const [leaveDesc, setLeaveDesc] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const studentItems = [{label: 'Hibba', value: 'Hibba'}];
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const {token} = useUser();

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchleave',
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
      throw new Error('User is not authenticated');
    }
  };

  const {data, refetch, isFetching} = useQuery({
    queryKey: ['tableData'],
    queryFn: fetchData,
    refetchOnWindowFocus: true, // Fetch new data when screen is focused
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

  // State to store the selected leave data
  interface Leave {
    sr: number;
    student: string;
    subject: string;
    date: string;
    status: string;
    desc: string;
  }

  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  const showLeaveModal = (leave: any) => {
    setSelectedLeave(leave); // Set the selected leave data
    setViewModalVisible(true); // Open the modal
  };

  const hideLeaveModal = () => {
    setSelectedLeave(null); // Clear the selected leave data
    setViewModalVisible(false); // Close the modal
  };

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setDate(new Date());
    setSelectedStudent(null);
    setLeaveSubject('');
    setLeaveDesc('');
    setVisible(false);
  };

  const onChange = ({event, selectedDate}: any) => {
    setShowDatePicker(false); // Hide the picker
    if (selectedDate) setDate(selectedDate); // Set the selected date
  };

  useEffect(() => {
    refetch();
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
              <Text style={styles.bckBtnText}>Dashboard</Text>
            </TouchableOpacity>
            {/* Apply Leave Button */}
            <TouchableOpacity style={styles.leaveBtn} onPress={showDialog}>
              <Text style={styles.bckBtnText}>Add Leave</Text>
            </TouchableOpacity>
          </View>

          {/* Table */}
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
                      paddingHorizontal: 1,
                      marginHorizontal: -5,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      borderWidth: 1,
                      borderColor: '#ddd',
                      width: 125, // Adjust width as needed
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
                      marginBottom: -2,
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
                      backgroundColor: '#3B82F6',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                      color: '#fff',
                      fontWeight: 'bold',
                    },
                  }}
                />
              ) : null}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Add Leave Modal */}
      <Modal
        visible={visible}
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
              <Text style={styles.modalTitle}>Add Leave</Text>
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
              <View style={styles.pickerCtr}>
                <View style={[styles.picker, {marginTop: 10}]}>
                  <Text style={styles.text}>
                    Student <Text style={{color: 'red'}}>*</Text>
                  </Text>
                  <DropDownPicker
                    open={openStudent}
                    value={selectedStudent}
                    setOpen={setOpenStudent}
                    setValue={setSelectedStudent}
                    placeholder="Select Student"
                    items={studentItems}
                    style={{
                      borderColor: 'transparent',
                      backgroundColor: 'transparent',
                      borderRadius: 10,
                    }}
                    dropDownContainerStyle={{
                      borderColor: '#ccc',
                      borderRadius: 10,
                      height: 'auto',
                    }}
                  />
                </View>
              </View>
              <View
                style={[
                  styles.picker,
                  {
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    paddingHorizontal: 15,
                    height: 40,
                  },
                ]}>
                <Text style={styles.text}>
                  Subject <Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  key="subject-input" // Add a unique key
                  value={leaveSubject}
                  onChangeText={text => setLeaveSubject(text)}
                  style={{
                    flex: 1,
                    textAlignVertical: 'top',
                    backgroundColor: 'transparent',
                  }}
                  cursorColor={'#000'}
                  multiline={true}
                />
              </View>

              {/* Leave Date */}
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
                  value={leaveDesc}
                  onChangeText={text => setLeaveDesc(text)}
                  style={{
                    flex: 1,
                    textAlignVertical: 'top',
                    backgroundColor: 'transparent',
                    height: '100%',
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

      {/* Leave Details Modal */}
      <Modal
        visible={viewModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideLeaveModal}>
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
              <Text style={styles.modalTitle}>Leave Details</Text>
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
                onPress={() => hideLeaveModal()}>
                <Icon name="close" size={26} color={'#000'} />
              </TouchableOpacity>
            </View>
            <View style={styles.leaveDetails}>
              <View style={styles.detailsCtr}>
                <Text style={styles.leaveDetailsText}>Date:</Text>
                <Text style={styles.leaveDetailsText}>Subject:</Text>
              </View>
              <View style={styles.detailsCtr}>
                <Text style={[styles.leaveDetailsText, {fontWeight: '500'}]}>
                  {selectedLeave?.date}
                </Text>
                <Text style={[styles.leaveDetailsText, {fontWeight: '500'}]}>
                  {selectedLeave?.subject}
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.leaveDetailsText}>Leave Description:</Text>
              <Text>{selectedLeave?.desc}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ParentApplyLeave;

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
  bckBtnCtr: {
    height: 50,
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: 20,
    marginTop: 20,
    marginHorizontal: 10,
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
  leaveBtn: {
    backgroundColor: '#28A745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  tblHdCtr: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
  tblBtnCtr: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tblActionBtn: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  tblBtnTxt: {
    color: '#fff',
  },

  // Picker Container Styling
  pickerCtr: {
    height: 'auto',
    width: '100%',
    paddingVertical: 5,
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
  leaveDetails: {
    width: '90%',
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  detailsCtr: {
    width: '50%',
    height: 'auto',
    flexDirection: 'column',
    marginTop: 10,
  },
  leaveDetailsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
});
