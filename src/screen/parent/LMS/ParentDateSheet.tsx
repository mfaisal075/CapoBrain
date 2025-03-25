import {
  BackHandler,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useUser} from '../../../Ctx/UserContext';
import axios from 'axios';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

interface DateSheet {
  id: number;
  cls_name: string;
  sec_name: string;
  bra_name: string;
  class_id: number;
  datesheet_no: string;
}

interface DateSheetData {
  sub_name: string;
  id: number;
  date: string;
  time_from: string;
  time_to: string;
}

const ParentDateSheet = ({navigation}: any) => {
  const {token} = useUser();
  const [originalData, setOriginalData] = useState<DateSheet[]>([]);
  const [isModalVisi, setModalVisi] = useState(false);

  const [ModalData, setModalData] = useState<DateSheetData[]>([]);

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
        setOriginalData(response.data.datesheets);
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
      navigation.navigate('ParentLMS');
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
          source={require('../../../assets/bgimg.jpg')}
        />
      </Animated.View>

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
        <Text style={styles.headerText}>Date Sheet</Text>
      </View>

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
              <Text
                style={
                  styles.title
                }>{`${item.cls_name} (${item.sec_name})`}</Text>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  const handleView = async (datesheet_no: string) => {
                    try {
                      const response = await axios.get(
                        `https://demo.capobrain.com/showdatesheet?id=${item.datesheet_no}&_token=${token}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );

                      setModalData(response.data.datesheet_detail);
                      setModalVisi(true);
                    } catch (error) {
                      console.log(error);
                      throw error;
                    }
                  };

                  handleView(item.datesheet_no);
                }}>
                <Image
                  style={styles.actionIcon}
                  source={require('../../../assets/visible.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal isVisible={isModalVisi}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 'auto',
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
              source={require('../../../assets/bgimg.jpg')}
            />
          </Animated.View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <Text style={{color: '#3b82f6', fontSize: 18, fontWeight: 'bold'}}>
              DateSheet
            </Text>

            <TouchableOpacity onPress={() => setModalVisi(!isModalVisi)}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#3b82f6',
              width: wp('90%'),
              marginBottom: 10,
            }}
          />

          <FlatList
            style={{marginBottom: 20}}
            data={ModalData}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.card}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.title}>{item.sub_name}</Text>
                  <Text
                    style={{
                      color: '#3b82f6',
                    }}>
                    {formatDate(item.date)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#3b82f6',
                    }}>
                    Start Time: {item.time_from}
                  </Text>
                  <Text
                    style={{
                      color: '#3b82f6',
                    }}>
                    End Time: {item.time_to}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ParentDateSheet;

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
    marginBottom: 20,
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
