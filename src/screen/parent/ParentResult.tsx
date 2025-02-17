import {
  BackHandler,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar';
import {DataTable} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';

const ParentResult = ({navigation}: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [numberOfItemsPerPageList] = useState([10, 50, 100]);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const examItems = [
    {label: 'Mids', value: 'mids'},
    {label: 'Annual', value: 'annual'},
    {label: 'Mid', value: 'mid'},
    {label: 'Final', value: 'final'},
    {label: 'MID TERM', value: 'mid_term'},
    {label: 'ANNUAL TERM', value: 'annual_term'},
    {label: 'MOCK TEST', value: 'mock_test'},
    {label: 'Grand Test', value: 'grand_test'},
    {label: 'December Test', value: 'december_test'},
    {label: 'Phase Test', value: 'phase_test'},
  ];

  const [items] = useState([
    {
      sr: 1,
      branch: 'Main Branch',
      registration: 'FR#015',
      student: 'Hibba',
      father: 'Abdullah',
      bForm: '88775-7757784-4',
      class: 'Five',
    },
  ]);

  const [resultItems] = useState([
    {
      sr: 1,
      subject: 'English',
      examType: 'MOCK TEST',
      totalMarks: 50,
      obtainMarks: 40,
      percentage: '80%',
      grade: 'B-',
    },
    {
      sr: 2,
      subject: 'Urdu',
      examType: 'MOCK TEST',
      totalMarks: 50,
      obtainMarks: 40,
      percentage: '80%',
      grade: 'B-',
    },
    {
      sr: 3,
      subject: 'Math',
      examType: 'MOCK TEST',
      totalMarks: 50,
      obtainMarks: 40,
      percentage: '80%',
      grade: 'B-',
    },
    {
      sr: 4,
      subject: 'Islamiyat',
      examType: 'MOCK TEST',
      totalMarks: 50,
      obtainMarks: 40,
      percentage: '80%',
      grade: 'B-',
    },
    {
      sr: 5,
      subject: 'English',
      examType: 'Final',
      totalMarks: 50,
      obtainMarks: 0,
      percentage: '0%',
      grade: 'F',
    },
    {
      sr: 6,
      subject: 'Urdu',
      examType: 'Final',
      totalMarks: 70,
      obtainMarks: 0,
      percentage: '0%',
      grade: 'F',
    },
    {
      sr: 'Total',
      totalMarks: 320,
      obtainMarks: 160,
      percentage: '50%',
      grade: 'F',
    },
  ]);

  useEffect(() => {
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
            <Text style={styles.tblHdCtr}>Results</Text>
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
          </View>

          {/* Table */}
          <View style={styles.tblDataCtr}>
            <ScrollView horizontal>
              <DataTable>
                {/* Table Header */}
                <DataTable.Header>
                  {[
                    'Sr#',
                    'Branch',
                    'Registration',
                    'Student',
                    'Father',
                    'B-Form',
                    'Class',
                    'Actions',
                  ].map((title, index) => (
                    <DataTable.Title
                      key={index}
                      textStyle={{
                        color: 'black',
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}
                      style={{
                        width: index === 0 ? 50 : 125, // Reduced width for the first header
                        paddingHorizontal: 5,
                        borderColor: '#000',
                        borderWidth: 0.5,
                        backgroundColor: '#F0F0F0',
                        justifyContent: 'center',
                      }}>
                      {title}
                    </DataTable.Title>
                  ))}
                </DataTable.Header>

                {/* Table Rows */}
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <DataTable.Row key={index}>
                      {[
                        item.sr,
                        item.branch,
                        item.registration,
                        item.student,
                        item.father,
                        item.bForm,
                        item.class,
                      ].map((value, idx) => (
                        <DataTable.Cell
                          key={idx}
                          textStyle={{color: '#000', fontSize: 12}}
                          style={{
                            width: idx === 0 ? 50 : 125, // Reduced width for the first cell
                            paddingHorizontal: 5,
                            borderColor: '#000',
                            borderWidth: 0.5,
                            justifyContent: 'center',
                          }}>
                          {value}
                        </DataTable.Cell>
                      ))}

                      {/* Actions Cell with "Results Card" Button */}
                      <DataTable.Cell
                        style={{
                          width: 125,
                          paddingHorizontal: 5,
                          borderColor: '#000',
                          borderWidth: 0.5,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'green',
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                          onPress={() => showModal()}>
                          <Icon
                            name="file"
                            size={16}
                            color={'#fff'}
                            style={{marginRight: 5}}
                          />
                          <Text style={{color: 'white', fontSize: 12}}>
                            Results Card
                          </Text>
                        </TouchableOpacity>
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))
                ) : (
                  <DataTable.Row>
                    <DataTable.Cell
                      textStyle={{
                        color: 'gray',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}
                      style={{
                        width: '100%',
                        paddingHorizontal: 5,
                        borderColor: '#000',
                        borderWidth: 0.5,
                        justifyContent: 'center',
                      }}>
                      No data found
                    </DataTable.Cell>
                  </DataTable.Row>
                )}
              </DataTable>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Result Modal */}
      <Modal
        visible={modalVisible}
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
              <Text style={styles.modalTitle}>Account Details</Text>
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

              <ScrollView
                style={styles.viewModalBody}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled">
                <View style={styles.schoolNameCtr}>
                  <Text style={styles.schoolNameTxt}>
                    Gujranwala City Grammar School
                  </Text>
                  <Text style={[styles.schoolNameTxt, {marginTop: 10}]}>
                    Main Branch
                  </Text>
                </View>
                <View style={styles.examPickerCtr}>
                  <DropDownPicker
                    listMode="SCROLLVIEW"
                    open={open}
                    value={value}
                    setOpen={setOpen}
                    setValue={setValue}
                    placeholder="Select Exams Type Filter"
                    items={examItems}
                    style={{
                      borderColor: 'transparent',
                      backgroundColor: 'transparent',
                      borderRadius: 10,
                    }}
                    dropDownContainerStyle={{
                      borderColor: '#ccc',
                      borderRadius: 10,
                      height: 180,
                    }}
                  />
                </View>
                <View style={styles.stdDetails}>
                  <View style={styles.detailsCtr}>
                    <Text style={styles.stdDetailsText}>Student Name:</Text>
                    <Text style={styles.stdDetailsText}>Father Name:</Text>
                    <Text style={styles.stdDetailsText}>Class:</Text>
                    <Text style={styles.stdDetailsText}>Section:</Text>
                  </View>
                  <View style={styles.detailsCtr}>
                    <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                      Hibba
                    </Text>
                    <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                      Abdullah
                    </Text>
                    <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                      Five
                    </Text>
                    <Text style={[styles.stdDetailsText, {fontWeight: '500'}]}>
                      B
                    </Text>
                  </View>
                </View>
                <ScrollView horizontal>
                  <DataTable>
                    <DataTable.Header>
                      {[
                        'Sr#',
                        'Subject',
                        'Exam Type',
                        'Total Marks',
                        'Obtain Marks',
                        'Percentage',
                        'Grade',
                      ].map((title, index) => (
                        <DataTable.Title
                          key={index}
                          textStyle={{
                            color: 'black',
                            fontSize: 14,
                            fontWeight: 'bold',
                          }}
                          style={{
                            width: index === 0 ? 50 : 125, // Reduced width for the first header
                            paddingHorizontal: 5,
                            borderColor: '#000',
                            borderWidth: 0.5,
                            backgroundColor: '#F0F0F0',
                          }}>
                          {title}
                        </DataTable.Title>
                      ))}
                    </DataTable.Header>

                    {resultItems.length > 0 ? (
                      resultItems.map((item, index) => (
                        <DataTable.Row key={index}>
                          {[
                            item.sr,
                            item.subject,
                            item.examType,
                            item.totalMarks,
                            item.obtainMarks,
                            item.percentage,
                            item.grade,
                          ].map((value, idx) => (
                            <DataTable.Cell
                              key={idx}
                              textStyle={{color: '#000', fontSize: 12}}
                              style={{
                                width: idx === 0 ? 50 : 125, // Reduced width for the first cell
                                paddingHorizontal: 5,
                                borderColor: '#000',
                                borderWidth: 0.5,
                              }}>
                              {value}
                            </DataTable.Cell>
                          ))}
                        </DataTable.Row>
                      ))
                    ) : (
                      <DataTable.Row>
                        <DataTable.Cell
                          textStyle={{
                            color: 'gray',
                            fontSize: 16,
                            fontWeight: 'bold',
                          }}
                          style={{
                            width: '100%',
                            paddingHorizontal: 5,
                            borderColor: '#000',
                            borderWidth: 0.5,
                            justifyContent: 'center',
                          }}>
                          No data found
                        </DataTable.Cell>
                      </DataTable.Row>
                    )}
                  </DataTable>
                </ScrollView>

                <View style={styles.reviewCtr}>
                  <Text
                    style={[
                      styles.reviewTxt,
                      {fontSize: 18, fontWeight: '600'},
                    ]}>
                    Teacher Review for Student:
                  </Text>
                  <Text
                    style={[
                      styles.reviewTxt,
                      {fontSize: 16, marginBottom: 10},
                    ]}>
                    It's important to focus more on studies, seek help if you're
                    struggling.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ParentResult;

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
  bckBtnCtr: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
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
  attendanceCtr: {
    height: 'auto',
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tblDataCtr: {
    marginTop: 10,
    height: 'auto',
    width: '100%',
    padding: 10,
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
  viewModalBody: {
    height: 600,
    borderColor: 'rgba(0,0,0, 0.5)',
    borderWidth: 0.5,
    borderRadius: 5,
  },
  schoolNameCtr: {
    paddingHorizontal: 50,
    marginTop: 30,
  },
  schoolNameTxt: {
    fontSize: 22,
    textAlign: 'center',
  },
  examPickerCtr: {
    width: '90%',
    marginHorizontal: 20,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
  },
  stdDetails: {
    width: '90%',
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  detailsCtr: {
    width: '50%',
    height: 'auto',
    flexDirection: 'column',
    marginTop: 10,
  },
  stdDetailsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  reviewCtr: {
    marginTop: 10,
    width: '90%',
    paddingHorizontal: '5%',
  },
  reviewTxt: {
    marginTop: 10,
  },
});
