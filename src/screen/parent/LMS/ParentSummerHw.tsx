import {
  Animated,
  BackHandler,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useUser} from '../../../Ctx/UserContext';
import axios from 'axios';
import {FlatList} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface HomeWork {
  id: number;
  total_marks: string;
  sub_name: string;
  cls_name: string;
  sec_name: string;
  student_id: string;
  cand_name: string;
}

interface HomeWorkData {
  summer_homework: {
    desc: string;
    total_marks: string;
  };
  subject: {
    sub_name: string;
  };
}

const ParentSummerHw = ({navigation}: any) => {
  const {token} = useUser();
  const [isModalVisi, setModalVisi] = useState(false);
  const [homeworkData, setHomeworkData] = useState<HomeWorkData | null>(null);

  const toggleModl = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/showstudentsummerwork?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setHomeworkData(res.data);
    } catch (error) {
      console.log(error);
    }
    setModalVisi(!isModalVisi);
  };

  const [originalData, setOriginalData] = useState<HomeWork[]>([]);

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `https://demo.capobrain.com/studentsummerhomework?_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setOriginalData(response.data.homework);
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error('User is not authentcated');
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
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
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
        <Text style={styles.headerText}>Summer Vacation HomeWork</Text>
      </View>

      <FlatList
        style={{paddingVertical: 10}}
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
                onPress={() => toggleModl(item.id)}>
                <Image
                  style={styles.actionIcon}
                  source={require('../../../assets/visible.png')}
                />
              </TouchableOpacity>

              <Text style={styles.title}>{item.sub_name}</Text>
              <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                {item.total_marks}
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
            maxHeight: 250,
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
            Summer HomeWork
          </Text>

          <Text style={styles.lblText}>Description:</Text>
          <Text style={styles.valueText}>
            {homeworkData?.summer_homework.desc}
          </Text>

          <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 10}}>
            <TouchableOpacity onPress={() => setModalVisi(!isModalVisi)}>
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
    </View>
  );
};

export default ParentSummerHw;

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

  lblText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#3b82f6',
    marginLeft: '10%',
    marginTop: 15,
  },
  valueText: {
    marginRight: '10%',
    marginLeft: '10%',
    color: '#3b82f6',
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
