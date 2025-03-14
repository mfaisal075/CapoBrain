import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useUser} from '../../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type TableRow = {
  sr: string;
  branch: string;
  class: string;
  action: string;
};

type TableModal = {
  sr: string | number;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
};

const ParentDateSheet = ({navigation}: any) => {
  const {token} = useUser();

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchdatesheet',
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
      navigation.navigate('ParentLMS');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const originalData: TableRow[] = [
    {sr: '1', branch: 'Main Branch', class: 'Three (A)', action: ''},
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

  const toggleModl = () => {
    setModalVisi(!isModalVisi);
  };

  const Info = [
    {key: 'Class', value: 'Three'},
    {key: 'Section', value: 'A'},
  ];

  const originalDta: TableModal[] = [
    {
      sr: '1',
      subject: 'English',
      date: '14-03-2025',
      startTime: '12:44',
      endTime: '13:44',
    },
    {
      sr: '2',
      subject: 'Urdu',
      date: '15-03-2025',
      startTime: '12:44',
      endTime: '14:44',
    },
    {
      sr: '3',
      subject: 'Math',
      date: '16-03-2025',
      startTime: '12:44',
      endTime: '15:44',
    },
    {
      sr: '4',
      subject: 'Pakistan Studies',
      date: '17-03-2025',
      startTime: '12:44',
      endTime: '16:44',
    },
    {
      sr: '5',
      subject: 'Science',
      date: '18-03-2025',
      startTime: '12:44',
      endTime: '17:44',
    },
    {
      sr: '6',
      subject: 'Islamiyat',
      date: '19-03-2025',
      startTime: '12:44',
      endTime: '13:44',
    },
  ];

  const [ModalData, setModalData] = useState<TableModal[]>(originalDta);

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
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
        <Text style={styles.headerText}>DateSheet</Text>
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
                {['Sr#', 'Branch', 'Class', 'Action'].map(header => (
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
                <Text style={styles.column}>{item.branch}</Text>
                <Text style={styles.column}>{item.class}</Text>
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
            maxHeight: 'auto',
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
            <Text style={{color: '#6C757D', fontSize: 18}}>DateSheet</Text>

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
          <Text
            style={{
              textAlign: 'center',
              marginTop: 5,
              fontSize: 16,
            }}>
            Gujranwala City Grammar School
          </Text>
          <Text
            style={{
              textAlign: 'center',
            }}>
            Main Branch
          </Text>

          <FlatList
            style={{
              flexGrow: 0,
            }}
            data={Info}
            keyExtractor={item => item.key}
            renderItem={({item}) => (
              <View style={styles.infoRow}>
                <Text style={styles.text}>{item.key}:</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            )}
          />
          <ScrollView
            horizontal
            style={{marginBottom: hp('5%')}}
            contentContainerStyle={{flexGrow: 0.8}}>
            <View>
              <FlatList
                style={styles.flatList}
                data={ModalData}
                nestedScrollEnabled
                keyExtractor={(item, index) =>
                  item.sr ? item.sr.toString() : index.toString()
                }
                ListHeaderComponent={() => (
                  <View style={styles.row}>
                    {['Sr#', 'Subject', 'Date', 'Time Start', 'Time end'].map(
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
                renderItem={({item}) => (
                  <View style={styles.row}>
                    <Text style={[styles.column, styles.withBorder]}>
                      {item.sr}
                    </Text>
                    <Text style={[styles.column, styles.withBorder]}>
                      {item.subject}
                    </Text>
                    <Text style={[styles.column, styles.withBorder]}>
                      {item.date}
                    </Text>
                    <Text style={[styles.column, styles.withBorder]}>
                      {item.startTime}
                    </Text>
                    <Text style={[styles.column, styles.withBorder]}>
                      {item.endTime}
                    </Text>
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ParentDateSheet;

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    top: -8,
    left: 14,
    fontSize: 8,
    color: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 4,
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
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontWeight: 'bold',
    marginLeft: 15,
  },
  value: {
    marginLeft: 10,
  },
  withBorder: {
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
