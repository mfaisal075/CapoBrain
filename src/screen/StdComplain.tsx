import {
  Alert,
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
import React, {useEffect, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../Ctx/UserContext';
import axios from 'axios';

interface Complains {
  id: number;
  name: string;
  email: string;
  contact: string;
  status: string;
}

interface ComplainData {
  description: string;
}

const StdComplain = ({navigation}: any) => {
  const {token} = useUser();
  const [complainData, setComplainData] = useState<ComplainData | null>(null);

  const [complaintsData, setComplaintsData] = useState<Complains[]>([]);

  //Complain Modal
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [desc, setDesc] = useState('');
  const [descError, setDescError] = useState('');

  const validateFields = () => {
    let isValid = true;

    if (!desc) {
      setDescError('Complain Note  is required');
      isValid = false;
    } else {
      setDescError('');
    }

    return isValid;
  };
  {
    /*view modal*/
  }
  const [isModalVisi, setModalVisi] = useState(false);

  const toggleModl = async (id: number) => {
    try {
      const res = await axios.get(
        `https://demo.capobrain.com/complainview?id=${id}&_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setComplainData(res.data);
      setModalVisi(!isModalVisi);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          'https://demo.capobrain.com/fetchusercomplain',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setComplaintsData(response.data.complains);
      } catch (error) {
        console.log(error);
      }
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
    <View style={styles.container}>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-left"
            size={38}
            color={'#fff'}
            style={{paddingHorizontal: 10}}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Complain</Text>
      </View>

      <TouchableOpacity onPress={toggleModal}>
        <View
          style={{
            width: 120,
            height: 30,
            backgroundColor: '#3b82f6',
            borderRadius: 5,
            marginRight: 10,
            alignSelf: 'flex-end',
            marginTop: 10,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
              marginTop: 3,
            }}>
            Add Complain
          </Text>
        </View>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            width: 'auto',
            maxHeight: 450,
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <Text style={{color: '#3b82f6', fontSize: 18, fontWeight: 'bold'}}>
              Add Complain
            </Text>

            <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
              <Text style={{color: 'red'}}>✖</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: '#3b82f6',
              width: wp('90%'),
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderBottomWidth: 1,
              width: 'auto',
              borderRightWidth: 1,
              borderLeftWidth: 1,
              borderRadius: 5,
              borderColor: '#3b82f6',
              marginLeft: 20,
              marginTop: 20,
              height: 300,
              marginRight: 20,
            }}>
            <Text style={styles.label}>Complain Note</Text>
            <Text
              style={{
                color: 'red',
                position: 'absolute',
                top: -8,
                left: 114,
                fontSize: 14,
                backgroundColor: 'white',
              }}>
              *
            </Text>
            <View
              style={{
                borderRadius: 5,
                borderColor: '#3b82f6',
              }}>
              <TextInput
                style={{
                  color: '#3b82f6',
                }}
                value={desc}
                onChangeText={setDesc}
                placeholder="Type Your Complain Here..."
                placeholderTextColor={'#3b82f6'}
              />
            </View>
          </View>
          {descError ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                position: 'absolute',
                top: 390,
                left: 20,
              }}>
              {descError}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              if (validateFields()) {
                console.log('Form is valid');
              } else {
                console.log('Form is invalid');
              }
            }}>
            <View
              style={{
                backgroundColor: '#3b82f6',
                borderRadius: 5,
                width: 50,
                height: 30,
                alignSelf: 'center',
                marginTop: 30,
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                Save
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={complaintsData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={{textAlign: 'right', color: '#3b82f6'}}>
                {item.contact ?? 'NILL'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#3b82f6'}}>{item.email ?? 'NILL'}</Text>

              <View style={styles.iconContainer}>
                <Image
                  style={styles.statusIcon}
                  source={
                    item.status === 'Approved'
                      ? require('../assets/approved.png')
                      : require('../assets/rejected.png')
                  }
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => toggleModl(item.id)}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../assets/visible.png')}
                  />
                </TouchableOpacity>
              </View>
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
            maxHeight: 340,
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
              textAlign: 'center',
              margin: 10,
              fontWeight: 'bold',
            }}>
            Complain Detail
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: '#3b82f6',
              width: wp('90%'),
            }}
          />

          <View
            style={{
              marginTop: 15,
            }}>
            <Text style={styles.lblText}>Description:</Text>
            <Text style={[styles.valueText, {marginLeft: 48, marginTop: 5}]}>
              {complainData?.description}
            </Text>
          </View>

          <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 20}}>
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

export default StdComplain;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#3b82f6',
  },
  backButton: {
    width: 24,
    height: 24,
    tintColor: 'white',
    marginRight: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusIcon: {
    width: 17,
    height: 17,
    elevation: 10,
  },
  actionIcon: {
    width: 15,
    height: 15,
    tintColor: '#3b82f6',
    marginLeft: 5,
    elevation: 10,
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 14,
    fontSize: 14,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    color: '#3b82f6',
  },
  lblText: {
    fontWeight: 'bold',
    color: '#3b82f6',
    marginLeft: '15%',
    fontSize: 16,
  },
  valueText: {
    marginRight: '15%',
    color: '#3b82f6',
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
    borderColor: '#3b82f6',
    borderWidth: 1,
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
