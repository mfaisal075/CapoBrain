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
import React, {useEffect, useRef, useState} from 'react';
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
  const originalData: ResultData[] = [];
  const [tableData, setTableData] = useState<ResultData[]>(originalData);

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
              <Text style={styles.titl}>{item.sub_name}</Text>
              <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                Total Marks: {item.total_marks}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={printPDF}>
                <View style={styles.printButton}>
                  <Icon
                    name="printer"
                    size={20}
                    color="#3b82f6"
                    style={styles.printIcon}
                  />
                  <Text style={styles.printText}>Print</Text>
                </View>
              </TouchableOpacity>
              <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                Obtain Marks: {item.obtain_marks}
              </Text>
            </View>
          </View>
        )}
      />
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
  text: {
    fontWeight: 'bold',
    marginLeft: 15,
  },
  value: {
    padding: 2,
    marginLeft: 10,
  },
  printButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  printIcon: {
    marginRight: 5,
  },
  printText: {
    color: '#3b82f6',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    marginBottom: 10,
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
  titl: {
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
