import {
  Alert,
  BackHandler,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import RNPrint from 'react-native-print';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

interface UserData {
  student: {
    student_id: string;
    cand_name: string;
  };
  parent: {
    par_fathername: string;
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

interface Printer {
  name: string;
  url: string;
}
type TableRow = {
  sr: string | number;
  subject: string;
  totalMarks: string;
  obtainMarks: string;
};

const SummerHomeWorkResult = ({navigation}: any) => {
  const {token} = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);

  const originalData: TableRow[] = [
    {sr: '1', subject: 'English', totalMarks: '50', obtainMarks: '0'},
    {sr: 'Total', subject: '', totalMarks: '50', obtainMarks: '0'},
  ];

  const [tableData, setTableData] = useState<TableRow[]>(originalData);

  // const silentPrint = async () => {
  //   if (!selectedPrinter) {
  //     Alert.alert('Error', 'Must select printer first');
  //     return;
  //   }

  //   await RNPrint.print({
  //     printerURL: selectedPrinter.url,
  //     html: '<h1>Silent Print</h1>',
  //   });
  // };

  // const printPDF = async () => {
  //   try {
  //     const results = await RNHTMLtoPDF.convert({
  //       html: '<h1>Summer Homework Result</h1><p>No record present in the database!</p>',
  //       fileName: 'Summer_Homework_Result',
  //       base64: false,
  //     });

  //     if (results.filePath) {
  //       await RNPrint.print({filePath: results.filePath});
  //     } else {
  //       Alert.alert('Error', 'Failed to generate PDF');
  //     }
  //   } catch (error) {
  //     console.error('PDF Generation Error:', error);
  //     Alert.alert('Error', 'Something went wrong while generating the PDF.');
  //   }
  // };
  const studentInfo = [
    {key: 'Student Name', value: userData?.student.cand_name},
    {key: 'Father Name', value: userData?.parent.par_fathername},
    {key: 'Class', value: userData?.class.cls_name},
    {key: 'Section', value: userData?.section.sec_name},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchstudentsummerhomeworkmarking',
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
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  useEffect(() => {
    fetchData();
    const backAction = () => {
      navigation.navigate('LMS');
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
        <TouchableOpacity onPress={() => navigation.navigate('LMS' as never)}>
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
          Gujranwala City Grammar School
        </Text>
        <Text style={{fontSize: 16, textAlign: 'center'}}>Main Branch</Text>
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
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.row,
                  {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                ]}>
                <Text style={styles.column}>{item.sr}</Text>
                <Text style={styles.column}>{item.subject}</Text>
                <Text style={styles.column}>{item.totalMarks}</Text>
                <Text style={styles.column}>{item.obtainMarks}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.printButton}>
          <Icon name="printer" size={18} color={'#fff'} />
          <Text style={styles.printText}>Print</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SummerHomeWorkResult;

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
  },
  column: {
    width: 100,
    padding: 5,
    textAlign: 'center',
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
  },
});
