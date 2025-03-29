import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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

interface ExamType {
  exam_type: string;
}

interface Results {
  id: number;
  sub_name: string;
  res_exam_type_id: string;
  res_total_marks: string;
  res_obtain_marks: string;
  percentage: string;
  grade: string;
}

const Result = ({navigation}: any) => {
  const {token} = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [examType, setExamType] = useState<ExamType[]>([]);
  const transformedExamTypes = examType.map(item => ({
    label: item.exam_type,
    value: item.exam_type,
  }));
  const [tableData, setTableData] = useState<Results[]>();

  const fetchData = async () => {
    if (token) {
      try {
        let url = `https://demo.capobrain.com/fetchstd_result?_token=${token}`;
        if (value) {
          url = `https://demo.capobrain.com/fetchexamtypresult?exam_type=${value}&id=${userData?.id}&_token=${token}`;
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTableData(response.data.result);
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

  const fetchExamType = async () => {
    try {
      const res = await axios.get(
        'https://demo.capobrain.com/examtypesdropdown',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setExamType(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const moveAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fetchData();
    fetchExamType();

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

    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [value]);

  const {totalMarks, totalObtain, totalPercentageDisplay, grade, remark} =
    React.useMemo(() => {
      let totalMarks = 0;
      let totalObtain = 0;

      if (tableData) {
        totalMarks = tableData.reduce(
          (acc, item) => acc + parseFloat(item.res_total_marks || '0'),
          0,
        );
        totalObtain = tableData.reduce(
          (acc, item) => acc + parseFloat(item.res_obtain_marks || '0'),
          0,
        );
      }

      const totalPercentage =
        totalMarks > 0 ? (totalObtain / totalMarks) * 100 : 0;

      // Grade calculation function
      const getGradeAndRemark = (percentage: number) => {
        const flooredPercentage = Math.floor(percentage);
        let grade = '';
        let remark = '';

        if (flooredPercentage >= 95) {
          grade = 'A+';
          remark = 'Outstanding performance! Continue to excel.';
        } else if (flooredPercentage >= 90) {
          grade = 'A';
          remark = 'Outstanding performance! Continue to excel.';
        } else if (flooredPercentage >= 87) {
          grade = 'B+';
          remark = "Very good effort, but there's always room for improvement!";
        } else if (flooredPercentage >= 83) {
          grade = 'B';
          remark = "Very good effort, but there's always room for improvement!";
        } else if (flooredPercentage >= 80) {
          grade = 'B-';
          remark = "Very good effort, but there's always room for improvement!";
        } else if (flooredPercentage >= 77) {
          grade = 'C+';
          remark =
            "Good work, but let's work on understanding the concepts even better.";
        } else if (flooredPercentage >= 73) {
          grade = 'C';
          remark =
            "Good work, but let's work on understanding the concepts even better.";
        } else if (flooredPercentage >= 70) {
          grade = 'C-';
          remark =
            "Good work, but let's work on understanding the concepts even better.";
        } else if (flooredPercentage >= 67) {
          grade = 'D+';
          remark = "You need to put in more effort. Let's try to improve.";
        } else if (flooredPercentage >= 63) {
          grade = 'D';
          remark = "You need to put in more effort. Let's try to improve.";
        } else if (flooredPercentage >= 60) {
          grade = 'D-';
          remark = "You need to put in more effort. Let's try to improve.";
        } else {
          grade = 'F';
          remark =
            "It's important to focus more on studies, seek help if you're struggling.";
        }

        return {grade, remark};
      };

      const {grade: calculatedGrade, remark: calculatedRemark} =
        getGradeAndRemark(totalPercentage);

      return {
        totalMarks,
        totalObtain,
        totalPercentageDisplay: totalPercentage.toFixed(0),
        grade: calculatedGrade,
        remark: calculatedRemark,
      };
    }, [tableData]);

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
          source={require('../assets/bgimg.jpg')}
        />
      </Animated.View>
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

      <View style={{width: '95%', marginTop: 10, marginBottom: 10}}>
        <DropDownPicker
          items={transformedExamTypes}
          open={open}
          setOpen={setOpen}
          value={value}
          setValue={setValue}
          maxHeight={200}
          placeholder="Select Exam Type Filter"
          placeholderStyle={{color: '#3b82f6'}}
          labelStyle={{color: '#3b82f6'}}
          textStyle={{color: '#3b82f6'}}
          ArrowUpIconComponent={({style}) => (
            <Icon name="chevron-up" size={22} color="#3b82f6" style={style} />
          )}
          ArrowDownIconComponent={({style}) => (
            <Icon name="chevron-down" size={22} color="#3b82f6" style={style} />
          )}
          TickIconComponent={({style}) => (
            <Icon name="check" size={22} color="#3b82f6" style={style} />
          )}
          style={styles.dropdown}
          dropDownContainerStyle={{marginLeft: 10}}
        />
      </View>

      {tableData && tableData.length > 0 ? (
        <>
          <View style={styles.row}>
            <Text
              style={[
                styles.column,
                styles.headTable,
                {width: 50, height: 40},
              ]}>
              Sr#
            </Text>
            <Text
              style={[
                styles.column,
                styles.headTable,
                {width: 50, height: 40},
              ]}>
              Subject
            </Text>

            {value === null && (
              <Text
                style={[
                  {
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    width: 50,
                    height: 40,
                    backgroundColor: '#3b82f6',
                    fontSize: 10,
                    paddingVertical: 5,
                  },
                ]}>
                Exam Type
              </Text>
            )}

            <Text
              style={[
                styles.column,
                styles.headTable,
                {width: 50, height: 40},
              ]}>
              Total Marks
            </Text>
            <Text
              style={[
                styles.column,
                styles.headTable,
                {width: 50, height: 40},
              ]}>
              Obtain Marks
            </Text>
            <Text
              style={[
                styles.column,
                styles.headTable,
                {width: 50, height: 40},
              ]}>
              Percentage
            </Text>
            <Text
              style={[
                styles.column,
                styles.headTable,
                {width: 50, height: 40},
              ]}>
              Grade
            </Text>
          </View>

          <FlatList
            data={tableData}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => {
              return (
                <View
                  style={[
                    styles.row,
                    {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                  ]}>
                  <Text style={[styles.column, {width: 50}]}>{index + 1}</Text>
                  <Text style={[styles.column, styles.boldText, {width: 50}]}>
                    {item.sub_name}
                  </Text>

                  {value === null && (
                    <Text
                      style={[
                        {
                          textAlign: 'center',
                          color: '#3b82f6',
                          fontSize: 10,
                        },
                        {width: 50},
                      ]}>
                      {item.res_exam_type_id}
                    </Text>
                  )}

                  <Text style={[styles.column, {width: 50}]}>
                    {item.res_total_marks}
                  </Text>
                  <Text style={[styles.column, {width: 50}]}>
                    {item.res_obtain_marks}
                  </Text>
                  <Text style={[styles.column, {width: 50}]}>
                    {item.percentage}
                  </Text>
                  <Text
                    style={[
                      {
                        textAlign: 'center',
                        color: '#3b82f6',
                        fontSize: 11,
                        flex: 1,
                      },
                      {width: 50},
                    ]}>
                    {item.grade}
                  </Text>
                </View>
              );
            }}
            ListFooterComponent={() => (
              <View>
                <View style={[styles.row, {backgroundColor: '#E2F0FF'}]}>
                  <Text
                    style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                    Total
                  </Text>
                  <Text style={[styles.column, {width: 50}]}></Text>
                  {value === null ? (
                    <Text style={[styles.column, {width: 50}]}></Text>
                  ) : null}

                  <Text
                    style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                    {totalMarks}
                  </Text>
                  <Text
                    style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                    {totalObtain}
                  </Text>
                  <Text
                    style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                    {totalPercentageDisplay}%
                  </Text>
                  <Text
                    style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                    {grade}
                  </Text>
                </View>

                <View
                  style={[
                    styles.row,
                    {
                      backgroundColor: '#E2F0FF',
                      borderTopWidth: 1,
                      height: 85,
                      borderTopColor: '#3b82f6',
                      marginBottom: 5,

                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: 10,
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        marginBottom: 5,
                        marginTop: 5,
                      },
                    ]}>
                    Teacher Review for Student:
                  </Text>
                  <Text
                    style={[
                      {
                        color: '#3b82f6',
                      },
                    ]}>
                    {remark}
                  </Text>
                </View>
              </View>
            )}
          />
        </>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#3b82f6', fontSize: 16, fontWeight: 'bold'}}>
            No data found in the database.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
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
  dropdown: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 5,
    minHeight: 30,
    marginLeft: 10,
  },

  flatList: {
    margin: 10,
    flex: 1,
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
  row: {
    flexDirection: 'row',
    width: '95%',
    height: 40,
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  column: {
    textAlign: 'center',
    borderRightColor: '#3b82f6',
    color: '#3b82f6',
    fontSize: 11,
    flex: 1,
  },
  headTable: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    paddingVertical: 5,
    textAlignVertical: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#3b82f6',
  },
});
