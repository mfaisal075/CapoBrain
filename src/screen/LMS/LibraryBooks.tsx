import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

interface Books {
  id: number;
  issue_bk_date: string;
  issue_bk_return_date: string;
  issue_bk_status: string;
  bk_name: string;
  issue_bk_quantity_no: string;
}

const LibraryBooks = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(
    null,
  );

  const [originalData, setOriginalData] = useState<Books[]>([]);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchstudentlibrarybooks',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.studentlibrarybooks);
      } catch (error) {
        console.error('Error fetching data', error);
        throw error; // Ensure the error is thrown so useQuery can handle it
      }
    } else {
      console.log('User is not authenticated');
      throw new Error('User is not authenticated');
    }
  };

  const moveAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fetchData();

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

  const EntryRow = ({label, value}: {label: string; value: string}) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '10%',
        marginRight: '10%',
      }}>
      <Text style={{fontWeight: 'bold', color: '#3b82f6'}}>{label}</Text>
      <Text
        style={{
          color: '#3b82f6',
        }}>
        {value}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
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

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('LMS' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Library Books</Text>
      </View>

      <FlatList
        data={originalData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setIsOpen(true);
              setSelectedTransaction(item.id);
            }}>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.title}>{item.bk_name}</Text>
                <Text
                  style={{
                    color: '#3b82f6',
                  }}>
                  {item.issue_bk_quantity_no}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal isVisible={isOpen}>
        <View style={styles.cards}>
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
                fontSize: 16,
                fontWeight: 'bold',
                color: '#3b82f6',
                textAlign: 'center',
                marginBottom: 10,
              }}>
              {
                originalData.find(item => item.id === selectedTransaction)
                  ?.bk_name
              }
            </Text>
          )}

          <FlatList
            data={originalData.filter(
              entry => entry.id === selectedTransaction,
            )}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View>
                <EntryRow
                  label="Status:"
                  value={item.issue_bk_status === 'Issue' ? '✅' : '⏳'}
                />

                <EntryRow
                  label="Issue Date:"
                  value={formatDate(item.issue_bk_date)}
                />
                <EntryRow
                  label="Return Date:"
                  value={formatDate(item.issue_bk_return_date)}
                />
              </View>
            )}
          />
          <TouchableOpacity onPress={() => setIsOpen(false)}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 23,
                alignSelf: 'center',
                marginTop: 10,
              }}>
              <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                Close
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default LibraryBooks;

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
    flex: 1,
    textAlign: 'center',
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    width: 25,
    height: 25,
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
  cards: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    margin: '2%',
    elevation: 5,
    overflow: 'hidden',
    height: 150,
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
