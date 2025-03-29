import {
  Alert,
  Animated,
  BackHandler,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../../../Ctx/UserContext';
import axios from 'axios';
import {FlatList} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import Modal from 'react-native-modal';

interface HomeWork {
  id: number;
  student_id: string;
  cand_name: string;
  cls_name: string;
  bra_name: string;
}

interface HomeWorkResult {
  id: number;
  total_marks: string;
  obtain_marks: string;
  sub_name: string;
}

const ParentSummerHwResult = ({navigation}: any) => {
  const {token} = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [originalData, setOriginalData] = useState<HomeWork[]>([]);

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
  const [ModalData, setModalData] = useState<HomeWorkResult[]>([]);

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
        setOriginalData(response.data.parent_students);
      } catch (error) {
        console.log(error);
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

  const {totalMarks, totalObtain} = useMemo(() => {
    let totalMarks = 0;
    let totalObtain = 0;

    if (ModalData) {
      totalMarks = ModalData.reduce(
        (acc, item) => acc + parseFloat(item.total_marks || '0'),
        0,
      );

      totalObtain = ModalData.reduce(
        (acc, item) => acc + parseFloat(item.obtain_marks || '0'),
        0,
      );
    }

    return {
      totalMarks,
      totalObtain,
    };
  }, [ModalData]);

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
          source={require('../../../assets/bgimg.jpg')}
        />
      </Animated.View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ParentLMS' as never)}>
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
        style={{paddingVertical: 10}}
        data={originalData}
        keyExtractor={(item, index) => item.id.toString() || `item-${index}`}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.titl}>{item.cand_name}</Text>

              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  const handleView = async (id: number) => {
                    try {
                      const response = await axios.get(
                        `https://demo.capobrain.com/summerhomeworkmarking?id=${item.id}&_token=${token}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );
                      setModalData(response.data.marking);
                      setModalVisible(true);
                    } catch (error) {
                      console.log(error);
                      throw error;
                    }
                  };

                  handleView(item.id);
                }}>
                <Image
                  style={styles.actionIcon}
                  source={require('../../../assets/visible.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

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
              source={require('../../../assets/bgimg.jpg')}
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

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
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
              <View style={{width: 200, marginTop: 9}}></View>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={[styles.column, styles.headTable, {width: 50}]}>
              Sr#
            </Text>
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

          <FlatList
            data={ModalData}
            keyExtractor={(item, index) =>
              item.id.toString() || `item-${index}`
            }
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
                  <Text
                    style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                    Total
                  </Text>
                  <Text style={[styles.column, {width: 50}]}></Text>

                  <Text
                    style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                    {totalMarks}
                  </Text>
                  <Text
                    style={[styles.column, {width: 50, fontWeight: 'bold'}]}>
                    {totalObtain}
                  </Text>
                </View>
              </View>
            )}
          />

          <TouchableOpacity>
            <TouchableOpacity
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
              }}
              onPress={printPDF}>
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
            </TouchableOpacity>
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
    width: 10,
    height: 10,
    marginRight: 5,
    tintColor: '#3b82f6',
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
  actionView: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notAvailable: {
    color: 'red',
    tintColor: 'red',

    borderRadius: 5,
  },
  available: {
    color: 'darkblue',
    tintColor: 'darkblue',
    width: 50,
    height: 27,
    borderRadius: 5,
    top: -3,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#3b82f6',
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
    fontSize: 10,
    paddingVertical: 5,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#3b82f6',
  },
});
