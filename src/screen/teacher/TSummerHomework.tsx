import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  BackHandler,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

type TableRow = {
  sr: string;
  branch: string;
  class: string;
  section: string;
  subject: string;
  action: string;
};

const TSummerHomework = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [des, setDes] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [branchError, setBranchError] = useState('');
  const [currentValue, setCurrentValue] = useState(null);
  const itemc = [{label: 'Ten', value: 1}];
  const [branchErrr, setBranchErrr] = useState('');
  const [isOpn, setIsOpn] = useState(false);
  const [currentValu, setCurrentValu] = useState(null);
  const itemz = [{label: 'Select Class First', value: 1}];
  const [isOpe, setIsOpe] = useState(false);
  const [currentVale, setCurrentVale] = useState(null);
  const itemo = [{label: 'Select Section First', value: 1}];
  const [isModalVisi, setModalVisi] = useState(false);

  const originalData: TableRow[] = [
    {
      sr: '1',
      branch: 'Main Branch',
      class: 'Ten',
      section: 'A',
      subject: 'Biology',
      action: '',
    },
    {
      sr: '2',
      branch: 'Main Branch',
      class: 'Ten',
      section: 'A',
      subject: 'Chemistry',
      action: '',
    },
    {
      sr: '3',
      branch: 'Main Branch',
      class: 'Ten',
      section: 'A',
      subject: 'Physics',
      action: '',
    },
    {
      sr: '4',
      branch: 'Main Branch',
      class: 'Ten',
      section: 'A',
      subject: 'Pakistan Studies',
      action: '',
    },
    {
      sr: '5',
      branch: 'Main Branch',
      class: 'Ten',
      section: 'A',
      subject: 'English',
      action: '',
    },
    {
      sr: '6',
      branch: 'Main Branch',
      class: 'Ten',
      section: 'A',
      subject: 'Urdu',
      action: '',
    },
    {
      sr: '7',
      branch: 'Main Branch',
      class: 'Ten',
      section: 'A',
      subject: 'Math',
      action: '',
    },
    {
      sr: '8',
      branch: 'Main Branch',
      class: 'Ten',
      section: 'A',
      subject: 'Islamiyat',
      action: '',
    },
    {
      sr: '9',
      branch: 'Main Branch',
      class: 'Ten',
      section: 'A',
      subject: 'Computer',
      action: '',
    },
    {
      sr: '10',
      branch: 'Main Branch',
      class: 'Ten',
      section: 'A',
      subject: 'Economics',
      action: '',
    },
  ];

  const [tableData, setTableData] = useState<TableRow[]>(originalData);

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

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const [subjectError, setSubjectError] = useState('');
  const [dateError, setDateError] = useState('');
  const [descError, setDescError] = useState('');
  const [desError, setDesError] = useState('');

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

    if (!date) {
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

  const toggleModl = () => {
    setModalVisi(!isModalVisi);
  };

  const [isModalV, setModalV] = useState(false);
  const tglModal = () => {
    setModalV(!isModalV);
  };
  const [isMdlVsble, setMdlVsble] = useState(false);
  const toggleMdl = () => {
    setMdlVsble(!isMdlVsble);
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/fetchhomework?_token=${token}`,
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

  useEffect(() => {
    fetchData();
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
        <Text style={styles.headerText}>Summer Homework List</Text>
      </View>
      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            width: 190,
            height: 30,
            backgroundColor: '#218838',
            borderRadius: 5,
            alignSelf: 'flex-end',
            margin: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 15,
              textAlign: 'center',
              marginTop: 3,
            }}>
            Add Summer Home Work
          </Text>
        </View>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
        <View>
          <FlatList
            style={styles.flatList}
            data={currentEntries}
            keyExtractor={(item, index) =>
              item.sr ? item.sr.toString() : index.toString()
            }
            ListHeaderComponent={() => (
              <View style={styles.row}>
                {['Sr#', 'Branch', 'Class', 'Section', 'Subject', 'Action'].map(
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
                <Text style={styles.column}>{item.sr}</Text>
                <Text style={styles.column}>{item.branch}</Text>
                <Text style={styles.column}>{item.class}</Text>
                <Text style={styles.column}>{item.section}</Text>
                <Text style={styles.column}>{item.subject}</Text>
                <TouchableOpacity
                  style={[
                    styles.iconContainer,
                    styles.actionIcon,
                    {marginTop: 8, marginRight: 5, marginLeft: 5},
                  ]}
                  onPress={toggleModl}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/visible.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleMdl}>
                  <View
                    style={[
                      item.action === 'Not Available'
                        ? styles.notAvailable
                        : styles.available,
                      styles.actionView,
                    ]}>
                    <Image
                      style={[
                        item.action === 'Not Available'
                          ? styles.notAvailable
                          : styles.available,
                        {width: 13},
                        {height: 13},
                        {marginTop: 4},
                        {marginLeft: 40},
                      ]}
                      source={require('../../assets/pencil.png')}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={tglModal}>
                  <View style={[styles.availble, styles.actionView]}>
                    <Image
                      style={[
                        styles.availble,
                        {width: 13},
                        {height: 13},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/dlt.png')}
                    />
                  </View>
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
            <Text style={{color: '#6C757D', fontSize: 18}}>
              Summer Home Work
            </Text>

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
            }}>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
              }}>
              <Text style={styles.lblText}>Class</Text>
              <Text style={styles.valueText}>Ten</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                marginRight: 40,
              }}>
              <Text style={styles.lblText}>Section</Text>
              <Text style={styles.valueText}>A</Text>
            </View>
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
            }}>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
              }}>
              <Text style={styles.lblText}>Subject</Text>
              <Text style={styles.valueText}>Biology</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
              }}>
              <Text style={styles.lblText}>Total Marks</Text>
              <Text style={styles.valueText}>60</Text>
            </View>
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
            }}>
            <Text style={styles.lblText}>Description:</Text>
            <Text style={styles.valueText}>
              write Ch # 1, 2 long questions and short questions.
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

      <Modal isVisible={isModalV}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 250,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6C757D',
          }}>
          <Image
            style={{
              width: 60,
              height: 60,
              tintColor: 'red',
              alignSelf: 'center',
              marginTop: 30,
            }}
            source={require('../../assets/info.png')}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 22,
              textAlign: 'center',
              marginTop: 20,
            }}>
            Warning{' '}
          </Text>
          <Text
            style={{
              color: 'gray',
              textAlign: 'center',
            }}>
            You may have not permission to delete this record!
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={() => setModalV(!isModalV)}>
              <View
                style={{
                  backgroundColor: '#78CBF2',
                  borderRadius: 5,
                  width: 'auto',
                  height: 30,
                  padding: 5,
                  marginRight: 10,
                }}>
                <Text
                  style={{
                    color: 'white',
                  }}>
                  OK
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={isMdlVsble}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 250,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6C757D',
          }}>
          <Image
            style={{
              width: 60,
              height: 60,
              tintColor: 'red',
              alignSelf: 'center',
              marginTop: 30,
            }}
            source={require('../../assets/info.png')}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 22,
              textAlign: 'center',
              marginTop: 20,
            }}>
            Warning{' '}
          </Text>
          <Text
            style={{
              color: 'gray',
              textAlign: 'center',
            }}>
            You may have not permission to edit this record!
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={() => setMdlVsble(!isMdlVsble)}>
              <View
                style={{
                  backgroundColor: '#78CBF2',
                  borderRadius: 5,
                  width: 'auto',
                  height: 30,
                  padding: 5,
                  marginRight: 10,
                }}>
                <Text
                  style={{
                    color: 'white',
                  }}>
                  OK
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Summer Homework Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 570,
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
            <Text style={{color: '#6C757D', fontSize: 18}}>
              Add Summer Home Work
            </Text>

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
                marginLeft: 10,
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
                  left: 15,
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
                marginLeft: 10,
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
                  left: 165,
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
                marginLeft: 10,
                height: 32,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                marginRight: 5,
                marginTop: 3,
              }}>
              <Text style={[styles.label, {top: -16}]}>Subject</Text>
              <Text
                style={{
                  color: 'red',
                  flexDirection: 'row',
                  top: -12,
                  left: 65,
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
                  left: 15,
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
              marginLeft: 10,
              marginTop: 30,
              height: 30,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Total Marks</Text>
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
                value={des}
                onChangeText={setDes}
              />
            </View>
          </View>
          {desError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 255,
                left: 15,
              }}>
              {desError}
            </Text>
          ) : null}

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
              marginLeft: 10,
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
                top: 385,
                left: 15,
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
                marginTop: 40,
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

export default TSummerHomework;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 12,
    width: 90,
    height: 30,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    borderRadius: 4,
    textAlign:'center',
    color:'gray'
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
    width: 150,
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
  label: {
    position: 'absolute',
    top: -10,
    left: 14,
    fontSize: 14,
    color: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 4,
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
    width: 60,
    height: 20,
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
    marginLeft: 80,
    marginTop:-12  
  },
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -6,
    marginRight: 5,
    marginLeft: 5,
  },

  available: {
    color: 'green',
    tintColor: 'green',
    width: 'auto',
    height: 27,
    borderRadius: 5,
  },
  availble: {
    color: 'red',
    tintColor: 'red',
    width: 'auto',
    height: 27,
    borderRadius: 5,
  },
  notAvailable: {
    color: 'red',
    tintColor: 'red',
    width: 'auto',
    height: 27,
    borderRadius: 5,
  },
});
