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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import Modal from 'react-native-modal';
import {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

type TableRow = {
  sr: string;
  student: string;
  class: string;
  section: string;
  status: string;
  date: string;
  action: string;
};
interface Student {
  name: string;
  date: string;
  status: string;
}

const StdAttendance = ({navigation}: any) => {
  const {token} = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisi, setModalVisi] = useState(false);
  const [isModalV, setModalV] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [Open, setOpen] = useState(false);
  const [currentValu, setCurrentValu] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModl = () => {
    setModalVisi(!isModalVisi);
  };

  const tglModal = () => {
    setModalV(!isModalV);
  };

  const originalData: TableRow[] = [
    {
      sr: '1',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '14-11-2024',
      action: 'Edit',
    },
    {
      sr: '2',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '14-11-2024',
      action: 'Edit',
    },
    {
      sr: '3',
      student: 'Zumar',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '14-11-2024',
      action: 'Edit',
    },
    {
      sr: '4',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '15-11-2024',
      action: 'Edit',
    },
    {
      sr: '5',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '15-11-2024',
      action: 'Edit',
    },
    {
      sr: '6',
      student: 'Zumar',
      class: 'Ten',
      section: 'A',
      status: 'Absent',
      date: '16-11-2024',
      action: 'Edit',
    },
    {
      sr: '7',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '16-11-2024',
      action: 'Edit',
    },
    {
      sr: '8',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '16-11-2024',
      action: 'Edit',
    },
    {
      sr: '9',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '19-11-2024',
      action: 'Edit',
    },
    {
      sr: '10',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '19-11-2024',
      action: 'Edit',
    },
    {
      sr: '11',
      student: 'Zumar',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '19-11-2024',
      action: 'Edit',
    },
    {
      sr: '12',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '20-11-2024',
      action: 'Edit',
    },
    {
      sr: '13',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '21-11-2024',
      action: 'Edit',
    },
    {
      sr: '14',
      student: 'Zumar',
      class: 'Ten',
      section: 'A',
      status: 'Absent',
      date: '21-11-2024',
      action: 'Edit',
    },
    {
      sr: '15',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '21-11-2024',
      action: 'Edit',
    },
    {
      sr: '16',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '21-11-2024',
      action: 'Edit',
    },
    {
      sr: '17',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '22-11-2024',
      action: 'Edit',
    },
    {
      sr: '18',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '23-11-2024',
      action: 'Edit',
    },
    {
      sr: '19',
      student: 'Zumar',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '24-11-2024',
      action: 'Edit',
    },
    {
      sr: '20',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '25-11-2024',
      action: 'Edit',
    },
    {
      sr: '21',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '25-11-2024',
      action: 'Edit',
    },
    {
      sr: '22',
      student: 'Zumar',
      class: 'Ten',
      section: 'A',
      status: 'Absent',
      date: '26-11-2024',
      action: 'Edit',
    },
    {
      sr: '23',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '26-11-2024',
      action: 'Edit',
    },
    {
      sr: '24',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '26-11-2024',
      action: 'Edit',
    },
    {
      sr: '25',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '27-11-2024',
      action: 'Edit',
    },
    {
      sr: '26',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '28-11-2024',
      action: 'Edit',
    },
    {
      sr: '27',
      student: 'Zumar',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '29-11-2024',
      action: 'Edit',
    },
    {
      sr: '28',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '30-11-2024',
      action: 'Edit',
    },
    {
      sr: '29',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '01-12-2024',
      action: 'Edit',
    },
    {
      sr: '30',
      student: 'Zumar',
      class: 'Ten',
      section: 'A',
      status: 'Absent',
      date: '6-12-2024',
      action: 'Edit',
    },
    {
      sr: '31',
      student: 'Hamza',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '10-12-2024',
      action: 'Edit',
    },
    {
      sr: '32',
      student: 'Ghulfam',
      class: 'Ten',
      section: 'A',
      status: 'Present',
      date: '16-12-2024',
      action: 'Edit',
    },
  ];

  const fav = [
    {label: 'Present', value: 1},
    {label: 'Absent', value: 2},
    {label: 'Leave', value: 3},
  ];
  const [students, setStudents] = useState<Student[]>([
    {name: 'Hamza', date: '11-03-2025', status: 'Present'},
    {name: 'Gulfam', date: '11-03-2025', status: 'Present'},
    {name: 'ZUMAR', date: '11-03-2025', status: 'Present'},
    {name: 'Mohsin', date: '11-03-2025', status: 'Present'},
    {name: 'Umair', date: '11-03-2025', status: 'Present'},
    {name: 'Arslan', date: '11-03-2025', status: 'Present'},
    {name: 'Meera', date: '11-03-2025', status: 'Present'},
  ]);

  const [dropdownValues, setDropdownValues] = useState<{[key: string]: string}>(
    Object.fromEntries(
      students.map(student => [student.name, student.date, student.status]),
    ),
  );
  const updateStatus = (name: string, newStatus: string) => {
    setDropdownValues(prevValues => ({...prevValues, [name]: newStatus}));
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.name === name ? {...student, status: newStatus} : student,
      ),
    );
  };

  const handleSubmit = () => {
    console.log('Attendance Submitted:', students);
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetch-attendance',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return response.data.output;
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
      navigation.navigate('TeacherAttendance');
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
          onPress={() => navigation.navigate('TeacherAttendance' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Attendance</Text>
      </View>

      <TouchableOpacity onPress={toggleModl}>
        <View
          style={{
            width: 190,
            height: 30,
            backgroundColor: '#3b82f6',
            borderRadius: 5,
            margin: 10,
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
            Mark Student Attendance
          </Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={originalData}
        keyExtractor={item => item.sr}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>{item.student}</Text>
              <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                {item.date}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#3b82f6'}}>{item.status}</Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TouchableOpacity onPress={toggleModal}>
                  <View
                    style={[
                      item.action === 'Not Available'
                        ? styles.notAvailable
                        : styles.available,
                      styles.actionView,
                    ]}>
                    <Image
                      style={[
                        item.action === 'Not Available'
                          ? styles.notAvailable
                          : styles.available,
                        {width: 13},
                        {height: 13},
                        {marginLeft: 4},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/pencil.png')}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={tglModal}>
                  <View style={[styles.availble, styles.actionView]}>
                    <Image
                      style={[
                        styles.availble,
                        {width: 13},
                        {height: 13},
                        {marginLeft: 4},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/dlt.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/*Add Attendance*/}
      <Modal isVisible={isModalVisi}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 535,
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
              Student Attendance
            </Text>
            <TouchableOpacity onPress={() => setModalVisi(!isModalVisi)}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderColor: '#3b82f6',
              borderBottomWidth: 1,
            }}
          />
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
              marginTop: 20,
              height: 30,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Class</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 54,
                fontSize: 12,
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
              />
            </View>
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
              marginLeft: 20,
              marginTop: 20,
              height: 30,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Section</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 68,
                fontSize: 12,
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
              />
            </View>
          </View>

          <TouchableOpacity>
            <View
              style={{
                borderRadius: 5,
                width: 70,
                height: 30,
                backgroundColor: '#3b82f6',
                marginTop: 10,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  marginTop: 3,
                  fontSize: 16,
                }}>
                Load
              </Text>
            </View>
          </TouchableOpacity>

          <ScrollView horizontal>
            <FlatList
              data={students}
              keyExtractor={item => item.name.toString()}
              ListHeaderComponent={() => (
                <View style={styles.rw}>
                  {['Student Name', 'Date', 'Attendance Status'].map(header => (
                    <Text key={header} style={[styles.colmn, styles.Table]}>
                      {header}
                    </Text>
                  ))}
                </View>
              )}
              renderItem={({item, index}) => (
                <View style={[styles.rw, {zIndex: students.length - index}]}>
                  <Text style={styles.colmn}>{item.name}</Text>
                  <Text style={styles.colmn}>{item.date}</Text>

                  <DropDownPicker
                    containerStyle={{width: '60%', zIndex: 5000}}
                    dropDownContainerStyle={{width: '50%', zIndex: 6000}}
                    open={openDropdowns[item.name] || false}
                    setOpen={() => toggleDropdown(item.name)}
                    placeholder="Present"
                    placeholderStyle={{color: '#3b82f6'}}
                    labelStyle={{color: '#3b82f6'}}
                    textStyle={{color: '#3b82f6'}}
                    value={dropdownValues[item.name]}
                    items={[
                      {label: 'Present', value: 'Present'},
                      {label: 'Absent', value: 'Absent'},
                      {label: 'Leave', value: 'Leave'},
                    ]}
                    setValue={callback =>
                      updateStatus(
                        item.name,
                        callback(dropdownValues[item.name]),
                      )
                    }
                    style={styles.drpdown}
                  />
                </View>
              )}
            />
          </ScrollView>

          <TouchableOpacity onPress={handleSubmit}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                padding: 5,
                width: 70,
                height: 30,
                alignSelf: 'center',
                marginTop: 5,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                }}>
                Submit
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/*Edit*/}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 420,
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
              Edit Student Attendance
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderColor: '#3b82f6',
            }}
          />
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
              marginTop: 20,
              height: 40,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Class</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 54,
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
              />
            </View>
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
              marginLeft: 20,
              marginTop: 20,
              height: 40,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Section</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 68,
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
              />
            </View>
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
              marginLeft: 20,
              marginTop: 20,
              height: 40,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Student</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 68,
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
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 'auto',
              borderRightWidth: 1,
              borderLeftWidth: 1,
              borderRadius: 5,
              borderColor: '#3b82f6',
              marginLeft: 20,
              height: 32,
              borderBottomWidth: 1,
              borderTopWidth: 1,
              marginTop: 20,
              marginRight: 20,
              maxHeight: 40,
            }}>
            <Text style={[styles.label, {top: -15}]}>Attendance Status</Text>
            <Text
              style={{
                color: 'red',
                flexDirection: 'row',
                top: -12,
                left: 134,
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
                items={fav}
                open={Open}
                setOpen={() => setOpen(!Open)}
                value={currentValu}
                setValue={val => setCurrentValu(val)}
                maxHeight={200}
                placeholderStyle={{color: '#3b82f6'}}
                labelStyle={{color: '#3b82f6'}}
                textStyle={{color: '#3b82f6'}}
                placeholder=""
                style={{
                  borderWidth: 1,
                  borderColor: 'white',
                  borderRadius: 5,
                  minHeight: 10,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderTopWidth: 1,
              borderBottomWidth: 1,
              width: 'auto',
              borderRightWidth: 1,
              borderLeftWidth: 1,
              borderRadius: 5,
              borderColor: '#3b82f6',
              marginRight: 20,
              marginTop: 20,
              marginLeft: 20,
              height: 40,
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
                    marginLeft: 180,
                    marginRight: 10,
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

          <TouchableOpacity>
            <View
              style={{
                borderRadius: 5,
                width: 'auto',
                height: 30,
                backgroundColor: '#3b82f6',
                alignSelf: 'center',
                marginTop: 30,
                padding: 5,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  color: 'white',
                }}>
                Save
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      {/*delete*/}
      <Modal isVisible={isModalV}>
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
            Are you sure?
          </Text>
          <Text
            style={{
              color: '#3b82f6',
              textAlign: 'center',
            }}>
            You won't be able to revert this record!
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
                  width: 100,
                  height: 30,
                  padding: 5,
                  marginRight: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#3b82f6',
                  borderRadius: 5,
                  width: 100,
                  height: 30,
                  padding: 5,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  Yes, delete it
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StdAttendance;

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
    borderColor: '#3b82f6',
    padding: 4,
    borderRadius: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#3b82f6',
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
  actionView: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: -6,
  },
  notAvailable: {
    color: 'red',
    tintColor: 'red',
    width: 'auto',
    height: 27,
    borderRadius: 5,
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
    width: 'auto',
    height: 27,
    borderRadius: 5,
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
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    width: 100,
    height: 30,
    margin: 5,
    padding: 5,
  },
  colmn: {
    width: 120,
    padding: 5,
    color: '#3b82f6',
    fontSize: 14,
    marginTop: 4,
  },
  rw: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#3b82f6',
    position: 'relative',
    color: '#3b82f6',
  },
  Table: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    marginTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'center',
    width: 120,
    color: 'white',
  },
  drpdown: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 5,
    minHeight: 30,
    width: 100,
    margin: 3,
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
});
