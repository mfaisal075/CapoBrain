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
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';
import {TextInput} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import YoutubePlayer from 'react-native-youtube-iframe';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LectureData {
  lecture: {
    date: string;
    url: string;
    description: string;
  };
  class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
  subject: {
    sub_name: string;
  };
  branch: {
    bra_name: string;
  };
}

interface Lecture {
  id: number;
  bra_name: string;
  cls_name: string;
  sec_name: string;
  sub_name: string;
}

const LMS = ({navigation}: any) => {
  const {token} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [lectureData, setLectureData] = useState<LectureData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playing, setPlaying] = useState(false);

  const extractVideoId = (url: any) => {
    if (!url) {
      return null;
    }

    if (url.includes('v=')) {
      const videoId = url.split('v=')[1];
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) {
        return videoId.substring(0, ampersandPosition);
      }
      return videoId;
    } else {
      return url.split('/').pop().split('?')[0];
    }
  };

  const videoId = extractVideoId(lectureData?.lecture.url);

  const [originalData, setOriginalData] = useState<Lecture[]>([]);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const studentInfo = [
    {key: 'Class', value: lectureData?.class.cls_name},
    {key: 'Section', value: lectureData?.section.sec_name},
    {key: 'Subject', value: lectureData?.subject.sub_name},
    {key: 'Date', value: lectureData?.lecture.date},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchstdlecture',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.lectures);
      } catch (error) {
        console.error('Error fetching data', error);
        throw error; // Ensure the error is thrown so useQuery can handle it
      }
    } else {
      console.log('User is not authenticated');
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
        <Text style={styles.headerText}>Lecture</Text>
      </View>
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        <View
          style={{
            width: 25,
            height: 25,
            borderColor: '#3b82f6',
            borderRadius: 50,
            borderWidth: 1,
            justifyContent: 'center',
            alignSelf: 'flex-end',
            margin: 5,
          }}>
          <Text
            style={{
              fontSize: 22,
              textAlign: 'center',
              top: -5,
              color: '#3b82f6',
            }}>
            +
          </Text>
        </View>
      </TouchableOpacity>

      {originalData.length > 0 ? (
        <FlatList
          data={originalData}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.titl}>{item.sub_name}</Text>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    const handleView = async (id: number) => {
                      try {
                        const response = await axios.get(
                          `https://demo.capobrain.com/leactureshow?id=${item.id}&_token=${token}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );
                        setLectureData(response.data);
                        setIsModalVisible(true);
                      } catch (error) {
                        console.log(error);
                        throw error;
                      }
                    };

                    handleView(item.id);
                  }}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../assets/visible.png')}
                  />
                </TouchableOpacity>
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

      {/* View Modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 500,
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
              source={require('../assets/bgimg.jpg')}
            />
          </Animated.View>

          <Text
            style={{
              color: '#3b82f6',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 10,
            }}>
            Show Lecture Detail
          </Text>

          <YoutubePlayer
            height={200}
            play={playing}
            videoId="HACa4b02mu8?si=M4Xh4mFZFyNjCv2Q"
            onChangeState={onStateChange}
          />

          <View
            style={[styles.border, {marginLeft: '10%', marginRight: '10%'}]}>
            <Text
              style={{
                color: '#3b82f6',
              }}>
              {lectureData?.lecture.description}
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 10}}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(!isModalVisible)}>
              <View
                style={{
                  backgroundColor: '#3b82f6',
                  borderRadius: 5,
                  width: 50,
                  height: 23,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                  Close
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Button Modal */}
      <Modal isVisible={isOpen}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 250,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#3b82f6',
            padding: 5,
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
              source={require('../assets/bgimg.jpg')}
            />
          </Animated.View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <Text style={{color: '#3b82f6', fontSize: 18, fontWeight: 'bold'}}>
              Select an Option
            </Text>

            <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>

          {/**buttons row */}

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StudentDiary' as never);
              setIsOpen(false);
            }}>
            <View
              style={{
                width: 190,
                height: 30,
                padding: 5,
                borderRadius: 10,
                backgroundColor: '#3b82f6',
                marginTop: 5,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  textAlign: 'center',
                }}>
                Daily Diary
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('DateSheet' as never);
              setIsOpen(false);
            }}>
            <View
              style={{
                width: 190,
                height: 30,
                padding: 5,
                borderRadius: 10,
                backgroundColor: '#3b82f6',
                marginTop: 5,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  textAlign: 'center',
                }}>
                Date Sheet
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LibraryBooks' as never);
              setIsOpen(false);
            }}>
            <View
              style={{
                width: 190,
                height: 30,
                padding: 5,
                borderRadius: 10,
                backgroundColor: '#3b82f6',
                marginTop: 5,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  textAlign: 'center',
                }}>
                Library Books
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SummerHomework' as never);
              setIsOpen(false);
            }}>
            <View
              style={{
                width: 190,
                height: 30,
                padding: 5,
                borderRadius: 10,
                backgroundColor: '#3b82f6',
                marginTop: 5,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  textAlign: 'center',
                }}>
                Summer HomeWork
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SummerHomeworkResult' as never);
              setIsOpen(false);
            }}>
            <View
              style={{
                width: 190,
                height: 30,
                padding: 5,
                borderRadius: 10,
                backgroundColor: '#3b82f6',
                marginTop: 5,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  textAlign: 'center',
                }}>
                Summer HomeWork Result
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default LMS;

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
    flex: 1,
    textAlign: 'center',
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
  lblText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  valueText: {
    marginRight: '5%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  branch: {
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 10,
  },
  border: {
    margin: 3,
    padding: 5,
  },
  text: {
    marginLeft: 15,
  },
  value: {
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
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
