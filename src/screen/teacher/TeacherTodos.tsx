import {
  BackHandler,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';

interface Todo {
  id: number;
  title: 'New Task';
  start_date: string;
  end_date: string;
  deadline_date: string;
  notifiaction_status: string;
}

interface TodoDetail {
  todo: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    deadline_date: string;
  };
  teacher: {
    app_name: string;
  };
}

const TeacherTodos = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [todoDetail, setTodoDetail] = useState<TodoDetail | null>(null);
  const [originalData, setOriginalData] = useState<Todo[]>([]);
  const [tableData, setTableData] = useState<Todo[]>(originalData);

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

  const toggleModal = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/stafftodoshow?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTodoDetail(res.data);
      setModalVisible(!isModalVisible);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchteachertodo',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.todo);
        setTableData(response.data.todo);
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
  }, []);

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
        <Text style={styles.headerText}>Staff Todo's</Text>
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
              item.id ? item.id.toString() : index.toString()
            }
            ListHeaderComponent={() => (
              <View style={styles.row}>
                {[
                  'Sr#',
                  'Title',
                  'Start Date',
                  'End Date',
                  'Deadline',
                  'Action',
                ].map(header => (
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
                <Text style={styles.column}>{index + 1}</Text>
                <Text style={styles.column}>{item.title}</Text>
                <Text style={styles.column}>{formatDate(item.start_date)}</Text>
                <Text style={styles.column}>{formatDate(item.end_date)}</Text>
                <Text style={styles.column}>
                  {formatDate(item.deadline_date)}
                </Text>
                <TouchableOpacity
                  onPress={() => toggleModal(item.id)}
                  disabled={item.notifiaction_status === 'Close'}>
                  <View style={[styles.view, styles.actionView]}>
                    <Image
                      style={[
                        styles.view,
                        {width: 13},
                        {height: 13},
                        {marginLeft: 40},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/visible.png')}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('TeacherComment' as never)
                  }>
                  <View style={[styles.comment, styles.actionView]}>
                    <Image
                      style={[
                        styles.comment,
                        {width: 13},
                        {height: 13},
                        {marginLeft: 4},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/chat.png')}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('TeacherComment' as never)
                  }>
                  <View style={[styles.commnt, styles.actionView]}>
                    <Image
                      style={[
                        styles.commnt,
                        {width: 13},
                        {height: 13},
                        {marginLeft: 4},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/chat.png')}
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

      {/* View Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 270,
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
            <Text style={{color: '#6C757D', fontSize: 18}}>Todo Detail</Text>

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
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
              flexDirection: 'row',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  margin: 8,
                }}>
                Name
              </Text>

              <Text
                style={{
                  margin: 8,
                }}>
                {todoDetail?.teacher.app_name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  margin: 8,
                }}>
                Title
              </Text>

              <Text
                style={{
                  margin: 8,
                }}>
                {todoDetail?.todo.title}
              </Text>
            </View>
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
              flexDirection: 'row',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  marginTop: 8,
                  marginLeft: 10,
                  marginRight: 5,
                }}>
                Start Date
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  marginRight: 10,
                }}>
                {formatDate(todoDetail?.todo.start_date ?? '--')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  margin: 8,
                }}>
                End Date
              </Text>

              <Text
                style={{
                  margin: 8,
                }}>
                {formatDate(todoDetail?.todo.end_date ?? '--')}
              </Text>
            </View>
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
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                margin: 10,
              }}>
              Deadline
            </Text>

            <Text
              style={{
                margin: 10,
              }}>
              {formatDate(todoDetail?.todo.deadline_date ?? '--')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                marginLeft: 10,
                marginTop: 10,
              }}>
              Description:
            </Text>
            <Text
              style={{
                fontWeight: 'bold',
                marginLeft: 10,
              }}>
              {todoDetail?.todo.description}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TeacherTodos;

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
  comment: {
    color: '#1DB9AA',
    tintColor: '#1DB9AA',
    width: 'auto',
    borderRadius: 5,
  },
  commnt: {
    width: 'auto',
    borderRadius: 5,
    color: '#F39C12',
    tintColor: '#F39C12',
  },
  view: {
    width: 'auto',
    color: '#319EF4',
    tintColor: '#319EF4',
    borderRadius: 5,
  },
  actionView: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 5,
    marginTop: 1,
    marginBottom: 1,
    alignSelf: 'center',
  },
});
