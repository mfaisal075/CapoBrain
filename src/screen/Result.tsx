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
  const examTables: Results[] = [];
  const [tableData, setTableData] = useState<Results[]>(examTables);

  const studentInfo = [
    {key: 'Student Name', value: userData?.candidate.cand_name},
    {key: 'Father Name', value: userData?.parent.par_fathername},
    {key: 'Class', value: userData?.class.cls_name},
    {key: 'Section', value: userData?.section.sec_name},
  ];

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
            style={{paddingHorizontal: 10, paddingVertical: 10}}
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
          style={styles.dropdown}
          dropDownContainerStyle={{marginLeft: 10}}
        />
      </View>

      <FlatList
        data={tableData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>{item.sub_name}</Text>
              <Text
                style={{
                  color: '#3b82f6',
                }}>
                {item.res_exam_type_id}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#3b82f6',
                }}>
                Total Marks: {item.res_total_marks}
              </Text>
              <Text
                style={{
                  color: '#3b82f6',
                }}>
                Obtain Marks: {item.res_obtain_marks}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#3b82f6',
                }}>
                {item.percentage}
              </Text>
              <Text
                style={{
                  color: '#3b82f6',
                }}>
                {item.grade}
              </Text>
            </View>
          </View>
        )}
      />
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
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  column: {
    width: 140,
    padding: 2,
  },
  headTable: {
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
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
});
