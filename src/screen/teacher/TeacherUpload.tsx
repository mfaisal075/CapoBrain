import {
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DocumentPicker, {
  DocumentPickerResponse,
} from '@react-native-documents/picker';
import Modal from 'react-native-modal';

type TableRow = {
  sr: string;
  class: string;
  section: string;
  title: string;
  date: string;
  action: string;
};

const TeacherUpload = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [Open, setOpen] = useState(false);
  const [currentValu, setCurrentValu] = useState(null);
  const [classError, setClassError] = useState('');
  const [sectionError, setSectionError] = useState('');
  const [Opn, setOpn] = useState(false);
  const [currentVal, setCurrentVal] = useState(null);
  const [isModalV, setModalV] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });

      if (Array.isArray(response)) {
        setFileResponse(response);
      } else {
        setFileResponse([response]);
      }
    } catch (err) {}
  }, []);

  const originalData: TableRow[] = [
    {
      sr: '1',
      class: 'Ten',
      section: 'A',
      title: 'Algebra',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: '2',
      class: 'Ten',
      section: 'A',
      title: 'Abc',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: '3',
      class: 'Ten',
      section: 'A',
      title: 'MMMMMM',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: '4',
      class: 'Ten',
      section: 'A',
      title: 'Text Tile 1',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: '5',
      class: 'Ten',
      section: 'A',
      title: 'o0o0o0',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '6',
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '7',
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '8',
      class: 'Ten',
      section: 'A',
      title: 'Economics',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '9',
      class: 'Ten',
      section: 'A',
      title: 'Pakistan',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '10',
      class: 'Ten',
      section: 'A',
      title: 'India',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '11',
      class: 'Ten',
      section: 'A',
      title: 'London',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '12',
      class: 'Ten',
      section: 'A',
      title: 'Title 4',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '13',
      class: 'Ten',
      section: 'A',
      title: 'Algebra',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: '14',
      class: 'Ten',
      section: 'A',
      title: 'Abc',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: '15',
      class: 'Ten',
      section: 'A',
      title: 'MMMMMM',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: '16',
      class: 'Ten',
      section: 'A',
      title: 'Text Tile 1',
      date: '29-11-2024',
      action: 'Download',
    },
    {
      sr: '17',
      class: 'Ten',
      section: 'A',
      title: 'o0o0o0',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '18',
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '19',
      class: 'Ten',
      section: 'A',
      title: 'Management',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '20',
      class: 'Ten',
      section: 'A',
      title: 'Economics',
      date: '07-12-2024',
      action: 'Download',
    },
    {
      sr: '21',
      class: 'Ten',
      section: 'A',
      title: 'Pakistan',
      date: '07-12-2024',
      action: 'Download',
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

  const tglModal = () => {
    setModalV(!isModalV);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [desc, setDesc] = useState('');
  const [descError, setDescError] = useState('');

  const [desError, setDesError] = useState('');

  const [dateError, setDateError] = useState('');

  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const validateFields = () => {
    let isValid = true;
    if (!Open) {
      setClassError('Class is required');
      isValid = false;
    } else {
      setClassError('');
    }

    if (!Opn) {
      setSectionError('Section is required');
      isValid = false;
    } else {
      setSectionError('');
    }

    return isValid;
  };

  const fav = [{label: 'Ten', value: 2}];
  const fv = [{label: 'Select Class First', value: 3}];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchteacheruploadmaterial',
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
        <Text style={styles.headerText}>Upload Material</Text>
      </View>
      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            width: 120,
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
            Upload Material
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
                {['Sr#', 'Class', 'Section', 'Title', 'Date', 'Action'].map(
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
                <Text style={styles.column}>{item.class}</Text>
                <Text style={styles.column}>{item.section}</Text>
                <Text style={styles.column}>{item.title}</Text>
                <Text style={styles.column}>{item.date}</Text>
                <TouchableOpacity>
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
                        {marginLeft: 45},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/dpd.png')}
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
                        {marginLeft: 4},
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
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 450,
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
              Upload Material
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: '#6C757D'}}>✖</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              borderColor: 'gray',
              borderWidth: 1,
              borderBottomWidth: 1,
            }}
          />

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
              marginTop: 20,
              height: 40,
              marginRight: 20,
            }}>
            <Text style={styles.label}>File Title</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 78,
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
                top: 460,
                left: 20,
              }}>
              {descError}
            </Text>
          ) : null}

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
              marginTop: 20,
              height: 40,
              marginRight: 20,
              justifyContent: 'flex-start',
            }}>
            <Text style={styles.label}>Select File</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 90,
                fontSize: 14,
                backgroundColor: 'white',
              }}>
              *
            </Text>
            {fileResponse.map((file, index) => (
              <Text
                key={index.toString()}
                style={styles.uri}
                numberOfLines={1}
                ellipsizeMode={'middle'}>
                {file.uri}
              </Text>
            ))}

            <TouchableOpacity onPress={handleDocumentSelection}>
              <View
                style={{
                  backgroundColor: '#A8A8A8',
                  borderRadius: 5,
                  height: 28,
                  marginTop: 7,
                  marginLeft: 7,
                  width: 70,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 3,
                    fontSize: 15,
                  }}>
                  Select
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {descError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 460,
                left: 20,
              }}>
              {desError}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderTopWidth: 1,
              borderBottomWidth: 1,
              width: 'auto',
              borderRightWidth: 1,
              borderLeftWidth: 1,
              borderRadius: 5,
              borderColor: 'gray',
              marginRight: 20,
              marginTop: 20,
              marginLeft: 20,
              height: 40,
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
                    marginLeft: 180,
                    marginRight: 10,
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
                top: 42,
                right: 80,
              }}>
              {dateError}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 'auto',
              borderRightWidth: 1,
              borderLeftWidth: 1,
              borderRadius: 5,
              borderColor: 'gray',
              marginLeft: 20,
              height: 32,
              borderBottomWidth: 1,
              borderTopWidth: 1,
              marginTop: 20,
              marginRight: 20,
              maxHeight: 40,
            }}>
            <Text style={[styles.label, {top: -13}]}>Class</Text>
            <Text
              style={{
                color: 'red',
                flexDirection: 'row',
                top: -9,
                left: 54,
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
                items={fav}
                open={Open}
                setOpen={() => setOpen(!Open)}
                value={currentValu}
                setValue={val => setCurrentValu(val)}
                maxHeight={200}
                placeholder="Select Class"
                style={{
                  borderWidth: 1,
                  borderColor: 'white',
                  borderRadius: 5,
                  minHeight: 10,
                }}
              />
            </View>
            {classError ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 32,
                  right: 193,
                }}>
                {classError}
              </Text>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 'auto',
              borderRightWidth: 1,
              borderLeftWidth: 1,
              borderRadius: 5,
              borderColor: 'gray',
              marginLeft: 20,
              height: 32,
              borderBottomWidth: 1,
              borderTopWidth: 1,
              marginTop: 20,
              marginRight: 20,
            }}>
            <Text style={[styles.label, {top: -13}]}>Section</Text>
            <Text
              style={{
                color: 'red',
                flexDirection: 'row',
                top: -9,
                left: 67,
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
                items={fv}
                open={Opn}
                setOpen={() => setOpn(!Opn)}
                value={currentVal}
                setValue={val => setCurrentVal(val)}
                maxHeight={200}
                placeholder="Select Class First"
                style={{
                  borderWidth: 1,
                  borderColor: 'white',
                  borderRadius: 5,
                  minHeight: 10,
                }}
              />
            </View>
          </View>
          {sectionError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 325,
                left: 27,
              }}>
              {sectionError}
            </Text>
          ) : null}

          <TouchableOpacity>
            <View
              style={{
                borderRadius: 5,
                width: 'auto',
                height: 30,
                backgroundColor: '#218838',
                alignSelf: 'center',
                marginTop: 30,
                padding: 5,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  color: 'white',
                }}>
                Upload
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Delete Modal */}
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
              tintColor: 'gray',
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
            Are you sure?
          </Text>
          <Text
            style={{
              color: 'gray',
              textAlign: 'center',
            }}>
            You won't be able to revert this record!
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
                  backgroundColor: 'red',
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
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View
                style={{
                  backgroundColor: 'green',
                  borderRadius: 5,
                  width: 'auto',
                  height: 30,
                  padding: 5,
                  marginRight: 20,
                }}>
                <Text
                  style={{
                    color: 'white',
                  }}>
                  Yes, delete it!.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TeacherUpload;

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
    width: 140,
    padding: 5,
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
  actionView: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 5,
    marginTop: 2,
    marginBottom: 2,
    marginRight: 5,
  },
  notAvailable: {
    color: 'red',
    tintColor: 'red',
    width: 'auto',
    height: 27,
    borderRadius: 5,
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
  label: {
    position: 'absolute',
    top: -10,
    left: 14,
    fontSize: 14,
    color: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 4,
  },
  uri: {
    color: 'gray',
  },
});
