import {
  Animated,
  BackHandler,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import {FlatList} from 'react-native';
import Modal from 'react-native-modal';

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

interface ExamType {
  exam_type: string;
}

interface ChildResult {
  id: number;
  sub_name: string;
  res_exam_type_id: string;
  res_total_marks: string;
  res_obtain_marks: string;
  percentage: string;
  grade: string;
}

const ParentResult = ({navigation}: any) => {
  const {token} = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOpn, setIsOpn] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [examType, setExamType] = useState<ExamType[]>([]);
  const transformedExamTypes = examType.map(item => ({
    label: item.exam_type,
    value: item.exam_type,
  }));
  const [tableDta, setTableDta] = useState<ChildResult[]>([]);
  const [originalData, setOriginalData] = useState<Results[]>([]);
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);

  const toggleModal = (id: number) => {
    setSelectedResultId(id);
    setModalVisible(!isModalVisible);
  };

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
      } catch (error) {
        console.error(error);
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

    const fetchChildResults = async () => {
      if (isModalVisible && selectedResultId !== null) {
        try {
          let url = `https://demo.capobrain.com/ResulCard?id=${selectedResultId}&_token=${token}`;
          if (value) {
            url = `https://demo.capobrain.com/fetchexamtypresult?exam_type=${value}&id=${selectedResultId}&_token=${token}`;
          }
          const res = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTableDta(res.data.result);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchChildResults();
    fetchData();
    fetchExamType();
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [selectedResultId, value, isModalVisible]);

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
  const {totalMarks, totalObtain, totalPercentageDisplay, grade, remark} =
    React.useMemo(() => {
      let totalMarks = 0;
      let totalObtain = 0;

      if (tableDta) {
        totalMarks = tableDta.reduce(
          (acc, item) => acc + parseFloat(item.res_total_marks || '0'),
          0,
        );
        totalObtain = tableDta.reduce(
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
    }, [tableDta]);

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
        <Text style={styles.headerText}>Results</Text>
      </View>

      {originalData.length > 0 ? (
        <FlatList
          data={originalData}
          keyExtractor={(item, index) => item.id.toString() || `item-${index}`}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => toggleModal(item.id)}>
              <View style={styles.card}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.title}>{item.cand_name}</Text>
                  <Text
                    style={{
                      color: '#3b82f6',
                    }}>
                    {item.cls_name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: '#3b82f6', fontWeight: 'bold'}}>
            No data found in the database!
          </Text>
        </View>
      )}

      {/* Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 'auto',
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
              Result Card
            </Text>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(!isModalVisible);
                setValue(null);
              }}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'column',
              borderWidth: 1,
              borderColor: '#3b82f6',
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View style={{flexDirection: 'column', marginTop: 10}}>
              <View style={{width: 200, marginTop: 9}}>
                <DropDownPicker
                  items={transformedExamTypes}
                  open={isOpn}
                  setOpen={setIsOpn}
                  value={value}
                  setValue={setValue}
                  maxHeight={200}
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
                    <Icon
                      name="check"
                      size={22}
                      color="#3b82f6"
                      style={style}
                    />
                  )}
                  placeholder="Select Exam Type Filter"
                  style={{
                    borderWidth: 1,
                    borderColor: '#3b82f6',
                    borderRadius: 5,
                    minHeight: 35,
                    marginLeft: 10,
                    width: '165%',
                  }}
                  dropDownContainerStyle={{
                    marginLeft: 10,
                    width: 330,
                    borderColor: '#3b82f6',
                  }}
                />
              </View>
            </View>
          </View>

          {tableDta.length > 0 ? (
            <>
              <View style={styles.row}>
                <Text style={[styles.column, styles.headTable, {width: 50}]}>
                  Sr#
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 50}]}>
                  Subject
                </Text>

                {value === null && (
                  <Text
                    style={[
                      {
                        textAlign: 'center',
                        borderRightWidth: 1,
                        borderRightColor: '#3b82f6',
                        color: 'white',
                        fontWeight: 'bold',
                        width: 50,
                        height: 30,
                        textAlignVertical: 'center',
                        backgroundColor: '#3b82f6',
                        fontSize: 9,
                        paddingVertical: 5,
                      },
                    ]}>
                    Exam Type
                  </Text>
                )}

                <Text style={[styles.column, styles.headTable, {width: 50}]}>
                  Total Marks
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 50}]}>
                  Obtain Marks
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 50}]}>
                  Percentage
                </Text>
                <Text style={[styles.column, styles.headTable, {width: 50}]}>
                  Grade
                </Text>
              </View>

              <FlatList
                data={tableDta}
                keyExtractor={(item, index) =>
                  item.id.toString() || `item-${index}`
                }
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={[
                        styles.row,
                        {
                          backgroundColor:
                            index % 2 === 0 ? 'white' : '#E2F0FF',
                        },
                      ]}>
                      <Text style={[styles.column, {width: 50}]}>
                        {index + 1}
                      </Text>
                      <Text
                        style={[styles.column, styles.boldText, {width: 50}]}>
                        {item.sub_name}
                      </Text>

                      {value === null && (
                        <Text
                          style={[
                            {
                              textAlign: 'center',
                              borderRightWidth: 1,
                              borderRightColor: '#3b82f6',
                              color: '#3b82f6',
                              fontSize: 11,
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
                    {/* Total Row */}
                    <View style={[styles.row, {backgroundColor: '#E2F0FF'}]}>
                      <Text
                        style={[
                          styles.column,
                          {width: 50, fontWeight: 'bold'},
                        ]}>
                        Total
                      </Text>
                      <Text style={[styles.column, {width: 50}]}></Text>
                      {value === null ? (
                        <Text style={[styles.column, {width: 50}]}></Text>
                      ) : null}

                      <Text
                        style={[
                          styles.column,
                          {width: 50, fontWeight: 'bold'},
                        ]}>
                        {totalMarks}
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          {width: 50, fontWeight: 'bold'},
                        ]}>
                        {totalObtain}
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          {width: 50, fontWeight: 'bold'},
                        ]}>
                        {totalPercentageDisplay}%
                      </Text>
                      <Text
                        style={[
                          styles.column,
                          {width: 50, fontWeight: 'bold'},
                        ]}>
                        {grade}
                      </Text>
                    </View>

                    {/* Remark Row */}
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

              <TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#3b82f6',
                    borderRadius: 5,
                    width: 60,
                    height: 30,
                    alignSelf: 'center',
                    marginTop: 20,
                    marginBottom: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="printer"
                    size={16}
                    color="white"
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                    }}>
                    Print
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#3b82f6',
                  fontWeight: 'bold',
                }}>
                No data found in the database!
              </Text>
            </View>
          )}
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
  },
  item: {
    borderBottomColor: '#ccc',
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
    borderColor: '#3b82f6',
    borderRadius: 5,
    minHeight: 30,
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
    color: '#3b82f6',
    fontSize: 11,
    flex: 1,
  },
  headTable: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 9,
    height: 30,
    textAlignVertical: 'center',
    paddingVertical: 5,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#3b82f6',
  },
});
