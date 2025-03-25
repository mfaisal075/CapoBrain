import {
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Animated,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useUser} from '../../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DailyDiary {
  id: number;
  sub_name: string;
  date: string;
}

interface DailyDiaryData {
  diary: {
    date: string;
    diary: string;
  };
  class: {
    cls_name: string;
  };
  subject: {
    sub_name: string;
  };
}

const ParentDailyDiary = ({navigation}: any) => {
  const {token} = useUser();
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isModalVisi, setModalVisi] = useState(false);
  const [dailydiaryData, setDailydiaryData] = useState<DailyDiaryData | null>(
    null,
  );

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const [originalData, setOriginalData] = useState<DailyDiary[]>([]);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/fetchstudentdiary?from=${
            startDate.toISOString().split('T')[0]
          }&to=${endDate.toISOString().split('T')[0]}&_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.dailydiary);
      } catch (error) {
        console.log(error);
        throw error;
      }
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
  }, [startDate, endDate]);

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty or invalid dates

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
  };

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
        <Text style={styles.headerText}>Daily Diary</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: hp('2%'),
          marginBottom: hp('2%'),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            width: 140,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderRadius: 5,
            borderColor: '#3b82f6',
            marginLeft: hp('1%'),
            height: 30,
          }}>
          <Text style={styles.label}>From</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 5,
              borderColor: '#3b82f6',
            }}>
            <Text style={{marginLeft: 10}}>
              {`${startDate.toLocaleDateString()}`}
            </Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'stretch',
                  alignItems: 'center',
                  marginLeft: 25,
                  tintColor: '#3b82f6',
                }}
                source={require('../../../assets/calendar.png')}
              />
              {showStartDatePicker && (
                <DateTimePicker
                  testID="startDatePicker"
                  value={startDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onStartDateChange}
                  textColor="#3b82f6"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            width: 140,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderRadius: 5,
            borderColor: '#3b82f6',
            marginLeft: hp('1%'),
            marginRight: hp('1%'),
          }}>
          <Text style={styles.label}>To</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 5,
              borderColor: '#3b82f6',
            }}>
            <Text
              style={{
                marginLeft: 10,
              }}>
              {`${endDate.toLocaleDateString()}`}
            </Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'stretch',
                  alignItems: 'center',
                  marginLeft: 25,
                  tintColor: '#3b82f6',
                }}
                source={require('../../../assets/calendar.png')}
              />
              {showEndDatePicker && (
                <DateTimePicker
                  testID="endDatePicker"
                  value={endDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onEndDateChange}
                  textColor="#3b82f6"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
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
                  onPress={() => {
                    const handleView = async (id: number) => {
                      try {
                        const response = await axios.get(
                          `https://demo.capobrain.com/showdiary?id=${item.id}&_token=${token}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );
                        setModalVisi(true);
                        setDailydiaryData(response.data);
                      } catch (error) {
                        console.log(error);
                        throw error;
                      }
                    };

                    handleView(item.id);
                  }}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../../assets/visible.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.title}>{item.sub_name}</Text>
                <Text style={{color: '#3b82f6'}}>{formatDate(item.date)}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={{width: '100%', marginTop: 20}}>
          <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
            No data found in the database!
          </Text>
        </View>
      )}

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
              source={require('../../../assets/bgimg.jpg')}
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
            Diary Detail
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: '#3b82f6',
              width: wp('90%'),
              marginBottom: 5,
            }}
          />

          <Text style={styles.lblText}>Description:</Text>
          <Text style={styles.valueText}>{dailydiaryData?.diary.diary}</Text>

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginBottom: 10,
            }}></View>
          <TouchableOpacity onPress={() => setModalVisi(!isModalVisi)}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 23,
                alignSelf: 'center',
                marginBottom: 5,
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

export default ParentDailyDiary;

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    top: -10,
    left: 14,
    fontSize: 10,
    color: '#3b82f6',
    backgroundColor: 'white',
    paddingHorizontal: 4,
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
    flex: 1,
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#fff',
    marginTop: 12,
    width: 90,
    height: 30,
    marginRight: 10,
  },

  lblText: {
    fontWeight: 'bold',
    color: '#3b82f6',
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
