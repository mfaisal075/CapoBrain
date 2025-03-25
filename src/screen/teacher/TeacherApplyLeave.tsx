import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface LeaveData {
  id: number;
  subject: string;
  leave_date: string;
  status: string;
  leave_desc: string;
}

const TeacherApplyLeave = ({navigation}: any) => {
  const {token} = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const [desc, setDesc] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [subjectError, setSubjectError] = useState('');
  const [dateError, setDateError] = useState('');
  const [descError, setDescError] = useState('');
  const [isModalVisi, setModalVisi] = useState(false);
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const toggleModl = async (id: number) => {
    setSelectedId(id);
    setModalVisi(!isModalVisi);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const validateFields = () => {
    let isValid = true;

    if (!value) {
      setSubjectError('Subject is required');
      isValid = false;
    } else {
      setSubjectError('');
    }

    if (!startDate) {
      setDateError('Date is required');
      isValid = false;
    } else {
      setDateError('');
    }

    if (!desc) {
      setDescError('Leave Description is required');
      isValid = false;
    } else {
      setDescError('');
    }

    return isValid;
  };

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchleave',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setLeaveData(response.data.leave);
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
        <Text style={styles.headerText}>Apply Leave</Text>
      </View>

      <>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <TouchableOpacity onPress={toggleModal}>
            <View
              style={{
                width: 90,
                height: 30,
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                marginRight: 10,
                alignSelf: 'flex-end',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 15,
                  textAlign: 'center',
                  marginTop: 3,
                }}>
                Add Leave
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={leaveData}
          keyExtractor={(item, index) =>
            item?.id?.toString() || `item-${index}`
          }
          renderItem={({item}) => (
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.title}>{item.subject}</Text>
                <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                  {formatDate(item.leave_date)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={styles.iconContainer}>
                  <Image
                    style={styles.statusIcon}
                    source={
                      item.status === 'Pending'
                        ? require('../../assets/pending.png')
                        : item.status === 'Approved'
                        ? require('../../assets/approved.png')
                        : require('../../assets/rejected.png')
                    }
                  />
                </View>

                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => toggleModl(item.id)}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/visible.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </>

      {/* Add Leave Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 550,
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <Text style={{color: '#3b82f6', fontSize: 18, fontWeight: 'bold'}}>
              Add Leave
            </Text>

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: '#3b82f6',
              width: wp('90%'),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: hp('2%'),
              justifyContent: 'space-between',
            }}>
            {/* Subject */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                width: 135,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderRadius: 5,
                borderColor: '#3b82f6',
                marginLeft: 20,
                marginRight: 5,
              }}>
              <Text style={styles.label}>Subject</Text>
              <Text
                style={{
                  color: 'red',
                  position: 'absolute',
                  top: -9,
                  left: 69,
                  fontSize: 14,
                  backgroundColor: 'white',
                }}>
                *
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 5,
                  borderColor: '#3b82f6',
                }}>
                <TextInput
                  style={{
                    color: '#3b82f6',
                    width: 95,
                  }}
                  value={value}
                  onChangeText={setValue}
                  placeholder="Enter"
                  placeholderTextColor={'#3b82f6'}
                />
              </View>
            </View>
            {subjectError ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 42,
                  left: 20,
                }}>
                {subjectError}
              </Text>
            ) : null}

            {/* Date */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                width: 135,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderRadius: 5,
                borderColor: '#3b82f6',
                marginRight: 20,
              }}>
              <Text style={styles.label}>Date</Text>
              <Text
                style={{
                  color: 'red',
                  position: 'absolute',
                  top: -8,
                  left: 50,
                  fontSize: 14,
                  backgroundColor: 'white',
                }}>
                *
              </Text>
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
                  {`${startDate.toLocaleDateString()}`}
                </Text>

                <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'stretch',
                      alignItems: 'center',
                      marginLeft: 20,
                      tintColor: '#3b82f6',
                    }}
                    source={require('../../assets/calendar.png')}
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
            {dateError ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 42,
                  right: 68,
                }}>
                {dateError}
              </Text>
            ) : null}
          </View>

          {/* Leave Description */}
          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderBottomWidth: 1,
              width: 'auto',
              borderRightWidth: 1,
              borderLeftWidth: 1,
              borderRadius: 5,
              borderColor: '#3b82f6',
              marginLeft: 20,
              marginTop: hp('5%'),
              height: 300,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Leave Description</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 134,
                fontSize: 14,
                backgroundColor: 'white',
              }}>
              *
            </Text>
            <View
              style={{
                borderRadius: 5,
                borderColor: '#3b82f6',
              }}>
              <TextInput
                style={{
                  color: '#3b82f6',
                }}
                value={desc}
                onChangeText={setDesc}
                placeholder="Leave"
                placeholderTextColor={'#3b82f6'}
              />
            </View>
          </View>
          {descError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 457,
                left: 20,
              }}>
              {descError}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              if (validateFields()) {
                console.log('Form is valid');
              } else {
                console.log('Form is invalid');
              }
            }}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 30,
                alignSelf: 'center',
                marginTop: hp('5%'),
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                Save
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

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
            overflow: 'hidden',
            borderColor: '#6C757D',
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
            Leave Detail
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: '#3b82f6',
              width: wp('90%'),
            }}
          />

          <View
            style={{
              marginTop: 15,
            }}>
            <Text style={styles.lblText}>Leave Description:</Text>
            <Text style={styles.valueText}>
              {leaveData.find(leave => leave.id === selectedId)?.leave_desc}
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 20}}>
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

export default TeacherApplyLeave;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 14,
    fontSize: 14,
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
    textAlign: 'center',
    flex: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    width: 17,
    height: 17,
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
  },
  lblText: {
    fontWeight: 'bold',
    color: '#3b82f6',
    fontSize: 16,
    marginLeft: '10%',
  },
  valueText: {
    marginRight: '10%',
    color: '#3b82f6',
    marginLeft: '10%',
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
