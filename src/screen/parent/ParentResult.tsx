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
      <FlatList
        style={{paddingVertical: 10}}
        data={originalData}
        keyExtractor={item => item.id.toString()}
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

      {/* Modal */}
      <Modal isVisible={isModalVisible} style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
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

          <View style={{paddingBottom: 20}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 10,
              }}>
              <Text
                style={{color: '#3b82f6', fontSize: 18, fontWeight: 'bold'}}>
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

            <DropDownPicker
              items={transformedExamTypes}
              open={isOpn}
              setOpen={setIsOpn}
              value={value}
              setValue={setValue}
              maxHeight={150}
              placeholder="Select Exam Type Filter"
              style={{
                borderWidth: 1,
                borderColor: '#3b82f6',
                borderRadius: 5,
                minHeight: 30,
                width: '95%',
                alignSelf: 'center',
              }}
              dropDownContainerStyle={{
                width: '95%',
                marginLeft: 9,
              }}
            />

            <View style={{maxHeight: 300, marginTop: 10}}>
              <FlatList
                style={{paddingVertical: 20}}
                nestedScrollEnabled={true}
                data={tableDta}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <View style={styles.card}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.title}>{item.sub_name}</Text>
                      <Text style={{color: '#3b82f6'}}>
                        {item.res_exam_type_id}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{color: '#3b82f6'}}>
                        Total Marks: {item.res_total_marks}
                      </Text>
                      <Text style={{color: '#3b82f6'}}>
                        Obtain Marks: {item.res_obtain_marks}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{color: '#3b82f6'}}>{item.percentage}</Text>
                      <Text style={{color: '#3b82f6'}}>{item.grade}</Text>
                    </View>
                  </View>
                )}
              />
            </View>

            <Text
              style={{
                marginTop: 6,
                marginLeft: 10,
                fontSize: 16,
                color: '#3b82f6',
              }}>
              Teacher Review for Student:
            </Text>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 14,
                marginBottom: 10,
                color: '#3b82f6',
              }}>
              It's important to focus more on studies, seek help if you're
              struggling.
            </Text>

            <TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#3b82f6',
                  borderRadius: 5,
                  borderWidth: 1,
                  width: 80,
                  height: 35,
                  alignSelf: 'center',
                  borderColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                  marginTop: 20,
                }}>
                <Icon
                  name="printer"
                  size={15}
                  color="white"
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 14,
                  }}>
                  Print
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: '33.33%',
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
});
