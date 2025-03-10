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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {TextInput} from 'react-native';
import {FlatList} from 'react-native';
import Modal from 'react-native-modal';

const srNumber: number = 5;
const row = {
  sr: srNumber.toString(),
};

type TableRow = {
  sr: string | number;
  branch: string;
  registration: string;
  student: string;
  father: string;
  Bform: string;
  class: string;
  action: string;
};

const srNumbr: number = 5;
const rw = {
  sr: srNumbr.toString(),
};

type TableCol = {
  sr: string | number;
  subject: string;
  examtype: string;
  totalmarks: string;
  obtainmarks: string;
  percentange: string;
  grade: string;
};

const ParentResult = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOpn, setIsOpn] = useState(false);
  const [currentValu, setCurrentValu] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const originalData: TableRow[] = [
    {
      sr: 1,
      branch: 'Main Branch',
      registration: 'FR#017',
      student: 'Ahmad Raza',
      father: 'Iftikhar',
      Bform: '84848-4884894-4',
      class: 'Two',
      action: 'Result Card',
    },
    {
      sr: 2,
      branch: 'Main Branch',
      registration: 'FR#019',
      student: 'Muhamad Raza',
      father: 'Iftikhar',
      Bform: '75858-8588885-8',
      class: 'Two',
      action: 'Result Card',
    },
    {
      sr: 3,
      branch: 'Main Branch',
      registration: 'FR#0254',
      student: 'saba',
      father: 'Iftikhar',
      Bform: '00000-9009090-0',
      class: 'Eight',
      action: 'Result Card',
    },
  ];
  const [tableData, setTableData] = useState<TableRow[]>(originalData);

  const [PRData, setRPData] = useState<TableCol[]>([
    {
      sr: 1,
      subject: 'English',
      examtype: 'Mid',
      totalmarks: '100',
      obtainmarks: '80',
      percentange: '80%',
      grade: 'B-',
    },
    {
      sr: 2,
      subject: 'Urdu',
      examtype: 'Mid',
      totalmarks: '100',
      obtainmarks: '70',
      percentange: '70%',
      grade: 'C-',
    },
    {
      sr: 3,
      subject: 'English',
      examtype: 'Final',
      totalmarks: '100',
      obtainmarks: '20',
      percentange: '20%',
      grade: 'F',
    },
    {
      sr: 4,
      subject: 'English',
      examtype: 'Grand Test',
      totalmarks: '75',
      obtainmarks: '67',
      percentange: '89%',
      grade: 'B+',
    },
    {
      sr: 5,
      subject: 'Urdu',
      examtype: 'Grand Test',
      totalmarks: '75',
      obtainmarks: '20',
      percentange: '27%',
      grade: 'F',
    },
    {
      sr: 6,
      subject: 'Math',
      examtype: 'Grand Test',
      totalmarks: '35',
      obtainmarks: '30',
      percentange: '86%',
      grade: 'B',
    },
    {
      sr: 7,
      subject: 'Urdu',
      examtype: 'Final',
      totalmarks: '100',
      obtainmarks: '20',
      percentange: '20%',
      grade: 'F',
    },
    {
      sr: 8,
      subject: 'Math',
      examtype: 'Final',
      totalmarks: '80',
      obtainmarks: '30',
      percentange: '38%',
      grade: 'F',
    },
    {
      sr: 'Total',
      subject: '',
      examtype: '',
      totalmarks: '665',
      obtainmarks: '337',
      percentange: '50%',
      grade: 'F',
    },
  ]);

  const itemz = [
    {label: 'Mids', value: 1},
    {label: 'Annual', value: 2},
    {label: 'Mid', value: 3},
    {label: 'Final', value: 4},
    {label: 'MID TERM', value: 5},
    {label: 'ANNUAL TERM', value: 6},
    {label: 'MOCK TEST', value: 7},
    {label: 'Grand Test', value: 8},
    {label: 'December Test', value: 9},
    {label: 'Phase Test', value: 10},
  ];

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
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const currentEntries = tableData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );
  const studentInfo = [
    {key: 'Student Name', value: 'Hanzala Ahmad'},
    {key: 'Father Name', value: 'Aftab Ahmad'},
    {key: 'Class', value: 'Three'},
    {key: 'Section', value: 'A'},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchparentresult',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        return response.data.output;
      } catch (error) {
        console.error(error);
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
        <Text style={styles.headerText}>Results</Text>
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

      <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
        <View>
          <FlatList
            style={{
              margin: 10,
              flex: 1,
            }}
            data={currentEntries}
            keyExtractor={(item, index) =>
              item.sr ? item.sr.toString() : index.toString()
            }
            ListHeaderComponent={() => (
              <View style={styles.row}>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 100},
                    {padding: 1},
                  ]}>
                  Sr#
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Branch
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Registration#
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 200},
                    {padding: 1},
                  ]}>
                  Student
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Father
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 200},
                    {padding: 1},
                  ]}>
                  B-Form
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Class
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 100},
                    {padding: 1},
                  ]}>
                  Actions
                </Text>
              </View>
            )}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.row,
                  {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                ]}>
                <Text style={[styles.column, {width: 100}, {padding: 5}]}>
                  {item.sr}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.branch}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.registration}
                </Text>
                <Text style={[styles.column, {width: 200}, {padding: 5}]}>
                  {item.student}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.father}
                </Text>
                <Text style={[styles.column, {width: 200}, {padding: 5}]}>
                  {item.Bform}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.class}
                </Text>

                <TouchableOpacity
                  onPress={
                    item.action === 'Result Card'
                      ? toggleModal
                      : (null as unknown as undefined)
                  }
                  disabled={item.action === 'Not Available'}>
                  <View
                    style={[
                      item.action === 'Not Available'
                        ? styles.notAvailable
                        : styles.available,
                    ]}>
                    <Image
                      style={[
                        item.action === 'Not Available'
                          ? styles.notAvailable
                          : styles.available,
                        {width: 15},
                        {height: 15},
                        {marginLeft: 40},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/id.png')}
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
          Showing {(currentPage - 1) * entriesPerPage + 1} to
          {Math.min(currentPage * entriesPerPage, tableData.length)} of
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

      {/* View Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 'auto',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6C757D',
          }}>
          <ScrollView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text style={{color: '#6C757D', fontSize: 18}}>Result Card</Text>

              <TouchableOpacity
                onPress={() => setModalVisible(!isModalVisible)}>
                <Text style={{color: '#6C757D'}}>✖</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'column',
                borderWidth: 1,
                borderColor: '#6C757D',
              }}
            />

            <View
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#6C757D',
                height: 670,
                width: 'auto',
                margin: 10,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: 10,
                  marginLeft: 20,
                  marginRight: 20,
                }}>
                <Text style={{fontSize: 18}}>
                  Gujranwala City Grammar School
                </Text>
                <Text style={{fontSize: 16, marginLeft: 60}}>Main Branch</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <View style={{flexDirection: 'column', marginTop: 10}}>
                  <View style={{width: 200, marginTop: 9}}>
                    <DropDownPicker
                      items={itemz}
                      open={isOpn}
                      setOpen={setIsOpn}
                      value={currentValu}
                      setValue={setCurrentValu}
                      maxHeight={200}
                      placeholder="Select Exam Type Filter"
                      style={{
                        borderWidth: 1,
                        borderColor: '#d5d5d9',
                        borderRadius: 5,
                        minHeight: 30,
                        marginLeft: 20,
                      }}
                    />
                  </View>
                  {/**std info */}
                  <FlatList
                    data={studentInfo}
                    keyExtractor={item => item.key}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                      <View style={styles.infoRow}>
                        <Text style={styles.txt}>{item.key}:</Text>
                        <Text style={styles.value}>{item.value}</Text>
                      </View>
                    )}
                  />
                </View>

                <Image
                  style={{
                    width: 60,
                    height: 60,
                    alignSelf: 'center',
                    marginRight: 20,
                    marginTop: 60,
                  }}
                  source={require('../../assets/avatar.png')}
                />
              </View>
              <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
                <View>
                  <FlatList
                    style={{
                      margin: 10,
                      flex: 1,
                    }}
                    data={PRData}
                    keyExtractor={(item, index) =>
                      item.sr ? String(item.sr) : String(index)
                    }
                    ListHeaderComponent={() => (
                      <View style={styles.row}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 100},
                            {padding: 1},
                          ]}>
                          Sr#
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Subject
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Exam Type
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 200},
                            {padding: 1},
                          ]}>
                          Total Marks
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Obtain Marks
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 200},
                            {padding: 1},
                          ]}>
                          Percentange
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Grade
                        </Text>
                      </View>
                    )}
                    renderItem={({item}) => (
                      <View style={styles.row}>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 100},
                            {padding: 5},
                          ]}>
                          {item.sr}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 150},
                            {padding: 5},
                          ]}>
                          {item.subject}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 150},
                            {padding: 5},
                          ]}>
                          {item.examtype}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 200},
                            {padding: 5},
                          ]}>
                          {item.totalmarks}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 150},
                            {padding: 5},
                          ]}>
                          {item.obtainmarks}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 200},
                            {padding: 5},
                          ]}>
                          {item.percentange}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 150},
                            {padding: 5},
                          ]}>
                          {item.grade}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </ScrollView>
              <>
                <Text
                  style={{
                    marginTop: 6,
                    marginLeft: 10,
                    fontSize: 16,
                  }}>
                  Teacher Review for Student:
                </Text>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 14,
                    marginBottom: 20,
                  }}>
                  It's important to focus more on studies, seek help if you're
                  struggling.
                </Text>
              </>
            </View>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#218838',
                  borderRadius: 5,
                  borderWidth: 1,
                  width: 60,
                  height: 30,
                  alignSelf: 'center',
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                <Icon
                  name="printer"
                  size={18}
                  color={'#fff'}
                  style={{marginTop: 5, marginRight: 4}}
                />
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    marginTop: 5,
                  }}>
                  Print
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ParentResult;

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
    marginBottom: 5,
    borderRadius: 4,
  },
  item: {
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: '33.33%',
    textAlign: 'center',
  },
  withBorder: {
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
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
    width: 27,
    height: 27,
    borderRadius: 5,
  },
  head: {
    backgroundColor: '#008604',
    height: 25,
  },
  text: {
    fontWeight: 'bold',
    marginLeft: 15,
    padding: 5,
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#d5d5d9',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  txt: {
    fontWeight: 'bold',
    marginLeft: 15,
  },
  value: {
    marginLeft: 10,
  },
});
