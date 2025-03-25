import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Homework {
  id: number;
  bra_name: string;
  cls_name: string;
  sec_name: string;
  sub_name: string;
  cand_name: string;
  home_date: string;
}

interface HomeworkData {
  homework: {
    home_date: string;
    home_desc: string;
  };
  subject: {
    sub_name: string;
  };
}

const ParentHomeWork = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisi, setModalVisi] = useState(false);
  const [originalData, setOriginalData] = useState<Homework[]>([]);
  const [tableData, setTableData] = useState<Homework[]>(originalData);
  const [homeworkData, setHomeworkData] = useState<HomeworkData | null>(null);

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

  const toggleModl = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/parentshomeworkshow?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setHomeworkData(res.data);
    } catch (error) {
      console.log(error);
    }
    setModalVisi(!isModalVisi);
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchparenthomework',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.homework);
        setTableData(response.data.homework);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
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
      navigation.goBack();
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Home Work</Text>
      </View>
      {originalData.length > 0 ? (
        <FlatList
          data={originalData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => toggleModl(item.id)}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/visible.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.title}>{item.sub_name}</Text>
                <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                  {formatDate(item.home_date)}
                </Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={{width: '100%', marginTop: 20}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
            No record data found in the database!
          </Text>
        </View>
      )}
      {/* View Modal */}
      <Modal isVisible={isModalVisi}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 250,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#3b82f6',
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
            Home Work
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: '#3b82f6',
              width: wp('90%'),
            }}
          />

          <Text style={styles.lblText}>Description:</Text>
          <Text style={styles.valueText}>
            {homeworkData?.homework.home_desc}
          </Text>

          <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 10}}>
            <TouchableOpacity onPress={() => setModalVisi(!isModalVisi)}>
              <View
                style={{
                  backgroundColor: '#3b82f6',
                  borderRadius: 5,
                  width: 50,
                  height: 23,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
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

export default ParentHomeWork;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    marginBottom: 10,
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

  lblText: {
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 15,
    marginLeft: '10%',
    fontSize: 16,
  },
  valueText: {
    marginRight: '10%',
    color: '#3b82f6',
    marginLeft: '10%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 20,
    marginLeft: '2%',
    marginRight: '2%',
    marginTop: '1%',
    borderWidth: 1,
    borderColor: '#3b82f6',
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
});
