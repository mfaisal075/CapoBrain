import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useUser} from '../../../Ctx/UserContext';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import YoutubePlayer from 'react-native-youtube-iframe';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Courses {
  id: number;
  title: string;
  cls_name: string;
  sec_name: string;
  price: string;
}

interface CoursesData {
  course: {
    title: string;
    description: string;
    url: string;
    outcomes: string;
    price: string;
  };
  teacher: {
    app_name: string;
  };
  class: {
    cls_name: string;
  };
  section: {
    sec_name: string;
  };
}

const ParentCourses = ({navigation}: any) => {
  const {token} = useUser();
  const [isModalVisi, setModalVisi] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [courseData, setCourseData] = useState<CoursesData | null>(null);
  const [originalData, setOriginalData] = useState<Courses[]>([]);

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
  const videoId = extractVideoId(courseData?.course.url);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const studentInfo = [
    {
      key: 'Class',
      value: `${courseData?.class.cls_name} (${courseData?.section.sec_name})`,
    },
    {key: 'Rs.', value: courseData?.course.price},
    {key: 'Created By', value: courseData?.teacher.app_name},
  ];

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchstdcourse',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.course);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authencated');
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
      navigation.goBack();
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
          source={require('../../../assets/bgimg.jpg')}
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
        <Text style={styles.headerText}>Course</Text>
      </View>

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
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  const handleView = async (id: number) => {
                    try {
                      const response = await axios.get(
                        `https://demo.capobrain.com/showcourse?id=${item.id}&_token=${token}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );
                      setCourseData(response.data);
                      setModalVisi(true);
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
              <Text style={styles.title}>{item.title}</Text>
              <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                {item.price === '0' ? 'Free' : item.price}
              </Text>
            </View>
          </View>
        )}
      />

      <Modal isVisible={isModalVisi}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 600,
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

          <Text
            style={{
              color: '#3b82f6',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 10,
            }}>
            Course Detail
          </Text>

          <YoutubePlayer
            height={200}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
          />
          <View style={styles.border}>
            <View style={styles.details}>
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
            </View>
          </View>

          <View
            style={[styles.border, {marginLeft: '20%', marginRight: '20%'}]}>
            <Text
              style={{
                color: '#3b82f6',
              }}>
              {courseData?.course.description}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisi(!isModalVisi)}
            style={{
              backgroundColor: '#3b82f6',
              borderRadius: 5,
              width: 50,
              height: 23,
              alignSelf: 'center',
              marginTop: 'auto',
              marginBottom: 20,
            }}>
            <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ParentCourses;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
  },
  backButton: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#3b82f6',
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
    marginLeft: '20%',
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  value: {
    color: '#3b82f6',
    marginRight: '20%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'space-between',
  },
});
