import {
  Alert,
  Animated,
  BackHandler,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

interface ResultData {
  id: number;
  sub_name: string;
  total_marks: string;
  obtain_marks: string;
}

const SummerHomeWorkResult = ({navigation}: any) => {
  const {token} = useUser();
  const [tableData, setTableData] = useState<ResultData[]>([]);

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
        setTableData(response.data.marking);
      } catch (error) {
        console.log(error);
      }
    } else {
      throw new Error('User is not authenticated');
    }
  };

  const moveAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fetchData();

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
      navigation.navigate('LMS');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const {totalMarks, totalObtain} = useMemo(() => {
    let totalMarks = 0;
    let totalObtain = 0;

    if (tableData) {
      totalMarks = tableData.reduce(
        (acc, item) => acc + parseFloat(item.total_marks || '0'),
        0,
      );

      totalObtain = tableData.reduce(
        (acc, item) => acc + parseFloat(item.obtain_marks || '0'),
        0,
      );
    }

    return {
      totalMarks,
      totalObtain,
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
          source={require('../../assets/bgimg.jpg')}
        />
      </Animated.View>
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

      <View style={styles.row}>
        <Text style={[styles.column, styles.headTable, {width: 50}]}>Sr#</Text>
        <Text style={[styles.column, styles.headTable, {width: 50}]}>
          Subject
        </Text>

        <Text style={[styles.column, styles.headTable, {width: 50}]}>
          Total Marks
        </Text>
        <Text style={[styles.column, styles.headTable, {width: 50}]}>
          Obtain Marks
        </Text>
      </View>

      {tableData.length > 0 ? (
        <FlatList
          data={tableData}
          keyExtractor={(item, index) => item.id.toString() || `item-${index}`}
          renderItem={({item, index}) => {
            return (
              <View
                style={[
                  styles.row,
                  {backgroundColor: index % 2 === 0 ? 'white' : '#E2F0FF'},
                ]}>
                <Text style={[styles.column, {width: 50}]}>{index + 1}</Text>
                <Text style={[styles.column, {width: 50}]}>
                  {item.sub_name}
                </Text>
                <Text style={[styles.column, {width: 50}]}>
                  {item.total_marks}
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
                  {item.obtain_marks}
                </Text>
              </View>
            );
          }}
          ListFooterComponent={() => (
            <View>
              {/* Total Row */}
              <View style={[styles.row, {backgroundColor: '#E2F0FF'}]}>
                <Text style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                  Total
                </Text>
                <Text style={[styles.column, {width: 50}]}></Text>

                <Text style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                  {totalMarks}
                </Text>
                <Text style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                  {totalObtain}
                </Text>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: '#3b82f6', fontWeight: 'bold'}}>
            No data found in the database!
          </Text>
        </View>
      )}

      <TouchableOpacity onPress={printPDF}>
        <View style={styles.printButton}>
          <Icon
            name="printer"
            size={16}
            color="white"
            style={styles.printIcon}
          />
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
    backgroundColor: '#3b82f6',
    borderRadius: 5,
    width: 60,
    height: 30,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  printIcon: {
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
    fontSize: 10,
    paddingVertical: 5,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#3b82f6',
  },
});
