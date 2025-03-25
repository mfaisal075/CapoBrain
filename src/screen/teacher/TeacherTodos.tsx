import {
  Animated,
  BackHandler,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useEffect, useRef, useState} from 'react';
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
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(
    null,
  );
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

  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
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
      <Animated.View
        style={[
          styles.animatedBackground,
          {transform: [{translateY: moveAnim}]},
        ]}>
        <ImageBackground
          resizeMode="cover"
          style={styles.backgroundImage}
          source={require('../../assets/bgimg.jpg')}
        />
      </Animated.View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TeacherHome')}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Staff's Todo</Text>
      </View>

      <FlatList
        style={{paddingVertical: 10}}
        data={originalData}
        keyExtractor={(item, index) => item?.id?.toString() || `item-${index}`}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedTransaction(item.id);
              setIsOpen(true);
            }}>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.title}>{item.title}</Text>

                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity onPress={() => toggleModal(item.id)}>
                    <View style={[styles.view, styles.actionView]}>
                      <Image
                        style={[
                          styles.view,
                          {width: 13},
                          {height: 13},
                          {marginLeft: 4},
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
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal isVisible={isOpen}>
        <View style={[styles.cards, {overflow: 'hidden'}]}>
          <Animated.View
            style={[
              styles.animatedBackground,
              {transform: [{translateY: moveAnim}]},
            ]}>
            <ImageBackground
              resizeMode="cover"
              style={styles.backgroundImage}
              source={require('../../assets/bgimg.jpg')}
            />
          </Animated.View>

          {selectedTransaction && (
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#3b82f6',
                textAlign: 'center',
                marginVertical: 10,
              }}>
              {
                originalData.find(item => item.id === selectedTransaction)
                  ?.title
              }
            </Text>
          )}

          <FlatList
            data={originalData.filter(
              entry => entry.id === selectedTransaction,
            )}
            keyExtractor={(item, index) =>
              item.id.toString() || `item-${index}`
            }
            renderItem={({item}) => (
              <View
                style={{
                  marginLeft: '15%',
                  marginRight: '15%',
                  marginTop: 5,
                }}>
                <EntryRow
                  label="Start Date:"
                  value={formatDate(item.start_date)}
                />
                <EntryRow label="End Date:" value={formatDate(item.end_date)} />
                <EntryRow
                  label="Deadline:"
                  value={formatDate(item.deadline_date)}
                />
              </View>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              setSelectedTransaction(null);
              setIsOpen(false);
            }}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 23,
                alignSelf: 'center',
                marginBottom: 15,
              }}>
              <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                Close
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

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
            overflow: 'hidden',
          }}>
          <Animated.View
            style={[
              styles.animatedBackground,
              {transform: [{translateY: moveAnim}]},
            ]}>
            <ImageBackground
              resizeMode="cover"
              style={styles.backgroundImage}
              source={require('../../assets/bgimg.jpg')}
            />
          </Animated.View>

          <Text
            style={{
              color: '#3b82f6',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 10,
            }}>
            Todo Detail
          </Text>

          <Text
            style={{
              fontWeight: 'bold',
              marginLeft: '15%',
              color: '#3b82f6',
              fontSize: 16,
              marginTop: 15,
            }}>
            Description:
          </Text>
          <Text
            style={{
              marginLeft: '15%',
              marginRight: '15%',
              color: '#3b82f6',
            }}>
            {todoDetail?.todo.description}
          </Text>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <View
                style={{
                  backgroundColor: '#3b82f6',
                  borderRadius: 5,
                  width: 50,
                  height: 23,
                  alignSelf: 'center',
                  marginBottom: 15,
                  marginTop: 15,
                }}>
                <Text
                  style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                  Close
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const EntryRow = ({label, value}: {label: string; value: string}) => (
  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
    <Text style={{fontWeight: 'bold', color: '#3b82f6'}}>{label}</Text>
    <Text
      style={{
        color: '#3b82f6',
      }}>
      {value}
    </Text>
  </View>
);

export default TeacherTodos;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    top: -6,
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

  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  text: {
    fontWeight: 'bold',
    padding: 2,
    color: 'white',
  },
  value: {
    padding: 2,
    color: 'white',
  },
  box: {
    marginTop: 10,
    width: '96%',
    borderRadius: 10,
    padding: 7,
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    opacity: 1,
    marginBottom: 5,
    height: 130,
  },
  cards: {
    borderRadius: 10,
    marginBottom: 10,
    margin: '2%',
    height: 170,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginLeft: '2%',
    elevation: 5,
    opacity: 1,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginRight: '2%',
    marginTop: '1%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  animatedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
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
  comment: {
    width: 'auto',
    borderRadius: 5,
    color: '#F39C12',
    tintColor: '#3b82f6',
  },
});
