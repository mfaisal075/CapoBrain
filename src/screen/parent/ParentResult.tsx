import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {TextInput} from 'react-native';
import {FlatList} from 'react-native';
import Modal from 'react-native-modal';

const srNumber: number = 5;
const row = {
  sr: srNumber.toString(),
};

type TableRow = {
  sr: string | number;
  branch: string;
  registration: string;
  student: string;
  father: string;
  Bform: string;
  class: string;
  action: string;
};

interface Results {
  id: number;
  form_id: string;
  student_id: string;
  cand_name: string;
  par_fathername: string;
  cand_bform: string;
  cls_name: string;
  bra_name: string;
}

interface StudentData {
  candidate: {
    cand_name: string;
  };
  school: {
    scl_institute_name: string;
  };
  parent: {
    par_fathername: string;
  };
  bra: {
    bra_name: string;
  };
  class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
}

const srNumbr: number = 5;
const rw = {
  sr: srNumbr.toString(),
};

type TableCol = {
  sr: string | number;
  subject: string;
  examType: string;
  totalMarks: string;
  obtainMarks: string;
  percentage: string;
  grade: string;
};

const ParentResult = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOpn, setIsOpn] = useState(false);
  const [currentValu, setCurrentValu] = useState(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [currentValue, setCurrentValue] = useState<string | null>(
    'Select Exams Type Filter',
  );

  const toggleModal = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/ResulCard?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setStudentData(res.data);
    } catch (error) {
      console.log(error);
    }
    setModalVisible(!isModalVisible);
  };

  const [originalData, setOriginalData] = useState<Results[]>([]);
  const [tableData, setTableData] = useState<Results[]>(originalData);

  const itemz = [
    {label: 'Select Exams Type Filter', value: 'Select Exams Type Filter'},
    {label: 'Mids', value: 'Mids'},
    {label: 'Annual', value: 'Annual'},
    {label: 'Mid', value: 'Mid'},
    {label: 'Final', value: 'Final'},
    {label: 'MID TERM', value: 'MID TERM'},
    {label: 'ANNUAL TERM', value: 'ANNUAL%20TERM'},
    {label: 'MOCK TEST', value: 'MOCK%20TEST'},
    {label: 'Grand Test', value: 'Grand%20test'},
    {label: 'December Test', value: 'december%20test'},
    {label: 'Phase Test', value: 'phase%20test'},
    {label: 'Annualism', value: 'Annualism'},
  ];

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

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tableData.length / entriesPerPage);
  const handlePageChange = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const currentEntries = tableData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );
  const studentInfo = [
    {key: 'Student Name', value: studentData?.candidate.cand_name},
    {key: 'Father Name', value: studentData?.parent.par_fathername},
    {key: 'Class', value: studentData?.class.cls_name},
    {key: 'Section', value: studentData?.section.sec_name},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchparentresult',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setOriginalData(response.data.acc);
        setTableData(response.data.acc);
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
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  {
    /*tables*/
  }
  const examTables: {[key: string]: TableCol[]} = {
    'Select Exams Type Filter': [
      {
        sr: 1,
        subject: 'English',
        examType: 'Mid',
        totalMarks: '100',
        obtainMarks: '80',
        percentage: '80%',
        grade: 'B-',
      },
      {
        sr: 2,
        subject: 'Urdu',
        examType: 'Mid',
        totalMarks: '100',
        obtainMarks: '70',
        percentage: '70%',
        grade: 'C-',
      },
      {
        sr: 3,
        subject: 'English',
        examType: 'Final',
        totalMarks: '100',
        obtainMarks: '20',
        percentage: '20%',
        grade: 'F',
      },
      {
        sr: 4,
        subject: 'English',
        examType: 'Grand Test',
        totalMarks: '75',
        obtainMarks: '67',
        percentage: '89%',
        grade: 'B+',
      },
      {
        sr: 5,
        subject: 'Urdu',
        examType: 'Grand Test',
        totalMarks: '75',
        obtainMarks: '20',
        percentage: '27%',
        grade: 'F',
      },
      {
        sr: 6,
        subject: 'Math',
        examType: 'Grand Test',
        totalMarks: '35',
        obtainMarks: '30',
        percentage: '86%',
        grade: 'B',
      },
      {
        sr: 7,
        subject: 'Urdu',
        examType: 'Final',
        totalMarks: '100',
        obtainMarks: '20',
        percentage: '20%',
        grade: 'F',
      },
      {
        sr: 8,
        subject: 'Math',
        examType: 'Final',
        totalMarks: '80',
        obtainMarks: '30',
        percentage: '38%',
        grade: 'F',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '665',
        obtainMarks: '337',
        percentage: '50%',
        grade: 'F',
      },
    ],
    Mids: [
      {
        sr: '1',
        subject: 'English',
        examType: 'Mids',
        totalMarks: '50',
        obtainMarks: '40',
        percentage: '80%',
        grade: 'B-',
      },
      {
        sr: '2',
        subject: 'Urdu',
        examType: 'Mids',
        totalMarks: '50',
        obtainMarks: '45',
        percentage: '90%',
        grade: 'A',
      },
      {
        sr: '3',
        subject: 'Math',
        examType: 'Mids',
        totalMarks: '50',
        obtainMarks: '47',
        percentage: '94%',
        grade: 'A',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '150',
        obtainMarks: '132',
        percentage: '88%',
        grade: 'B+',
      },
    ],
    Annual: [
      {
        sr: '1',
        subject: 'English',
        examType: 'Annual',
        totalMarks: '100',
        obtainMarks: '90',
        percentage: '90%',
        grade: 'A',
      },
      {
        sr: '2',
        subject: 'Urdu',
        examType: 'Annual',
        totalMarks: '100',
        obtainMarks: '90',
        percentage: '90%',
        grade: 'A',
      },
      {
        sr: '3',
        subject: 'Math',
        examType: 'Annual',
        totalMarks: '100',
        obtainMarks: '80',
        percentage: '80%',
        grade: 'B-',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '300',
        obtainMarks: '260',
        percentage: '85%',
        grade: 'B',
      },
    ],
    Mid: [
      {
        sr: '1',
        subject: 'English',
        examType: 'Mid',
        totalMarks: '50',
        obtainMarks: '0',
        percentage: '0%',
        grade: 'F',
      },
      {
        sr: '2',
        subject: 'Urdu',
        examType: 'Mid',
        totalMarks: '50',
        obtainMarks: '0',
        percentage: '0%',
        grade: 'F',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '100',
        obtainMarks: '0',
        percentage: '0%',
        grade: 'F',
      },
    ],
    Final: [
      {
        sr: '1',
        subject: 'English',
        examType: 'Final',
        totalMarks: '75',
        obtainMarks: '0',
        percentage: '0%',
        grade: 'F',
      },
      {
        sr: '2',
        subject: 'Urdu',
        examType: 'Final',
        totalMarks: '75',
        obtainMarks: '0',
        percentage: '0%',
        grade: 'F',
      },
      {
        sr: '3',
        subject: 'Math',
        examType: 'Final',
        totalMarks: '75',
        obtainMarks: '0',
        percentage: '0%',
        grade: 'F',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '150',
        obtainMarks: '0',
        percentage: '0%',
        grade: 'F',
      },
    ],
    'MID TERM': [
      {
        sr: '1',
        subject: 'English',
        examType: 'MID TERM',
        totalMarks: '50',
        obtainMarks: '40',
        percentage: '80%',
        grade: 'B-',
      },
      {
        sr: '2',
        subject: 'Urdu',
        examType: 'MID TERM',
        totalMarks: '50',
        obtainMarks: '45',
        percentage: '90%',
        grade: 'A',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '100',
        obtainMarks: '80',
        percentage: '80%',
        grade: 'B',
      },
    ],
    'ANNUAL%20TERM': [
      {
        sr: '1',
        subject: 'Science',
        examType: 'ANNUAL TERM',
        totalMarks: '100',
        obtainMarks: '80',
        percentage: '80%',
        grade: 'B',
      },
      {
        sr: '2',
        subject: 'Math',
        examType: 'ANNUAL TERM',
        totalMarks: '100',
        obtainMarks: '90',
        percentage: '90%',
        grade: 'A',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '200',
        obtainMarks: '170',
        percentage: '85%',
        grade: 'B+',
      },
    ],
    'MOCK%20TEST': [
      {
        sr: '1',
        subject: 'Biology',
        examType: 'Mock Test',
        totalMarks: '50',
        obtainMarks: '48',
        percentage: '96%',
        grade: 'A+',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '50',
        obtainMarks: '48',
        percentage: '96%',
        grade: 'A+',
      },
    ],
    'Grand%20test': [
      {
        sr: '1',
        subject: 'Computer',
        examType: 'Grand Test',
        totalMarks: '100',
        obtainMarks: '92',
        percentage: '92%',
        grade: 'A',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '100',
        obtainMarks: '92',
        percentage: '92%',
        grade: 'A',
      },
    ],
    'december%20test': [
      {
        sr: '1',
        subject: 'Computer',
        examType: 'December Test',
        totalMarks: '100',
        obtainMarks: '92',
        percentage: '92%',
        grade: 'A',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '100',
        obtainMarks: '92',
        percentage: '92%',
        grade: 'A',
      },
    ],
    'phase%20test': [
      {
        sr: '1',
        subject: 'Computer',
        examType: 'Phase Test',
        totalMarks: '100',
        obtainMarks: '92',
        percentage: '92%',
        grade: 'A',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '100',
        obtainMarks: '92',
        percentage: '92%',
        grade: 'A',
      },
    ],
    Annualism: [
      {
        sr: '1',
        subject: 'Computer',
        examType: 'Annualism',
        totalMarks: '100',
        obtainMarks: '92',
        percentage: '92%',
        grade: 'A',
      },
      {
        sr: 'Total',
        subject: '',
        examType: '',
        totalMarks: '100',
        obtainMarks: '92',
        percentage: '92%',
        grade: 'A',
      },
    ],
  };

  useEffect(() => {
    if (currentValue) {
      setTableDta(examTables[currentValue] || []);
    }
  }, [currentValue]);

  const [tableDta, setTableDta] = useState<TableCol[]>(
    examTables['Select Exams Type Filter'],
  );

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
        <Text style={styles.headerText}>Results</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <View style={{width: 80, marginTop: 9}}>
          <DropDownPicker
            items={items}
            open={isOpen}
            setOpen={setIsOpen}
            value={entriesPerPage}
            setValue={callback => {
              setEntriesPerPage(prev =>
                typeof callback === 'function' ? callback(prev) : callback,
              );
            }}
            maxHeight={200}
            placeholder=""
            style={styles.dropdown}
          />
        </View>

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor={'gray'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
        <View>
          <FlatList
            style={{
              margin: 10,
              flex: 1,
            }}
            data={currentEntries}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            ListHeaderComponent={() => (
              <View style={styles.row}>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 100},
                    {padding: 1},
                  ]}>
                  Sr#
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Branch
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Registration#
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 200},
                    {padding: 1},
                  ]}>
                  Student
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Father
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 200},
                    {padding: 1},
                  ]}>
                  B-Form
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 150},
                    {padding: 1},
                  ]}>
                  Class
                </Text>
                <Text
                  style={[
                    styles.column,
                    styles.headTable,
                    {width: 100},
                    {padding: 1},
                  ]}>
                  Actions
                </Text>
              </View>
            )}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.row,
                  {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                ]}>
                <Text style={[styles.column, {width: 100}, {padding: 5}]}>
                  {index + 1}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.bra_name}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.form_id}
                </Text>
                <Text style={[styles.column, {width: 200}, {padding: 5}]}>
                  {item.cand_name}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.par_fathername}
                </Text>
                <Text style={[styles.column, {width: 200}, {padding: 5}]}>
                  {item.cand_bform}
                </Text>
                <Text style={[styles.column, {width: 150}, {padding: 5}]}>
                  {item.cls_name}
                </Text>

                <TouchableOpacity onPress={() => toggleModal(item.id)}>
                  <View
                    style={[
                      item.bra_name === 'Not Available'
                        ? styles.notAvailable
                        : styles.available,
                    ]}>
                    <Image
                      style={[
                        item.bra_name === 'Not Available'
                          ? styles.notAvailable
                          : styles.available,
                        {width: 15},
                        {height: 15},
                        {marginLeft: 40},
                        {marginTop: 4},
                      ]}
                      source={require('../../assets/id.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        <Text>
          Showing {(currentPage - 1) * entriesPerPage + 1} to
          {Math.min(currentPage * entriesPerPage, tableData.length)} of
          {tableData.length} entries
        </Text>
        <View style={styles.paginationButtons}>
          <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)}>
            <Text style={styles.paginationText}>Previous</Text>
          </TouchableOpacity>
          <View style={styles.pageNumber}>
            <Text style={styles.pageText}>{currentPage}</Text>
          </View>
          <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)}>
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* View Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 'auto',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6C757D',
          }}>
          <ScrollView nestedScrollEnabled>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text style={{color: '#6C757D', fontSize: 18}}>Result Card</Text>

              <TouchableOpacity
                onPress={() => setModalVisible(!isModalVisible)}>
                <Text style={{color: '#6C757D'}}>✖</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'column',
                borderWidth: 1,
                borderColor: '#6C757D',
              }}
            />

            <View
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#6C757D',
                height: 670,
                width: 'auto',
                margin: 10,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: 10,
                }}>
                <Text style={{fontSize: 18, textAlign: 'center'}}>
                  {studentData?.school.scl_institute_name}
                </Text>
                <Text style={{fontSize: 16, textAlign: 'center'}}>
                  {studentData?.bra.bra_name}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                }}>
                <View style={{width: '90%', marginTop: 9}}>
                  <DropDownPicker
                    items={itemz}
                    open={isOpn}
                    setOpen={setIsOpn}
                    value={currentValue}
                    setValue={setCurrentValue}
                    maxHeight={200}
                    placeholder="Select Exam Type Filter"
                    style={{
                      borderWidth: 1,
                      borderColor: '#d5d5d9',
                      borderRadius: 5,
                      minHeight: 40,
                      marginHorizontal: 15,
                    }}
                    dropDownContainerStyle={{
                      marginHorizontal: 15,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  {/**std info */}
                  <FlatList
                    style={{width: '50%'}}
                    data={studentInfo}
                    keyExtractor={item => item.key}
                    scrollEnabled={false}
                    renderItem={({item}) => (
                      <View style={styles.infoRow}>
                        <Text style={styles.txt}>{item.key}:</Text>
                        <Text style={styles.value}>{item.value}</Text>
                      </View>
                    )}
                  />
                  <Image
                    style={{
                      width: 60,
                      height: 60,
                      marginRight: 20,
                    }}
                    source={require('../../assets/avatar.png')}
                  />
                </View>
              </View>
              <ScrollView horizontal contentContainerStyle={{flexGrow: 1}}>
                <View>
                  <FlatList
                    style={{
                      margin: 10,
                      flex: 1,
                    }}
                    data={tableDta}
                    keyExtractor={(item, index) =>
                      item.sr ? String(item.sr) : String(index)
                    }
                    ListHeaderComponent={() => (
                      <View style={styles.row}>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 100},
                            {padding: 1},
                          ]}>
                          Sr#
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Subject
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Exam Type
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 200},
                            {padding: 1},
                          ]}>
                          Total Marks
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Obtain Marks
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 200},
                            {padding: 1},
                          ]}>
                          Percentange
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.headTable,
                            {width: 150},
                            {padding: 1},
                          ]}>
                          Grade
                        </Text>
                      </View>
                    )}
                    renderItem={({item}) => (
                      <View style={styles.row}>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 100},
                            {padding: 5},
                          ]}>
                          {item.sr}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 150},
                            {padding: 5},
                          ]}>
                          {item.subject}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 150},
                            {padding: 5},
                          ]}>
                          {item.examType}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 200},
                            {padding: 5},
                          ]}>
                          {item.totalMarks}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 150},
                            {padding: 5},
                          ]}>
                          {item.obtainMarks}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 200},
                            {padding: 5},
                          ]}>
                          {item.percentage}
                        </Text>
                        <Text
                          style={[
                            styles.column,
                            styles.withBorder,
                            {width: 150},
                            {padding: 5},
                          ]}>
                          {item.grade}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </ScrollView>
              <>
                <Text
                  style={{
                    marginTop: 6,
                    marginLeft: 10,
                    fontSize: 16,
                  }}>
                  Teacher Review for Student:
                </Text>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 14,
                    marginBottom: 20,
                  }}>
                  It's important to focus more on studies, seek help if you're
                  struggling.
                </Text>
              </>
            </View>
            <TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#218838',
                  borderRadius: 5,
                  borderWidth: 1,
                  width: 60,
                  height: 30,
                  alignSelf: 'center',
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                <Icon
                  name="printer"
                  size={18}
                  color={'#fff'}
                  style={{marginTop: 5, marginRight: 4}}
                />
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    marginTop: 5,
                  }}>
                  Print
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ParentResult;

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
    marginBottom: 5,
    borderRadius: 4,
    textAlign: 'center',
    color: 'gray',
  },
  item: {
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: '33.33%',
    textAlign: 'center',
  },
  withBorder: {
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
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
    width: 27,
    height: 27,
    borderRadius: 5,
  },
  head: {
    backgroundColor: '#008604',
    height: 25,
  },
  text: {
    fontWeight: 'bold',
    marginLeft: 15,
    padding: 5,
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#d5d5d9',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  txt: {
    fontWeight: 'bold',
    marginLeft: 15,
  },
  value: {
    marginLeft: 10,
  },
});
