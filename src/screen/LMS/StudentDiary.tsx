import {
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TableRow = {
  sr: string;
  class: string;
  subject: string;
  date: string;
  action: string;
};

const StudentDiary = ({navigation}: any) => {
  const {token} = useUser();
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

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

  const originalData: TableRow[] = [
    {
      sr: '1',
      class: 'Three(A)',
      subject: 'English',
      date: '07-03-2025',
      action: '',
    },
    {
      sr: '2',
      class: 'Three(A)',
      subject: 'Urdu',
      date: '07-03-2025',
      action: '',
    },
    {
      sr: '3',
      class: 'Three(A)',
      subject: 'Math',
      date: '07-03-2025',
      action: '',
    },
    {
      sr: '4',
      class: 'Three(A)',
      subject: 'Pakistan Studies',
      date: '07-03-2025',
      action: '',
    },
    {
      sr: '5',
      class: 'Three(A)',
      subject: 'Science',
      date: '07-03-2025',
      action: '',
    },
    {
      sr: '6',
      class: 'Three(A)',
      subject: 'Islamiyat',
      date: '07-03-2025',
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
  {
    /*view modal*/
  }
  const [isModalVisi, setModalVisi] = useState(false);

  const toggleModl = () => {
    setModalVisi(!isModalVisi);
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchstudentdiary',
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
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('LMS' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Daily Diary</Text>
      </View>

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
                  marginLeft: 28,
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
                  marginLeft: 28,
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
        <View>
          <FlatList
            style={styles.flatList}
            data={currentEntries}
            keyExtractor={(item, index) =>
              item.sr ? item.sr.toString() : index.toString()
            }
            ListHeaderComponent={() => (
              <View style={styles.row}>
                {['Sr#', 'Class', 'Subject', 'Date', 'Action'].map(header => (
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
                <Text style={styles.column}>{item.sr}</Text>
                <Text style={styles.column}>{item.class}</Text>
                <Text style={styles.column}>{item.subject}</Text>
                <Text style={styles.column}>{item.date}</Text>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={toggleModl}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/visible.png')}
                  />
                </TouchableOpacity>
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
                        Diary Detail
                      </Text>

                      <TouchableOpacity
                        onPress={() => setModalVisi(!isModalVisi)}>
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
                        <Text style={styles.valueText}>07-03-2025</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginRight: 50,
                        }}>
                        <Text style={styles.lblText}>Class</Text>
                        <Text style={styles.valueText}>Three</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 10,
                      }}>
                      <Text style={styles.lblText}>Subject</Text>
                      <Text style={styles.valueText}>English</Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.lblText}>Description:</Text>
                      <Text style={styles.valueText}>
                        ghfghdft nfghjfgghfghdft nfghjfgghfghdft
                      </Text>
                    </View>
                  </View>
                </Modal>
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
    </View>
  );
};

export default StudentDiary;

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
    width: 100,
    height: 30,
  },

  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#3b82f6',
    marginLeft: 30,
  },
});
