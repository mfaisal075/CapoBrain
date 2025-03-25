import {
  Alert,
  Animated,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useUser} from '../../Ctx/UserContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';

interface Lessons {
  id: number;
  date: string;
  cls_name: string;
  sec_name: string;
  sub_name: string;
  bra_name: string;
}

interface LessonsData {
  lesson: {
    date: string;
    les_desc: string;
    file: string;
  };
  class: {
    cls_name: string;
  };
  subject: {
    sub_name: string;
  };
  branch: {
    bra_name: string;
  };
}

const LessonPlan = ({navigation}: any) => {
  const {token} = useUser();
  const [originalData, setOriginalData] = useState<Lessons[]>([]);
  const [visible, setVisible] = useState(false);
  const [lessonData, setLessonData] = useState<LessonsData | null>(null);

  const toggleModal = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/showlesson?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLessonData(res.data);
      setVisible(!visible);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = async (url: any) => {
    try {
      const fileName = url.split('/').pop();
      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const options = {
        fromUrl: url,
        toFile: downloadDest,
      };

      const download = RNFS.downloadFile(options);

      download.promise.then(response => {
        if (response.statusCode === 200) {
          Alert.alert('Success', `File downloaded to ${downloadDest}`);
        } else {
          Alert.alert('Error', 'Failed to download file');
        }
      });
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'An error occurred while downloading the file');
    }
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/lesson-fetchlesson' + `?_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.lessons);
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
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty or invalid dates

    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Return formatted date
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
        <Text style={styles.headerText}>Lesson Plan</Text>
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
              <Text style={styles.title}>{item.sub_name}</Text>
              <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                {formatDate(item.date)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#3b82f6'}}>{item.cls_name}</Text>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => toggleModal(item.id)}>
                <Image
                  style={styles.actionIcon}
                  source={require('../../assets/visible.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal isVisible={visible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 300,
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

          <Text
            style={{
              color: '#3b82f6',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 10,
            }}>
            Planned Lesson Details
          </Text>

          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Text style={styles.label}>Attachment:</Text>
            <TouchableOpacity
              onPress={() => {
                downloadFile(
                  `https://demo.capobrain.com/lessons/${lessonData?.lesson.file}`,
                );
              }}>
              <Text
                style={[styles.valueText, {textDecorationLine: 'underline'}]}>
                Attachment
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.label, {marginTop: 5}]}>Description:</Text>
          <Text style={styles.valueText}>{lessonData?.lesson.les_desc}</Text>

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginBottom: 10,
            }}></View>
          <TouchableOpacity onPress={() => setVisible(false)}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 23,
                alignSelf: 'center',
                marginBottom: 20,
              }}>
              <Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>
                Close
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default LessonPlan;

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
  label: {
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: '10%',
  },
  valueText: {
    color: '#3b82f6',
    marginLeft: '10%',
    marginRight: '10%',
  },
});
