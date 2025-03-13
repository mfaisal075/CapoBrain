import {
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Image} from 'react-native';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import YoutubePlayer from 'react-native-youtube-iframe';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TableRow = {
  sr: string;
  branch: string;
  class: string;
  subject: string;
  action: string;
};

const ParentLMS = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisi, setModalVisi] = useState(false);
  const [playing, setPlaying] = useState(false);

  const toggleModl = () => {
    setModalVisi(!isModalVisi);
  };

  const originalData: TableRow[] = [
    {
      sr: '1',
      branch: 'Main Branch',
      class: 'Nursery',
      subject: 'English',
      action: '',
    },
    {
      sr: '2',
      branch: 'Main Branch',
      class: 'Nursery',
      subject: 'Math',
      action: '',
    },
    {
      sr: '3',
      branch: 'Main Branch',
      class: 'Nursery',
      subject: 'Urdu',
      action: '',
    },
    {
      sr: '4',
      branch: 'Main Branch',
      class: 'Nursery',
      subject: 'Islamiyat',
      action: '',
    },
    {
      sr: '5',
      branch: 'Main Branch',
      class: 'Nursery',
      subject: 'English',
      action: '',
    },
    {
      sr: '6',
      branch: 'Main Branch',
      class: 'Nursery',
      subject: 'Math',
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

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const studentInfo = [
    {key: 'Class', value: 'Nursery'},
    {key: 'Section', value: 'A'},
    {key: 'Subject', value: 'English'},
    {key: 'Date', value: '2025-02-26'},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchstdlecture',
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
      navigation.navigate('ParentHome');
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
        <TouchableOpacity onPress={() => navigation.navigate('ParentHome')}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Lecture</Text>
      </View>

      {/**buttons row */}
      <View
        style={{
          flexDirection: 'column',
          marginLeft: 62,
          marginBottom: 20,
          alignItems: 'flex-end',
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ParentSummerHw' as never)}>
            <View
              style={{
                width: 160,
                height: 30,
                backgroundColor: '#0069D9',
                marginTop: 10,
                borderRadius: 5,
                marginRight: 6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Summer HomeWork
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ParentSummerHwResult' as never)
            }>
            <View
              style={{
                width: 200,
                height: 30,
                backgroundColor: '#0069D9',
                marginTop: 10,
                borderRadius: 5,
                marginRight: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Summer HomeWork Result
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ParentCourses' as never)}>
            <View
              style={{
                width: 70,
                height: 30,
                backgroundColor: '#0069D9',
                marginTop: 10,
                borderRadius: 5,
                marginRight: 6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Courses
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ParentLibraryBooks' as never)}>
            <View
              style={{
                width: 110,
                height: 30,
                backgroundColor: '#0069D9',
                marginTop: 10,
                borderRadius: 5,
                marginRight: 6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Library Books
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ParentDateSheet' as never)}>
            <View
              style={{
                width: 90,
                height: 30,
                backgroundColor: '#0069D9',
                marginTop: 10,
                borderRadius: 5,
                marginRight: 6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Date Sheet
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ParentDailyDiary' as never)}>
            <View
              style={{
                width: 90,
                height: 30,
                backgroundColor: '#0069D9',
                marginTop: 10,
                borderRadius: 5,
                marginRight: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Daily Diary
              </Text>
            </View>
          </TouchableOpacity>
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

      {/**table */}

      <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
        <View>
          <FlatList
            style={{
              margin: 10,
              flex: 1,
            }}
            scrollEnabled={true}
            data={currentEntries}
            keyExtractor={(item, index) => index.toString()}
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
                    {width: 100},
                    {padding: 1},
                  ]}>
                  Branch
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 100},
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
                  Subject
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 100},
                    {padding: 1},
                  ]}>
                  Action
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
                <Text style={[styles.column, {width: 100}, {padding: 5}]}>
                  {item.branch}
                </Text>
                <Text style={[styles.column, {width: 100}, {padding: 5}]}>
                  {item.class}
                </Text>
                <Text style={[styles.column, {width: 100}, {padding: 5}]}>
                  {item.subject}
                </Text>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={toggleModl}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/visible.png')}
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

      {/* Modal */}
      <Modal isVisible={isModalVisi}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 600,
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
              Show Lecture Detail
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

          <YoutubePlayer
            height={200}
            play={playing}
            videoId="ezmsrB59mj8"
            onChangeState={onStateChange}
          />
          <View style={styles.border}>
            <Text style={styles.branch}>Main Branch</Text>
            <View style={styles.details}>
              <FlatList
                data={studentInfo}
                keyExtractor={item => item.key}
                renderItem={({item}) => (
                  <View style={styles.infoRow}>
                    <Text style={styles.text}>{item.key}:</Text>
                    <Text style={styles.value}>{item.value}</Text>
                  </View>
                )}
              />
            </View>
          </View>

          <View style={styles.border}>
            <Text>Watch it</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ParentLMS;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 12,
    width: 90,
    height: 30,
    marginRight: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    marginBottom: 5,
    borderRadius: 4,
    textAlign:'center',
    color:'gray'
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
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 30,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#3b82f6',
    marginLeft: 40,
  },
  lblText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  valueText: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  branch: {
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 10,
  },
  border: {
    borderWidth: 1,
    margin: 5,
    padding: 5,
    borderColor: 'gray',
    borderRadius: 5,
  },
  text: {
    marginLeft: 15,
  },
  value: {
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d5d5d9',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 10,
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
});
