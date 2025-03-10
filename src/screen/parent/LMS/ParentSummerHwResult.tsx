import {
  Alert,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../../Ctx/UserContext';
import axios from 'axios';
import {FlatList} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';

interface Printer {
  name: string;
  url: string;
}
type TableRow = {
  sr: string | number;
  id: string;
  name: string;
  classname: string;
  branchname: string;
  action: string;
};

type TableModal = {
  sr: string | number;
  subject: string;
  totalmarks: string;
  obtainmarks: string;
};

interface UserData {
  parent: {
    par_fathername: string;
    parent_id: string;
  };
  student: {
    cand_name: string;
    student_id: string;
  };
  class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
  school: {
    scl_institute_name: string;
  };
  branch: {
    bra_name: string;
  };
}

const ParentSummerHwResult = ({navigation}: any) => {
  const {token} = useUser();
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const originalData: TableRow[] = [
    {
      sr: '1',
      id: 'GCGS1124S001',
      name: 'Ayesha Zumar',
      classname: 'Five',
      branchname: 'Main Branch',
      action: 'View',
    },
    {
      sr: '2',
      id: 'GCGS1124S002',
      name: 'Nayab Fatimah',
      classname: 'Nursery',
      branchname: 'Main Branch',
      action: 'View',
    },
    {
      sr: '3',
      id: 'GCGS1124S003',
      name: 'Fiza',
      classname: 'Two',
      branchname: 'Gujranwala Branch',
      action: 'View',
    },
    {
      sr: '4',
      id: 'GCGS1124S004',
      name: 'Fahmeen',
      classname: 'Three',
      branchname: 'Gujranwala Branch',
      action: 'View',
    },
    {
      sr: '5',
      id: 'GCGS1124S002',
      name: 'Talha',
      classname: 'Five',
      branchname: 'Gujranwala Branch',
      action: 'View',
    },
  ];
  const [tableData, setTableData] = useState<TableRow[]>(originalData);

  const silentPrint = async () => {
    if (!selectedPrinter) {
      Alert.alert('Error', 'Must select printer first');
      return;
    }

    await RNPrint.print({
      printerURL: selectedPrinter.url,
      html: '<h1>Silent Print</h1>',
    });
  };

  const printPDF = async () => {
    try {
      const results = await RNHTMLtoPDF.convert({
        html: '<h1>Summer Homework Result</h1><p>No record present in the database!</p>',
        fileName: 'Summer_Homework_Result',
        base64: false,
      });

      if (results.filePath) {
        await RNPrint.print({filePath: results.filePath});
      } else {
        Alert.alert('Error', 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('PDF Generation Error:', error);
      Alert.alert('Error', 'Something went wrong while generating the PDF.');
    }
  };

  const studentInfo = [
    {key: 'Parent ID', value: userData?.parent.parent_id},
    {key: 'Father Name', value: userData?.parent.par_fathername},
  ];

  const stdInfo = [
    {key: 'Student ID', value: userData?.student.student_id},
    {key: 'Student Name', value: userData?.student.cand_name},
    {key: 'Father Name', value: userData?.parent.par_fathername},
    {
      key: 'Class',
      value: `${userData?.class.cls_name}` + ` (${userData?.section.sec_name})`,
    },
  ];

  const originalDta: TableModal[] = [
    {sr: '1', subject: 'English', totalmarks: '50', obtainmarks: '40'},
    {sr: '2', subject: 'Urdu', totalmarks: '50', obtainmarks: '30'},
    {sr: '3', subject: 'Math', totalmarks: '50', obtainmarks: '30'},
  ];
  const [ModalData, setModalData] = useState<TableModal[]>(originalDta);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchstudentsummerhomeworkmarking' +
            `?_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserData(response.data);
        return response.data.output;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  useEffect(() => {
    fetchData();
    const backAction = () => {
      navigation.navigate('ParentLMS');
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Summer HomeWork Result</Text>
      </View>
      <View style={styles.schoolInfo}>
        <Text style={{fontSize: 18, textAlign: 'center'}}>
          {userData?.school.scl_institute_name}
        </Text>
        <Text style={{fontSize: 16, textAlign: 'center'}}>
          {userData?.branch.bra_name}
        </Text>
        <FlatList
          data={studentInfo}
          keyExtractor={item => item.key}
          renderItem={({item}) => (
            <View style={styles.infoRow}>
              <Text style={styles.txt}>{item.key}:</Text>
              <Text style={styles.valu}>{item.value}</Text>
            </View>
          )}
        />
      </View>
      <ScrollView
        horizontal
        style={{marginBottom: hp('5%')}}
        contentContainerStyle={{flexGrow: 0.8}}>
        <View>
          <FlatList
            style={styles.flatList}
            data={tableData}
            nestedScrollEnabled
            keyExtractor={(item, index) =>
              item.sr ? item.sr.toString() : index.toString()
            }
            ListHeaderComponent={() => (
              <View style={styles.row}>
                {[
                  'Sr#',
                  'ID',
                  'Name',
                  'Class Name',
                  'Branch Name',
                  'Action',
                ].map(header => (
                  <Text key={header} style={[styles.column, styles.headTable]}>
                    {header}
                  </Text>
                ))}
              </View>
            )}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.row,
                  {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                ]}>
                <Text style={styles.column}>{item.sr}</Text>
                <Text style={styles.column}>{item.id}</Text>
                <Text style={styles.column}>{item.name}</Text>
                <Text style={styles.column}>{item.classname}</Text>
                <Text style={styles.column}>{item.branchname}</Text>
                <TouchableOpacity
                  onPress={
                    item.action === 'View'
                      ? toggleModal
                      : (null as unknown as undefined)
                  }
                  disabled={item.action === 'Not Available'}>
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
                        {width: 18},
                        {height: 18},
                        {marginLeft: 4},
                        {marginTop: 4},
                      ]}
                      source={require('../../../assets/visible.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 600,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6C757D',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            <Text style={{color: '#6C757D', fontSize: 18}}>Home Work</Text>

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: '#6C757D'}}>✖</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              marginTop: 10,
              alignSelf: 'center',
            }}>
            <Text style={{fontSize: 16}}>
              {userData?.school.scl_institute_name}
            </Text>
            <Text style={{fontSize: 16, marginLeft: 90}}>
              {userData?.branch.bra_name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View style={{flexDirection: 'column', marginTop: 10}}>
              <View style={{width: 200, marginTop: 9}}></View>
              {/**std info */}
              <FlatList
                data={stdInfo}
                keyExtractor={item => item.key}
                renderItem={({item}) => (
                  <View style={styles.infoRow}>
                    <Text style={styles.text}>{item.key}:</Text>
                    <Text style={styles.value}>{item.value}</Text>
                  </View>
                )}
              />
            </View>
          </View>

          <ScrollView
            horizontal
            style={{marginBottom: hp('5%')}}
            contentContainerStyle={{flexGrow: 0.8}}>
            <View>
              <FlatList
                style={styles.flatList}
                data={ModalData}
                nestedScrollEnabled
                keyExtractor={(item, index) =>
                  item.sr ? item.sr.toString() : index.toString()
                }
                ListHeaderComponent={() => (
                  <View style={styles.row}>
                    {['Sr#', 'Subject', 'Total Marks', 'Obtain Marks'].map(
                      header => (
                        <Text
                          key={header}
                          style={[styles.column, styles.headTable]}>
                          {header}
                        </Text>
                      ),
                    )}
                  </View>
                )}
                renderItem={({item}) => (
                  <View style={styles.row}>
                    <Text style={[styles.column, styles.withBorder]}>
                      {item.sr}
                    </Text>
                    <Text style={[styles.column, styles.withBorder]}>
                      {item.subject}
                    </Text>
                    <Text style={[styles.column, styles.withBorder]}>
                      {item.totalmarks}
                    </Text>
                    <Text style={[styles.column, styles.withBorder]}>
                      {item.obtainmarks}
                    </Text>
                  </View>
                )}
              />
            </View>
          </ScrollView>

          <TouchableOpacity>
            <View
              style={{
                backgroundColor: '#218838',
                borderRadius: 5,
                width: 50,
                height: 30,
                alignSelf: 'center',
                marginTop: 20,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                Print
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ParentSummerHwResult;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F1F1E9',
    margin: 10,
    marginTop: 80,
    padding: 10,
  },

  title: {
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 10,
  },

  infoContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#6C757D',
    height: 390,
    width: 'auto',
    margin: 5,
    padding: 10,
  },
  schoolInfo: {
    marginVertical: 10,
  },
  studentInfo: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    marginLeft: 15,
  },
  value: {
    padding: 2,
    marginLeft: 10,
  },
  noRecordText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6C757D',
  },
  printButton: {
    flexDirection: 'row',
    backgroundColor: '#218838',
    borderRadius: 5,
    borderWidth: 1,
    width: 54,
    height: 30,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  printIcon: {
    width: 10,
    height: 10,
    tintColor: 'white',
    marginRight: 5,
  },
  printText: {
    color: 'white',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  txt: {
    fontWeight: 'bold',
    marginLeft: 15,
    padding: 5,
  },
  valu: {
    padding: 5,
    marginLeft: 10,
  },
  flatList: {
    margin: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  column: {
    width: 140,
    padding: 5,
    textAlign: 'center',
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  actionView: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 60,
    marginTop: 1,
    marginBottom: 1,
  },
  notAvailable: {
    color: 'red',
    tintColor: 'red',
    width: 80,
    height: 27,
    borderRadius: 5,
  },
  available: {
    color: 'darkblue',
    tintColor: 'darkblue',
    width: 50,
    height: 27,
    borderRadius: 5,
  },
  withBorder: {
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
