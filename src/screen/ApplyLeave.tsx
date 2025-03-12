import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';

interface LeaveData {
  id: number;
  subject: string;
  leave_date: string;
  status: string;
}
interface LeaveDetails {
  subject: string;
  leave_date: string;
  leave_desc: string;
}

const ApplyLeave = ({navigation}: any) => {
  const {token} = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [subjectError, setSubjectError] = useState('');
  const [dateError, setDateError] = useState('');
  const [descError, setDescError] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisi, setModalVisi] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState<LeaveDetails | null>(null);

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const validateFields = () => {
    let isValid = true;

    if (!value) {
      setSubjectError('Subject is required');
      isValid = false;
    } else {
      setSubjectError('');
    }

    if (!date) {
      setDateError('Date is required');
      isValid = false;
    } else {
      setDateError('');
    }

    if (!desc) {
      setDescError('Leave Description is required');
      isValid = false;
    } else {
      setDescError('');
    }

    return isValid;
  };

  const originalData: LeaveData[] = [];
  const [tableData, setTableData] = useState<LeaveData[]>(originalData);

  const items = [
    {label: '10', value: 10},
    {label: '25', value: 25},
    {label: '50', value: 50},
    {label: '100', value: 100},
  ];

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setTableData(originalData);
    } else {
      const filtered = originalData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(text.toLowerCase()),
        ),
      );
      setTableData(filtered);
    }
  };

  const totalPages = Math.ceil(tableData.length / entriesPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentEntries = tableData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );
  {
    /*view modal*/
  }

  const toggleModl = () => {
    setModalVisi(!isModalVisi);
  };

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

        setTableData(response.data.leave);
      } catch (error) {
        console.error('Error fetching data', error);
        throw error; // Ensure the error is thrown so useQuery can handle it
      }
    } else {
      console.log('User is not authenticated');
      throw new Error('User is not authenticated');
    }
  };

  useEffect(() => {
    //Fetch Data
    fetchData();
    const backAction = () => {
      navigation.navigate('Home');
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
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Apply Leave</Text>
      </View>

      <>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={toggleModal}>
            <View
              style={{
                width: 90,
                height: 30,
                backgroundColor: '#218838',
                borderRadius: 5,
                marginRight: 10,
                alignSelf: 'flex-end',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 15,
                  textAlign: 'center',
                  marginTop: 3,
                }}>
                Add Leave
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View style={{width: 80, marginTop: 9}}>
            <DropDownPicker
              items={items}
              open={isOpen}
              setOpen={setIsOpen}
              value={entriesPerPage}
              setValue={callback => {
                setEntriesPerPage(prev =>
                  typeof callback === 'function' ? callback(prev) : callback,
                );
              }}
              maxHeight={200}
              placeholder=""
              style={styles.dropdown}
            />
          </View>

          <View style={styles.searchcontainer}>
            <TextInput
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor={'gray'}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {/* Table */}
        <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
          <View>
            <FlatList
              style={styles.flatList}
              data={currentEntries}
              nestedScrollEnabled
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              ListHeaderComponent={() => (
                <View style={styles.row}>
                  {['Sr#', 'Subject', 'Date', 'Status', 'Action'].map(
                    header => (
                      <Text
                        key={header}
                        style={[styles.column, styles.headTable]}>
                        {header}
                      </Text>
                    ),
                  )}
                </View>
              )}
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles.row,
                    {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                  ]}>
                  <Text style={styles.column}>{index + 1}</Text>
                  <Text style={styles.column}>{item.subject}</Text>
                  <Text style={styles.column}>{item.leave_date}</Text>
                  <View style={styles.iconContainer}>
                    <Image
                      style={styles.statusIcon}
                      source={
                        item.status === 'Pending'
                          ? require('../assets/pending.png')
                          : item.status === 'Approved'
                          ? require('../assets/approved.png')
                          : require('../assets/rejected.png')
                      }
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => {
                      const handleShowLeave = async (id: number) => {
                        try {
                          const response = await axios.get(
                            `https://demo.capobrain.com/showleave?id=${item.id}&_token=${token}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );
                          setLeaveDetails(response.data);
                          setModalVisi(true);
                        } catch (error) {
                          console.log(error);
                          throw error;
                        }
                      };

                      handleShowLeave(item.id);
                    }}>
                    <Image
                      style={styles.actionIcon}
                      source={require('../assets/visible.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </ScrollView>

        <View style={styles.pagination}>
          <Text>
            Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
            {Math.min(currentPage * entriesPerPage, tableData.length)} of{' '}
            {tableData.length} entries
          </Text>
          <View style={styles.paginationButtons}>
            <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)}>
              <Text style={styles.paginationText}>Previous</Text>
            </TouchableOpacity>
            <View style={styles.pageNumber}>
              <Text style={styles.pageText}>{currentPage}</Text>
            </View>
            <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)}>
              <Text style={styles.paginationText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>

      {/* Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 550,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6C757D',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            <Text style={{color: '#6C757D', fontSize: 18}}>Add Leave</Text>

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: '#6C757D'}}>✖</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: 'gray',
              width: wp('90%'),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp('2%'),
              justifyContent: 'space-between',
            }}>
            {/* Subject */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                width: 135,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderRadius: 5,
                borderColor: 'gray',
                marginLeft: 20,
                marginRight: 5,
              }}>
              <Text style={styles.label}>Subject</Text>
              <Text
                style={{
                  color: 'red',
                  position: 'absolute',
                  top: -9,
                  left: 69,
                  fontSize: 14,
                  backgroundColor: 'white',
                }}>
                *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 5,
                  borderColor: 'gray',
                }}>
                <TextInput
                  style={{
                    color: 'black',
                    width: 95,
                  }}
                  value={value}
                  onChangeText={setValue}
                  placeholder="Enter"
                  placeholderTextColor={'gray'}
                />
              </View>
            </View>
            {subjectError ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 42,
                  left: 20,
                }}>
                {subjectError}
              </Text>
            ) : null}

            {/* Date */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                width: 135,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderRadius: 5,
                borderColor: 'gray',
                marginRight: 20,
              }}>
              <Text style={styles.label}>Date</Text>
              <Text
                style={{
                  color: 'red',
                  position: 'absolute',
                  top: -8,
                  left: 50,
                  fontSize: 14,
                  backgroundColor: 'white',
                }}>
                *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 5,
                  borderColor: 'gray',
                }}>
                <Text
                  style={{
                    marginLeft: 10,
                  }}>
                  {`${startDate.toLocaleDateString()}`}
                </Text>

                <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'stretch',
                      alignItems: 'center',
                      marginLeft: 20,
                    }}
                    source={require('../assets/calendar.png')}
                  />
                  {showStartDatePicker && (
                    <DateTimePicker
                      testID="startDatePicker"
                      value={startDate}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={onStartDateChange}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {dateError ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 42,
                  right: 68,
                }}>
                {dateError}
              </Text>
            ) : null}
          </View>

          {/* Leave Description */}
          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderBottomWidth: 1,
              width: 'auto',
              borderRightWidth: 1,
              borderLeftWidth: 1,
              borderRadius: 5,
              borderColor: 'gray',
              marginLeft: 20,
              marginTop: hp('5%'),
              height: 300,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Leave Description</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 134,
                fontSize: 14,
                backgroundColor: 'white',
              }}>
              *
            </Text>
            <View
              style={{
                borderRadius: 5,
                borderColor: 'gray',
              }}>
              <TextInput
                style={{
                  color: 'black',
                }}
                value={desc}
                onChangeText={setDesc}
                placeholder="Leave"
                placeholderTextColor={'gray'}
              />
            </View>
          </View>
          {descError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 457,
                left: 20,
              }}>
              {descError}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              if (validateFields()) {
                console.log('Form is valid');
              } else {
                console.log('Form is invalid');
              }
            }}>
            <View
              style={{
                backgroundColor: '#218838',
                borderRadius: 5,
                width: 50,
                height: 30,
                alignSelf: 'center',
                marginTop: hp('5%'),
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                Save
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* View Modal */}
      <Modal isVisible={isModalVisi}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 300,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6C757D',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            <Text style={{color: '#6C757D', fontSize: 18}}>Leave Detail</Text>

            <TouchableOpacity onPress={() => setModalVisi(!isModalVisi)}>
              <Text style={{color: '#6C757D'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: 'gray',
              width: wp('90%'),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={styles.lblText}>Subject</Text>
              <Text style={styles.valueText}>{leaveDetails?.subject}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginRight: 50,
              }}>
              <Text style={styles.lblText}>Date</Text>
              <Text style={styles.valueText}>{leaveDetails?.leave_date}</Text>
            </View>
          </View>

          <View
            style={{
              marginLeft: 10,
              marginTop: 10,
            }}>
            <Text style={styles.lblText}>Leave Description:</Text>
            <Text style={styles.valueText}>{leaveDetails?.leave_desc}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ApplyLeave;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 14,
    fontSize: 14,
    color: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 4,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    borderRadius: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d5d5d9',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 10,
  },
  searchcontainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    width: 90,
    height: 30,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: 100,
    padding: 5,
    textAlign: 'center',
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  paginationButtons: {
    flexDirection: 'row',
  },
  paginationText: {
    fontWeight: 'bold',
  },
  pageNumber: {
    width: 22,
    height: 22,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  pageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flatList: {
    margin: 10,
    flex: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 20,
    marginRight: 50,
  },
  statusIcon: {
    width: 17,
    height: 17,
    top: 5,
    marginLeft: 50,
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
    top: 5,
    marginLeft: 50,
  },
  lblText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  valueText: {
    marginRight: 10,
  },
});
