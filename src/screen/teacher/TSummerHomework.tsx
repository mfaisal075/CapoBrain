import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  BackHandler,
  ScrollView,
  Image,
  FlatList,
  Animated,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import Modal from 'react-native-modal';

interface SummerHomework {
  id: number;
  cls_name: string;
  sec_name: string;
  sub_name: string;
  bra_name: string;
}

interface SummerHomeworkData {
  total_marks: string;
  desc: string;
}

const TSummerHomework = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [des, setDes] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [branchError, setBranchError] = useState('');
  const [currentValue, setCurrentValue] = useState(null);
  const itemc = [{label: 'Ten', value: 1}];
  const [branchErrr, setBranchErrr] = useState('');
  const [isOpn, setIsOpn] = useState(false);
  const [currentValu, setCurrentValu] = useState(null);
  const itemz = [{label: 'Select Class First', value: 1}];
  const [isOpe, setIsOpe] = useState(false);
  const [currentVale, setCurrentVale] = useState(null);
  const itemo = [{label: 'Select Section First', value: 1}];
  const [isModalVisi, setModalVisi] = useState(false);
  const [summerHwData, setSummerHwData] = useState<SummerHomeworkData | null>(
    null,
  );
  const [originalData, setOriginalData] = useState<SummerHomework[]>([]);

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const [subjectError, setSubjectError] = useState('');
  const [dateError, setDateError] = useState('');
  const [descError, setDescError] = useState('');
  const [desError, setDesError] = useState('');

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

    if (!date) {
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
    if (!des) {
      setDesError('Total Marks is required');
      isValid = false;
    } else {
      setDesError('');
    }

    return isValid;
  };

  const toggleModl = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/showsummerhomework?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setModalVisi(!isModalVisi);
      setSummerHwData(res.data.homework);
    } catch (error) {
      console.log();
    }
  };

  const [isModalV, setModalV] = useState(false);
  const tglModal = () => {
    setModalV(!isModalV);
  };
  const [isMdlVsble, setMdlVsble] = useState(false);
  const toggleMdl = () => {
    setMdlVsble(!isMdlVsble);
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/fetchhomework?_token=${token}`,
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
          onPress={() => navigation.navigate('TeacherHomework' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Summer Homework List</Text>
      </View>
      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            width: 190,
            height: 30,
            backgroundColor: '#3b82f6',
            borderRadius: 5,
            alignSelf: 'flex-end',
            margin: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 15,
              textAlign: 'center',
              marginTop: 3,
            }}>
            Add Summer Home Work
          </Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={originalData}
        keyExtractor={(item, index) => item.id.toString() || `item-${index}`}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
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
                {item.bra_name}
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
                  fontSize: 16,
                }}>
                {item.cls_name}({item.sec_name})
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={[
                    styles.iconContainer,
                    styles.actionIcon,
                    {marginTop: 6},
                  ]}
                  onPress={() => toggleModl(item.id)}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/visible.png')}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleMdl}>
                  <View style={[styles.available, styles.actionView]}>
                    <Image
                      style={[styles.available, {width: 13}, {height: 13}]}
                      source={require('../../assets/pencil.png')}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={tglModal}>
                  <View style={[styles.availble, styles.actionView]}>
                    <Image
                      style={[styles.availble, {width: 13}, {height: 13}]}
                      source={require('../../assets/dlt.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/*Add hw*/}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 450,
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
              Add Summer Home Work
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
                marginLeft: 10,
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
                  left: 15,
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
                marginLeft: 10,
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
                  left: 165,
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
                marginLeft: 10,
                height: 32,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                marginRight: 5,
                marginTop: 3,
              }}>
              <Text style={[styles.label, {top: -16}]}>Subject</Text>
              <Text
                style={{
                  color: 'red',
                  flexDirection: 'row',
                  top: -12,
                  left: 65,
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
                  left: 15,
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
                      marginLeft: 30,
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
              marginLeft: 10,
              marginTop: 30,
              height: 30,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Total Marks</Text>
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
                value={des}
                onChangeText={setDes}
              />
            </View>
          </View>
          {desError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 255,
                left: 15,
              }}>
              {desError}
            </Text>
          ) : null}

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
              marginLeft: 10,
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
                top: 385,
                left: 15,
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
                marginTop: 40,
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

      {/*eye modal*/}
      <Modal isVisible={isModalVisi}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 300,
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
            Summer Home Work
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.lblText}>Total Marks</Text>
            <Text style={styles.valueText}>{summerHwData?.total_marks}</Text>
          </View>

          <Text style={styles.lblText}>Description:</Text>
          <Text style={[styles.valueText, {marginLeft: '15%'}]}>
            {summerHwData?.desc}
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

      {/*delete*/}
      <Modal isVisible={isModalV}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 220,
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
          <Image
            style={{
              width: 60,
              height: 60,
              tintColor: '#3b82f6',
              alignSelf: 'center',
              marginTop: 30,
            }}
            source={require('../../assets/info.png')}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 22,
              textAlign: 'center',
              marginTop: 10,
              color: '#3b82f6',
            }}>
            Warning
          </Text>
          <Text
            style={{
              color: '#3b82f6',
              textAlign: 'center',
            }}>
            You may have not permission to delete this record!
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => setModalV(!isModalV)}>
              <View
                style={{
                  backgroundColor: '#3b82f6',
                  borderRadius: 5,
                  width: 50,
                  height: 30,
                  padding: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  OK
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*edit*/}
      <Modal isVisible={isMdlVsble}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 220,
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
          <Image
            style={{
              width: 60,
              height: 60,
              tintColor: '#3b82f6',
              alignSelf: 'center',
              marginTop: 30,
            }}
            source={require('../../assets/info.png')}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 22,
              textAlign: 'center',
              marginTop: 10,
              color: '#3b82f6',
            }}>
            Warning
          </Text>
          <Text
            style={{
              color: '#3b82f6',
              textAlign: 'center',
            }}>
            You may have not permission to edit this record!
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => setMdlVsble(!isMdlVsble)}>
              <View
                style={{
                  backgroundColor: '#3b82f6',
                  borderRadius: 5,
                  width: 50,
                  height: 30,
                  padding: 5,
                  marginRight: 10,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  OK
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TSummerHomework;

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
    width: 150,
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

  flatList: {
    margin: 10,
    flex: 1,
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
  lblText: {
    fontWeight: 'bold',
    marginLeft: '15%',
    color: '#3b82f6',
  },
  valueText: {
    marginRight: '15%',
    color: '#3b82f6',
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
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  available: {
    color: 'green',
    tintColor: 'green',
    width: 'auto',
    height: 27,
    borderRadius: 5,
  },
  availble: {
    color: 'red',
    tintColor: 'red',

    height: 27,
    borderRadius: 5,
  },
  notAvailable: {
    color: 'red',
    tintColor: 'red',

    height: 27,
    borderRadius: 5,
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
});
