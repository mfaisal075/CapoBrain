import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Homework {
  home_user_id: number;
  home_date: string;
  home_desc: string;
  cls_name: string;
  sec_name: string;
  sub_name: string;
}

interface HomeworkData {
  homework: {
    home_desc: string;
    home_date: string;
  };
  subject: {
    sub_name: string;
  };
}

const TeacherHomework = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectError, setSubjectError] = useState('');
  const [dateError, setDateError] = useState('');
  const [descError, setDescError] = useState('');
  const [desError, setDesError] = useState('');
  const [date, setDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const [dat, setDat] = useState('');
  const [desc, setDesc] = useState('');
  const [des, setDes] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [branchError, setBranchError] = useState('');
  const [homeworkData, setHomeworkData] = useState<HomeworkData | null>(null);
  const [currentValue, setCurrentValue] = useState(null);
  const itemc = [{label: 'Ten', value: 1}];
  const [branchErrr, setBranchErrr] = useState('');
  const [isOpn, setIsOpn] = useState(false);
  const [currentValu, setCurrentValu] = useState(null);
  const itemz = [{label: 'Select Class First', value: 1}];
  const [isOpe, setIsOpe] = useState(false);
  const [currentVale, setCurrentVale] = useState(null);
  const itemo = [{label: 'Select Section First', value: 1}];

  const [originalData, setOriginalData] = useState<Homework[]>([]);
  const [tableData, setTableData] = useState<Homework[]>(originalData);

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

  const [isModalVisi, setModalVisi] = useState(false);

  const toggleModl = async (home_desc: string) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/showhomework?id=${home_desc}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setHomeworkData(res.data);
    } catch (error) {
      console.log(error);
    }
    setModalVisi(!isModalVisi);
  };

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const validateFields = () => {
    let isValid = true;
    if (!isOpn) {
      setBranchErrr('Section is required');
      isValid = false;
    } else {
      setBranchErrr('');
    }
    if (!isOpen) {
      setBranchError('Class is required');
      isValid = false;
    } else {
      setBranchError('');
    }

    if (!value) {
      setSubjectError('Subject is required');
      isValid = false;
    } else {
      setSubjectError('');
    }

    if (!dat) {
      setDateError('Date is required');
      isValid = false;
    } else {
      setDateError('');
    }

    if (!desc) {
      setDescError('Description is required');
      isValid = false;
    } else {
      setDescError('');
    }
    if (!des) {
      setDesError('Total Marks is required');
      isValid = false;
    } else {
      setDesError('');
    }

    return isValid;
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/teacherhomeworks_fetchhomework?from=${
            startDate.toISOString().split('T')[0]
          }&to=${endDate.toISOString().split('T')[0]}&_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.homework);
        setTableData(response.data.homework);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not Authenticated');
    }
  };

  useEffect(() => {
    fetchData();

    const backAction = () => {
      navigation.navigate('TeacherHome');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [startDate, endDate]);

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty or invalid dates

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
  };
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('TeacherHome')}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Home Work</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            width: 140,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderRadius: 5,
            borderColor: 'gray',
            marginLeft: 20,
          }}>
          <Text style={styles.label}>From</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 5,
              borderColor: 'gray',
            }}>
            <Text style={{marginLeft: 10}}>
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
                source={require('../../assets/calendar.png')}
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

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            width: 140,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderRadius: 5,
            borderColor: 'gray',
            marginLeft: 10,
            marginRight: 20,
            height: 40,
          }}>
          <Text style={styles.label}>To</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 5,
              borderColor: 'gray',
            }}>
            <Text style={{marginLeft: 10}}>
              {`${endDate.toLocaleDateString()}`}
            </Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'stretch',
                  alignItems: 'center',
                  marginLeft: 20,
                }}
                source={require('../../assets/calendar.png')}
              />
              {showEndDatePicker && (
                <DateTimePicker
                  testID="endDatePicker"
                  value={endDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onEndDateChange}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 5,
          marginRight: 10,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TSummerHomework' as never)}>
          <View
            style={{
              width: 150,
              height: 30,
              backgroundColor: '#218838',
              borderRadius: 5,
              marginRight: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
                marginTop: 3,
              }}>
              Summer Home Work
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleModal}>
          <View
            style={{
              width: 130,
              height: 30,
              backgroundColor: '#218838',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
                marginTop: 3,
              }}>
              Add Home Work
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

        <View style={styles.container}>
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
        {currentEntries.length > 0 ? (
          <View>
            <FlatList
              style={styles.flatList}
              data={currentEntries}
              nestedScrollEnabled
              keyExtractor={(item, index) => `${item.home_user_id}-${index}`}
              ListHeaderComponent={() => (
                <View style={styles.row}>
                  {['Sr#', 'Class', 'Section', 'Subject', 'Date', 'Action'].map(
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
                  <Text style={styles.column}>{item.cls_name}</Text>
                  <Text style={styles.column}>{item.sec_name}</Text>
                  <Text style={styles.column}>{item.sub_name}</Text>
                  <Text style={styles.column}>
                    {formatDate(item.home_date)}
                  </Text>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => toggleModl(item.home_desc)}>
                    <Image
                      style={styles.actionIcon}
                      source={require('../../assets/visible.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ) : (
          <View style={{marginTop: 20, width: '100%'}}>
            <Text
              style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
              No data found in the database
            </Text>
          </View>
        )}
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

      {/* Modal */}
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
            <Text style={{color: '#6C757D', fontSize: 18}}>Home Work</Text>

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
              margin: 10,
            }}>
            <Text style={styles.lblText}>Date</Text>
            <Text style={styles.valueText}>
              {formatDate(homeworkData?.homework.home_date ?? '')}
            </Text>
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
              margin: 10,
            }}>
            <Text style={styles.lblText}>Subject</Text>
            <Text style={styles.valueText}>
              {homeworkData?.subject.sub_name}
            </Text>
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
              margin: 10,
              flexDirection: 'row',
            }}>
            <Text style={styles.lblText}>Description:</Text>
            <Text style={styles.valueText}>
              {homeworkData?.homework.home_desc}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: 'gray',
              width: wp('90%'),
            }}
          />
        </View>
      </Modal>

      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 500,
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
            <Text style={{color: '#6C757D', fontSize: 18}}>Add Home Work</Text>

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: '#6C757D'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: 'auto',
              height: 1,
              borderColor: 'gray',
              borderWidth: 1,
              borderBottomWidth: 1,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 135,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderRadius: 5,
                borderColor: 'gray',
                marginLeft: 20,
                height: 32,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                marginRight: 5,
                marginTop: 20,
              }}>
              <Text style={[styles.label, {top: -14}]}>Class</Text>
              <Text
                style={{
                  color: 'red',
                  flexDirection: 'row',
                  top: -12,
                  left: 58,
                  fontSize: 14,
                  position: 'absolute',
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
                <DropDownPicker
                  items={itemc}
                  open={isOpen}
                  setOpen={() => setIsOpen(!isOpen)}
                  value={currentValue}
                  setValue={val => setCurrentValue(val)}
                  maxHeight={200}
                  placeholder="Select Class"
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 5,
                    minHeight: 5,
                  }}
                />
              </View>
            </View>
            {branchError ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 53,
                  left: 26,
                }}>
                {branchError}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 145,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderRadius: 5,
                borderColor: 'gray',
                marginLeft: 5,
                height: 32,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                marginRight: 10,
                marginTop: 20,
              }}>
              <Text style={[styles.label, {top: -14}]}>Section</Text>
              <Text
                style={{
                  color: 'red',
                  flexDirection: 'row',
                  top: -12,
                  left: 68,
                  fontSize: 14,
                  position: 'absolute',
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
                <DropDownPicker
                  items={itemz}
                  open={isOpn}
                  setOpen={() => setIsOpn(!isOpn)}
                  value={currentValu}
                  setValue={val => setCurrentValu(val)}
                  maxHeight={200}
                  placeholder="Select Section"
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 5,
                    minHeight: 5,
                  }}
                />
              </View>
            </View>
            {branchErrr ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 53,
                  left: 170,
                }}>
                {branchErrr}
              </Text>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 40,
              justifyContent: 'space-between',
            }}>
            {/* Subject */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 145,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderRadius: 5,
                borderColor: 'gray',
                marginLeft: 20,
                height: 32,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                marginRight: 5,
                marginTop: 3,
              }}>
              <Text style={[styles.label, {top: -16}]}>Assigned Subject</Text>
              <Text
                style={{
                  color: 'red',
                  flexDirection: 'row',
                  top: -12,
                  left: 130,
                  fontSize: 14,
                  position: 'absolute',
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
                <DropDownPicker
                  items={itemo}
                  open={isOpe}
                  setOpen={() => setIsOpe(!isOpe)}
                  value={currentVale}
                  setValue={val => setCurrentVale(val)}
                  maxHeight={200}
                  placeholder="Select Subject"
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 5,
                    minHeight: 5,
                  }}
                />
              </View>
            </View>

            {subjectError ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 35,
                  left: 25,
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
                marginLeft: 2,
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
                      marginLeft: 30,
                    }}
                    source={require('../../assets/calendar.png')}
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
                  top: 35,
                  right: 65,
                }}>
                {dateError}
              </Text>
            ) : null}
          </View>
          {/* Description */}
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
              marginTop: 30,
              height: 100,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Description</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 92,
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
              />
            </View>
          </View>
          {descError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 325,
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
                marginTop: 30,
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
    </View>
  );
};

export default TeacherHomework;

const styles = StyleSheet.create({
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
    textAlign: 'center',
    color: 'gray',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d5d5d9',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: 140,
    padding: 1,
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
  container: {
    backgroundColor: '#fff',
    marginTop: 12,
    width: 90,
    height: 30,
    marginRight: 10,
  },
  lblText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  valueText: {
    marginRight: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 20,
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
    marginLeft: 90,
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
});
