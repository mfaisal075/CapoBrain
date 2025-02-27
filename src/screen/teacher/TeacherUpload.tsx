import {
  BackHandler,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {Dimensions} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';

const TeacherUpload = ({navigation}: any) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [fileTitle, setFileTitle] = useState('');
  const [uploadDate, setUploadDate] = useState(new Date());
  const [showUploadDatePicker, setShowUploadDatePicker] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [classValue, setClassValue] = useState(null);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [sectionValue, setSectionValue] = useState(null);
  const {token} = useUser();

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
        return response.data.output;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  const {data, refetch, isFetching} = useQuery({
    queryKey: ['tableData'],
    queryFn: fetchData,
    refetchOnWindowFocus: true, // Fetch new data when screen is focused
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
    setShowUploadDatePicker(false); // Hide the picker
    if (selectedDate) setUploadDate(selectedDate); // Set the selected date
  };

  const showModal = () => {
    setUploadModalVisible(true);
  };
  const hideModal = () => {
    setFileTitle('');
    setUploadDate(new Date());
    setUploadModalVisible(false);
  };

  const branchItems: {label: string; value: string}[] = [];

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
            <Text style={styles.tblHdCtr}>Upload Material</Text>
          </View>

          {/* Back Button */}
          <View style={styles.bckBtnCtr}>
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
              <Text style={styles.bckBtnText}>Dashboard</Text>
            </TouchableOpacity>
            {/* Apply Leave Button */}
            <TouchableOpacity style={styles.leaveBtn} onPress={showModal}>
              <Text style={styles.bckBtnText}>Upload Material</Text>
            </TouchableOpacity>
          </View>

          {/* Data Container */}
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
                      width: 125, // Adjust width as needed
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
                      marginBottom: -3,
                      borderBottomColor: 'white',
                    },
                    tr: {
                      backgroundColor: '#fff',
                      marginHorizontal: -3,
                    },
                    a: {
                      backgroundColor: '#3B82F6',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 5,
                      color: '#fff',
                      textDecorationLine: 'none',
                      fontWeight: 'bold',
                      fontSize: 12,
                    },
                  }}
                />
              ) : null}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Upload Material Modal */}
      <Modal
        visible={uploadModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideModal}>
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
              <Text style={styles.modalTitle}>Upload Material</Text>
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
                onPress={() => hideModal()}>
                <Icon name="close" size={26} color={'#000'} />
              </TouchableOpacity>
              <View
                style={[
                  styles.picker,
                  {
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    paddingHorizontal: 15,
                    height: 40,
                  },
                ]}>
                <Text style={styles.text}>
                  File Title <Text style={{color: 'red'}}>*</Text>
                </Text>
                <TextInput
                  key="subject-input" // Add a unique key
                  value={fileTitle}
                  onChangeText={text => setFileTitle(text)}
                  style={{
                    flex: 1,
                    textAlignVertical: 'top',
                    backgroundColor: 'transparent',
                  }}
                  cursorColor={'#000'}
                  multiline={true}
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
                    height: 40,
                  },
                ]}>
                <Text style={styles.text}>
                  Select File <Text style={{color: 'red'}}>*</Text>
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity style={styles.chooseBtn}>
                    <Text>Choose File</Text>
                  </TouchableOpacity>
                  <Text style={{marginLeft: 5}}>No file chosen</Text>
                </View>
              </View>

              {/* Leave Date */}
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Date <Text style={{color: 'red'}}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowUploadDatePicker(true)}
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
                      {uploadDate.toISOString().split('T')[0]}{' '}
                      {/* Display date in YYYY-MM-DD format */}
                    </Text>
                    <Icon name="calendar" size={24} color={'#3B82F6'} />
                  </View>
                </TouchableOpacity>

                {showUploadDatePicker && (
                  <DateTimePicker
                    value={uploadDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>

              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Class <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={classOpen}
                  value={classValue}
                  setOpen={setClassOpen}
                  setValue={setClassValue}
                  placeholder="Please Select Class"
                  items={branchItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                  }}
                />
              </View>
              <View style={[styles.picker, {marginTop: 20}]}>
                <Text style={styles.text}>
                  Section <Text style={{color: 'red'}}>*</Text>
                </Text>
                <DropDownPicker
                  open={sectionOpen}
                  value={sectionValue}
                  setOpen={setSectionOpen}
                  setValue={setSectionValue}
                  placeholder="Select Class First"
                  items={branchItems}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                    height: 'auto',
                  }}
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

export default TeacherUpload;

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
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
  },
  bckBtnCtr: {
    height: 40,
    width: '100%',
    paddingHorizontal: '5%',
    flexDirection: 'row',
    paddingRight: 20,
    marginBottom: 20,
  },
  bckBtn: {
    backgroundColor: '#5A6268',
    paddingHorizontal: 15,
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
  leaveBtn: {
    backgroundColor: '#28A745',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  dataCtr: {
    width: '100%',
    height: 200,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataTxt: {
    fontSize: 18,
    color: 'gray',
  },
  // Picker Container Styling
  pickerCtr: {
    height: 'auto',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: '5%',
  },
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
  addHWBtnCtr: {
    width: '90%',
    flexDirection: 'row-reverse',
    marginTop: 20,
  },
  addHWBtn: {
    width: '55%',
    height: 40,
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  addHWBtnTxt: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  innerDataCtr: {
    width: '100%',
    height: '100%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
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
  chooseBtn: {
    backgroundColor: '#EFEFEF',
    padding: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
});
