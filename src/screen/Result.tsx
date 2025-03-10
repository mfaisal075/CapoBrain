import {
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TableRow {
  sr: string | number;
  subject: string;
  examType: string;
  totalMarks: string;
  obtainMarks: string;
  percentage: string;
  grade: string;
}

interface UserData {
  id: number;
  candidate: {
    cand_name: string;
  };
  bra: {
    bra_name: string;
  };
  parent: {
    par_fathername: string;
  };
  class: {
    cls_name: string;
  };
  school: {
    scl_institute_name: string;
  };
  section: {
    sec_name: string;
  };
}

const Result = ({navigation}: any) => {
  const {token} = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const originalData: TableRow[] = [
    {
      sr: '1',
      subject: 'Pakistan Studies',
      examType: 'First Term',
      totalMarks: '50',
      obtainMarks: '50',
      percentage: '100%',
      grade: 'A+',
    },
    {
      sr: 'Total',
      subject: '',
      examType: '',
      totalMarks: '50',
      obtainMarks: '50',
      percentage: '100%',
      grade: 'A+',
    },
  ];

  const [tableData, setTableData] = useState<TableRow[]>(originalData);

  const items = [
    {label: 'Select Exams Type Filter', value: ''},
    {label: 'Mids', value: 'Mids'},
    {label: 'Annual', value: 'Annual'},
    {label: 'Mid', value: 'Mid'},
    {label: 'Final', value: 'Final'},
    {label: 'MID TERM', value: 'MID'},
    {label: 'ANNUAL TERM', value: 'ANNUAL%20TERM'},
    {label: 'MOCK TEST', value: 'MOCK%20TEST'},
    {label: 'Grand Test', value: 'Grand%20test'},
    {label: 'December Test', value: 'december%20test'},
    {label: 'Phase Test', value: 'phase%20test'},
    {label: 'Annualism', value: 'Annualism'},
  ];

  const studentInfo = [
    {key: 'Student Name', value: userData?.candidate.cand_name},
    {key: 'Father Name', value: userData?.parent.par_fathername},
    {key: 'Class', value: userData?.class.cls_name},
    {key: 'Section', value: userData?.section.sec_name},
  ];

  const fetchData = async (examType: string | null | undefined = null) => {
    if (token) {
      try {
        let url = 'https://demo.capobrain.com/fetchstd_result';
        if (examType) {
          url = `https://demo.capobrain.com/fetchexamtypresult?exam_type=${examType}&id=${userData?.id}&_token=${token}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const details = await axios.get(
          'https://demo.capobrain.com/fetchstd_result',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserData(details.data);
        return response.data.output;
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  useEffect(() => {
    fetchData();
    const backAction = () => {
      navigation.navigate('Home');
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
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Results</Text>
      </View>

      <View
        style={{flexDirection: 'column', marginTop: 10, marginHorizontal: 10}}>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            marginVertical: 5,
            fontWeight: '600',
          }}>
          {userData?.school.scl_institute_name}
        </Text>
        <Text style={{fontSize: 16, textAlign: 'center'}}>
          {userData?.bra.bra_name}
        </Text>
        <View style={styles.examPickerCtr}>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={open}
            value={value}
            setOpen={setOpen}
            setValue={setValue}
            placeholder="Select Exams Type Filter"
            items={items}
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
            onChangeValue={selectedValue => {
              setValue(selectedValue);
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 5,
        }}>
        <FlatList
          data={studentInfo}
          keyExtractor={item => item.key}
          renderItem={({item}) => (
            <View style={styles.infoRow}>
              <Text style={styles.text}>{item.key}:</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          )}
        />

        <Image
          style={styles.studentImage}
          source={require('../assets/avatar.png')}
        />
      </View>

      {/* Table */}
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
                  'Subject',
                  'Exam Type',
                  'Total Marks',
                  'Obtain Marks',
                  'Percentage',
                  'Grade',
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
                <Text style={styles.column}>{item.subject}</Text>
                <Text style={styles.column}>{item.examType}</Text>
                <Text style={styles.column}>{item.totalMarks}</Text>
                <Text style={styles.column}>{item.obtainMarks}</Text>
                <Text style={styles.column}>{item.percentage}</Text>
                <Text style={styles.column}>{item.grade}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
      <View style={{bottom: hp('2%')}}>
        <Text style={styles.label}>Teacher Review for Student:</Text>
        <Text style={styles.valueText}>
          Outstanding performance! Continue to excel.
        </Text>
      </View>
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    width: '50%',
  },
  value: {
    width: '50%',
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
    textAlign: 'center',
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#d5d5d9',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 20,
    marginBottom: 5,
  },
  studentImage: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginRight: 20,
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
  label: {
    fontWeight: 'bold',
    marginLeft: hp('1%'),
  },
  valueText: {
    marginLeft: hp('1%'),
  },
  examPickerCtr: {
    width: '90%',
    marginHorizontal: '5%',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    marginBottom: 5,
  },
});
