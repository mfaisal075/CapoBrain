import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Animated,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Homework {
  home_user_id: number;
  home_date: string;
  home_desc: string;
  cls_name: string;
  sec_name: string;
  sub_name: string;
}

interface HomeworkData {
  homework: {
    home_desc: string;
    home_date: string;
  };
  subject: {
    sub_name: string;
  };
}

const TeacherHomework = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [subjectError, setSubjectError] = useState('');
  const [dateError, setDateError] = useState('');
  const [descError, setDescError] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const [dat, setDat] = useState(new Date());
  const [desc, setDesc] = useState('');
  const [des, setDes] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [branchError, setBranchError] = useState('');
  const [homeworkData, setHomeworkData] = useState<HomeworkData | null>(null);
  const [currentValue, setCurrentValue] = useState(null);
  const itemc = [{label: 'Ten', value: 1}];
  const [branchErrr, setBranchErrr] = useState('');
  const [isOpn, setIsOpn] = useState(false);
  const [currentValu, setCurrentValu] = useState(null);
  const itemz = [{label: 'Select Class First', value: 1}];
  const [isOpe, setIsOpe] = useState(false);
  const [currentVale, setCurrentVale] = useState(null);
  const itemo = [{label: 'Select Section First', value: 1}];

  const [originalData, setOriginalData] = useState<Homework[]>([]);

  const [isModalVisi, setModalVisi] = useState(false);

  const toggleModl = async (home_desc: string) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/showhomework?id=${home_desc}&_token=${token}`,
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

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setDat(currentDate);
  };

  const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const validateFields = () => {
    let isValid = true;
    if (!isOpn) {
      setBranchErrr('Section is required');
      isValid = false;
    } else {
      setBranchErrr('');
    }
    if (!isOpen) {
      setBranchError('Class is required');
      isValid = false;
    } else {
      setBranchError('');
    }

    if (!value) {
      setSubjectError('Subject is required');
      isValid = false;
    } else {
      setSubjectError('');
    }

    if (!dat) {
      setDateError('Date is required');
      isValid = false;
    } else {
      setDateError('');
    }

    if (!desc) {
      setDescError('Description is required');
      isValid = false;
    } else {
      setDescError('');
    }

    return isValid;
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/teacherhomeworks_fetchhomework?from=${
            startDate.toISOString().split('T')[0]
          }&to=${endDate.toISOString().split('T')[0]}&_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.homework);
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
        <TouchableOpacity onPress={() => navigation.navigate('TeacherHome')}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Home Work</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            width: 170,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderRadius: 5,
            borderColor: '#3b82f6',
            marginLeft: '2%',
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
                  marginLeft: 50,
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
            width: 170,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderRadius: 5,
            borderColor: '#3b82f6',
            marginLeft: '1%',
            marginRight: '2%',
            height: 30,
          }}>
          <Text style={styles.label}>To</Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 5,
              borderColor: '#3b82f6',
            }}>
            <Text style={{marginLeft: 10}}>
              {`${endDate.toLocaleDateString()}`}
            </Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'stretch',
                  alignItems: 'center',
                  marginLeft: 50,
                  tintColor: '#3b82f6',
                }}
                source={require('../../assets/calendar.png')}
              />
              {showEndDatePicker && (
                <DateTimePicker
                  testID="endDatePicker"
                  value={endDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onEndDateChange}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginTop: 10,
          marginBottom: 10,
          marginLeft: '2%',
          marginRight: '2%',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TSummerHomework' as never)}>
          <View
            style={{
              width: 171,
              height: 30,
              backgroundColor: '#3b82f6',
              borderRadius: 5,
              marginRight: '1%',
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
                marginTop: 3,
              }}>
              Summer Home Work
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleModal}>
          <View
            style={{
              width: 172,
              height: 30,
              backgroundColor: '#3b82f6',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
                marginTop: 3,
              }}>
              Add Home Work
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {originalData.length > 0 ? (
        <FlatList
          data={originalData}
          keyExtractor={(item, index) =>
            item?.home_user_id?.toString() || `item-${index}`
          }
          renderItem={({item}) => (
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => toggleModl(item.home_desc)}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/visible.png')}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#3b82f6',
                    fontSize: 16,
                  }}>
                  {item.sub_name}
                </Text>
                <Text
                  style={{
                    color: '#3b82f6',
                  }}>
                  {formatDate(item.home_date)}
                </Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={{width: '100%', marginTop: 20}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, textAlign: 'center'}}>
            No data found in the database!
          </Text>
        </View>
      )}

      {/* Homework View Modal */}
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

          <Text style={styles.lblTxt}>Description:</Text>
          <Text style={styles.valueTxt}>
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
                  style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                  Close
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Homework Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 400,
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <Text style={{color: '#3b82f6', fontSize: 18, fontWeight: 'bold'}}>
              Add Home Work
            </Text>

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: 'auto',
              height: 1,
              borderColor: '#3b82f6',
              borderWidth: 1,
              borderBottomWidth: 1,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 135,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderRadius: 5,
                borderColor: '#3b82f6',
                marginLeft: 20,
                height: 32,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                marginRight: 5,
                marginTop: 20,
              }}>
              <Text style={[styles.label, {top: -14}]}>Class</Text>
              <Text
                style={{
                  color: 'red',
                  flexDirection: 'row',
                  top: -12,
                  left: 58,
                  fontSize: 14,
                  position: 'absolute',
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
                <DropDownPicker
                  items={itemc}
                  open={isOpen}
                  setOpen={() => setIsOpen(!isOpen)}
                  value={currentValue}
                  setValue={val => setCurrentValue(val)}
                  maxHeight={200}
                  placeholder="Select Class"
                  placeholderStyle={{color: '#3b82f6'}}
                  labelStyle={{color: '#3b82f6'}}
                  textStyle={{color: '#3b82f6'}}
                  ArrowUpIconComponent={({style}) => (
                    <Icon
                      name="chevron-up"
                      size={22}
                      color="#3b82f6"
                      style={style}
                    />
                  )}
                  ArrowDownIconComponent={({style}) => (
                    <Icon
                      name="chevron-down"
                      size={22}
                      color="#3b82f6"
                      style={style}
                    />
                  )}
                  TickIconComponent={({style}) => (
                    <Icon
                      name="check"
                      size={22}
                      color="#3b82f6"
                      style={style}
                    />
                  )}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 5,
                    minHeight: 5,
                  }}
                />
              </View>
            </View>
            {branchError ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 53,
                  left: 26,
                }}>
                {branchError}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 145,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderRadius: 5,
                borderColor: '#3b82f6',
                marginLeft: 5,
                height: 32,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                marginRight: 10,
                marginTop: 20,
              }}>
              <Text style={[styles.label, {top: -14}]}>Section</Text>
              <Text
                style={{
                  color: 'red',
                  flexDirection: 'row',
                  top: -12,
                  left: 68,
                  fontSize: 14,
                  position: 'absolute',
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
                <DropDownPicker
                  items={itemz}
                  open={isOpn}
                  setOpen={() => setIsOpn(!isOpn)}
                  value={currentValu}
                  setValue={val => setCurrentValu(val)}
                  maxHeight={200}
                  placeholder="Select Section"
                  placeholderStyle={{color: '#3b82f6'}}
                  labelStyle={{color: '#3b82f6'}}
                  textStyle={{color: '#3b82f6'}}
                  ArrowUpIconComponent={({style}) => (
                    <Icon
                      name="chevron-up"
                      size={22}
                      color="#3b82f6"
                      style={style}
                    />
                  )}
                  ArrowDownIconComponent={({style}) => (
                    <Icon
                      name="chevron-down"
                      size={22}
                      color="#3b82f6"
                      style={style}
                    />
                  )}
                  TickIconComponent={({style}) => (
                    <Icon
                      name="check"
                      size={22}
                      color="#3b82f6"
                      style={style}
                    />
                  )}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 5,
                    minHeight: 5,
                  }}
                />
              </View>
            </View>
            {branchErrr ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 53,
                  left: 170,
                }}>
                {branchErrr}
              </Text>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 40,
              justifyContent: 'space-between',
            }}>
            {/* Subject */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 145,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderRadius: 5,
                borderColor: '#3b82f6',
                marginLeft: 20,
                height: 32,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                marginRight: 5,
                marginTop: 3,
              }}>
              <Text style={[styles.label, {top: -16}]}>Assigned Subject</Text>
              <Text
                style={{
                  color: 'red',
                  flexDirection: 'row',
                  top: -12,
                  left: 130,
                  fontSize: 14,
                  position: 'absolute',
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
                <DropDownPicker
                  items={itemo}
                  open={isOpe}
                  setOpen={() => setIsOpe(!isOpe)}
                  value={currentVale}
                  setValue={val => setCurrentVale(val)}
                  maxHeight={200}
                  placeholder="Select Subject"
                  placeholderStyle={{color: '#3b82f6'}}
                  labelStyle={{color: '#3b82f6'}}
                  textStyle={{color: '#3b82f6'}}
                  ArrowUpIconComponent={({style}) => (
                    <Icon
                      name="chevron-up"
                      size={22}
                      color="#3b82f6"
                      style={style}
                    />
                  )}
                  ArrowDownIconComponent={({style}) => (
                    <Icon
                      name="chevron-down"
                      size={22}
                      color="#3b82f6"
                      style={style}
                    />
                  )}
                  TickIconComponent={({style}) => (
                    <Icon
                      name="check"
                      size={22}
                      color="#3b82f6"
                      style={style}
                    />
                  )}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 5,
                    minHeight: 5,
                  }}
                />
              </View>
            </View>

            {subjectError ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 35,
                  left: 25,
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
                marginLeft: 2,
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
                      value={dat}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={onStartDateChange}
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
                  top: 35,
                  right: 65,
                }}>
                {dateError}
              </Text>
            ) : null}
          </View>
          {/* Description */}
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
              marginTop: 30,
              height: 100,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Description</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 92,
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
              />
            </View>
          </View>
          {descError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 325,
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
                marginTop: 30,
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
    </View>
  );
};

export default TeacherHomework;

const styles = StyleSheet.create({
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

  container: {
    backgroundColor: '#fff',
    marginTop: 12,
    width: 90,
    height: 30,
    marginRight: 10,
  },
  lblText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  valueText: {
    marginRight: 10,
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
  label: {
    position: 'absolute',
    top: -10,
    left: 14,
    fontSize: 14,
    color: '#3b82f6',
    backgroundColor: 'white',
    paddingHorizontal: 4,
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
  cards: {
    borderRadius: 10,
    marginBottom: 10,
    margin: '2%',
    height: 240,
    backgroundColor: 'white',
    justifyContent: 'space-between',
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

  lblTxt: {
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 15,
    marginLeft: '10%',
    fontSize: 16,
  },
  valueTxt: {
    marginRight: '10%',
    color: '#3b82f6',
    marginLeft: '10%',
  },
});
