import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import {BackHandler} from 'react-native';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';

interface Dailydiary {
  id: number;
  date: string;
  bra_name: string;
  cls_name: string;
  sec_name: string;
  sub_name: string;
}

interface DailydiaryData {
  branch: {
    bra_name: string;
  };
  class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
  diary: {
    date: string;
    diary: string;
  };
  subject: {
    sub_name: string;
  };
}

export default function DailyDiary({navigation}: any) {
  const {token} = useUser();
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [startDte, setStartDte] = useState(new Date());
  const [showStartDtePicker, setShowStartDtePicker] = useState(false);
  const [formData, setFormData] = useState({
    english: '',
    urdu: '',
    math: '',
    pakistanStudies: '',
    chemistry: '',
    biology: '',
    physics: '',
    islamiyat: '',
  });
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalData, setOriginalData] = useState<Dailydiary[]>([]);
  const [tableData, setTableData] = useState<Dailydiary[]>(originalData);
  const [dailydiaryData, setDailydiaryData] = useState<DailydiaryData | null>(
    null,
  );

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

  const [currentPage, setCurrentPage] = useState(1);
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
  const [isModalVisi, setModalVisi] = useState(false);

  const toggleModl = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/showdiary?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setModalVisi(!isModalVisi);
      setDailydiaryData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  {
    /*Add Diary*/
  }
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onStartDteChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setStartDte(selectedDate);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({...formData, [field]: value});
  };

  const validateFields = () => {
    if (!selectedClass || !selectedSection) {
      Alert.alert('Error', 'Please select Class and Section');
      return false;
    }

    for (const key of Object.keys(formData) as Array<keyof typeof formData>) {
      if (!formData[key]) {
        Alert.alert('Error', `Please enter ${key}`);
        return false;
      }
    }

    return true;
  };

  const fetchData = async () => {
    if (token) {
      try {
        const res = await axios.get(
          `https://demo.capobrain.com/fetchdailydiary?from=${
            startDate.toISOString().split('T')[0]
          }&to=${endDate.toISOString().split('T')[0]}&_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(res.data.dailydiary);
        setTableData(res.data.dailydiary);
      } catch (error) {
        console.log(error);
      }
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
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Daily Diary</Text>
      </View>
      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            width: 90,
            height: 30,
            backgroundColor: '#218838',
            borderRadius: 5,
            margin: 10,
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
            Add Diary
          </Text>
        </View>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: hp('2%'),
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
            marginLeft: hp('1%'),
            height: 30,
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
                  marginLeft: 25,
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
            marginLeft: hp('1%'),
            marginRight: hp('1%'),
          }}>
          <Text style={styles.label}>To</Text>

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
              {`${endDate.toLocaleDateString()}`}
            </Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'stretch',
                  alignItems: 'center',
                  marginLeft: 25,
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
        {currentEntries.length > 0 ? (
          <View>
            <FlatList
              style={styles.flatList}
              data={currentEntries}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              ListHeaderComponent={() => (
                <View style={styles.row}>
                  {['Sr#', 'Class', 'Subject', 'Date', 'Action'].map(header => (
                    <Text
                      key={header}
                      style={[styles.column, styles.headTable]}>
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
                  <Text style={styles.column}>{index + 1}</Text>
                  <Text
                    style={
                      styles.column
                    }>{`${item.cls_name} (${item.sec_name})`}</Text>
                  <Text style={styles.column}>{item.sub_name}</Text>
                  <Text style={styles.column}>{item.date}</Text>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => toggleModl(item.id)}>
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
          <View style={{width: '100%', marginTop: 20}}>
            <Text
              style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
              No record present in the database!
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
      <Modal isVisible={isModalVisible}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6C757D',
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: '#6C757D',
              }}>
              Add Diary
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{color: '#6C757D'}}>✖</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 1,
              width: wp('85%'),
              backgroundColor: 'gray',
            }}
          />
          <Text
            style={{
              marginTop: 10,
              left: 7,
            }}>
            Class
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              dropdownIconColor="gray"
              mode="dropdown"
              selectedValue={selectedClass}
              onValueChange={itemValue => setSelectedClass(itemValue)}>
              <Picker.Item label="Please Select" value="" />
              <Picker.Item label="Ten" value="Ten" />
            </Picker>
          </View>

          <Text
            style={{
              left: 7,
            }}>
            Section
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              dropdownIconColor="gray"
              mode="dropdown"
              selectedValue={selectedSection}
              onValueChange={itemValue => setSelectedSection(itemValue)}>
              <Picker.Item label="Select Section" value="" />
              <Picker.Item label="A" value="A" />
            </Picker>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'gray',
              padding: 7,
              borderRadius: 5,
              justifyContent: 'space-between',
              height: 33,
            }}>
            <Text>Date: {startDte.toLocaleDateString()}</Text>
            <TouchableOpacity onPress={() => setShowStartDtePicker(true)}>
              <Image
                source={require('../../assets/calendar.png')}
                style={{height: 20, width: 20}}
              />
            </TouchableOpacity>
          </View>
          {showStartDtePicker && (
            <DateTimePicker
              value={startDte}
              mode="date"
              display="default"
              onChange={onStartDteChange}
            />
          )}

          {Object.keys(formData).map(subject => (
            <View key={subject} style={{marginVertical: 10}}>
              <Text>{subject.charAt(0).toUpperCase() + subject.slice(1)}</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  padding: 5,
                  borderRadius: 5,
                }}
                value={formData[subject as keyof typeof formData]}
                onChangeText={text =>
                  handleInputChange(subject as keyof typeof formData, text)
                }
                placeholder={`Enter ${subject} details`}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={() => {
              if (validateFields()) {
                Alert.alert('Success', 'Form submitted successfully!');
              }
            }}>
            <View
              style={{
                backgroundColor: '#218838',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
                marginBottom: hp('5%'),
                marginTop: hp('2%'),
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Save
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
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
            <Text style={{color: '#6C757D', fontSize: 18}}>Diary Detail</Text>

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
              <Text style={styles.lblText}>Date</Text>
              <Text style={styles.valueText}>
                {formatDate(dailydiaryData?.diary.date ?? '')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginRight: 50,
              }}>
              <Text style={styles.lblText}>Class</Text>
              <Text style={styles.valueText}>
                {dailydiaryData?.class.cls_name}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginLeft: 10,
            }}>
            <Text style={styles.lblText}>Subject</Text>
            <Text style={styles.valueText}>
              {dailydiaryData?.subject.sub_name}
            </Text>
          </View>
          <View
            style={{
              marginLeft: 10,
              marginTop: 10,
            }}>
            <Text style={styles.lblText}>Description:</Text>
            <Text style={styles.valueText}>{dailydiaryData?.diary.diary}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    top: -10,
    left: 14,
    fontSize: 10,
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
    flex: 1,
    textAlign: 'center',
  },
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
  lblText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  valueText: {
    marginRight: hp('5%'),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 20,
  },

  actionIcon: {
    width: 17,
    height: 17,
    tintColor: '#3b82f6',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
    width: wp('83%'),
    alignSelf: 'center',
    height: 30,
    justifyContent: 'center',
    marginBottom: 10,
  },
  picker: {
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 16,
    height: 50,
    paddingLeft: 10,
  },
});
