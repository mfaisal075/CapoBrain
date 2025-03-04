import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  BackHandler,
  Dimensions,
  RefreshControl,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';

const TSummerHomework = ({navigation}: any) => {
  const {token} = useUser();
  const [hwModalVisible, setHwModalVisible] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [branchValue, setBranchValue] = useState(null);
  const [modalSectionOpen, setModalSectionOpen] = useState(false);
  const [modalSectionValue, setModalSectionValue] = useState(null);
  const [modalClassOpen, setModalClassOpen] = useState(false);
  const [modalClassValue, setModalClassValue] = useState(null);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectValue, setSubjectValue] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalMarks, setTotalMarks] = useState('');
  const [desc, setDesc] = useState('');

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
        return response.data.output;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not Authenticated');
    }
  };

  const {data, refetch, isFetching} = useQuery({
    queryKey: ['tableData'],
    queryFn: fetchData,
    refetchOnWindowFocus: true,
  });

  const customHTMLElementModels = {
    center: HTMLElementModel.fromCustomModel({
      tagName: 'center',
      mixedUAStyles: {
        alignItems: 'center',
        textAlign: 'center',
      },
      contentModel: HTMLContentModel.block,
    }),
  };

  const onChange = ({event, selectedDate}: any) => {
    setShowDatePicker(false); // Hide the picker
    if (selectedDate) setDate(selectedDate); // Set the selected date
  };

  const showDialog = () => {
    setHwModalVisible(true);
  };
  const hideDialog = () => {
    setDesc('');
    setDate(new Date());
    setHwModalVisible(false);
  };

  const classItems: {label: string; value: string}[] = [];

  useEffect(() => {
    refetch();
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
    <View style={styles.container}>
      <NavBar />

      <ScrollView>
        <View style={styles.accountContainer}>
          <View style={styles.actHeadingContainer}>
            <Text style={styles.tblHdCtr}>Summer Homework List</Text>
          </View>

          {/* Data Container */}
          <View style={styles.dataCtr}>
            <View style={styles.addHWBtnCtr}>
              <TouchableOpacity style={styles.addHWBtn} onPress={showDialog}>
                <Text style={styles.addHWBtnTxt}>Add Summer Home Work</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bckBtn}
                onPress={() => navigation.goBack()}>
                <Image
                  source={require('../../assets/back.png')}
                  style={[styles.bckBtnIcon, {marginRight: -8}]}
                />
                <Image
                  source={require('../../assets/back.png')}
                  style={styles.bckBtnIcon}
                />
                <Text style={styles.bckBtnText}>Back</Text>
              </TouchableOpacity>
            </View>
            {/* Table */}
            <View style={styles.tblDataCtr}>
              <ScrollView
                horizontal
                style={{flex: 1, padding: 10}}
                refreshControl={
                  <RefreshControl refreshing={isFetching} onRefresh={refetch} />
                }>
                {data ? (
                  <RenderHtml
                    contentWidth={Dimensions.get('window').width}
                    source={{html: data}}
                    customHTMLElementModels={customHTMLElementModels}
                    tagsStyles={{
                      h4: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#000',
                        textAlign: 'center',
                      },
                      table: {
                        borderWidth: 1,
                        borderColor: '#ddd',
                        width: '100%',
                        marginLeft: -10,
                      },
                      th: {
                        backgroundColor: '#f2f2f2',
                        paddingVertical: 0,
                        paddingHorizontal: 1,
                        marginHorizontal: -5,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        borderWidth: 1,
                        borderColor: '#ddd',
                        width: 145, // Adjust width as needed
                        height: 50,
                        justifyContent: 'center',
                        marginBottom: -10,
                        marginTop: -10,
                      },
                      td: {
                        borderWidth: 1,
                        borderColor: '#ddd',
                        paddingVertical: 0,
                        paddingHorizontal: 6,
                        textAlign: 'center',
                        width: 100, // Adjust width as needed
                        height: 50,
                        justifyContent: 'center',
                        marginBottom: -1,
                        borderBottomColor: 'white',
                      },
                      tr: {
                        backgroundColor: '#fff',
                        marginLeft: -3,
                      },
                      h6: {
                        marginVertical: 0,
                        textAlign: 'center',
                      },
                      span: {
                        backgroundColor: 'gray', // Green background (Approved)
                        color: '#fff', // White text
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        alignSelf: 'center', // Center the badge
                      },
                      center: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                      a: {
                        backgroundColor: 'green',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                        color: '#fff',
                        fontWeight: 'bold',
                        textDecorationLine: 'none',
                      },
                    }}
                  />
                ) : (
                  <View style={styles.attendanceCtr}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: 'rgba(0,0,0,0.6)',
                        textAlign: 'center',
                      }}>
                      No record present in the database!
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={hwModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideDialog}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
            }}>
            <View style={styles.modalTitleCtr}>
              <Text style={styles.modalTitle}>Add Summer Home Work</Text>
            </View>
            <View
              style={{
                borderBottomColor: '#000',
                borderBottomWidth: 0.5,
                marginVertical: 10,
              }}
            />
            <View>
              <TouchableOpacity
                style={styles.clsIconCtr}
                onPress={() => hideDialog()}>
                <Icon name="close" size={26} color={'#000'} />
              </TouchableOpacity>
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Branch <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={branchOpen}
                  value={branchValue}
                  setOpen={setBranchOpen}
                  setValue={setBranchValue}
                  placeholder="Please Select"
                  items={classItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                    zIndex: 100,
                  }}
                />
              </View>
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Class <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={modalClassOpen}
                  value={modalClassValue}
                  setOpen={setModalClassOpen}
                  setValue={setModalClassValue}
                  placeholder="Select Branch First"
                  items={classItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                    zIndex: 100,
                  }}
                />
              </View>
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Section <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={modalSectionOpen}
                  value={modalSectionValue}
                  setOpen={setModalSectionOpen}
                  setValue={setModalSectionValue}
                  placeholder="Select Class First"
                  items={classItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                    zIndex: 100,
                  }}
                />
              </View>
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Subject <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={subjectOpen}
                  value={subjectValue}
                  setOpen={setSubjectOpen}
                  setValue={setSubjectValue}
                  placeholder="Select Section First"
                  items={classItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                    zIndex: 100,
                  }}
                />
              </View>

              {/* Date Picker */}
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Date <Text style={{color: 'red'}}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    borderColor: '#ccc',
                    width: '100%',
                    height: '100%',
                    padding: 8, // Match spacing
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{color: '#000'}}>
                      {date.toISOString().split('T')[0]}{' '}
                      {/* Display date in YYYY-MM-DD format */}
                    </Text>
                    <Icon name="calendar" size={24} color={'#3B82F6'} />
                  </View>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>
              <View
                style={[
                  styles.picker,
                  {
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    paddingHorizontal: 15,
                  },
                ]}>
                <Text style={styles.text}>
                  Total Marks <Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  value={totalMarks}
                  onChangeText={text => setTotalMarks(text)}
                  style={{flex: 1, marginLeft: 5}}
                  keyboardType="numeric"
                  cursorColor={'#000'}
                />
              </View>
              <View
                style={[
                  styles.picker,
                  {
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    paddingHorizontal: 15,
                    height: 120,
                  },
                ]}>
                <Text style={styles.text}>
                  Description <Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  key="desc-input" // Add a unique key
                  value={desc}
                  onChangeText={text => setDesc(text)}
                  style={{
                    flex: 1,
                    marginLeft: 5,
                    height: '100%',
                    textAlignVertical: 'top',
                  }}
                  cursorColor={'#000'}
                  multiline={true}
                  numberOfLines={5}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <TouchableOpacity style={styles.saveBtn}>
                <Text style={styles.saveBtnTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TSummerHomework;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
  accountContainer: {
    height: 'auto',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: '5%',
    alignItems: 'center',
  },
  actHeadingContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  tblHdCtr: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bckBtn: {
    backgroundColor: '#5A6268',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bckBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bckBtnIcon: {
    height: 16,
    width: 16,
    tintColor: '#fff',
    marginRight: 5,
  },

  // Picker Container Styling
  picker: {
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 12,
    position: 'absolute',
    left: 15,
    top: -10,
    backgroundColor: '#fff',
    paddingHorizontal: 2,
  },
  dataCtr: {
    width: '100%',
  },
  addHWBtnCtr: {
    width: '95%',
    flexDirection: 'row-reverse',
    marginTop: 20,
  },
  addHWBtn: {
    width: '50%',
    height: 40,
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 5,
    marginLeft: 5
  },
  addHWBtnTxt: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },

  //Modal Styling
  modalTitleCtr: {
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clsIconCtr: {
    position: 'absolute',
    right: 5,
    top: -50,
  },
  saveBtn: {
    backgroundColor: '#28A745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveBtnTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
  attendanceCtr: {
    height: 'auto',
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
