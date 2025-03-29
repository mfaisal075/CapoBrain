import {
  Alert,
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
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import DocumentPicker, {
  DocumentPickerResponse,
} from '@react-native-documents/picker';
import Modal from 'react-native-modal';
import RNFS from 'react-native-fs';

interface Upload {
  id: number;
  file_date: string;
  cls_name: string;
  sec_name: string;
  file_title: string;
  file_notes: string;
}

const TeacherUpload = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileResponse, setFileResponse] = useState<DocumentPickerResponse[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [Open, setOpen] = useState(false);
  const [currentValu, setCurrentValu] = useState(null);
  const [classError, setClassError] = useState('');
  const [sectionError, setSectionError] = useState('');
  const [Opn, setOpn] = useState(false);
  const [currentVal, setCurrentVal] = useState(null);
  const [isModalV, setModalV] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const downloadFile = async (url: any) => {
    try {
      const fileName = url.split('/').pop();
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const options = {
        fromUrl: url,
        toFile: downloadDest,
      };

      const download = RNFS.downloadFile(options);

      download.promise.then(response => {
        if (response.statusCode === 200) {
          Alert.alert('Success', `File downloaded to ${downloadDest}`);
        } else {
          Alert.alert('Error', 'Failed to download file');
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'An error occurred while downloading the file');
    }
  };

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });

      if (Array.isArray(response)) {
        setFileResponse(response);
      } else {
        setFileResponse([response]);
      }
    } catch (err) {}
  }, []);

  const [originalData, setOriginalData] = useState<Upload[]>([]);
  const [tableData, setTableData] = useState<Upload[]>(originalData);

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

  const tglModal = () => {
    setModalV(!isModalV);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [desc, setDesc] = useState('');
  const [descError, setDescError] = useState('');

  const [desError, setDesError] = useState('');

  const [dateError, setDateError] = useState('');

  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const validateFields = () => {
    let isValid = true;
    if (!Open) {
      setClassError('Class is required');
      isValid = false;
    } else {
      setClassError('');
    }

    if (!Opn) {
      setSectionError('Section is required');
      isValid = false;
    } else {
      setSectionError('');
    }

    return isValid;
  };

  const fav = [{label: 'Ten', value: 2}];
  const fv = [{label: 'Select Class First', value: 3}];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchteacheruploadmaterial',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.file);
        setTableData(response.data.file);
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
        <Text style={styles.headerText}>Upload Material</Text>
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
                width: 120,
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
                Upload Material
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={originalData}
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
                <Text style={styles.title}>{item.file_title}</Text>
                <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                  {formatDate(item.file_date)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: '#3b82f6'}}>
                  {item.cls_name}({item.sec_name})
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      downloadFile(
                        `https://demo.capobrain.com/files_download/${item.file_notes}`,
                      );
                    }}>
                    <View style={[styles.available, styles.actionView]}>
                      <Image
                        style={[
                          styles.available,
                          {width: 13},
                          {height: 13},
                          {marginLeft: 4},
                          {marginTop: 4},
                        ]}
                        source={require('../../assets/dpd.png')}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={tglModal}>
                    <View style={[styles.actionView]}>
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
      </>

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
                  marginRight: 10,
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

      {/*Upload*/}
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
            <Text style={{color: '#3b82f6', fontWeight: 'bold', fontSize: 18}}>
              Upload Material
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              borderColor: '#3b82f6',
              borderWidth: 1,
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
              height: 40,
              marginRight: 20,
            }}>
            <Text style={styles.label}>File Title</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 73,
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
                top: 460,
                left: 20,
              }}>
              {descError}
            </Text>
          ) : null}

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
              justifyContent: 'flex-start',
            }}>
            <Text style={styles.label}>Select File</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 85,
                fontSize: 14,
                backgroundColor: 'white',
              }}>
              *
            </Text>
            {fileResponse.map((file, index) => (
              <Text
                key={index.toString()}
                style={styles.uri}
                numberOfLines={1}
                ellipsizeMode={'middle'}>
                {file.uri}
              </Text>
            ))}

            <TouchableOpacity onPress={handleDocumentSelection}>
              <View
                style={{
                  backgroundColor: '#3b82f6',
                  borderRadius: 5,
                  height: 28,
                  marginTop: 7,
                  marginLeft: 7,
                  width: 70,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 3,
                    fontSize: 15,
                    color: 'white',
                  }}>
                  Select
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {descError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 460,
                left: 20,
              }}>
              {desError}
            </Text>
          ) : null}

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
                right: 80,
              }}>
              {dateError}
            </Text>
          ) : null}

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
            <Text style={[styles.label, {top: -13}]}>Class</Text>
            <Text
              style={{
                color: 'red',
                flexDirection: 'row',
                top: -9,
                left: 54,
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
                  <Icon name="check" size={22} color="#3b82f6" style={style} />
                )}
                style={{
                  borderWidth: 1,
                  borderColor: 'white',
                  borderRadius: 5,
                  minHeight: 10,
                }}
              />
            </View>
            {classError ? (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  position: 'absolute',
                  top: 32,
                  right: 193,
                }}>
                {classError}
              </Text>
            ) : null}
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
            }}>
            <Text style={[styles.label, {top: -13}]}>Section</Text>
            <Text
              style={{
                color: 'red',
                flexDirection: 'row',
                top: -9,
                left: 67,
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
                items={fv}
                open={Opn}
                setOpen={() => setOpn(!Opn)}
                value={currentVal}
                setValue={val => setCurrentVal(val)}
                maxHeight={200}
                placeholder="Select Class First"
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
                  <Icon name="check" size={22} color="#3b82f6" style={style} />
                )}
                style={{
                  borderWidth: 1,
                  borderColor: 'white',
                  borderRadius: 5,
                  minHeight: 10,
                }}
              />
            </View>
          </View>
          {sectionError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 325,
                left: 27,
              }}>
              {sectionError}
            </Text>
          ) : null}

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
                Upload
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default TeacherUpload;

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
  actionView: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availble: {
    color: 'red',
    tintColor: 'red',
  },
  notAvailable: {
    color: 'red',
    tintColor: 'red',

    borderRadius: 5,
  },
  available: {
    color: 'green',
    tintColor: 'green',

    borderRadius: 5,
  },
  uri: {
    color: '#3b82f6',
  },
});
