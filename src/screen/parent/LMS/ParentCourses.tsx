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
import {useUser} from '../../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import YoutubePlayer from 'react-native-youtube-iframe';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TableRow = {
  sr: string;
  title: string;
  class: string;
  section: string;
  price: string;
  action: string;
};

const ParentCourses = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisi, setModalVisi] = useState(false);
  const [playing, setPlaying] = useState(false);

  const originalData: TableRow[] = [
    {
      sr: '1',
      title: 'English',
      class: 'One',
      section: 'A',
      price: '0',
      action: 'View',
    },
    {
      sr: '2',
      title: 'English',
      class: 'One',
      section: 'A',
      price: '0',
      action: 'View',
    },
    {
      sr: '3',
      title: 'English',
      class: 'One',
      section: 'A',
      price: '0',
      action: 'View',
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

  const toggleModl = () => {
    setModalVisi(!isModalVisi);
  };

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const studentInfo = [
    {key: 'Class', value: 'One (A)'},
    {key: 'Rs.', value: '0'},
    {key: 'Created By', value: 'Tahira Khanam'},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchstdcourse',
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
      throw new Error('User is not authencated');
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
        <TouchableOpacity
          onPress={() => navigation.navigate('ParentLMS' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Courses List</Text>
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
                {['Sr#', 'Title', 'Class', 'Section', 'Price', 'Action'].map(
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
                <Text style={styles.column}>{item.title}</Text>
                <Text style={styles.column}>{item.class}</Text>
                <Text style={styles.column}>{item.section}</Text>
                <Text style={styles.column}>{item.price}</Text>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={toggleModl}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../../assets/visible.png')}
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
            <Image
              style={{
                width: 60,
                height: 60,
                alignSelf: 'center',
                margin: 10,
              }}
              source={require('../../../assets/avatar.png')}
            />
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
            <Text>English</Text>
            <Text>Knowledge of English</Text>
          </View>
          <View style={styles.border}>
            <Text>-----</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ParentCourses;

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
    width: 100,
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
});
