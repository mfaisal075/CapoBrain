import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import {BackHandler} from 'react-native';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';

interface Dailydiary {
  id: number;
  date: string;
  bra_name: string;
  cls_name: string;
  sec_name: string;
  sub_name: string;
}

interface DailydiaryData {
  branch: {
    bra_name: string;
  };
  class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
  diary: {
    date: string;
    diary: string;
  };
  subject: {
    sub_name: string;
  };
}

export default function DailyDiary({navigation}: any) {
  const {token} = useUser();
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [startDte, setStartDte] = useState(new Date());
  const [showStartDtePicker, setShowStartDtePicker] = useState(false);
  const [formData, setFormData] = useState({
    english: '',
    urdu: '',
    math: '',
    pakistanStudies: '',
    chemistry: '',
    biology: '',
    physics: '',
    islamiyat: '',
  });
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [originalData, setOriginalData] = useState<Dailydiary[]>([]);
  const [dailydiaryData, setDailydiaryData] = useState<DailydiaryData | null>(
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

  const [isModalVisi, setModalVisi] = useState(false);

  const toggleModl = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/showdiary?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setModalVisi(!isModalVisi);
      setDailydiaryData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  {
    /*Add Diary*/
  }
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onStartDteChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setStartDte(selectedDate);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({...formData, [field]: value});
  };

  const validateFields = () => {
    if (!selectedClass || !selectedSection) {
      Alert.alert('Error', 'Please select Class and Section');
      return false;
    }

    for (const key of Object.keys(formData) as Array<keyof typeof formData>) {
      if (!formData[key]) {
        Alert.alert('Error', `Please enter ${key}`);
        return false;
      }
    }

    return true;
  };

  const fetchData = async () => {
    if (token) {
      try {
        const res = await axios.get(
          `https://demo.capobrain.com/fetchdailydiary?from=${
            startDate.toISOString().split('T')[0]
          }&to=${endDate.toISOString().split('T')[0]}&_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(res.data.dailydiary);
      } catch (error) {
        console.log(error);
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
        <Text style={styles.headerText}>Daily Diary</Text>
      </View>

      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            width: 90,
            height: 30,
            backgroundColor: '#3b82f6',
            borderRadius: 5,
            marginTop: 10,
            alignSelf: 'flex-end',
            marginRight: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 15,
              textAlign: 'center',
              marginTop: 3,
            }}>
            Add Diary
          </Text>
        </View>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: hp('1%'),
          marginBottom: hp('1%'),
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
          keyExtractor={(item, index) => item.id.toString() || `item-${index}`}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.title}>{item.sub_name}</Text>
                <Text style={{color: '#3b82f6'}}>{formatDate(item.date)}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: '#3b82f6',
                  }}>{`${item.cls_name} (${item.sec_name})`}</Text>
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
      ) : (
        <View style={{width: '100%', marginTop: 20}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
            No data found in the database!
          </Text>
        </View>
      )}

      {/* Modal */}
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

          <TouchableOpacity onPress={() => setModalVisi(!isModalVisi)}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 23,
                alignSelf: 'center',
                marginTop: 20,
              }}>
              <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                Close
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={isModalVisible}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#3b82f6',
            padding: 10,
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
            }}>
            <Text
              style={{
                fontSize: 18,
                color: '#3b82f6',
                fontWeight: 'bold',
              }}>
              Add Diary
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              height: 1,
              width: wp('85%'),
              backgroundColor: '#3b82f6',
            }}
          />
          <Text
            style={{
              marginTop: 10,
              left: 7,
              color: '#3b82f6',
            }}>
            Class
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              dropdownIconColor="#3b82f6"
              mode="dropdown"
              selectedValue={selectedClass}
              onValueChange={itemValue => setSelectedClass(itemValue)}>
              <Picker.Item label="Please Select" value="" />
              <Picker.Item label="Ten" value="Ten" />
            </Picker>
          </View>

          <Text
            style={{
              left: 7,
              color: '#3b82f6',
            }}>
            Section
          </Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              dropdownIconColor="#3b82f6"
              mode="dropdown"
              selectedValue={selectedSection}
              onValueChange={itemValue => setSelectedSection(itemValue)}>
              <Picker.Item label="Select Section" value="" />
              <Picker.Item label="A" value="A" />
            </Picker>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#3b82f6',
              padding: 7,
              borderRadius: 5,
              justifyContent: 'space-between',
              height: 33,
            }}>
            <Text>Date: {startDte.toLocaleDateString()}</Text>
            <TouchableOpacity onPress={() => setShowStartDtePicker(true)}>
              <Image
                source={require('../../assets/calendar.png')}
                style={{height: 20, width: 20, tintColor: '#3b82f6'}}
              />
            </TouchableOpacity>
          </View>
          {showStartDtePicker && (
            <DateTimePicker
              value={startDte}
              mode="date"
              display="default"
              textColor="#3b82f6"
              onChange={onStartDteChange}
            />
          )}

          {Object.keys(formData).map(subject => (
            <View key={subject} style={{marginVertical: 10}}>
              <Text
                style={{
                  color: '#3b82f6',
                }}>
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#3b82f6',
                  padding: 5,
                  borderRadius: 5,
                }}
                value={formData[subject as keyof typeof formData]}
                onChangeText={text =>
                  handleInputChange(subject as keyof typeof formData, text)
                }
                placeholder={`Enter ${subject} details`}
                placeholderTextColor={'#3b82f6'}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={() => {
              if (validateFields()) {
                Alert.alert('Success', 'Form submitted successfully!');
              }
            }}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
                marginBottom: hp('5%'),
                marginTop: hp('2%'),
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                Save
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 5,
    backgroundColor: 'white',
    width: wp('83%'),
    alignSelf: 'center',
    height: 30,
    justifyContent: 'center',
    marginBottom: 10,
  },
  picker: {
    paddingHorizontal: 10,
    color: '#3b82f6',
    fontSize: 16,
    height: 50,
    paddingLeft: 10,
  },
});
